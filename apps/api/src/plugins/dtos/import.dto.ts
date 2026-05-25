import {
  IsString,
  IsUrl,
  IsArray,
  IsOptional,
  IsNumber,
  IsEnum,
  ValidateNested,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePluginFromUrlDto {
  @IsUrl()
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  customTitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  customDescription?: string;
}

export class ImportJobResponseDto {
  id: string;
  pluginId?: string;
  sourceUrl: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  progress: number;
  errorMessage?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export class PluginVersionDto {
  id: string;
  pluginId: string;
  version: string;
  fileName: string;
  fileSize: number;
  fileHash: string;
  downloadUrl: string;
  releaseDate: Date;
  changelog: string;
  isLatest: boolean;
}

export class ResourceSnapshotDto {
  id: string;
  pluginId: string;
  title: string;
  descriptionHtml: string;
  author: string;
  version: string;
  tags: string[];
  categories: string[];
  testedVersions: string[];
  dependencies: string[];
  coverImage: string;
  bannerImage?: string;
  images: string[];
  capturedAt: Date;
}

export class PluginDetailDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  descriptionHtml: string;
  author: string;
  version: string;
  tags: string[];
  categories: string[];
  testedVersions: string[];
  dependencies: string[];
  coverImage: string;
  bannerImage?: string;
  images: string[];
  sourceUrl: string;
  isVipOnly: boolean;
  downloadCount: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  latestVersion?: PluginVersionDto;
  snapshot?: ResourceSnapshotDto;
  allVersions?: PluginVersionDto[];
}

export class UpdatePluginDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  descriptionHtml?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @IsArray()
  testedVersions?: string[];

  @IsOptional()
  @IsArray()
  dependencies?: string[];

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsString()
  bannerImage?: string;

  @IsOptional()
  @IsArray()
  images?: string[];
}

export class ResyncPluginDto {
  @IsUrl()
  @IsString()
  sourceUrl: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class BulkImportDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePluginFromUrlDto)
  plugins: CreatePluginFromUrlDto[];

  @IsOptional()
  @IsString()
  campaignName?: string;
}

export class ImportFilterDto {
  @IsOptional()
  @IsString()
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

  @IsOptional()
  @IsString()
  sourceUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'updatedAt' | 'progress';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}

export class PluginFilterDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  isVipOnly?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'downloads' | 'rating' | 'title';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}

export class PluginDownloadDto {
  id: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  downloadUrl: string;
}

export class MarketplaceStatsDto {
  totalPlugins: number;
  totalVipPlugins: number;
  totalDownloads: number;
  averageRating: number;
  recentImports: {
    count: number;
    successRate: number;
    avgDuration: number;
  };
  topAuthor: {
    author: string;
    pluginCount: number;
  };
  topTags: Array<{ tag: string; count: number }>;
  topCategories: Array<{ category: string; count: number }>;
}
