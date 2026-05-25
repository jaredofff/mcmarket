// Mock para isomorphic-dompurify que no requiere jsdom
class DOMPurifyMock {
  sanitize(html: string, config?: any): string {
    if (!html) {
      return '';
    }

    let result = html;

    // Si no hay ALLOWED_TAGS en la configuración, retornar vacío (modo texto plano)
    if (config && config.ALLOWED_TAGS && config.ALLOWED_TAGS.length === 0) {
      // Remover todas las etiquetas HTML
      return html.replace(/<[^>]*>/g, '');
    }

    // Remover scripts
    result = result.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      '',
    );

    // Remover iframes
    result = result.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '');

    // Remover on* attributes
    result = result.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
    result = result.replace(/\s+on\w+\s*=\s*[^\s>]*/gi, '');

    return result;
  }
}

export default new DOMPurifyMock();
