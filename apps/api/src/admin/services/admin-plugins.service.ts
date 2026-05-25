import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { FileUploadService } from './file-upload.service';
import { CreateAdminPluginDto } from '../dtos/create-admin-plugin.dto';
import { UpdateAdminPluginDto } from '../dtos/update-admin-plugin.dto';
import slug from 'slug';
import { Prisma, Plugin } from '@prisma/client';

interface UploadedFiles {
  coverImage?: Array<{ buffer: Buffer; mimetype: string }>;
  bannerImage?: Array<{ buffer: Buffer; mimetype: string }>;
  pluginFile?: Array<{ buffer: Buffer; mimetype: string }>;
}

@Injectable()
export class AdminPluginsService {
  private readonly logger = new Logger(AdminPluginsService.name);

  constructor(
    private prisma: PrismaService,
    private fileUploadService: FileUploadService,
  ) {}

  /**
   * Genera un slug único para el plugin
   */
  private async generateUniqueSlug(title: string): Promise<string> {
    let baseSlug = slug(title);
    let slugValue = baseSlug;
    let counter = 1;

    while (
      await this.prisma.plugin.findUnique({
        where: { slug: slugValue },
      })
    ) {
      slugValue = `${baseSlug}-${counter}`;
      counter++;
    }

    return slugValue;
  }

  /**
   * Crea un nuevo plugin en la administración
   */
  async createPlugin(
    dto: CreateAdminPluginDto,
    creatorId: string,
    files: UploadedFiles,
  ) {
    try {
      if (!dto.title) {
        throw new BadRequestException('El título es requerido');
      }

      const pluginSlug = await this.generateUniqueSlug(dto.title);

      let coverImageUrl: string | undefined;
      let bannerImageUrl: string | undefined;
      let pluginFileUrl: string | undefined;

      if (files?.coverImage?.[0]) {
        this.fileUploadService.validateImageFile(files.coverImage[0].mimetype);
        this.fileUploadService.validateFileSize(
          files.coverImage[0].buffer,
          5,
        );
        coverImageUrl = await this.fileUploadService.uploadFile(
          files.coverImage[0].buffer,
          files.coverImage[0].mimetype,
          'plugins/covers',
        );
      }

      if (files?.bannerImage?.[0]) {
        this.fileUploadService.validateImageFile(files.bannerImage[0].mimetype);
        this.fileUploadService.validateFileSize(
          files.bannerImage[0].buffer,
          5,
        );
        bannerImageUrl = await this.fileUploadService.uploadFile(
          files.bannerImage[0].buffer,
          files.bannerImage[0].mimetype,
          'plugins/banners',
        );
      }

      if (files?.pluginFile?.[0]) {
        this.fileUploadService.validatePluginFile(
          files.pluginFile[0].mimetype,
        );
        this.fileUploadService.validateFileSize(
          files.pluginFile[0].buffer,
          100,
        );
        pluginFileUrl = await this.fileUploadService.uploadFile(
          files.pluginFile[0].buffer,
          files.pluginFile[0].mimetype,
          'plugins/files',
        );
      }

      const plugin = await this.prisma.plugin.create({
        data: {
          title: dto.title,
          slug: pluginSlug,
          description: dto.description,
          descriptionHtml: dto.descriptionHtml || dto.description,
          version: dto.version,
          author: dto.author,
          price: Math.round((dto.price || 0) * 100),
          testedVersions: dto.testedVersions || [],
          dependencies: dto.dependencies || [],
          tags: dto.tags || [],
          categories: dto.categories || [],
          testServerUrl: dto.testServerUrl,
          isVipOnly: dto.isVipOnly || false,
          published: dto.published || false,
          sourceUrl: dto.sourceUrl,
          coverImage: coverImageUrl,
          bannerImage: bannerImageUrl,
          fileUrl: pluginFileUrl,
          creatorId,
          snapshot: {
            create: {
              title: dto.title,
              descriptionHtml: dto.descriptionHtml || dto.description,
              author: dto.author,
              version: dto.version,
              tags: dto.tags || [],
              categories: dto.categories || [],
              testedVersions: dto.testedVersions || [],
              dependencies: dto.dependencies || [],
              coverImage: coverImageUrl,
              bannerImage: bannerImageUrl,
              images: [],
            },
          },
        },
        include: {
          versions: true,
          snapshot: true,
        },
      });

      this.logger.log(`Plugin creado: ${plugin.id} - ${plugin.title}`);
      return this.formatPluginResponse(plugin);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(`Error al crear plugin: ${msg}`);
      throw error;
    }
  }

  /**
   * Lista plugins con filtros y paginación
   */
  async listPlugins(
    limit: number = 20,
    offset: number = 0,
    search?: string,
    published?: boolean,
  ) {
    try {
      const where: Prisma.PluginWhereInput = {};

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { author: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (published !== undefined) {
        where.published = published;
      }

      const [plugins, total] = await Promise.all([
        this.prisma.plugin.findMany({
          where,
          include: {
            versions: { take: 1 },
            snapshot: true,
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          take: limit,
          skip: offset,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.plugin.count({ where }),
      ]);

      return {
        items: plugins.map((p) => this.formatPluginResponse(p)),
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(`Error al listar plugins: ${msg}`);
      throw new InternalServerErrorException(
        'Error al listar plugins',
      );
    }
  }

  /**
   * Obtiene el detalle de un plugin
   */
  async getPluginDetail(id: string) {
    try {
      const plugin = await this.prisma.plugin.findUnique({
        where: { id },
        include: {
          versions: true,
          snapshot: true,
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!plugin) {
        throw new NotFoundException(`Plugin no encontrado: ${id}`);
      }

      return this.formatPluginResponse(plugin);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(`Error al obtener detalle del plugin: ${msg}`);
      throw new InternalServerErrorException(
        'Error al obtener detalle del plugin',
      );
    }
  }

  /**
   * Actualiza un plugin existente
   */
  async updatePlugin(
    id: string,
    dto: UpdateAdminPluginDto,
    files?: UploadedFiles,
  ) {
    try {
      const existingPlugin = await this.prisma.plugin.findUnique({
        where: { id },
      });

      if (!existingPlugin) {
        throw new NotFoundException(`Plugin no encontrado: ${id}`);
      }

      const updateData: Record<string, unknown> = { ...dto };

      if (dto.price !== undefined) {
        updateData.price = Math.round(dto.price * 100);
      }

      if (files?.coverImage?.[0]) {
        this.fileUploadService.validateImageFile(files.coverImage[0].mimetype);
        this.fileUploadService.validateFileSize(
          files.coverImage[0].buffer,
          5,
        );

        if (existingPlugin.coverImage) {
          await this.fileUploadService.deleteFile(
            existingPlugin.coverImage,
          );
        }

        updateData.coverImage = await this.fileUploadService.uploadFile(
          files.coverImage[0].buffer,
          files.coverImage[0].mimetype,
          'plugins/covers',
        );
      }

      if (files?.bannerImage?.[0]) {
        this.fileUploadService.validateImageFile(files.bannerImage[0].mimetype);
        this.fileUploadService.validateFileSize(
          files.bannerImage[0].buffer,
          5,
        );

        if (existingPlugin.bannerImage) {
          await this.fileUploadService.deleteFile(
            existingPlugin.bannerImage,
          );
        }

        updateData.bannerImage = await this.fileUploadService.uploadFile(
          files.bannerImage[0].buffer,
          files.bannerImage[0].mimetype,
          'plugins/banners',
        );
      }

      if (files?.pluginFile?.[0]) {
        this.fileUploadService.validatePluginFile(
          files.pluginFile[0].mimetype,
        );
        this.fileUploadService.validateFileSize(
          files.pluginFile[0].buffer,
          100,
        );

        if (existingPlugin.fileUrl) {
          await this.fileUploadService.deleteFile(existingPlugin.fileUrl);
        }

        updateData.fileUrl = await this.fileUploadService.uploadFile(
          files.pluginFile[0].buffer,
          files.pluginFile[0].mimetype,
          'plugins/files',
        );
      }

      if (
        dto.title ||
        dto.descriptionHtml ||
        dto.author ||
        dto.version ||
        updateData.coverImage ||
        updateData.bannerImage
      ) {
        updateData.snapshot = {
          update: {
            title: dto.title || undefined,
            descriptionHtml:
              dto.descriptionHtml || undefined,
            author: dto.author || undefined,
            version: dto.version || undefined,
            tags: dto.tags || undefined,
            categories: dto.categories || undefined,
            testedVersions: dto.testedVersions || undefined,
            dependencies: dto.dependencies || undefined,
            coverImage: updateData.coverImage || undefined,
            bannerImage: updateData.bannerImage || undefined,
          },
        };
      }

      const plugin = await this.prisma.plugin.update({
        where: { id },
        data: updateData,
        include: {
          versions: true,
          snapshot: true,
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      this.logger.log(`Plugin actualizado: ${plugin.id} - ${plugin.title}`);
      return this.formatPluginResponse(plugin);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(`Error al actualizar plugin: ${msg}`);
      throw new InternalServerErrorException(
        'Error al actualizar plugin',
      );
    }
  }

  /**
   * Publica un plugin (cambia estado a published = true)
   */
  async publishPlugin(id: string) {
    try {
      const plugin = await this.prisma.plugin.findUnique({
        where: { id },
      });

      if (!plugin) {
        throw new NotFoundException(`Plugin no encontrado: ${id}`);
      }

      const updated = await this.prisma.plugin.update({
        where: { id },
        data: { published: true },
        include: {
          versions: true,
          snapshot: true,
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      this.logger.log(`Plugin publicado: ${updated.id} - ${updated.title}`);
      return this.formatPluginResponse(updated);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(`Error al publicar plugin: ${msg}`);
      throw new InternalServerErrorException(
        'Error al publicar plugin',
      );
    }
  }

  /**
   * Borra un plugin y sus archivos asociados
   */
  async deletePlugin(id: string) {
    try {
      const plugin = await this.prisma.plugin.findUnique({
        where: { id },
      });

      if (!plugin) {
        throw new NotFoundException(`Plugin no encontrado: ${id}`);
      }

      if (plugin.coverImage) {
        await this.fileUploadService.deleteFile(plugin.coverImage);
      }

      if (plugin.bannerImage) {
        await this.fileUploadService.deleteFile(plugin.bannerImage);
      }

      if (plugin.fileUrl) {
        await this.fileUploadService.deleteFile(plugin.fileUrl);
      }

      await this.prisma.plugin.delete({
        where: { id },
      });

      this.logger.log(`Plugin eliminado: ${id} - ${plugin.title}`);
      return { message: 'Plugin eliminado exitosamente', pluginId: id };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(`Error al eliminar plugin: ${msg}`);
      throw new InternalServerErrorException(
        'Error al eliminar plugin',
      );
    }
  }

  /**
   * Formatea la respuesta del plugin
   */
  private formatPluginResponse(plugin: unknown): Record<string, unknown> {
    const p = plugin as Plugin & { versions?: unknown; snapshot?: unknown; creator?: unknown };

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      descriptionHtml: p.descriptionHtml,
      author: p.author,
      version: p.version,
      price: (p.price ?? 0) / 100,
      tags: p.tags,
      categories: p.categories,
      testedVersions: p.testedVersions,
      dependencies: p.dependencies,
      coverImage: p.coverImage,
      bannerImage: p.bannerImage,
      fileUrl: p.fileUrl,
      isVipOnly: p.isVipOnly,
      published: p.published,
      sourceUrl: p.sourceUrl,
      testServerUrl: p.testServerUrl,
      downloadCount: p.downloadCount,
      rating: p.rating,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      creator: p.creator,
      latestVersion: Array.isArray(p.versions) && p.versions.length > 0 ? p.versions[0] : null,
      snapshot: p.snapshot,
      allVersions: p.versions,
    };
  }
}
