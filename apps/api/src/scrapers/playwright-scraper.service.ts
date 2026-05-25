import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import DOMPurify from 'isomorphic-dompurify';
import axios from 'axios';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';

export interface ScrapedResource {
  title: string;
  description: string;
  descriptionHtml: string;
  author: string;
  version: string;
  tags: string[];
  categories: string[];
  testedVersions: string[];
  dependencies: string[];
  coverImage: string; // Local path after download
  bannerImage?: string;
  images: string[]; // Array of local paths
  downloadLink: string;
  changelog: {
    version: string;
    changes: string;
    date?: string;
  }[];
  metadata: Record<string, any>;
  sourceUrl: string;
}

@Injectable()
export class PlaywrightScraperService {
  private readonly logger = new Logger(PlaywrightScraperService.name);
  private readonly snapshotDir = path.join(
    process.cwd(),
    'public',
    'snapshots',
  );
  private readonly maxRetries = 3;

  constructor() {
    this.ensureSnapshotDirExists();
  }

  private ensureSnapshotDirExists(): void {
    if (!fs.existsSync(this.snapshotDir)) {
      fs.mkdirSync(this.snapshotDir, { recursive: true });
      this.logger.log(`Created snapshot directory: ${this.snapshotDir}`);
    }
  }

  /**
   * Scrape de BuiltByBit usando método manual (sin Playwright para evitar dependencias pesadas)
   * En producción, reemplazar con Playwright para manejar lazy loading
   *
   * Formato esperado de BuiltByBit:
   * https://builtbybit.com/resources/[resource-id]/
   */
  async scrapeBuiltByBit(url: string): Promise<ScrapedResource> {
    try {
      if (!this.isValidBuiltByBitUrl(url)) {
        throw new BadRequestException('URL inválida de BuiltByBit');
      }

      this.logger.log(`Iniciando scrape de: ${url}`);

      // Descargar HTML
      const html = await this.fetchHtml(url);

      // Extraer metadata
      const metadata = await this.extractMetadata(html, url);

      // Descargar imágenes
      const downloadedImages = await this.downloadImages(metadata);

      // Sanitizar HTML
      const sanitizedHtml = DOMPurify.sanitize(metadata.descriptionHtml);

      return {
        title: metadata.title,
        description: metadata.description,
        descriptionHtml: sanitizedHtml,
        author: metadata.author,
        version: metadata.version || '1.0.0',
        tags: metadata.tags || [],
        categories: metadata.categories || [],
        testedVersions: metadata.testedVersions || [],
        dependencies: metadata.dependencies || [],
        coverImage: downloadedImages.coverImage,
        bannerImage: downloadedImages.bannerImage,
        images: downloadedImages.allImages,
        downloadLink: metadata.downloadLink,
        changelog: metadata.changelog || [],
        metadata,
        sourceUrl: url,
      };
    } catch (error) {
      this.logger.error(`Error scraping BuiltByBit: ${error.message}`);
      throw error;
    }
  }

  /**
   * Valida que sea una URL de BuiltByBit válida
   */
  private isValidBuiltByBitUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return (
        urlObj.hostname.includes('builtbybit.com') &&
        urlObj.pathname.includes('/resources/')
      );
    } catch {
      return false;
    }
  }

  /**
   * Descarga el HTML de la página
   */
  private async fetchHtml(url: string, retryCount = 0): Promise<string> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 30000,
      });

      return response.data;
    } catch (error) {
      if (retryCount < this.maxRetries) {
        this.logger.warn(
          `Retry ${retryCount + 1}/${this.maxRetries} for ${url}`,
        );
        await this.delay(2000 * (retryCount + 1));
        return this.fetchHtml(url, retryCount + 1);
      }
      throw new BadRequestException(
        `No se pudo descargar la página: ${error.message}`,
      );
    }
  }

  /**
   * Extrae metadata de la página HTML
   * Este es un parser básico. En producción usar Playwright para HTML dinámico
   */
  private async extractMetadata(
    html: string,
    sourceUrl: string,
  ): Promise<Record<string, any>> {
    // Usar expresiones regulares simples para extraer metadata
    // En producción, usar Cheerio o Playwright para parsing más robusto

    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
    const authorMatch = html.match(
      /by\s+([^<]+)<\/|<span[^>]*>([^<]+)<\/span>/,
    );

    return {
      title: titleMatch ? titleMatch[1].trim() : 'Recurso Importado',
      description: descMatch ? descMatch[1] : 'Descripción no disponible',
      descriptionHtml: html, // Raw HTML para después sanitizar
      author: authorMatch ? authorMatch[1] || authorMatch[2] : 'Desconocido',
      version: '1.0.0',
      tags: [],
      categories: [],
      testedVersions: [],
      dependencies: [],
      downloadLink: sourceUrl,
      changelog: [],
      sourceUrl,
    };
  }

  /**
   * Descarga todas las imágenes encontradas en el HTML
   */
  private async downloadImages(metadata: Record<string, any>): Promise<{
    coverImage: string;
    bannerImage?: string;
    allImages: string[];
  }> {
    const images: string[] = [];
    let coverImage = '';
    let bannerImage = '';

    const imageUrls = this.extractImageUrls(metadata.descriptionHtml);

    for (const imageUrl of imageUrls) {
      try {
        const localPath = await this.downloadAndStoreImage(imageUrl);
        images.push(localPath);

        // Primera imagen como cover
        if (!coverImage) {
          coverImage = localPath;
        }
        // Segunda como banner
        if (!bannerImage && images.length === 2) {
          bannerImage = localPath;
        }
      } catch (error) {
        this.logger.warn(
          `Falló descargar imagen ${imageUrl}: ${error.message}`,
        );
      }
    }

    return {
      coverImage: coverImage || '/public/images/placeholder.png',
      bannerImage: bannerImage || coverImage,
      allImages: images,
    };
  }

  /**
   * Extrae URLs de imágenes del HTML
   */
  private extractImageUrls(html: string): string[] {
    const imgRegex = /<img[^>]+src="([^"]+)"/g;
    const urls: string[] = [];
    let match;

    while ((match = imgRegex.exec(html)) !== null) {
      const url = match[1];
      if (this.isValidImageUrl(url)) {
        urls.push(url);
      }
    }

    return urls;
  }

  /**
   * Valida que sea una URL de imagen válida
   */
  private isValidImageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url, 'https://builtbybit.com');
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(urlObj.pathname);
    } catch {
      return false;
    }
  }

  /**
   * Descarga una imagen y la almacena localmente
   */
  private async downloadAndStoreImage(imageUrl: string): Promise<string> {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 15000,
      });

      const buffer = Buffer.from(response.data);
      const fileName = this.generateFileName(imageUrl);
      const filePath = path.join(this.snapshotDir, fileName);

      fs.writeFileSync(filePath, buffer);

      return `/public/snapshots/${fileName}`;
    } catch (error) {
      throw new BadRequestException(
        `No se pudo descargar la imagen: ${error.message}`,
      );
    }
  }

  /**
   * Genera un nombre de archivo único
   */
  private generateFileName(url: string): string {
    const hash = crypto.randomBytes(8).toString('hex');
    const ext = url.split('.').pop()?.split('?')[0] || 'jpg';
    return `${Date.now()}-${hash}.${ext}`;
  }

  /**
   * Helper: delay para reintentos
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Calcula hash SHA-256 de un archivo
   */
  calculateFileHash(filePath: string): string {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
  }

  /**
   * Calcula hash SHA-256 de un buffer
   */
  calculateBufferHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }
}
