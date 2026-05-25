# Image Storage Service

## Overview

The `ImageStorageService` provides secure image download, validation, and local storage functionality for the plugin import system. Images are downloaded from remote URLs and stored locally in the `public/images/` directory, ensuring plugins remain accessible even if the original image source is deleted.

## Features

- **Secure Download**: Downloads images via HTTPS/HTTP with validation
- **Type Checking**: Validates MIME types (JPEG, PNG, GIF, WebP only)
- **Size Limits**: Enforces maximum file size (5MB by default)
- **Unique Storage**: Generates collision-resistant filenames using timestamp + hash
- **Error Handling**: Graceful failures with detailed logging
- **Cleanup**: Optional automatic cleanup of old images
- **Static Serving**: Integrates with NestJS ServeStaticModule for HTTP serving

## Usage

### Basic Image Download

```typescript
import { ImageStorageService } from './storage/image-storage.service';

@Injectable()
export class PluginsService {
  constructor(private imageStorage: ImageStorageService) {}

  async importPlugin(data: ImportPluginDto) {
    if (data.imageUrl) {
      try {
        const result = await this.imageStorage.downloadAndStoreImage(data.imageUrl);
        // Save result.storagePath to database instead of original URL
        const plugin = await this.db.plugin.create({
          imagePath: result.storagePath,
        });
      } catch (error) {
        // Continue without image if download fails
        console.warn(`Image download failed: ${error.message}`);
      }
    }
  }
}
```

### Delete Stored Image

```typescript
async deletePlugin(pluginName: string) {
  const plugin = await this.db.plugin.findOne(pluginName);
  if (plugin?.imagePath) {
    await this.imageStorage.deleteImage(plugin.imagePath);
  }
  await this.db.plugin.delete(pluginName);
}
```

### Cleanup Old Images

```typescript
// Remove images older than 30 days (optional scheduled task)
async cleanupTask() {
  const daysOld = 30;
  await this.imageStorage.cleanupOldImages(daysOld);
}
```

## Architecture

### Service Methods

#### `downloadAndStoreImage(imageUrl: string): Promise<ImageStorageResult>`

Downloads an image from a remote URL and stores it locally.

**Parameters:**
- `imageUrl` (string): Full URL to the image (must be HTTP/HTTPS)

**Returns:** `ImageStorageResult` object:
```typescript
{
  originalUrl: string;        // Original image URL
  storagePath: string;        // Local path (/public/images/filename)
  fileName: string;           // Generated filename
  fileSize: number;           // File size in bytes
  downloadedAt: Date;         // Download timestamp
}
```

**Throws:** `BadRequestException` for:
- Invalid URL format
- Unsupported protocol (non-HTTP/HTTPS)
- Unsupported MIME type
- File size exceeds 5MB
- Network errors (timeout, connection refused, etc.)

#### `deleteImage(filePath: string): void`

Removes a stored image file.

**Parameters:**
- `filePath` (string): Storage path returned from `downloadAndStoreImage()`

#### `getImageInfo(filePath: string): ImageInfo`

Returns file statistics without downloading.

**Returns:**
```typescript
{
  exists: boolean;
  size: number;           // File size in bytes
  createdAt: Date;        // File creation time
  mimeType: string;       // Content type
}
```

#### `cleanupOldImages(daysOld: number): void`

Removes images older than the specified number of days.

## Configuration

### Allowed MIME Types

Only these image formats are accepted:
- `image/jpeg` (.jpg, .jpeg)
- `image/png` (.png)
- `image/gif` (.gif)
- `image/webp` (.webp)

### Storage Location

Images are stored in: `<project-root>/public/images/`

The directory is created automatically if it doesn't exist.

### File Size Limits

- **Maximum file size:** 5MB (5,242,880 bytes)
- Enforced before file write to prevent disk space exhaustion

### Filename Generation

Generated format: `<timestamp>-<hash>.<extension>`

Example: `1716406900-a1b2c3d4.jpg`

- `timestamp`: Unix timestamp of download
- `hash`: Numeric hash of original URL (prevents collisions)
- `extension`: Detected from MIME type

### HTTP Request Configuration

- **Timeout:** 10 seconds
- **User-Agent:** Custom Mozilla 5.0 string (avoids blocking)
- **Protocol:** HTTPS preferred, HTTP allowed
- **Headers:** Includes User-Agent to avoid server blocks

## Integration with ServeStaticModule

The `AppModule` configures static file serving:

```typescript
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    // ... other imports
  ],
})
export class AppModule {}
```

This allows images stored in `public/images/` to be served at:
- `GET /public/images/filename` (HTTP endpoint)

## Error Handling

### Graceful Degradation

The plugin import process continues even if image download fails:

```typescript
try {
  const imageResult = await this.imageStorage.downloadAndStoreImage(imageUrl);
  plugin.imagePath = imageResult.storagePath;
} catch (error) {
  console.warn(`Image download failed: ${error.message}`);
  // Plugin created without image, uses placeholder or omits image
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid image URL" | Malformed URL or non-HTTP protocol | Provide valid HTTPS URL |
| "Unsupported image format" | MIME type not in whitelist | Use JPEG, PNG, GIF, or WebP |
| "Image too large" | File exceeds 5MB | Optimize image size before import |
| "Request timeout" | Download took >10 seconds | Check network or image server |
| "ENOENT" (file not found) | Image URL returns 404 | Verify URL is accessible |

## Security Considerations

### URL Validation
- Only HTTP/HTTPS protocols accepted
- URL must be properly formatted
- No file:// or data: URLs allowed

### Type Checking
- MIME type validated from response headers
- File extension validated against detected type
- Prevents upload of malicious files

### Size Limits
- 5MB maximum enforces disk space safety
- Prevents DoS attacks via large file uploads

### Filename Safety
- Generated filenames use timestamp + hash
- No user input in filenames
- No directory traversal possible

## Testing

The service includes 11 comprehensive unit tests:

```bash
npm test -- src/storage/image-storage.service.spec.ts
```

Tests cover:
- ✓ Valid image download
- ✓ URL validation (protocol, format)
- ✓ MIME type detection
- ✓ File size validation
- ✓ Hash-based filename generation
- ✓ Error handling for network failures
- ✓ Cleanup of old files

## Database Integration

When saving plugin records, store the `storagePath` (not original URL):

```typescript
// ✓ GOOD: Save local path
const plugin = await db.plugin.create({
  title: 'My Plugin',
  imagePath: '/public/images/1716406900-a1b2c3d4.jpg',
});

// ✗ BAD: Save original URL (defeats the purpose)
const plugin = await db.plugin.create({
  imagePath: 'https://example.com/original-image.jpg',
});
```

To retrieve the image in the frontend:
```typescript
// In plugin response
{
  id: '123',
  title: 'My Plugin',
  imagePath: '/public/images/1716406900-a1b2c3d4.jpg'
}

// Client-side
<img src={plugin.imagePath} alt={plugin.title} />
```

## Future Enhancements

- [ ] Image optimization (resize, compress)
- [ ] Thumbnail generation
- [ ] CDN integration
- [ ] Scheduled cleanup task via CronJob
- [ ] S3/Cloud storage backend
- [ ] Image caching headers optimization
- [ ] WebP conversion from PNG/JPEG
