import { Test, TestingModule } from '@nestjs/testing';
import { SanitizationService } from './sanitization.service';

describe('SanitizationService', () => {
  let service: SanitizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SanitizationService],
    }).compile();

    service = module.get<SanitizationService>(SanitizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sanitizeHtml', () => {
    it('should remove script tags', () => {
      const html = '<p>Hello</p><script>alert("xss")</script>';
      const result = service.sanitizeHtml(html);
      expect(result).not.toContain('<script>');
      expect(result).toContain('<p>Hello</p>');
    });

    it('should remove iframe tags', () => {
      const html = '<p>Content</p><iframe src="evil.com"></iframe>';
      const result = service.sanitizeHtml(html);
      expect(result).not.toContain('<iframe>');
      expect(result).toContain('<p>Content</p>');
    });

    it('should remove dangerous attributes like onmouseover', () => {
      const html = '<p onmouseover="alert(1)">Text</p>';
      const result = service.sanitizeHtml(html);
      expect(result).not.toContain('onmouseover');
      expect(result).toContain('Text');
    });

    it('should allow basic formatting tags', () => {
      const html = '<h1>Title</h1><p>Content</p><strong>Bold</strong><em>Italic</em>';
      const result = service.sanitizeHtml(html);
      expect(result).toContain('<h1>Title</h1>');
      expect(result).toContain('<p>Content</p>');
      expect(result).toContain('<strong>Bold</strong>');
      expect(result).toContain('<em>Italic</em>');
    });

    it('should allow lists', () => {
      const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
      const result = service.sanitizeHtml(html);
      expect(result).toContain('<ul>');
      expect(result).toContain('<li>Item 1</li>');
      expect(result).toContain('</ul>');
    });

    it('should allow img tags with src and alt attributes', () => {
      const html = '<img src="image.jpg" alt="Image description" />';
      const result = service.sanitizeHtml(html);
      expect(result).toContain('src="image.jpg"');
      expect(result).toContain('alt="Image description"');
    });

    it('should add rel="nofollow" to links', () => {
      const html = '<a href="https://example.com">Link</a>';
      const result = service.sanitizeHtml(html);
      expect(result).toContain('rel="nofollow"');
      expect(result).toContain('href="https://example.com"');
    });

    it('should add target="_blank" to links', () => {
      const html = '<a href="https://example.com">Link</a>';
      const result = service.sanitizeHtml(html);
      expect(result).toContain('target="_blank"');
    });

    it('should preserve existing rel and add nofollow', () => {
      const html = '<a href="https://example.com" rel="external">Link</a>';
      const result = service.sanitizeHtml(html);
      expect(result).toContain('rel="external nofollow"');
      expect(result).toContain('target="_blank"');
    });

    it('should handle multiple links', () => {
      const html = '<a href="https://example.com">Link1</a><a href="https://other.com">Link2</a>';
      const result = service.sanitizeHtml(html);
      const matches = result.match(/rel="nofollow"/g);
      expect(matches).toHaveLength(2);
      const targetMatches = result.match(/target="_blank"/g);
      expect(targetMatches).toHaveLength(2);
    });

    it('should return empty string for empty input', () => {
      const result = service.sanitizeHtml('');
      expect(result).toBe('');
    });

    it('should return empty string for null input', () => {
      const result = service.sanitizeHtml(null as any);
      expect(result).toBe('');
    });

    it('should handle complex HTML with mixed content', () => {
      const html = `
        <h1>Title</h1>
        <p>Safe content <strong>with formatting</strong></p>
        <a href="https://example.com">External Link</a>
        <img src="image.jpg" alt="test" />
        <script>alert("xss")</script>
        <p onclick="alert(1)">Dangerous</p>
      `;
      const result = service.sanitizeHtml(html);
      expect(result).toContain('<h1>Title</h1>');
      expect(result).toContain('<strong>with formatting</strong>');
      expect(result).toContain('rel="nofollow"');
      expect(result).toContain('target="_blank"');
      expect(result).toContain('src="image.jpg"');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('onclick');
    });
  });

  describe('sanitizeHtmlArray', () => {
    it('should sanitize multiple HTML strings', () => {
      const htmlArray = [
        '<p>Content 1</p><script>alert(1)</script>',
        '<p>Content 2</p><iframe src="evil"></iframe>',
      ];
      const result = service.sanitizeHtmlArray(htmlArray);
      expect(result).toHaveLength(2);
      expect(result[0]).not.toContain('<script>');
      expect(result[1]).not.toContain('<iframe>');
    });
  });

  describe('stripHtml', () => {
    it('should remove all HTML tags', () => {
      const html = '<p>Hello <strong>World</strong></p>';
      const result = service.stripHtml(html);
      expect(result).toBe('Hello World');
    });

    it('should return empty string for empty input', () => {
      const result = service.stripHtml('');
      expect(result).toBe('');
    });

    it('should handle complex HTML', () => {
      const html = '<h1>Title</h1><p>Content with <em>formatting</em></p><a href="#">Link</a>';
      const result = service.stripHtml(html);
      expect(result).toBe('TitleContent with formattingLink');
    });
  });
});
