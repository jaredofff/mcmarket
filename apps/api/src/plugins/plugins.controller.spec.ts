import { Test, TestingModule } from '@nestjs/testing';
import { PluginsController } from './plugins.controller';
import { PluginsService } from './plugins.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

describe('PluginsController', () => {
  let controller: PluginsController;
  let service: PluginsService;

  beforeEach(async () => {
    const mockPrismaService = {
      plugin: {
        create: jest.fn(),
      },
      user: {
        findFirst: jest.fn(),
      },
    };

    const mockImageStorageService = {
      downloadAndStoreImage: jest.fn(),
      deleteImage: jest.fn(),
      getImageInfo: jest.fn(),
      cleanupOldImages: jest.fn(),
    };

    // Directly instantiate service with mocks, bypass DI container
    service = new PluginsService(mockPrismaService, mockImageStorageService);
    controller = new PluginsController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return imported plugins', () => {
    const mockPlugins = [
      {
        name: 'plugin1',
        url: 'http://example.com/plugin1',
        status: 'imported',
      },
    ];

    jest.spyOn(service, 'getImportedPlugins').mockReturnValue(mockPlugins);

    const result = controller.getPlugins();
    expect(result).toEqual(mockPlugins);
  });

  it('should import a plugin', async () => {
    const importData = {
      pluginName: 'test-plugin',
      pluginUrl: 'http://example.com/plugin',
    };

    const mockResult = {
      success: true,
      message: 'Plugin test-plugin imported successfully',
      plugin: {
        name: 'test-plugin',
        url: 'http://example.com/plugin',
        config: {},
        importedAt: expect.any(Date),
        status: 'imported',
      },
    };

    jest.spyOn(service, 'importPlugin').mockResolvedValue(mockResult);

    const result = await controller.importPlugin(importData);
    expect(result).toEqual(mockResult);
    expect(service.importPlugin).toHaveBeenCalledWith(importData);
  });
});
