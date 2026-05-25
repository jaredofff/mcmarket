import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ImportQueueService } from './queue/import-queue.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  try {
    const importQueue = app.get(ImportQueueService);
    await importQueue.initQueue();
  } catch (error) {
    // Fallback: cola no disponible, continúa en modo inline
  }

  const port = process.env.API_PORT ?? process.env.PORT ?? 3001;
  await app.listen(port);
}
bootstrap();
