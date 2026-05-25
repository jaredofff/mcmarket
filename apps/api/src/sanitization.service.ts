import { Injectable } from '@nestjs/common';
import DOMPurify from 'isomorphic-dompurify';

@Injectable()
export class SanitizationService {
  /**
   * Configura DOMPurify con las opciones de sanitización necesarias
   * Permite solo etiquetas básicas de formato y añade rel="nofollow"
   * a los enlaces
   */
  private getDOMPurifyConfig() {
    return {
      ALLOWED_TAGS: [
        'p',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'b',
        'strong',
        'i',
        'em',
        'a',
        'img',
        'br',
      ],
      ALLOWED_ATTR: ['href', 'title', 'src', 'alt', 'rel', 'target'],
      KEEP_CONTENT: true,
    };
  }

  /**
   * Sanitiza el contenido HTML eliminando scripts, iframes y atributos peligrosos
   * Asegura que los enlaces tengan rel="nofollow" y target="_blank"
   * @param html - HTML a sanitizar
   * @returns HTML sanitizado
   */
  sanitizeHtml(html: string): string {
    if (!html) {
      return '';
    }

    // Primero remover scripts, iframes e inyecciones peligrosas manualmente
    let sanitized = this.removeScriptsAndDangerousCode(html);

    // Aplicar DOMPurify
    const config = this.getDOMPurifyConfig();
    sanitized = DOMPurify.sanitize(sanitized, config);

    // Procesar enlaces para agregar rel="nofollow" y target="_blank"
    sanitized = this.processLinks(sanitized);

    return sanitized;
  }

  /**
   * Remueve scripts, iframes y código peligroso del HTML
   * @param html - HTML a limpiar
   * @returns HTML sin elementos peligrosos
   */
  private removeScriptsAndDangerousCode(html: string): string {
    // Remover etiquetas script completas
    let result = html.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      '',
    );

    // Remover etiquetas iframe
    result = result.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '');

    return result;
  }

  /**
   * Procesa los enlaces en el HTML para agregar rel="nofollow" y target="_blank"
   * @param html - HTML con enlaces
   * @returns HTML con enlaces procesados
   */
  private processLinks(html: string): string {
    // Expresión regular para encontrar todas las etiquetas <a>
    const linkRegex = /<a\s+([^>]*?)>/gi;

    return html.replace(linkRegex, (match, attributes) => {
      // Verificar si el atributo rel ya existe
      const hasRel = /\brel\s*=\s*["']([^"']*)["']/i.test(attributes);
      const hasTarget = /\btarget\s*=\s*["']([^"']*)["']/i.test(attributes);

      let updatedAttributes = attributes;

      // Agregar o actualizar rel="nofollow"
      if (hasRel) {
        updatedAttributes = updatedAttributes.replace(
          /\brel\s*=\s*["']([^"']*)["']/i,
          (match: string, value: string) => {
            if (!value.includes('nofollow')) {
              return `rel="${value} nofollow"`;
            }
            return match;
          },
        );
      } else {
        updatedAttributes += ' rel="nofollow"';
      }

      // Agregar o actualizar target="_blank"
      if (hasTarget) {
        updatedAttributes = updatedAttributes.replace(
          /\btarget\s*=\s*["']([^"']*)["']/i,
          () => `target="_blank"`,
        );
      } else {
        updatedAttributes += ' target="_blank"';
      }

      return `<a ${updatedAttributes}>`;
    });
  }

  /**
   * Sanitiza múltiples contenidos HTML
   * @param htmlArray - Array de HTML a sanitizar
   * @returns Array de HTML sanitizados
   */
  sanitizeHtmlArray(htmlArray: string[]): string[] {
    return htmlArray.map((html) => this.sanitizeHtml(html));
  }

  /**
   * Extrae solo el texto plano sin etiquetas HTML
   * @param html - HTML del cual extraer texto
   * @returns Texto plano
   */
  stripHtml(html: string): string {
    if (!html) {
      return '';
    }

    return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
  }
}
