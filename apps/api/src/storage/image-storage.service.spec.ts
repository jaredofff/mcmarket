import { Test, TestingModule } from '@nestjs/testing';
import { ImageStorageService } from './image-storage.service';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

describe('ImageStorageService', () => {
  let service: ImageStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageStorageService],
    }).compile();

    service = module.get<ImageStorageService>(ImageStorageService);
  });

  afterEach(() => {
    // Limpiar archivos de test si existen
    const testDir = path.join(process.cwd(), 'public', 'images');
    if (fs.existsSync(testDir)) {
      const files = fs.readdirSync(testDir);
      files.forEach((file) => {
        const filePath = path.join(testDir, file);
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          // Ignore
        }
      });
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('downloadAndStoreImage', () => {
    it('should reject invalid URLs', async () => {
      await expect(
        service.downloadAndStoreImage('not-a-valid-url'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject HTTP URLs that are not images', async () => {
      await expect(
        service.downloadAndStoreImage('http://example.com'),
      ).rejects.toThrow();
    });

    it('should validate URL protocol', async () => {
      await expect(
        service.downloadAndStoreImage('ftp://example.com/image.jpg'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getMimeTypeExtension', () => {
    it('should return correct extension for JPEG', () => {
      // Accedemos a través de reflection ya que es private
      const ext = (service as any).getMimeTypeExtension('image/jpeg');
      expect(ext).toBe('.jpg');
    });

    it('should return correct extension for PNG', () => {
      const ext = (service as any).getMimeTypeExtension('image/png');
      expect(ext).toBe('.png');
    });

    it('should return correct extension for GIF', () => {
      const ext = (service as any).getMimeTypeExtension('image/gif');
      expect(ext).toBe('.gif');
    });

    it('should return correct extension for WebP', () => {
      const ext = (service as any).getMimeTypeExtension('image/webp');
      expect(ext).toBe('.webp');
    });

    it('should default to JPG for unknown types', () => {
      const ext = (service as any).getMimeTypeExtension('image/unknown');
      expect(ext).toBe('.jpg');
    });
  });

  describe('isValidUrl', () => {
    it('should validate HTTPS URLs', () => {
      const result = (service as any).isValidUrl(
        'https://example.com/image.jpg',
      );
      expect(result).toBe(true);
    });

    it('should validate HTTP URLs', () => {
      const result = (service as any).isValidUrl(
        'http://example.com/image.jpg',
      );
      expect(result).toBe(true);
    });

    it('should reject FTP URLs', () => {
      const result = (service as any).isValidUrl(
        'ftp://example.com/image.jpg',
      );
      expect(result).toBe(false);
    });

    it('should reject invalid URLs', () => {
      const result = (service as any).isValidUrl('not-a-url');
      expect(result).toBe(false);
    });
  });

  describe('simpleHash', () => {
    it('should generate consistent hash for same URL', () => {
      const url = 'http://example.com/image.jpg';
      const hash1 = (service as any).simpleHash(url);
      const hash2 = (service as any).simpleHash(url);
      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different URLs', () => {
      const url1 = 'http://example.com/image1.jpg';
      const url2 = 'http://example.com/image2.jpg';
      const hash1 = (service as any).simpleHash(url1);
      const hash2 = (service as any).simpleHash(url2);
      expect(hash1).not.toBe(hash2);
    });

    it('should generate valid hex strings', () => {
      const hash = (service as any).simpleHash('http://example.com/test.jpg');
      expect(/^[0-9a-f]+$/.test(hash)).toBe(true);
    });
  });

  describe('deleteImage', () => {
    it('should not throw error if file does not exist', () => {
      expect(() => {
        service.deleteImage('/nonexistent/path/image.jpg');
      }).not.toThrow();
    });
  });

  describe('getImageInfo', () => {
    it('should return null for nonexistent file', () => {
      const info = service.getImageInfo('/nonexistent/path/image.jpg');
      expect(info).toBeNull();
    });
  });

  describe('cleanupOldImages', () => {
    it('should return 0 if no images to cleanup', () => {
      const result = service.cleanupOldImages(1);
      expect(result).toBe(0);
    });
  });
});
