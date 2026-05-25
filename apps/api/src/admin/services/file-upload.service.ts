import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { randomBytes } from 'crypto';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  constructor() {
    this.ensureUploadsDir();
  }

  /**
   * Asegura que exista el directorio de uploads
   */
  private ensureUploadsDir(): void {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
      this.logger.log(`Uploads directory created at ${this.uploadsDir}`);
    }
  }

  /**
   * Obtiene la extensión de archivo basada en mimetype
   */
  private getFileExtension(mimetype: string): string {
    const mimeMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'application/zip': 'zip',
      'application/x-zip-compressed': 'zip',
      'application/java-archive': 'jar',
    };

    return mimeMap[mimetype] || 'bin';
  }

  /**
   * Sube un archivo al servidor
   * @param buffer - Buffer del archivo
   * @param mimetype - MIME type del archivo
   * @param folder - Carpeta destino dentro de uploads
   * @returns Ruta relativa del archivo guardado
   */
  async uploadFile(
    buffer: Buffer,
    mimetype: string,
    folder: string = 'general',
  ): Promise<string> {
    try {
      // Validar que el buffer exista
      if (!buffer || buffer.length === 0) {
        throw new BadRequestException('El archivo está vacío');
      }

      // Crear directorio de la carpeta si no existe
      const folderPath = path.join(this.uploadsDir, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // Generar nombre único del archivo
      const ext = this.getFileExtension(mimetype);
      const randomName = randomBytes(16).toString('hex');
      const filename = `${randomName}.${ext}`;
      const filePath = path.join(folderPath, filename);

      // Guardar archivo
      fs.writeFileSync(filePath, buffer);
      this.logger.log(`Archivo guardado: ${filePath}`);

      // Retornar ruta relativa
      return `/uploads/${folder}/${filename}`;
    } catch (error) {
      this.logger.error(`Error al subir archivo: ${error.message}`);
      throw new BadRequestException(`Error al subir archivo: ${error.message}`);
    }
  }

  /**
   * Borra un archivo del filesystem
   * @param filePath - Ruta relativa del archivo (ej: /uploads/images/file.jpg)
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      // Construir ruta absoluta y validar que esté dentro de uploads
      const absolutePath = path.join(process.cwd(), 'public', filePath);
      const normalizedPath = path.normalize(absolutePath);
      const normalizedUploadsDir = path.normalize(this.uploadsDir);

      if (!normalizedPath.startsWith(normalizedUploadsDir)) {
        throw new BadRequestException(
          'Intento de acceso a archivo fuera del directorio permitido',
        );
      }

      // Verificar que el archivo existe
      if (!fs.existsSync(normalizedPath)) {
        this.logger.warn(`Archivo no encontrado: ${normalizedPath}`);
        return;
      }

      // Eliminar archivo
      fs.unlinkSync(normalizedPath);
      this.logger.log(`Archivo eliminado: ${normalizedPath}`);
    } catch (error) {
      this.logger.error(`Error al eliminar archivo: ${error.message}`);
      throw new BadRequestException(
        `Error al eliminar archivo: ${error.message}`,
      );
    }
  }

  /**
   * Valida el tamaño del archivo
   * @param buffer - Buffer del archivo
   * @param maxSizeMb - Tamaño máximo en MB
   * @throws BadRequestException si el archivo es demasiado grande
   */
  validateFileSize(buffer: Buffer, maxSizeMb: number): void {
    const maxBytes = maxSizeMb * 1024 * 1024;
    if (buffer.length > maxBytes) {
      throw new BadRequestException(
        `El archivo excede el tamaño máximo de ${maxSizeMb}MB. Tamaño actual: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`,
      );
    }
  }

  /**
   * Valida que el archivo sea una imagen
   * @param mimetype - MIME type del archivo
   * @throws BadRequestException si no es una imagen válida
   */
  validateImageFile(mimetype: string): void {
    const validImageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!validImageTypes.includes(mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido. Formatos válidos: JPEG, PNG, GIF, WebP. Recibido: ${mimetype}`,
      );
    }
  }

  /**
   * Valida que el archivo sea un ZIP/JAR (plugin)
   * @param mimetype - MIME type del archivo
   * @throws BadRequestException si no es un archivo de plugin válido
   */
  validatePluginFile(mimetype: string): void {
    const validPluginTypes = [
      'application/zip',
      'application/x-zip-compressed',
      'application/java-archive',
    ];
    if (!validPluginTypes.includes(mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido. Se esperaba ZIP/JAR, recibido: ${mimetype}`,
      );
    }
  }
}
