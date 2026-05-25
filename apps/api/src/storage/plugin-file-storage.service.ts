import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';

export interface PluginFileStorageResult {
  originalUrl: string;
  storagePath: string;
  fileName: string;
  fileSize: number;
  fileHash: string;
  downloadedAt: Date;
}

@Injectable()
export class PluginFileStorageService {
  private readonly logger = new Logger(PluginFileStorageService.name);
  private readonly uploadDir = path.join(process.cwd(), 'public', 'plugins');
  private readonly maxFileSize = 500 * 1024 * 1024; // 500MB para archivos de plugins
  private readonly allowedExtensions = ['jar', 'zip', 'rar', 'tar', 'gz', '7z'];

  constructor() {
    this.ensureUploadDirExists();
  }

  /**
   * Asegura que el directorio de carga existe
   */
  private ensureUploadDirExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log(`Created plugin upload directory: ${this.uploadDir}`);
    }
  }

  /**
   * Descarga un archivo de plugin desde una URL y lo almacena localmente
   * @param fileUrl - URL del archivo a descargar
   * @returns Información del archivo almacenado
   */
  async downloadAndStorePluginFile(
    fileUrl: string,
  ): Promise<PluginFileStorageResult> {
    try {
      if (!this.isValidUrl(fileUrl)) {
        throw new BadRequestException('URL de archivo inválida');
      }

      this.logger.log(`Descargando archivo de plugin: ${fileUrl}`);

      // Descargar el archivo
      const response = await axios.get(fileUrl, {
        responseType: 'arraybuffer',
        timeout: 120000, // 2 minutos para archivos grandes
        maxContentLength: this.maxFileSize,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const fileBuffer = Buffer.from(response.data);

      // Validar tamaño
      if (fileBuffer.length > this.maxFileSize) {
        throw new BadRequestException(
          `Archivo demasiado grande. Máximo: ${this.maxFileSize / 1024 / 1024}MB. Recibido: ${(fileBuffer.length / 1024 / 1024).toFixed(2)}MB`,
        );
      }

      // Validar extensión
      const fileExt = this.extractFileExtension(fileUrl);
      if (!this.allowedExtensions.includes(fileExt.toLowerCase())) {
        throw new BadRequestException(
          `Extensión de archivo no permitida. Permitidas: ${this.allowedExtensions.join(', ')}`,
        );
      }

      // Calcular hash
      const fileHash = this.calculateHash(fileBuffer);

      // Generar nombre único usando hash
      const fileName = `${fileHash}.${fileExt}`;
      const filePath = path.join(this.uploadDir, fileName);

      // Evitar sobrescrituras: si ya existe, retornar info existente
      if (fs.existsSync(filePath)) {
        this.logger.log(`Archivo ya existe (mismo hash): ${fileName}`);
        return {
          originalUrl: fileUrl,
          storagePath: `/public/plugins/${fileName}`,
          fileName,
          fileSize: fileBuffer.length,
          fileHash,
          downloadedAt: new Date(),
        };
      }

      // Guardar archivo
      fs.writeFileSync(filePath, fileBuffer);

      const storagePath = `/public/plugins/${fileName}`;

      this.logger.log(
        `Archivo de plugin descargado y almacenado: ${fileUrl} → ${storagePath}`,
      );

      return {
        originalUrl: fileUrl,
        storagePath,
        fileName,
        fileSize: fileBuffer.length,
        fileHash,
        downloadedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Fallo al descargar archivo de plugin desde ${fileUrl}: ${error.message}`,
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        `Fallo al descargar archivo: ${error.message}`,
      );
    }
  }

  /**
   * Obtiene información de un archivo almacenado
   */
  getFileInfo(fileName: string): {
    exists: boolean;
    size?: number;
    createdAt?: Date;
  } {
    const filePath = path.join(this.uploadDir, fileName);

    if (!fs.existsSync(filePath)) {
      return { exists: false };
    }

    const stats = fs.statSync(filePath);
    return {
      exists: true,
      size: stats.size,
      createdAt: stats.birthtime,
    };
  }

  /**
   * Elimina un archivo de plugin
   */
  deleteFile(fileName: string): boolean {
    try {
      const filePath = path.join(this.uploadDir, fileName);

      if (!fs.existsSync(filePath)) {
        return false;
      }

      fs.unlinkSync(filePath);
      this.logger.log(`Archivo eliminado: ${fileName}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Error al eliminar archivo ${fileName}: ${error.message}`,
      );
      return false;
    }
  }

  /**
   * Valida acceso a un archivo (útil para descargas autenticadas)
   */
  validateFileAccess(fileName: string): boolean {
    const filePath = path.join(this.uploadDir, fileName);

    // Validar que no sea path traversal
    if (!filePath.startsWith(this.uploadDir)) {
      this.logger.warn(`Path traversal attempt detected: ${fileName}`);
      return false;
    }

    return fs.existsSync(filePath);
  }

  /**
   * Obtiene la ruta del archivo para lectura
   */
  getFilePath(fileName: string): string | null {
    if (!this.validateFileAccess(fileName)) {
      return null;
    }
    return path.join(this.uploadDir, fileName);
  }

  /**
   * Valida que sea una URL válida
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Extrae la extensión del archivo de una URL
   */
  private extractFileExtension(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const match = pathname.match(/\.([a-zA-Z0-9]+)$/);
      return match ? match[1] : 'jar'; // Default a 'jar' si no hay extensión
    } catch {
      return 'jar';
    }
  }

  /**
   * Calcula hash SHA-256 de un buffer
   */
  private calculateHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Limpia archivos antiguos (útil como tarea programada)
   */
  cleanupOldFiles(daysOld: number): void {
    try {
      const files = fs.readdirSync(this.uploadDir);
      const now = Date.now();
      const millisecondsPerDay = 24 * 60 * 60 * 1000;

      for (const file of files) {
        const filePath = path.join(this.uploadDir, file);
        const stats = fs.statSync(filePath);
        const fileAgeInDays = (now - stats.mtimeMs) / millisecondsPerDay;

        if (fileAgeInDays > daysOld) {
          fs.unlinkSync(filePath);
          this.logger.log(
            `Archivo antiguo eliminado: ${file} (${fileAgeInDays.toFixed(1)} días)`,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Error durante limpieza de archivos antiguos: ${error.message}`,
      );
    }
  }

  /**
   * Obtiene estadísticas del directorio
   */
  getDirectoryStats(): {
    totalFiles: number;
    totalSize: number;
    oldestFile?: { name: string; age: number };
    newestFile?: { name: string; age: number };
  } {
    try {
      const files = fs.readdirSync(this.uploadDir);
      let totalSize = 0;
      let oldestFile: { name: string; age: number } | undefined;
      let newestFile: { name: string; age: number } | undefined;
      const now = Date.now();
      const millisecondsPerDay = 24 * 60 * 60 * 1000;

      for (const file of files) {
        const filePath = path.join(this.uploadDir, file);
        const stats = fs.statSync(filePath);
        const fileAgeInDays = (now - stats.mtimeMs) / millisecondsPerDay;

        totalSize += stats.size;

        if (!oldestFile || fileAgeInDays > oldestFile.age) {
          oldestFile = { name: file, age: fileAgeInDays };
        }

        if (!newestFile || fileAgeInDays < newestFile.age) {
          newestFile = { name: file, age: fileAgeInDays };
        }
      }

      return {
        totalFiles: files.length,
        totalSize,
        oldestFile,
        newestFile,
      };
    } catch (error) {
      this.logger.error(`Error obteniendo estadísticas: ${error.message}`);
      return { totalFiles: 0, totalSize: 0 };
    }
  }
}
