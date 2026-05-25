import { Test, TestingModule } from '@nestjs/testing';
import { PluginsService } from './plugins.service';
import { BadRequestException } from '@nestjs/common';

describe('PluginsService (Simplified Unit Tests)', () => {
  let service: PluginsService;
  let mockPrismaService: any;
  let mockImageStorageService: any;

  // Constructor injection for testing - bypass DI container
  beforeEach(() => {
    mockPrismaService = {
      plugin: {
        create: jest.fn(),
      },
      user: {
        findFirst: jest.fn(),
      },
    };

    mockImageStorageService = {
      downloadAndStoreImage: jest.fn(),
      deleteImage: jest.fn(),
      getImageInfo: jest.fn(),
      cleanupOldImages: jest.fn(),
    };

    // Directly instantiate service with mocked dependencies
    service = new PluginsService(mockPrismaService, mockImageStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('importPlugin', () => {
    it('should import a valid plugin', async () => {
      const importData = {
        pluginName: 'test-plugin',
        pluginUrl: 'http://example.com/plugin',
        config: { key: 'value' },
      };

      const result = await service.importPlugin(importData);

      expect(result.success).toBe(true);
      expect(result.plugin.name).toBe('test-plugin');
      expect(result.plugin.url).toBe('http://example.com/plugin');
      expect(result.plugin.config).toEqual({ key: 'value' });
    });

    it('should import a plugin with imageUrl and download image', async () => {
      mockImageStorageService.downloadAndStoreImage.mockResolvedValue({
        storagePath: '/public/images/1716406900-hash.jpg',
        fileName: '1716406900-hash.jpg',
        fileSize: 102400,
        downloadedAt: new Date(),
      });

      const importData = {
        pluginName: 'plugin-with-image',
        pluginUrl: 'http://example.com/plugin',
        imageUrl: 'http://example.com/image.jpg',
        config: {},
      };

      const result = await service.importPlugin(importData);

      expect(result.success).toBe(true);
      expect(result.plugin.imagePath).toBe('/public/images/1716406900-hash.jpg');
      expect(mockImageStorageService.downloadAndStoreImage).toHaveBeenCalledWith(
        'http://example.com/image.jpg',
      );
    });

    it('should continue import if image download fails', async () => {
      mockImageStorageService.downloadAndStoreImage.mockRejectedValue(
        new Error('Download failed'),
      );

      const importData = {
        pluginName: 'plugin-failed-image',
        pluginUrl: 'http://example.com/plugin',
        imageUrl: 'http://example.com/image.jpg',
      };

      const result = await service.importPlugin(importData);

      expect(result.success).toBe(true);
      expect(result.plugin.imagePath).toBeUndefined();
    });

    it('should throw error if pluginName is missing', async () => {
      const importData = {
        pluginName: '',
        pluginUrl: 'http://example.com/plugin',
      };

      await expect(service.importPlugin(importData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error if pluginUrl is missing', async () => {
      const importData = {
        pluginName: 'test-plugin',
        pluginUrl: '',
      };

      await expect(service.importPlugin(importData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error if pluginUrl is invalid', async () => {
      const importData = {
        pluginName: 'test-plugin',
        pluginUrl: 'invalid-url',
      };

      await expect(service.importPlugin(importData)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should store plugin in the map', async () => {
      const importData = {
        pluginName: 'stored-plugin',
        pluginUrl: 'http://example.com/stored',
      };

      await service.importPlugin(importData);
      const plugin = service.getPlugin('stored-plugin');

      expect(plugin).toBeDefined();
      expect(plugin.name).toBe('stored-plugin');
    });
  });

  describe('getImportedPlugins', () => {
    it('should return empty array initially', () => {
      const plugins = service.getImportedPlugins();
      expect(plugins).toEqual([]);
    });

    it('should return all imported plugins', async () => {
      await service.importPlugin({
        pluginName: 'plugin1',
        pluginUrl: 'http://example.com/plugin1',
      });

      await service.importPlugin({
        pluginName: 'plugin2',
        pluginUrl: 'http://example.com/plugin2',
      });

      const plugins = service.getImportedPlugins();
      expect(plugins).toHaveLength(2);
      expect(plugins.map((p) => p.name)).toContain('plugin1');
      expect(plugins.map((p) => p.name)).toContain('plugin2');
    });
  });

  describe('getPlugin', () => {
    it('should return plugin by name', async () => {
      const importData = {
        pluginName: 'specific-plugin',
        pluginUrl: 'http://example.com/specific',
      };

      await service.importPlugin(importData);
      const plugin = service.getPlugin('specific-plugin');

      expect(plugin).toBeDefined();
      expect(plugin.name).toBe('specific-plugin');
    });

    it('should return null if plugin not found', () => {
      const plugin = service.getPlugin('nonexistent');
      expect(plugin).toBeNull();
    });
  });

  describe('deletePlugin', () => {
    it('should delete a plugin and its image', async () => {
      mockImageStorageService.downloadAndStoreImage.mockResolvedValue({
        storagePath: '/public/images/1716406900-hash.jpg',
        fileName: '1716406900-hash.jpg',
      });

      await service.importPlugin({
        pluginName: 'plugin-to-delete',
        pluginUrl: 'http://example.com/plugin',
        imageUrl: 'http://example.com/image.jpg',
      });

      service.deletePlugin('plugin-to-delete');

      expect(mockImageStorageService.deleteImage).toHaveBeenCalledWith(
        '/public/images/1716406900-hash.jpg',
      );
      expect(service.getPlugin('plugin-to-delete')).toBeNull();
    });

    it('should delete a plugin without image', async () => {
      await service.importPlugin({
        pluginName: 'plugin-no-image',
        pluginUrl: 'http://example.com/plugin',
      });

      service.deletePlugin('plugin-no-image');

      expect(mockImageStorageService.deleteImage).not.toHaveBeenCalled();
      expect(service.getPlugin('plugin-no-image')).toBeNull();
    });
  });
});
