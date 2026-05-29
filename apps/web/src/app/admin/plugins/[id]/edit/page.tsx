'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import PluginForm from '../../../components/PluginForm';

interface PluginData {
  id: string;
  title: string;
  version: string;
  price: number;
  description: string;
  category: string;
  tier: 'free' | 'premium' | 'elite';
  testedVersions: string;
  isVipOnly: boolean;
  published: boolean;
}

export default function EditPluginPage() {
  const params = useParams();
  const router = useRouter();
  const pluginId = params.id as string;

  const [plugin, setPlugin] = useState<PluginData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPlugin = async () => {
      try {
        const response = await fetch(`/api/admin/plugins/${pluginId}`);
        if (!response.ok) throw new Error('Failed to fetch plugin');

        const data = await response.json();
        setPlugin(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load plugin');
      } finally {
        setLoading(false);
      }
    };

    if (pluginId) fetchPlugin();
  }, [pluginId]);

  interface PluginFormData {
    title: string
    version: string
    price: string | number
    description: string
    category: string
    tier: string
    testedVersions: string
    isVipOnly: boolean | string
    published: boolean | string
  }

  const handleSubmit = async (data: PluginFormData, files: { coverImage?: File; bannerImage?: File; pluginFile?: File }) => {
    try {
      setIsSubmitting(true);
      setError('');

      const formData = new FormData();

      // Add regular fields
      formData.append('title', data.title);
      formData.append('version', data.version);
      formData.append('price', data.price);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('tier', data.tier);
      formData.append('testedVersions', data.testedVersions);
      formData.append('isVipOnly', data.isVipOnly);
      formData.append('published', data.published);

      // Add files
      if (files.coverImage) formData.append('coverImage', files.coverImage);
      if (files.bannerImage) formData.append('bannerImage', files.bannerImage);
      if (files.pluginFile) formData.append('pluginFile', files.pluginFile);

      const response = await fetch(`/api/admin/plugins/${pluginId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update plugin');
      }

      router.push('/admin/plugins');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-amber-500/5 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error && !plugin) {
    return (
      <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-amber-500">Edit Plugin</h1>
        <p className="text-[#a89968] mt-1">Update plugin information</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      {plugin && (
        <div className="p-6 bg-[#1a1714] border border-amber-500/20 rounded-lg">
          <PluginForm
            initialData={plugin}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            submitLabel="Update Plugin"
          />
        </div>
      )}
    </div>
  );
}
