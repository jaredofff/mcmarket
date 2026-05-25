import { Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PluginFileStorageService } from '../storage/plugin-file-storage.service';
import { PlaywrightScraperService } from '../scrapers/playwright-scraper.service';
import { ImportQueueService } from '../queue/import-queue.service';
import { Prisma } from '@prisma/client';
import {
  CreatePluginFromUrlDto,
  UpdatePluginDto,
  PluginDetailDto,
  PluginFilterDto,
  MarketplaceStatsDto,
} from './dtos/import.dto';
import * as slugLib from 'slug';

@Injectable()
export class PluginsService {
  private readonly logger = new Logger(PluginsService.name);

  constructor(
    private prisma: PrismaService,
    private pluginFileStorageService: PluginFileStorageService,
    private scraperService: PlaywrightScraperService,
    private importQueueService: ImportQueueService,
  ) {}

  /**
   * Importa un plugin desde una URL de BuiltByBit
   */
  async importFromUrl(
    createPluginDto: CreatePluginFromUrlDto,
    userId: string,
  ): Promise<{ jobId: string; plugin: any }> {
    // Crear job de importación
    const importJob = await this.prisma.importJob.create({
      data: {
        sourceUrl: createPluginDto.url,
        status: 'PENDING',
        progress: 0,
      },
    });

    // Agregar a la cola de procesamiento (con fallback inline si la cola no está disponible)
    this.importQueueService
      .addImportJob({
        jobId: importJob.id,
        sourceUrl: createPluginDto.url,
        userId,
        customTitle: createPluginDto.customTitle,
      })
      .catch((error) => {
        this.logger.error(`Error agregando a cola: ${error.message}`);
      });

    return {
      jobId: importJob.id,
      plugin: null,
    };
  }

  /**
   * Obtiene información detallada de un plugin
   */
  async getPluginDetail(slug: string): Promise<PluginDetailDto> {
    const plugin = await this.prisma.plugin.findUnique({
      where: { slug },
      include: {
        versions: true,
        snapshot: true,
      },
    });

    if (!plugin) {
      throw new NotFoundException(`Plugin no encontrado: ${slug}`);
    }

    return this.mapPluginToDetailDto(plugin);
  }

  /**
   * Lista plugins con filtros
   */
  async listPlugins(filters: PluginFilterDto) {
    const {
      search,
      tags,
      categories,
      isVipOnly,
      limit = 20,
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const where: Prisma.PluginWhereInput = {
      published: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { author: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(tags && tags.length > 0 && { tags: { hasSome: tags } }),
      ...(categories &&
        categories.length > 0 && {
          categories: { hasSome: categories },
        }),
      ...(isVipOnly !== undefined && { isVipOnly }),
    };

    const [plugins, total] = await Promise.all([
      this.prisma.plugin.findMany({
        where,
        include: { versions: { take: 1 }, snapshot: true },
        take: limit,
        skip: offset,
        orderBy: {
          [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc',
        },
      }),
      this.prisma.plugin.count({ where }),
    ]);

    return {
      items: plugins.map((p) => this.mapPluginToDetailDto(p)),
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  /**
   * Actualiza un plugin
   */
  async updatePlugin(
    id: string,
    updatePluginDto: UpdatePluginDto,
  ): Promise<PluginDetailDto> {
    const plugin = await this.prisma.plugin.update({
      where: { id },
      data: updatePluginDto,
      include: { versions: true, snapshot: true },
    });

    return this.mapPluginToDetailDto(plugin);
  }

  /**
   * Re-sincroniza un plugin desde su URL original
   */
  async resyncPlugin(id: string, userId: string): Promise<string> {
    const plugin = await this.prisma.plugin.findUnique({
      where: { id },
    });

    if (!plugin) {
      throw new NotFoundException(`Plugin no encontrado: ${id}`);
    }
    if (!plugin.sourceUrl) {
      throw new NotFoundException(`Plugin sin URL de origen: ${id}`);
    }

    const importJob = await this.prisma.importJob.create({
      data: {
        sourceUrl: plugin.sourceUrl,
        status: 'PENDING',
        progress: 0,
        pluginId: id,
      },
    });

    // Procesar asíncrona pero actualizar plugin existente
    this.processResync(importJob.id, plugin.sourceUrl, id).catch((error) => {
      this.logger.error(`Error en resync de ${id}: ${error.message}`);
    });

    return importJob.id;
  }

  /**
   * Procesa la resincronización de un plugin
   */
  private async processResync(
    jobId: string,
    sourceUrl: string,
    pluginId: string,
  ): Promise<void> {
    try {
      await this.prisma.importJob.update({
        where: { id: jobId },
        data: {
          status: 'IN_PROGRESS',
          progress: 10,
          startedAt: new Date(),
        },
      });

      const scrapedResource =
        await this.scraperService.scrapeBuiltByBit(sourceUrl);

      await this.prisma.plugin.update({
        where: { id: pluginId },
        data: {
          descriptionHtml: scrapedResource.descriptionHtml,
          author: scrapedResource.author,
          version: scrapedResource.version,
          tags: scrapedResource.tags,
          categories: scrapedResource.categories,
          testedVersions: scrapedResource.testedVersions,
          dependencies: scrapedResource.dependencies,
          coverImage: scrapedResource.coverImage,
          bannerImage: scrapedResource.bannerImage,

          snapshot: {
            update: {
              title: scrapedResource.title,
              descriptionHtml: scrapedResource.descriptionHtml,
              author: scrapedResource.author,
              version: scrapedResource.version,
              tags: scrapedResource.tags,
              categories: scrapedResource.categories,
              testedVersions: scrapedResource.testedVersions,
              dependencies: scrapedResource.dependencies,
              coverImage: scrapedResource.coverImage,
              bannerImage: scrapedResource.bannerImage,
              images: scrapedResource.images,
            },
          },
        },
      });

      await this.prisma.importJob.update({
        where: { id: jobId },
        data: {
          status: 'COMPLETED',
          progress: 100,
          completedAt: new Date(),
        },
      });

      this.logger.log(`Resync completado para plugin: ${pluginId}`);
    } catch (error) {
      this.logger.error(`Error en resync ${jobId}: ${error.message}`);
      await this.prisma.importJob.update({
        where: { id: jobId },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
          completedAt: new Date(),
        },
      });
    }
  }

  /**
   * Elimina un plugin y sus datos asociados
   */
  async deletePlugin(id: string): Promise<{ success: boolean; message: string }> {
    const plugin = await this.prisma.plugin.findUnique({
      where: { id },
      include: { versions: true, snapshot: true },
    });

    if (!plugin) {
      throw new NotFoundException(`Plugin no encontrado: ${id}`);
    }

    try {
      // Eliminar archivos asociados si existen
      if (plugin.coverImage) {
        try {
          this.pluginFileStorageService.deleteFile(plugin.coverImage);
        } catch (err: any) {
          this.logger.warn(
            `No se pudo eliminar coverImage: ${err.message || err}`,
          );
        }
      }
      if (plugin.bannerImage) {
        try {
          this.pluginFileStorageService.deleteFile(plugin.bannerImage);
        } catch (err: any) {
          this.logger.warn(
            `No se pudo eliminar bannerImage: ${err.message || err}`,
          );
        }
      }

      // Eliminar el plugin (cascada en BD por FK)
      await this.prisma.plugin.delete({
        where: { id },
      });

      this.logger.log(`Plugin eliminado: ${id} (${plugin.title})`);

      return {
        success: true,
        message: `Plugin "${plugin.title}" eliminado exitosamente`,
      };
    } catch (error: any) {
      this.logger.error(`Error eliminando plugin ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas del marketplace
   */
  async getMarketplaceStats(): Promise<MarketplaceStatsDto> {
    const [totalPlugins, totalVipPlugins, recentImports] = await Promise.all([
      this.prisma.plugin.count({ where: { published: true } }),
      this.prisma.plugin.count({ where: { published: true, isVipOnly: true } }),
      this.prisma.importJob.findMany({
        where: { status: 'COMPLETED' },
        take: 100,
        orderBy: { completedAt: 'desc' },
      }),
    ]);

    const successCount = recentImports.filter(
      (j) => j.status === 'COMPLETED',
    ).length;

    return {
      totalPlugins,
      totalVipPlugins,
      totalDownloads: 0, // TODO: Implementar contador de descargas
      averageRating: 0, // TODO: Implementar sistema de ratings
      recentImports: {
        count: recentImports.length,
        successRate:
          recentImports.length > 0 ? successCount / recentImports.length : 0,
        avgDuration: 0, // TODO: Calcular duración promedio
      },
      topAuthor: { author: 'Unknown', pluginCount: 0 }, // TODO: Calcular top autor
      topTags: [], // TODO: Calcular tags más usados
      topCategories: [], // TODO: Calcular categorías más usadas
    };
  }

  /**
   * Obtiene estado de un job de importación
   */
  async getImportJobStatus(jobId: string) {
    const job = await this.prisma.importJob.findUnique({
      where: { id: jobId },
      include: { plugin: true },
    });

    if (!job) {
      throw new NotFoundException(`Import job no encontrado: ${jobId}`);
    }

    return job;
  }

  /**
   * Mapea Plugin de Prisma a PluginDetailDto
   */
  private mapPluginToDetailDto(plugin: any): PluginDetailDto {
    return {
      id: plugin.id,
      title: plugin.title,
      slug: plugin.slug,
      description: plugin.description,
      descriptionHtml: plugin.descriptionHtml,
      author: plugin.author,
      version: plugin.version,
      tags: plugin.tags,
      categories: plugin.categories,
      testedVersions: plugin.testedVersions,
      dependencies: plugin.dependencies,
      coverImage: plugin.coverImage,
      bannerImage: plugin.bannerImage,
      images: plugin.snapshot?.images || [],
      sourceUrl: plugin.sourceUrl,
      isVipOnly: plugin.isVipOnly,
      downloadCount: plugin.downloadCount || 0,
      rating: plugin.rating || 0,
      createdAt: plugin.createdAt,
      updatedAt: plugin.updatedAt,
      latestVersion: plugin.versions?.[0] || null,
      snapshot: plugin.snapshot,
      allVersions: plugin.versions,
    };
  }
}
