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
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { PluginsService } from './plugins.service';
import { ImportPluginDto } from './import-plugin.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import {
  CreatePluginFromUrlDto,
  UpdatePluginDto,
  PluginFilterDto,
  BulkImportDto,
} from './dtos/import.dto';

type RequestWithUser = { user: { id: string } };

@Controller('plugins')
export class PluginsController {
  constructor(private pluginsService: PluginsService) {}

  /**
   * GET /plugins/marketplace/stats
   * Obtiene estadísticas generales del marketplace (público)
   */
  @Get('marketplace/stats')
  @HttpCode(HttpStatus.OK)
  async getMarketplaceStats() {
    return this.pluginsService.getMarketplaceStats();
  }

  /**
   * GET /plugins/import-status/:jobId
   * Obtiene el estado de un job de importación
   */
  @Get('import-status/:jobId')
  @HttpCode(HttpStatus.OK)
  async getImportStatus(@Param('jobId') jobId: string) {
    return this.pluginsService.getImportJobStatus(jobId);
  }

  /**
   * GET /plugins/search
   * Lista plugins con filtros de búsqueda (público)
   */
  @Get('search')
  @HttpCode(HttpStatus.OK)
  async listPlugins(@Query() filters: PluginFilterDto) {
    return this.pluginsService.listPlugins(filters);
  }

  /**
   * GET /plugins/:slug
   * Obtiene detalle de un plugin por slug (público)
   */
  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async getPlugin(@Param('slug') slug: string) {
    return this.pluginsService.getPluginDetail(slug);
  }

  /**
   * POST /plugins/import-url
   * Importa un plugin desde una URL de BuiltByBit (requiere CEO)
   */
  @Post('import-url')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CEO', 'DEVELOPER', 'ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async importFromUrl(
    @Body() createPluginDto: CreatePluginFromUrlDto,
    @Request() req: RequestWithUser,
  ) {
    return this.pluginsService.importFromUrl(createPluginDto, req.user.id);
  }

  /**
   * POST /plugins/bulk-import
   * Importa múltiples plugins en batch (requiere CEO)
   */
  @Post('bulk-import')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CEO', 'ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async bulkImport(
    @Body() bulkImportDto: BulkImportDto,
    @Request() req: RequestWithUser,
  ) {
    const results = [];

    for (const plugin of bulkImportDto.plugins) {
      const result = await this.pluginsService.importFromUrl(
        plugin,
        req.user.id,
      );
      results.push(result);
    }

    return {
      totalImports: results.length,
      jobs: results.map((r) => r.jobId),
      campaignName: bulkImportDto.campaignName,
    };
  }

  /**
   * PUT /plugins/:id
   * Actualiza información de un plugin (requiere CEO/ADMIN)
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CEO', 'ADMIN', 'DEVELOPER')
  @HttpCode(HttpStatus.OK)
  async updatePlugin(
    @Param('id') id: string,
    @Body() updatePluginDto: UpdatePluginDto,
  ) {
    return this.pluginsService.updatePlugin(id, updatePluginDto);
  }

  /**
   * POST /plugins/:id/resync
   * Re-sincroniza un plugin desde su URL original (requiere CEO/ADMIN)
   */
  @Post(':id/resync')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CEO', 'ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async resyncPlugin(@Param('id') id: string, @Request() req: RequestWithUser) {
    const jobId = await this.pluginsService.resyncPlugin(id, req.user.id);
    return {
      jobId,
      message: 'Re-sync iniciado',
    };
  }

  /**
   * DELETE /plugins/:id
   * Elimina un plugin (requiere CEO/ADMIN)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CEO', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  async deletePlugin(@Param('id') id: string) {
    // TODO: Implementar delete en service
    return {
      success: true,
      message: `Plugin ${id} eliminado`,
    };
  }

  /**
   * Endpoints legacy (mantener compatibilidad)
   */

  @Get()
  getPlugins() {
    // Redirect a la búsqueda pública
    return this.pluginsService.listPlugins({ limit: 50 });
  }

  @Post('import')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CEO')
  @HttpCode(HttpStatus.CREATED)
  async importPlugin(@Body() importData: ImportPluginDto) {
    // Legacy endpoint para compatibilidad
    const createDto: CreatePluginFromUrlDto = {
      url: importData.pluginUrl,
      customTitle: importData.pluginName,
    };

    return this.pluginsService.importFromUrl(createDto, 'legacy-user');
  }
}
