# 🔑 Snippets Clave - Panel de Administración

## Backend - AdminPluginsController

```typescript
// apps/api/src/admin/controllers/admin-plugins.controller.ts

import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../../auth/roles.guard';
import { AdminPluginsService } from '../services/admin-plugins.service';
import { CreateAdminPluginDto } from '../dtos/create-admin-plugin.dto';
import { UpdateAdminPluginDto } from '../dtos/update-admin-plugin.dto';

@Controller('admin/plugins')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'CEO')
export class AdminPluginsController {
  constructor(private adminPluginsService: AdminPluginsService) {}

  // POST /admin/plugins - Crear plugin con archivos
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'coverImage', maxCount: 1 },
      { name: 'bannerImage', maxCount: 1 },
      { name: 'pluginFile', maxCount: 1 },
    ]),
  )
  @HttpCode(HttpStatus.CREATED)
  async createPlugin(
    @Body() createPluginDto: CreateAdminPluginDto,
    @UploadedFiles()
    files: {
      coverImage?: Express.Multer.File[];
      bannerImage?: Express.Multer.File[];
      pluginFile?: Express.Multer.File[];
    },
  ) {
    return this.adminPluginsService.createPlugin(createPluginDto, files);
  }

  // GET /admin/plugins - Listar plugins con paginación
  @Get()
  async listPlugins(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.adminPluginsService.listPlugins({ page, limit, search });
  }

  // GET /admin/plugins/:id - Obtener detalle
  @Get(':id')
  async getPluginDetail(@Param('id') id: string) {
    return this.adminPluginsService.getPluginDetail(id);
  }

  // PUT /admin/plugins/:id - Actualizar plugin
  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'coverImage', maxCount: 1 },
      { name: 'bannerImage', maxCount: 1 },
      { name: 'pluginFile', maxCount: 1 },
    ]),
  )
  async updatePlugin(
    @Param('id') id: string,
    @Body() updatePluginDto: UpdateAdminPluginDto,
    @UploadedFiles()
    files?: {
      coverImage?: Express.Multer.File[];
      bannerImage?: Express.Multer.File[];
      pluginFile?: Express.Multer.File[];
    },
  ) {
    return this.adminPluginsService.updatePlugin(id, updatePluginDto, files);
  }

  // DELETE /admin/plugins/:id - Eliminar plugin
  @Delete(':id')
  async deletePlugin(@Param('id') id: string) {
    return this.adminPluginsService.deletePlugin(id);
  }

  // POST /admin/plugins/:id/publish - Cambiar estado
  @Post(':id/publish')
  async publishPlugin(
    @Param('id') id: string,
    @Body() { published }: { published: boolean },
  ) {
    return this.adminPluginsService.publishPlugin(id, published);
  }
}
```

---

## Backend - AdminPluginsService

```typescript
// apps/api/src/admin/services/admin-plugins.service.ts

import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { FileUploadService } from './file-upload.service';
import { CreateAdminPluginDto } from '../dtos/create-admin-plugin.dto';
import { UpdateAdminPluginDto } from '../dtos/update-admin-plugin.dto';
import * as slugLib from 'slug';

@Injectable()
export class AdminPluginsService {
  private readonly logger = new Logger(AdminPluginsService.name);

  constructor(
    private prisma: PrismaService,
    private fileUpload: FileUploadService,
  ) {}

  async createPlugin(
    dto: CreateAdminPluginDto,
    files: {
      coverImage?: Express.Multer.File[];
      bannerImage?: Express.Multer.File[];
      pluginFile?: Express.Multer.File[];
    },
  ) {
    // Validar archivos requeridos
    if (!files?.coverImage?.[0] || !files?.pluginFile?.[0]) {
      throw new BadRequestException('coverImage y pluginFile son requeridos');
    }

    try {
      // Generar slug único
      const slug = await this.generateUniqueSlug(dto.title);

      // Subir archivos
      const coverImagePath = await this.fileUpload.uploadFile(
        files.coverImage[0].buffer,
        'covers',
      );
      const bannerImagePath = files.bannerImage?.[0]
        ? await this.fileUpload.uploadFile(files.bannerImage[0].buffer, 'banners')
        : null;
      const pluginFilePath = await this.fileUpload.uploadFile(
        files.pluginFile[0].buffer,
        'plugins',
      );

      // Crear plugin en BD
      const plugin = await this.prisma.plugin.create({
        data: {
          title: dto.title,
          slug,
          description: dto.description,
          descriptionHtml: dto.descriptionHtml,
          version: dto.version,
          price: Math.round(dto.price * 100), // convertir a centavos
          categories: dto.categories,
          tier: dto.tier || null,
          isVipOnly: dto.isVipOnly,
          published: dto.published,
          coverImage: coverImagePath,
          bannerImage: bannerImagePath,
          fileUrl: pluginFilePath,
          creatorId: 'admin-user', // Ajustar según contexto
        },
      });

      this.logger.log(`Plugin creado: ${plugin.id}`);
      return plugin;
    } catch (error) {
      this.logger.error(`Error creando plugin: ${error.message}`);
      throw error;
    }
  }

  async listPlugins(filters: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 10, search } = filters;
    const skip = (page - 1) * limit;

    const where = search ? { title: { contains: search, mode: 'insensitive' } } : {};

    const [plugins, total] = await Promise.all([
      this.prisma.plugin.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          version: true,
          price: true,
          published: true,
          coverImage: true,
          createdAt: true,
          creator: { select: { name: true } },
        },
      }),
      this.prisma.plugin.count({ where }),
    ]);

    return {
      data: plugins,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getPluginDetail(id: string) {
    const plugin = await this.prisma.plugin.findUnique({
      where: { id },
      include: { creator: { select: { name: true, email: true } } },
    });

    if (!plugin) {
      throw new NotFoundException('Plugin no encontrado');
    }

    return plugin;
  }

  async updatePlugin(
    id: string,
    dto: UpdateAdminPluginDto,
    files?: {
      coverImage?: Express.Multer.File[];
      bannerImage?: Express.Multer.File[];
      pluginFile?: Express.Multer.File[];
    },
  ) {
    const plugin = await this.prisma.plugin.findUnique({ where: { id } });
    if (!plugin) {
      throw new NotFoundException('Plugin no encontrado');
    }

    let coverImage = plugin.coverImage;
    let bannerImage = plugin.bannerImage;
    let fileUrl = plugin.fileUrl;

    // Actualizar archivos si se proporcionan
    if (files?.coverImage?.[0]) {
      if (plugin.coverImage) {
        await this.fileUpload.deleteFile(plugin.coverImage);
      }
      coverImage = await this.fileUpload.uploadFile(files.coverImage[0].buffer, 'covers');
    }

    if (files?.bannerImage?.[0]) {
      if (plugin.bannerImage) {
        await this.fileUpload.deleteFile(plugin.bannerImage);
      }
      bannerImage = await this.fileUpload.uploadFile(files.bannerImage[0].buffer, 'banners');
    }

    if (files?.pluginFile?.[0]) {
      if (plugin.fileUrl) {
        await this.fileUpload.deleteFile(plugin.fileUrl);
      }
      fileUrl = await this.fileUpload.uploadFile(files.pluginFile[0].buffer, 'plugins');
    }

    const updated = await this.prisma.plugin.update({
      where: { id },
      data: {
        title: dto.title || plugin.title,
        description: dto.description || plugin.description,
        descriptionHtml: dto.descriptionHtml || plugin.descriptionHtml,
        version: dto.version || plugin.version,
        price: dto.price ? Math.round(dto.price * 100) : plugin.price,
        categories: dto.categories || plugin.categories,
        tier: dto.tier !== undefined ? dto.tier : plugin.tier,
        isVipOnly: dto.isVipOnly !== undefined ? dto.isVipOnly : plugin.isVipOnly,
        published: dto.published !== undefined ? dto.published : plugin.published,
        coverImage,
        bannerImage,
        fileUrl,
      },
    });

    return updated;
  }

  async deletePlugin(id: string) {
    const plugin = await this.prisma.plugin.findUnique({ where: { id } });
    if (!plugin) {
      throw new NotFoundException('Plugin no encontrado');
    }

    // Eliminar archivos
    if (plugin.coverImage) await this.fileUpload.deleteFile(plugin.coverImage);
    if (plugin.bannerImage) await this.fileUpload.deleteFile(plugin.bannerImage);
    if (plugin.fileUrl) await this.fileUpload.deleteFile(plugin.fileUrl);

    return this.prisma.plugin.delete({ where: { id } });
  }

  async publishPlugin(id: string, published: boolean) {
    const plugin = await this.prisma.plugin.findUnique({ where: { id } });
    if (!plugin) {
      throw new NotFoundException('Plugin no encontrado');
    }

    return this.prisma.plugin.update({
      where: { id },
      data: { published },
    });
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    let slug = slugLib(title);
    let count = 0;
    let finalSlug = slug;

    while (
      await this.prisma.plugin.findUnique({ where: { slug: finalSlug } })
    ) {
      count++;
      finalSlug = `${slug}-${count}`;
    }

    return finalSlug;
  }
}
```

---

## Frontend - PluginForm.tsx

```typescript
// apps/web/src/app/admin/components/PluginForm.tsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { RichTextEditor } from './RichTextEditor';

const pluginSchema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres').max(200),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Formato: X.Y.Z'),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
  descriptionHtml: z.string().min(10),
  price: z.number().min(0, 'El precio debe ser >= 0'),
  categories: z.array(z.string()).min(1, 'Selecciona al menos una categoría'),
  tier: z.enum(['VIP', 'LEGEND']).optional(),
  isVipOnly: z.boolean(),
  published: z.boolean(),
});

type PluginFormData = z.infer<typeof pluginSchema>;

export function PluginForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PluginFormData>({
    resolver: zodResolver(pluginSchema),
    defaultValues: {
      isVipOnly: false,
      published: false,
    },
  });

  const [preview, setPreview] = useState<{ cover?: string; banner?: string }>({});
  const [description, setDescription] = useState('');

  const onSubmitHandler = async (data: PluginFormData) => {
    const formData = new FormData();

    // Añadir campos de texto
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'coverImage' && key !== 'bannerImage' && key !== 'pluginFile') {
        formData.append(key, String(value));
      }
    });

    formData.append('descriptionHtml', `<p>${description}</p>`);

    // Añadir archivos
    const coverInput = document.getElementById('coverImage') as HTMLInputElement;
    const bannerInput = document.getElementById('bannerImage') as HTMLInputElement;
    const pluginInput = document.getElementById('pluginFile') as HTMLInputElement;

    if (coverInput?.files?.[0]) formData.append('coverImage', coverInput.files[0]);
    if (bannerInput?.files?.[0]) formData.append('bannerImage', bannerInput.files[0]);
    if (pluginInput?.files?.[0]) formData.append('pluginFile', pluginInput.files[0]);

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-8">
      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Título</label>
        <input
          {...register('title')}
          type="text"
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Nombre del plugin"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      {/* Versión */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Versión</label>
        <input
          {...register('version')}
          type="text"
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="1.0.0"
        />
        {errors.version && <p className="text-red-500 text-sm">{errors.version.message}</p>}
      </div>

      {/* Descripción (RichText) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <RichTextEditor value={description} onChange={setDescription} />
      </div>

      {/* Precio */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Precio (USD)</label>
        <input
          {...register('price', { valueAsNumber: true })}
          type="number"
          step="0.01"
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
          placeholder="0.00"
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
      </div>

      {/* Archivos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Icono Plugin *</label>
          <input
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => setPreview({ ...preview, cover: ev.target?.result as string });
                reader.readAsDataURL(file);
              }
            }}
            className="mt-1 w-full"
          />
          {preview.cover && (
            <img src={preview.cover} alt="Cover preview" className="mt-2 w-32 h-32 object-cover rounded" />
          )}
        </div>

        {/* Banner Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Banner</label>
          <input
            id="bannerImage"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => setPreview({ ...preview, banner: ev.target?.result as string });
                reader.readAsDataURL(file);
              }
            }}
            className="mt-1 w-full"
          />
          {preview.banner && (
            <img src={preview.banner} alt="Banner preview" className="mt-2 w-full h-32 object-cover rounded" />
          )}
        </div>

        {/* Plugin File */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Archivo Plugin * (.jar, .zip)</label>
          <input
            id="pluginFile"
            type="file"
            accept=".jar,.zip"
            className="mt-1 w-full"
          />
        </div>
      </div>

      {/* Categorías */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Categorías *</label>
        <select
          multiple
          {...register('categories')}
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="Economy">Economy</option>
          <option value="Admin">Admin</option>
          <option value="Gameplay">Gameplay</option>
          <option value="PvP">PvP</option>
        </select>
      </div>

      {/* Checkboxes */}
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input {...register('isVipOnly')} type="checkbox" />
          <span>Solo VIP</span>
        </label>
        <label className="flex items-center gap-2">
          <input {...register('published')} type="checkbox" />
          <span>Publicar ahora</span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
        <button type="reset" className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
          Limpiar
        </button>
      </div>
    </form>
  );
}
```

---

## Frontend - RichTextEditor.tsx

```typescript
// apps/web/src/app/admin/components/RichTextEditor.tsx

'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  return (
    <div className="grid grid-cols-2 gap-4 border border-gray-300 rounded-lg overflow-hidden">
      {/* Editor */}
      <div className="bg-white">
        <div className="bg-gray-100 border-b p-2 flex gap-1">
          <button
            type="button"
            onClick={() => onChange(`${value}**bold**`)}
            className="px-2 py-1 bg-white border rounded hover:bg-gray-100"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => onChange(`${value}*italic*`)}
            className="px-2 py-1 bg-white border rounded hover:bg-gray-100"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => onChange(`${value}\n\`code\``)}
            className="px-2 py-1 bg-white border rounded hover:bg-gray-100"
            title="Code"
          >
            {'<>'}
          </button>
          <button
            type="button"
            onClick={() => onChange(`${value}\n[Link](url)`)}
            className="px-2 py-1 bg-white border rounded hover:bg-gray-100"
            title="Link"
          >
            🔗
          </button>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-64 p-3 focus:outline-none resize-none"
          placeholder="Escribe tu descripción aquí con Markdown..."
        />
      </div>

      {/* Preview */}
      <div className="bg-gray-50 p-3 overflow-auto h-80 prose prose-sm max-w-none">
        <ReactMarkdown>{value}</ReactMarkdown>
      </div>
    </div>
  );
}
```

---

## Frontend - AdminLayout.tsx

```typescript
// apps/web/src/app/admin/layout.tsx

'use client';

import { ReactNode } from 'react';
import { AdminSidebar } from './components/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Logout
          </button>
        </header>

        {/* Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
```

---

## Middleware Protección

```typescript
// apps/web/src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Proteger rutas /admin/*
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const user = request.headers.get('x-user-role');

    if (!user || !['ADMIN', 'CEO'].includes(user)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

---

**¡Todos los snippets están listos para usar!**
