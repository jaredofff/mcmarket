/**
 * Example: Plugin Import with Image Storage
 *
 * This example demonstrates how to import a plugin with image storage integration.
 * The ImageStorageService automatically downloads the plugin image and stores it
 * locally, replacing the original URL with a local path.
 */

import { Injectable } from '@nestjs/common';
import { PluginsService } from './plugins.service';
import { ImageStorageService } from '../storage/image-storage.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PluginImportExample {
  constructor(
    private pluginsService: PluginsService,
    private imageStorage: ImageStorageService,
    private prisma: PrismaService,
  ) {}

  /**
   * Example 1: Import a plugin with automatic image storage
   *
   * Request body:
   * {
   *   "pluginName": "Advanced Search Plugin",
   *   "pluginUrl": "https://plugins.example.com/advanced-search",
   *   "imageUrl": "https://assets.example.com/plugins/search.png",
   *   "config": {
   *     "searchEngines": ["google", "bing"]
   *   }
   * }
   *
   * What happens:
   * 1. ImageStorageService downloads image from imageUrl
   * 2. Validates MIME type (must be JPEG, PNG, GIF, or WebP)
   * 3. Checks file size (max 5MB)
   * 4. Generates unique filename (e.g., "1716406900-a1b2c3d4.png")
   * 5. Saves to public/images/1716406900-a1b2c3d4.png
   * 6. Returns storagePath: "/public/images/1716406900-a1b2c3d4.png"
   * 7. PluginsService stores plugin with imagePath (not original URL)
   *
   * Response:
   * {
   *   "success": true,
   *   "message": "Plugin Advanced Search Plugin imported successfully",
   *   "plugin": {
   *     "name": "Advanced Search Plugin",
   *     "url": "https://plugins.example.com/advanced-search",
   *     "imageUrl": "https://assets.example.com/plugins/search.png",  // Original URL stored for reference
   *     "imagePath": "/public/images/1716406900-a1b2c3d4.png",      // Local path for serving
   *     "config": { "searchEngines": ["google", "bing"] },
   *     "importedAt": "2025-05-22T17:30:45.123Z",
   *     "status": "imported"
   *   }
   * }
   */
  async exampleImportPluginWithImage() {
    const importData = {
      pluginName: 'Advanced Search Plugin',
      pluginUrl: 'https://plugins.example.com/advanced-search',
      imageUrl: 'https://assets.example.com/plugins/search.png',
      config: {
        searchEngines: ['google', 'bing'],
      },
    };

    return await this.pluginsService.importPlugin(importData);
  }

  /**
   * Example 2: Import plugin without image (imageUrl optional)
   *
   * If imageUrl is not provided, plugin is imported without image.
   */
  async exampleImportPluginWithoutImage() {
    const importData = {
      pluginName: 'Simple Counter Plugin',
      pluginUrl: 'https://plugins.example.com/counter',
      // No imageUrl provided
      config: {},
    };

    return await this.pluginsService.importPlugin(importData);
  }

  /**
   * Example 3: Handle image download failure gracefully
   *
   * The import process continues even if image download fails.
   * For example, if the image URL is unreachable, the plugin
   * is still created but without an associated image.
   *
   * Error scenarios handled:
   * - URL returns 404 (Not Found)
   * - Timeout (>10 seconds)
   * - Invalid MIME type (e.g., text/html instead of image/)
   * - File too large (>5MB)
   * - Network connection error
   */
  async exampleHandleImageDownloadFailure() {
    const importData = {
      pluginName: 'Plugin with Unavailable Image',
      pluginUrl: 'https://plugins.example.com/unavailable-image',
      imageUrl: 'https://example.com/deleted-image.jpg', // This URL returns 404
      config: {},
    };

    // Even if image download fails, plugin import succeeds
    const result = await this.pluginsService.importPlugin(importData);

    // result.plugin.imagePath will be undefined
    console.log(result.plugin.imagePath); // undefined
    console.log(result.plugin.imageUrl); // 'https://example.com/deleted-image.jpg' (stored for reference)

    return result;
  }

  /**
   * Example 4: Retrieve plugin and serve stored image
   *
   * When retrieving a plugin, imagePath points to the local storage.
   * Frontend can access this via the static file server.
   */
  async exampleRetrievePluginWithImage() {
    const plugin = await this.prisma.plugin.findUnique({
      where: { id: '123' },
    });

    // plugin.imagePath example: "/public/images/1716406900-a1b2c3d4.png"
    // Client can access via: GET /public/images/1716406900-a1b2c3d4.png

    return {
      id: plugin.id,
      title: plugin.title,
      description: plugin.description,
      imageUrl: plugin.imagePath, // Use local path, not original URL
      // imagePath ensures image persists even if original author deletes it
    };
  }

  /**
   * Example 5: Delete plugin and clean up image
   *
   * When a plugin is deleted, the associated image should also be deleted.
   * PluginsService.deletePlugin() handles this automatically.
   */
  async exampleDeletePluginAndImage(pluginName: string) {
    // This method:
    // 1. Finds the plugin by name
    // 2. If plugin has imagePath, deletes the file
    // 3. Removes plugin from storage
    this.pluginsService.deletePlugin(pluginName);

    console.log(`Plugin ${pluginName} and associated image deleted`);
  }

  /**
   * Example 6: Manual image storage (not via plugin import)
   *
   * If you need to store an image without importing a plugin,
   * you can use ImageStorageService directly.
   */
  async exampleManualImageStorage() {
    try {
      const result = await this.imageStorage.downloadAndStoreImage(
        'https://example.com/custom-image.jpg',
      );

      console.log('Image stored at:', result.storagePath);
      console.log('File size:', result.fileSize, 'bytes');

      // You can now save result.storagePath to database
      return result;
    } catch (error) {
      console.error('Image download failed:', error.message);
      // Handle error (e.g., show placeholder image)
    }
  }

  /**
   * Example 7: Cleanup old images (maintenance task)
   *
   * Images older than the specified number of days are deleted.
   * This could be run as a scheduled task via @Cron decorator.
   */
  async exampleCleanupOldImages() {
    const daysOld = 30;
    console.log(`Cleaning up images older than ${daysOld} days...`);

    // This would typically be run as a scheduled task:
    // @Cron('0 0 * * *') // Daily at midnight
    // async cleanupImages() {
    //   this.imageStorage.cleanupOldImages(30);
    // }

    this.imageStorage.cleanupOldImages(daysOld);
    console.log('Cleanup complete');
  }

  /**
   * Example 8: Get image file information
   *
   * Retrieve metadata about a stored image without downloading it.
   */
  async exampleGetImageInfo() {
    const imagePath = '/public/images/1716406900-a1b2c3d4.png';

    const info = this.imageStorage.getImageInfo(imagePath);

    console.log('Image exists:', info.exists);
    console.log('File size:', info.size, 'bytes');
    console.log('Created at:', info.createdAt);
    console.log('MIME type:', info.mimeType);

    return info;
  }
}

/**
 * HTTP Examples
 *
 * Note: Replace $CEO_TOKEN with an actual JWT token from POST /auth/login
 * with a CEO user.
 */

// Example request: Import plugin with image
// POST /plugins/import
// Authorization: Bearer $CEO_TOKEN
// Content-Type: application/json
//
// {
//   "pluginName": "SEO Optimizer",
//   "pluginUrl": "https://plugins.example.com/seo",
//   "imageUrl": "https://assets.example.com/plugins/seo-icon.png",
//   "config": {
//     "keywords": ["seo", "optimization"]
//   }
// }
//
// Response 200 OK:
// {
//   "success": true,
//   "message": "Plugin SEO Optimizer imported successfully",
//   "plugin": {
//     "name": "SEO Optimizer",
//     "url": "https://plugins.example.com/seo",
//     "imageUrl": "https://assets.example.com/plugins/seo-icon.png",
//     "imagePath": "/public/images/1716407000-b2c3d4e5.png",
//     "config": { "keywords": ["seo", "optimization"] },
//     "importedAt": "2025-05-22T17:35:00.000Z",
//     "status": "imported"
//   }
// }

// Example request: Serve stored image
// GET /public/images/1716407000-b2c3d4e5.png
// Response 200 OK with PNG image data
