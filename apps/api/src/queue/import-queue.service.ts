import { Injectable, Logger } from '@nestjs/common';
import { Queue, Worker, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';
import { PlaywrightScraperService } from '../scrapers/playwright-scraper.service';
import { PrismaService } from '../prisma.service';

export interface ImportJobPayload {
  pluginId?: string;
  sourceUrl: string;
  userId: string;
  jobId: string;
  customTitle?: string;
}

@Injectable()
export class ImportQueueService {
  private readonly logger = new Logger(ImportQueueService.name);
  private importQueue?: Queue<ImportJobPayload>;
  private worker?: Worker<ImportJobPayload>;
  private connection?: IORedis;

  constructor(
    private scraperService: PlaywrightScraperService,
    private prisma: PrismaService,
  ) {}

  /**
   * Inicializa la cola de importación
   */
  async initQueue(): Promise<void> {
    try {
      this.connection = this.buildRedisConnection();
      this.connection.on('error', () => undefined);
      await this.connection.connect();
      await this.connection.ping();

      const queueName = 'plugin-imports';
      this.importQueue = new Queue(queueName, {
        connection: this.connection,
      });

      this.worker = new Worker(
        queueName,
        async (job) => this.processImportJob(job.data),
        {
          connection: this.connection,
          concurrency: parseInt(process.env.IMPORT_CONCURRENCY || '3', 10),
        },
      );

      this.worker.on('completed', (job) => {
        this.logger.log(`Job completado: ${job.id}`);
      });

      this.worker.on('failed', (job, error) => {
        this.logger.error(`Job falló: ${job?.id} - ${error.message}`);
      });

      this.importQueue.on('error', (error) => {
        this.logger.error(`Cola error: ${error.message}`);
      });

      this.logger.log('Import Queue inicializado');
    } catch (error) {
      this.logger.warn(
        `No se pudo inicializar Redis queue, usando procesamiento inline: ${error.message}`,
      );

      if (this.connection) {
        this.connection.disconnect();
        this.connection = undefined;
      }
    }
  }

  /**
   * Añade un job de importación a la cola
   */
  async addImportJob(
    payload: ImportJobPayload,
    options?: JobsOptions,
  ): Promise<string> {
    if (!this.importQueue) {
      this.logger.warn('Cola no disponible, procesando inline');
      await this.processImportJob(payload);
      return payload.jobId;
    }

    const job = await this.importQueue.add('import', payload, {
      priority: 5,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
      ...options,
    });

    this.logger.log(`Job añadido a cola: ${job.id}`);
    return String(job.id);
  }

  /**
   * Procesa un job de importación
   */
  private async processImportJob(payload: ImportJobPayload): Promise<void> {
    try {
      const { jobId, sourceUrl, userId, customTitle } = payload;

      await this.prisma.importJob.update({
        where: { id: jobId },
        data: {
          status: 'IN_PROGRESS',
          progress: 10,
          startedAt: new Date(),
        },
      });

      this.logger.log(`Procesando import job: ${jobId} - ${sourceUrl}`);

      const scrapedResource =
        await this.scraperService.scrapeBuiltByBit(sourceUrl);

      await this.prisma.importJob.update({
        where: { id: jobId },
        data: { progress: 60 },
      });

      const plugin = await this.prisma.plugin.create({
        data: {
          title: customTitle || scrapedResource.title,
          slug: this.generateSlug(customTitle || scrapedResource.title),
          description: scrapedResource.description,
          descriptionHtml: scrapedResource.descriptionHtml,
          author: scrapedResource.author,
          sourceUrl,
          coverImage: scrapedResource.coverImage,
          bannerImage: scrapedResource.bannerImage,
          version: scrapedResource.version,
          tags: scrapedResource.tags,
          categories: scrapedResource.categories,
          testedVersions: scrapedResource.testedVersions,
          dependencies: scrapedResource.dependencies,
          creatorId: userId,
          published: true,
          snapshot: {
            create: {
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
          pluginId: plugin.id,
          completedAt: new Date(),
        },
      });

      this.logger.log(`Import completado: ${plugin.title}`);
    } catch (error) {
      this.logger.error(
        `Error procesando job ${payload.jobId}: ${error.message}`,
      );

      await this.prisma.importJob.update({
        where: { id: payload.jobId },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
          completedAt: new Date(),
        },
      });

      throw error;
    }
  }

  /**
   * Obtiene estado de un job
   */
  async getJobStatus(jobId: string): Promise<any> {
    if (!this.importQueue) {
      return this.prisma.importJob.findUnique({
        where: { id: jobId },
      });
    }

    const job = await this.importQueue.getJob(jobId);
    if (!job) {
      return null;
    }

    const state = await job.getState();
    return {
      id: job.id,
      status: state,
      progress: job.progress,
      data: job.data,
    };
  }

  /**
   * Cancela un job
   */
  async cancelJob(jobId: string): Promise<boolean> {
    if (!this.importQueue) {
      return false;
    }

    const job = await this.importQueue.getJob(jobId);
    if (job) {
      await job.remove();
      return true;
    }

    return false;
  }

  /**
   * Obtiene estadísticas de la cola
   */
  async getQueueStats() {
    if (!this.importQueue) {
      return {
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0,
      };
    }

    const [waiting, active, completed, failed] = await Promise.all([
      this.importQueue.getWaitingCount(),
      this.importQueue.getActiveCount(),
      this.importQueue.getCompletedCount(),
      this.importQueue.getFailedCount(),
    ]);

    return { waiting, active, completed, failed };
  }

  /**
   * Limpia jobs completados
   */
  async cleanupCompletedJobs(): Promise<number> {
    if (!this.importQueue) {
      return 0;
    }

    const completed = await this.importQueue.clean(3600000, 100, 'completed');
    this.logger.log(`Limpiados ${completed.length} jobs completados`);
    return completed.length;
  }

  /**
   * Detiene los workers
   */
  async closeQueue(): Promise<void> {
    if (this.worker) {
      await this.worker.close();
    }

    if (this.importQueue) {
      await this.importQueue.close();
    }

    if (this.connection) {
      await this.connection.quit();
    }

    this.logger.log('Import Queue cerrado');
  }

  /**
   * Helper: generar slug
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .substring(0, 100);
  }

  private buildRedisConnection(): IORedis {
    return new IORedis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
      lazyConnect: true,
      connectTimeout: 1000,
      maxRetriesPerRequest: null,
      retryStrategy: () => null,
      enableOfflineQueue: false,
      enableReadyCheck: true,
    });
  }
}
