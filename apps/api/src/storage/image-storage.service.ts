import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

export interface ImageStorageResult {
  originalUrl: string;
  storagePath: string;
  fileName: string;
  fileSize: number;
  downloadedAt: Date;
}

@Injectable()
export class ImageStorageService {
  private readonly logger = new Logger(ImageStorageService.name);
  private readonly uploadDir = path.join(process.cwd(), 'public', 'images');
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  constructor() {
    this.ensureUploadDirExists();
  }

  /**
   * Asegura que el directorio de carga existe
   */
  private ensureUploadDirExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log(`Created upload directory: ${this.uploadDir}`);
    }
  }

  /**
   * Descarga una imagen desde una URL y la guarda localmente
   * @param imageUrl - URL de la imagen a descargar
   * @returns Información de la imagen almacenada
   */
  async downloadAndStoreImage(imageUrl: string): Promise<ImageStorageResult> {
    try {
      if (!this.isValidUrl(imageUrl)) {
        throw new BadRequestException('Invalid image URL');
      }

      // Descargar la imagen
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 10000, // 10 segundos de timeout
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      // Validar content-type
      const contentType = response.headers['content-type'] as
        | string
        | undefined;
      if (!contentType || !this.allowedMimeTypes.includes(contentType)) {
        throw new BadRequestException(
          `Unsupported image format. Allowed: JPEG, PNG, GIF, WebP. Got: ${contentType || 'unknown'}`,
        );
      }

      // Validar tamaño
      const imageBuffer = Buffer.from(response.data);
      if (imageBuffer.length > this.maxFileSize) {
        throw new BadRequestException(
          `Image too large. Max: ${this.maxFileSize / 1024 / 1024}MB. Got: ${(imageBuffer.length / 1024 / 1024).toFixed(2)}MB`,
        );
      }

      // Generar nombre único
      const fileName = this.generateFileName(imageUrl, contentType);
      const filePath = path.join(this.uploadDir, fileName);

      // Guardar archivo
      fs.writeFileSync(filePath, imageBuffer);

      const storagePath = `/public/images/${fileName}`;

      this.logger.log(
        `Image downloaded and stored: ${imageUrl} → ${storagePath}`,
      );

      return {
        originalUrl: imageUrl,
        storagePath,
        fileName,
        fileSize: imageBuffer.length,
        downloadedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to download image from ${imageUrl}: ${error.message}`,
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        `Failed to download image: ${error.message}`,
      );
    }
  }

  /**
   * Genera un nombre de archivo único basado en timestamp y hash
   * @param originalUrl - URL original de la imagen
   * @param contentType - Tipo MIME de la imagen
   * @returns Nombre de archivo único
   */
  private generateFileName(originalUrl: string, contentType: string): string {
    const timestamp = Date.now();
    const extension = this.getMimeTypeExtension(contentType);
    const hash = this.simpleHash(originalUrl);
    return `${timestamp}-${hash}${extension}`;
  }

  /**
   * Obtiene la extensión basada en el tipo MIME
   * @param mimeType - Tipo MIME de la imagen
   * @returns Extensión del archivo
   */
  private getMimeTypeExtension(mimeType: string): string {
    const mimeMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
    };
    return mimeMap[mimeType] || '.jpg';
  }

  /**
   * Genera un hash simple para la URL
   * @param url - URL a hashear
   * @returns Hash simple
   */
  private simpleHash(url: string): string {
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      const char = url.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).substring(0, 8);
  }

  /**
   * Valida que la URL sea una URL válida
   * @param url - URL a validar
   * @returns true si es válida
   */
  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Elimina una imagen almacenada
   * @param storagePath - Ruta de almacenamiento de la imagen
   */
  deleteImage(storagePath: string): void {
    try {
      const fileName = path.basename(storagePath);
      const filePath = path.join(this.uploadDir, fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`Image deleted: ${storagePath}`);
      }
    } catch (error) {
      this.logger.warn(`Failed to delete image: ${error.message}`);
    }
  }

  /**
   * Obtiene información de un archivo almacenado
   * @param storagePath - Ruta de almacenamiento
   * @returns Estadísticas del archivo
   */
  getImageInfo(storagePath: string): fs.Stats | null {
    try {
      const fileName = path.basename(storagePath);
      const filePath = path.join(this.uploadDir, fileName);

      if (fs.existsSync(filePath)) {
        return fs.statSync(filePath);
      }
      return null;
    } catch (error) {
      this.logger.warn(`Failed to get image info: ${error.message}`);
      return null;
    }
  }

  /**
   * Limpia imágenes antiguas (mayores a X días)
   * @param daysOld - Número de días para considerar una imagen como antigua
   * @returns Número de archivos eliminados
   */
  cleanupOldImages(daysOld: number = 30): number {
    try {
      const files = fs.readdirSync(this.uploadDir);
      const now = Date.now();
      const daysInMs = daysOld * 24 * 60 * 60 * 1000;
      let deletedCount = 0;

      files.forEach((file) => {
        const filePath = path.join(this.uploadDir, file);
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtimeMs;

        if (fileAge > daysInMs) {
          fs.unlinkSync(filePath);
          deletedCount++;
          this.logger.log(`Cleaned up old image: ${file}`);
        }
      });

      return deletedCount;
    } catch (error) {
      this.logger.warn(`Failed to cleanup old images: ${error.message}`);
      return 0;
    }
  }
}
