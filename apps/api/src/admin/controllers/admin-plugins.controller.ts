import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  Body,
  Param,
  Query,
  UploadedFiles,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../../auth/roles.guard';
import { AdminPluginsService } from '../services/admin-plugins.service';
import { CreateAdminPluginDto } from '../dtos/create-admin-plugin.dto';
import { UpdateAdminPluginDto } from '../dtos/update-admin-plugin.dto';

interface UploadedFiles {
  coverImage?: Array<{ buffer: Buffer; mimetype: string }>;
  bannerImage?: Array<{ buffer: Buffer; mimetype: string }>;
  pluginFile?: Array<{ buffer: Buffer; mimetype: string }>;
}

interface AuthenticatedRequest {
  user?: { id: string; [key: string]: unknown };
  [key: string]: unknown;
}

@Controller('admin/plugins')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminPluginsController {
  constructor(private adminPluginsService: AdminPluginsService) {}

  /**
   * Crear un nuevo plugin
   * POST /admin/plugins
   */
  @Post()
  @Roles('ADMIN', 'CEO')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'coverImage', maxCount: 1 },
      { name: 'bannerImage', maxCount: 1 },
      { name: 'pluginFile', maxCount: 1 },
    ]),
  )
  async createPlugin(
    @Body() dto: CreateAdminPluginDto,
    @UploadedFiles()
    files: UploadedFiles,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('Usuario no autenticado');
    }

    return this.adminPluginsService.createPlugin(dto, userId, files);
  }

  /**
   * Listar plugins
   * GET /admin/plugins?limit=20&offset=0&search=texto&published=true
   */
  @Get()
  @Roles('ADMIN', 'CEO')
  async listPlugins(
    @Query('limit') limit: string = '20',
    @Query('offset') offset: string = '0',
    @Query('search') search?: string,
    @Query('published') published?: string,
  ) {
    const limitNum = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const offsetNum = Math.max(parseInt(offset) || 0, 0);
    const publishedBool =
      published === 'true' ? true : published === 'false' ? false : undefined;

    return this.adminPluginsService.listPlugins(
      limitNum,
      offsetNum,
      search,
      publishedBool,
    );
  }

  /**
   * Obtener detalle de un plugin
   * GET /admin/plugins/:id
   */
  @Get(':id')
  @Roles('ADMIN', 'CEO')
  async getPluginDetail(@Param('id') id: string) {
    return this.adminPluginsService.getPluginDetail(id);
  }

  /**
   * Actualizar un plugin
   * PUT /admin/plugins/:id
   */
  @Put(':id')
  @Roles('ADMIN', 'CEO')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'coverImage', maxCount: 1 },
      { name: 'bannerImage', maxCount: 1 },
      { name: 'pluginFile', maxCount: 1 },
    ]),
  )
  async updatePlugin(
    @Param('id') id: string,
    @Body() dto: UpdateAdminPluginDto,
    @UploadedFiles()
    files?: UploadedFiles,
  ) {
    return this.adminPluginsService.updatePlugin(id, dto, files);
  }

  /**
   * Publicar un plugin
   * POST /admin/plugins/:id/publish
   */
  @Post(':id/publish')
  @Roles('ADMIN', 'CEO')
  async publishPlugin(@Param('id') id: string) {
    return this.adminPluginsService.publishPlugin(id);
  }

  /**
   * Eliminar un plugin
   * DELETE /admin/plugins/:id
   */
  @Delete(':id')
  @Roles('ADMIN', 'CEO')
  async deletePlugin(@Param('id') id: string) {
    return this.adminPluginsService.deletePlugin(id);
  }
}
