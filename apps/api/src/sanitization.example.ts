import { Injectable } from '@nestjs/common';
import { SanitizationService } from './sanitization.service';

/**
 * Ejemplo de integración del SanitizationService
 * Este archivo es de referencia y muestra cómo usar el servicio
 */

// Ejemplo 1: Integración en un servicio que procesa contenido scrapeado
@Injectable()
export class ExampleScraperService {
  constructor(private sanitizationService: SanitizationService) {}

  /**
   * Ejemplo: Procesar contenido obtenido del scraper
   */
  async processScrappedContent(html: string): Promise<string> {
    // El HTML viene del scraper con contenido potencialmente peligroso
    const cleanHtml = this.sanitizationService.sanitizeHtml(html);
    return cleanHtml;
  }

  /**
   * Ejemplo: Procesar múltiples contenidos
   */
  async processScrappedContents(htmlArray: string[]): Promise<string[]> {
    return this.sanitizationService.sanitizeHtmlArray(htmlArray);
  }

  /**
   * Ejemplo: Extraer un resumen de texto sin HTML
   */
  getContentSummary(html: string, maxLength: number = 200): string {
    const text = this.sanitizationService.stripHtml(html);
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  }
}

/**
 * Ejemplos de uso en un controlador
 */

// import { Controller, Post, Body } from '@nestjs/common';
// import { ExampleScraperService } from './example-scraper.service';
//
// @Controller('api/content')
// export class ExampleContentController {
//   constructor(private scraperService: ExampleScraperService) {}
//
//   @Post('sanitize')
//   async sanitizeHtml(@Body('html') html: string): Promise<{ sanitized: string }> {
//     const sanitized = await this.scraperService.processScrappedContent(html);
//     return { sanitized };
//   }
//
//   @Post('batch-sanitize')
//   async sanitizeBatch(@Body('htmlArray') htmlArray: string[]): Promise<{ sanitized: string[] }> {
//     const sanitized = await this.scraperService.processScrappedContents(htmlArray);
//     return { sanitized };
//   }
//
//   @Post('summary')
//   async getSummary(@Body('html') html: string): Promise<{ summary: string }> {
//     const summary = this.scraperService.getContentSummary(html);
//     return { summary };
//   }
// }

/**
 * Ejemplo de uso directo
 */

// Entrada peligrosa del scraper:
const dangerousHtml = `
  <h1>Article Title</h1>
  <p>Safe paragraph content.</p>
  <p onclick="alert('XSS')">Dangerous paragraph with onclick</p>
  <script>alert('Injection attempt')</script>
  <img src="image.jpg" onerror="alert('XSS')" alt="Image" />
  <a href="https://example.com" onclick="trackUser()">Link</a>
  <iframe src="https://evil.com"></iframe>
  <b>Bold text</b>
  <strong>Strong text</strong>
  <ul>
    <li>List item 1</li>
    <li>List item 2</li>
  </ul>
`;

// Salida sanitizada esperada:
// <h1>Article Title</h1>
// <p>Safe paragraph content.</p>
// <p>Dangerous paragraph with onclick</p>
// <!-- script removed -->
// <img src="image.jpg" alt="Image" />
// <a href="https://example.com" rel="nofollow" target="_blank">Link</a>
// <!-- iframe removed -->
// <b>Bold text</b>
// <strong>Strong text</strong>
// <ul>
//   <li>List item 1</li>
//   <li>List item 2</li>
// </ul>

export const EXAMPLE_USAGE = dangerousHtml;
