import { Module } from '@nestjs/common';
import { AdminPluginsController } from './controllers/admin-plugins.controller';
import { AdminPluginsService } from './services/admin-plugins.service';
import { FileUploadService } from './services/file-upload.service';
import { PluginsModule } from '../plugins/plugins.module';
import { PrismaModule } from '../prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PluginsModule, PrismaModule, AuthModule],
  controllers: [AdminPluginsController],
  providers: [AdminPluginsService, FileUploadService],
  exports: [AdminPluginsService, FileUploadService],
})
export class AdminModule {}
