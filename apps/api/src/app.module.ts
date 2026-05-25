import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SanitizationService } from './sanitization.service';
import { AuthModule } from './auth/auth.module';
import { PluginsModule } from './plugins/plugins.module';
import { PrismaModule } from './prisma.module';
import { StorageModule } from './storage/storage.module';
import { AdminModule } from './admin/admin.module';
import { ImportQueueService } from './queue/import-queue.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    AuthModule,
    PluginsModule,
    PrismaModule,
    StorageModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, SanitizationService, ImportQueueService],
})
export class AppModule {}
