import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateAdminPluginDto {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  @MaxLength(200, { message: 'El título no puede exceder 200 caracteres' })
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(10, {
    message: 'La descripción debe tener al menos 10 caracteres',
  })
  @MaxLength(5000, {
    message: 'La descripción no puede exceder 5000 caracteres',
  })
  description?: string;

  @IsString()
  @IsOptional()
  descriptionHtml?: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'El precio no puede ser negativo' })
  price?: number;

  @IsArray()
  @IsOptional()
  testedVersions?: string[];

  @IsArray()
  @IsOptional()
  dependencies?: string[];

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsArray()
  @IsOptional()
  categories?: string[];

  @IsString()
  @IsOptional()
  testServerUrl?: string;

  @IsBoolean()
  @IsOptional()
  isVipOnly?: boolean;

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsString()
  @IsOptional()
  sourceUrl?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsOptional()
  bannerImage?: string;
}
