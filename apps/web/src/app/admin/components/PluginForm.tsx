'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Upload, AlertCircle } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

const pluginSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  version: z.string().min(1, 'Version is required'),
  price: z.number().min(0, 'Price must be positive'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  tier: z.enum(['free', 'premium', 'elite']),
  testedVersions: z.string().min(1, 'Tested versions required'),
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
  submitLabel = 'Create Plugin',
}: PluginFormProps) {
  const [description, setDescription] = useState(initialData?.description || '');
  const [error, setError] = useState('');
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PluginFormData>({
    resolver: zodResolver(pluginSchema),
    defaultValues: {
      title: initialData?.title || '',
      version: initialData?.version || '1.0.0',
      price: initialData?.price ?? 0,
      category: initialData?.category || '',
      tier: initialData?.tier || 'free',
      testedVersions: initialData?.testedVersions || '',
      isVipOnly: initialData?.isVipOnly ?? false,
      published: initialData?.published ?? false,
      description: initialData?.description || '',
      coverImage: undefined,
      bannerImage: undefined,
      pluginFile: undefined,
    },
  });

  const handleImagePreview = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 max-w-4xl">
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex gap-3">
          <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Basic Information */}
      <fieldset className="space-y-4 p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
        <legend className="text-amber-500 font-semibold px-2">Basic Information</legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#a89968] font-medium mb-2">Plugin Title *</label>
            <input
              {...register('title')}
              type="text"
              placeholder="My Awesome Plugin"
              className="w-full px-4 py-2 bg-[#1a1714] border border-amber-500/20 rounded-lg text-[#e8e4db] placeholder-[#a89968] focus:outline-none focus:border-amber-500/50"
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-[#a89968] font-medium mb-2">Version *</label>
            <input
              {...register('version')}
              type="text"
              placeholder="1.0.0"
              className="w-full px-4 py-2 bg-[#1a1714] border border-amber-500/20 rounded-lg text-[#e8e4db] placeholder-[#a89968] focus:outline-none focus:border-amber-500/50"
            />
            {errors.version && (
              <p className="text-red-400 text-sm mt-1">{errors.version.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[#a89968] font-medium mb-2">Price ($) *</label>
            <input
              {...register('price', { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="9.99"
              className="w-full px-4 py-2 bg-[#1a1714] border border-amber-500/20 rounded-lg text-[#e8e4db] placeholder-[#a89968] focus:outline-none focus:border-amber-500/50"
            />
            {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-[#a89968] font-medium mb-2">Category *</label>
            <select
              {...register('category')}
              className="w-full px-4 py-2 bg-[#1a1714] border border-amber-500/20 rounded-lg text-[#e8e4db] focus:outline-none focus:border-amber-500/50"
            >
              <option value="">Select a category</option>
              <option value="utilities">Utilities</option>
              <option value="economy">Economy</option>
              <option value="gameplay">Gameplay</option>
              <option value="protection">Protection</option>
              <option value="management">Management</option>
              <option value="other">Other</option>
            </select>
            {errors.category && (
              <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[#a89968] font-medium mb-2">Tier *</label>
            <select
              {...register('tier')}
              className="w-full px-4 py-2 bg-[#1a1714] border border-amber-500/20 rounded-lg text-[#e8e4db] focus:outline-none focus:border-amber-500/50"
            >
              <option value="free">Free</option>
              <option value="premium">Premium</option>
              <option value="elite">Elite</option>
            </select>
            {errors.tier && <p className="text-red-400 text-sm mt-1">{errors.tier.message}</p>}
          </div>

          <div>
            <label className="block text-[#a89968] font-medium mb-2">Tested Versions *</label>
            <input
              {...register('testedVersions')}
              type="text"
              placeholder="1.19, 1.20, 1.20.1"
              className="w-full px-4 py-2 bg-[#1a1714] border border-amber-500/20 rounded-lg text-[#e8e4db] placeholder-[#a89968] focus:outline-none focus:border-amber-500/50"
            />
            {errors.testedVersions && (
              <p className="text-red-400 text-sm mt-1">{errors.testedVersions.message}</p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Description */}
      <fieldset className="space-y-2 p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
        <legend className="text-amber-500 font-semibold px-2">Description (Markdown) *</legend>
        <RichTextEditor value={description} onChange={setDescription} />
      </fieldset>

      {/* Images */}
      <fieldset className="space-y-4 p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
        <legend className="text-amber-500 font-semibold px-2">Media</legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cover Image */}
          <div>
            <label className="block text-[#a89968] font-medium mb-2">Cover Image</label>
            <div className="relative">
              <input
                {...register('coverImage')}
                type="file"
                accept="image/*"
                onChange={(e) => handleImagePreview(e, setCoverImagePreview)}
                className="hidden"
                id="cover-image"
              />
              <label
                htmlFor="cover-image"
                className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-amber-500/30 rounded-lg cursor-pointer hover:border-amber-500/60 transition-colors"
              >
                {coverImagePreview ? (
                  <img src={coverImagePreview} alt="Preview" className="max-h-32 rounded" />
                ) : (
                  <>
                    <Upload size={24} className="text-amber-500 mb-2" />
                    <span className="text-[#a89968] text-sm">Click to upload or drag</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Banner Image */}
          <div>
            <label className="block text-[#a89968] font-medium mb-2">Banner Image</label>
            <div className="relative">
              <input
                {...register('bannerImage')}
                type="file"
                accept="image/*"
                onChange={(e) => handleImagePreview(e, setBannerImagePreview)}
                className="hidden"
                id="banner-image"
              />
              <label
                htmlFor="banner-image"
                className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-amber-500/30 rounded-lg cursor-pointer hover:border-amber-500/60 transition-colors"
              >
                {bannerImagePreview ? (
                  <img src={bannerImagePreview} alt="Preview" className="max-h-32 rounded" />
                ) : (
                  <>
                    <Upload size={24} className="text-amber-500 mb-2" />
                    <span className="text-[#a89968] text-sm">Click to upload or drag</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Plugin File */}
        <div>
          <label className="block text-[#a89968] font-medium mb-2">Plugin File (.jar)</label>
          <input
            {...register('pluginFile')}
            type="file"
            accept=".jar"
            className="w-full px-4 py-2 bg-[#1a1714] border border-amber-500/20 rounded-lg text-[#e8e4db] file:bg-amber-500/20 file:border-0 file:text-amber-500 file:px-3 file:py-1 file:rounded cursor-pointer"
          />
        </div>
      </fieldset>

      {/* Options */}
      <fieldset className="space-y-3 p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
        <legend className="text-amber-500 font-semibold px-2">Options</legend>

        <div className="flex items-center gap-3">
          <input
            {...register('isVipOnly')}
            type="checkbox"
            id="vip-only"
            className="w-4 h-4 bg-amber-500/20 border border-amber-500/30 rounded cursor-pointer accent-amber-500"
          />
          <label htmlFor="vip-only" className="text-[#a89968] cursor-pointer">
            VIP Only
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            {...register('published')}
            type="checkbox"
            id="published"
            className="w-4 h-4 bg-amber-500/20 border border-amber-500/30 rounded cursor-pointer accent-amber-500"
          />
          <label htmlFor="published" className="text-[#a89968] cursor-pointer">
            Publish Immediately
          </label>
        </div>
      </fieldset>

      {/* Submit Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-50 text-amber-500 rounded-lg font-medium transition-colors"
        >
          {isLoading ? 'Saving...' : submitLabel}
        </button>
        <Link
          href="/admin/plugins"
          className="px-6 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg font-medium transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
