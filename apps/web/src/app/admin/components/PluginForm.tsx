'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Upload, AlertCircle, Box, FileArchive, ImageIcon, Settings } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

const pluginSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  version: z.string().min(1, 'La versión es obligatoria'),
  price: z.number().min(0, 'El precio no puede ser negativo'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  category: z.string().min(1, 'La categoría es obligatoria'),
  tier: z.enum(['free', 'premium', 'elite']),
  testedVersions: z.string().min(1, 'Indica compatibilidad o escribe N/A'),
  coverImage: z.instanceof(FileList).optional(),
  bannerImage: z.instanceof(FileList).optional(),
  pluginFile: z.instanceof(FileList).optional(),
  isVipOnly: z.boolean(),
  published: z.boolean(),
});

type PluginFormData = z.infer<typeof pluginSchema>;

interface PluginFormProps {
  initialData?: Partial<PluginFormData> & { id?: string };
  onSubmit: (data: PluginFormData, files: Record<string, File>) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export default function PluginForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Guardar recurso',
}: PluginFormProps) {
  const [description, setDescription] = useState(initialData?.description || '');
  const [error, setError] = useState('');
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PluginFormData>({
    resolver: zodResolver(pluginSchema),
    defaultValues: {
      title: initialData?.title || '',
      version: initialData?.version || '1.0.0',
      price: initialData?.price ?? 0,
      category: initialData?.category || '',
      tier: (initialData?.tier as 'free' | 'premium' | 'elite') || 'free',
      testedVersions: initialData?.testedVersions || '',
      isVipOnly: initialData?.isVipOnly ?? false,
      published: initialData?.published ?? false,
      description: initialData?.description || '',
      coverImage: undefined,
      bannerImage: undefined,
      pluginFile: undefined,
    },
  });

  const isVipOnly = watch('isVipOnly');
  const published = watch('published');
  const coverImageField = register('coverImage');
  const bannerImageField = register('bannerImage');

  const handleImagePreview = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string | null) => void,
    formOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  ) => {
    formOnChange(e);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    setValue('description', value, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmitForm = async (data: PluginFormData) => {
    try {
      setError('');
      const files: Record<string, File> = {};

      // Collect uploaded files
      if (data.coverImage?.[0]) files.coverImage = data.coverImage[0];
      if (data.bannerImage?.[0]) files.bannerImage = data.bannerImage[0];
      if (data.pluginFile?.[0]) files.pluginFile = data.pluginFile[0];

      await onSubmit({ ...data, description }, files);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="max-w-5xl space-y-6">
      {error && (
        <div className="flex gap-3 rounded-sm border border-red-500/50 bg-red-500/20 p-4">
          <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <fieldset className="space-y-5 rounded-sm border border-[#2d2a26] bg-[#181512] p-5">
        <legend className="flex items-center gap-2 px-2 font-bold text-amber-400">
          <Box size={18} />
          Información principal
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#a89968] font-medium mb-2">Título del recurso *</label>
            <input
              {...register('title')}
              type="text"
              placeholder="Survival Setup Pro, Lobby Medieval, Economy Config..."
              className="w-full rounded-sm border border-[#3d3830] bg-[#11100e] px-4 py-2 text-[#e8e4db] placeholder-[#6b6459] focus:border-amber-500/50 focus:outline-none"
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-[#a89968] font-medium mb-2">Versión *</label>
            <input
              {...register('version')}
              type="text"
              placeholder="1.0.0"
              className="w-full rounded-sm border border-[#3d3830] bg-[#11100e] px-4 py-2 text-[#e8e4db] placeholder-[#6b6459] focus:border-amber-500/50 focus:outline-none"
            />
            {errors.version && (
              <p className="text-red-400 text-sm mt-1">{errors.version.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[#a89968] font-medium mb-2">Precio USD *</label>
            <input
              {...register('price', { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="9.99"
              className="w-full rounded-sm border border-[#3d3830] bg-[#11100e] px-4 py-2 text-[#e8e4db] placeholder-[#6b6459] focus:border-amber-500/50 focus:outline-none"
            />
            {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-[#a89968] font-medium mb-2">Tipo de recurso *</label>
            <select
              {...register('category')}
              className="w-full rounded-sm border border-[#3d3830] bg-[#11100e] px-4 py-2 text-[#e8e4db] focus:border-amber-500/50 focus:outline-none"
            >
              <option value="">Selecciona un tipo</option>
              <option value="Plugins">Plugins</option>
              <option value="Setups">Setups</option>
              <option value="Configs">Configs</option>
              <option value="Builds">Builds</option>
              <option value="Webs">Webs</option>
              <option value="Models">Modelos 3D</option>
              <option value="Textures">Texturas</option>
              <option value="Utilities">Utilidades</option>
            </select>
            {errors.category && (
              <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[#a89968] font-medium mb-2">Nivel *</label>
            <select
              {...register('tier')}
              className="w-full rounded-sm border border-[#3d3830] bg-[#11100e] px-4 py-2 text-[#e8e4db] focus:border-amber-500/50 focus:outline-none"
            >
              <option value="free">Gratis</option>
              <option value="premium">Premium</option>
              <option value="elite">Elite</option>
            </select>
            {errors.tier && <p className="text-red-400 text-sm mt-1">{errors.tier.message}</p>}
          </div>

          <div>
            <label className="block text-[#a89968] font-medium mb-2">Compatibilidad *</label>
            <input
              {...register('testedVersions')}
              type="text"
              placeholder="1.19, 1.20, Paper, N/A..."
              className="w-full rounded-sm border border-[#3d3830] bg-[#11100e] px-4 py-2 text-[#e8e4db] placeholder-[#6b6459] focus:border-amber-500/50 focus:outline-none"
            />
            {errors.testedVersions && (
              <p className="text-red-400 text-sm mt-1">{errors.testedVersions.message}</p>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-2 rounded-sm border border-[#2d2a26] bg-[#181512] p-5">
        <legend className="flex items-center gap-2 px-2 font-bold text-amber-400">
          <Settings size={18} />
          Descripción del recurso *
        </legend>
        <input type="hidden" {...register('description')} />
        <RichTextEditor value={description} onChange={handleDescriptionChange} placeholder="Describe qué incluye, cómo se instala, requisitos y soporte..." />
        {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
      </fieldset>

      <fieldset className="space-y-4 rounded-sm border border-[#2d2a26] bg-[#181512] p-5">
        <legend className="flex items-center gap-2 px-2 font-bold text-amber-400">
          <ImageIcon size={18} />
          Media y archivo
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#a89968] font-medium mb-2">Imagen de portada</label>
            <div className="relative">
              <input
                {...coverImageField}
                type="file"
                accept="image/*"
                onChange={(e) => handleImagePreview(e, setCoverImagePreview, coverImageField.onChange)}
                className="hidden"
                id="cover-image"
              />
              <label
                htmlFor="cover-image"
                className="flex min-h-40 w-full cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed border-[#3d3830] bg-[#11100e] p-6 transition-colors hover:border-amber-500/60"
              >
                {coverImagePreview ? (
                  <img src={coverImagePreview} alt="Preview" className="max-h-32 rounded" />
                ) : (
                  <>
                    <Upload size={24} className="text-amber-500 mb-2" />
                    <span className="text-[#a89968] text-sm">Click para subir portada</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[#a89968] font-medium mb-2">Banner opcional</label>
            <div className="relative">
              <input
                {...bannerImageField}
                type="file"
                accept="image/*"
                onChange={(e) => handleImagePreview(e, setBannerImagePreview, bannerImageField.onChange)}
                className="hidden"
                id="banner-image"
              />
              <label
                htmlFor="banner-image"
                className="flex min-h-40 w-full cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed border-[#3d3830] bg-[#11100e] p-6 transition-colors hover:border-amber-500/60"
              >
                {bannerImagePreview ? (
                  <img src={bannerImagePreview} alt="Preview" className="max-h-32 rounded" />
                ) : (
                  <>
                    <Upload size={24} className="text-amber-500 mb-2" />
                    <span className="text-[#a89968] text-sm">Click para subir banner</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-[#a89968] font-medium mb-2">
            <FileArchive size={18} />
            Archivo del recurso
          </label>
          <input
            {...register('pluginFile')}
            type="file"
            accept=".jar,.zip,.rar,.7z,.schem,.schematic,.yml,.yaml,.json,.txt,.html,.css,.js,.ts,.tsx,.jsx,.png,.jpg,.jpeg,.webp"
            className="w-full cursor-pointer rounded-sm border border-[#3d3830] bg-[#11100e] px-4 py-2 text-[#e8e4db] file:mr-4 file:rounded-sm file:border-0 file:bg-amber-500/20 file:px-3 file:py-1 file:font-bold file:text-amber-400"
          />
          <p className="mt-2 text-xs text-[#6b6459]">
            Acepta JAR, ZIP, configuraciones, esquemáticos, builds comprimidos, webs y assets.
          </p>
        </div>
      </fieldset>

      <fieldset className="space-y-3 rounded-sm border border-[#2d2a26] bg-[#181512] p-5">
        <legend className="px-2 font-bold text-amber-400">Opciones</legend>

        <div className="flex items-center gap-3">
          <input
            {...register('isVipOnly')}
            type="checkbox"
            id="vip-only"
            checked={isVipOnly}
            className="w-4 h-4 bg-amber-500/20 border border-amber-500/30 rounded cursor-pointer accent-amber-500"
          />
          <label htmlFor="vip-only" className="text-[#a89968] cursor-pointer">
            Solo VIP
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            {...register('published')}
            type="checkbox"
            id="published"
            checked={published}
            className="w-4 h-4 bg-amber-500/20 border border-amber-500/30 rounded cursor-pointer accent-amber-500"
          />
          <label htmlFor="published" className="text-[#a89968] cursor-pointer">
            Publicar inmediatamente
          </label>
        </div>
      </fieldset>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isLoading}
          className="h-11 rounded-sm bg-linear-to-b from-amber-400 to-yellow-600 px-6 font-black text-[#141311] shadow-[0_3px_0_#92400e] transition-all hover:brightness-110 disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : submitLabel}
        </button>
        <Link
          href="/admin/plugins"
          className="flex h-11 items-center justify-center rounded-sm border border-[#3d3830] bg-[#11100e] px-6 font-bold text-[#a89968] transition-colors hover:text-amber-400"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
