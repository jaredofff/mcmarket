export class ImportPluginDto {
  pluginName: string;
  pluginUrl: string;
  imageUrl?: string; // URL de la imagen a descargar y almacenar
  config?: Record<string, any>;
}
