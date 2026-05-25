import { Module } from '@nestjs/common';
import { PluginsController } from './plugins.controller';
import { PluginsService } from './plugins.service';
import { AuthModule } from '../auth/auth.module';
import { StorageModule } from '../storage/storage.module';
import { PrismaModule } from '../prisma.module';
import { PlaywrightScraperService } from '../scrapers/playwright-scraper.service';
import { PluginFileStorageService } from '../storage/plugin-file-storage.service';
import { ImportQueueService } from '../queue/import-queue.service';

@Module({
  imports: [AuthModule, StorageModule, PrismaModule],
  controllers: [PluginsController],
  providers: [
    PluginsService,
    PlaywrightScraperService,
    PluginFileStorageService,
    ImportQueueService,
  ],
  exports: [
    PluginsService,
    PlaywrightScraperService,
    PluginFileStorageService,
    ImportQueueService,
  ],
})
export class PluginsModule {}
