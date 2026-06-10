'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PluginForm from '../../components/PluginForm';

export const runtime = 'edge';

export default function CreatePluginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  interface PluginFormData {
    title: string
    version: string
    description: string
    category: string
    tier: 'free' | 'vip' | 'legend'
    testedVersions: string
    published: boolean | string
  }

  const handleSubmit = async (data: PluginFormData, files: { coverImage?: File; bannerImage?: File; pluginFile?: File }) => {
    try {
      setIsLoading(true);
      setError('');

      const formData = new FormData();

      // Add regular fields
      formData.append('title', data.title);
      formData.append('version', data.version);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('tier', data.tier);
      formData.append('testedVersions', data.testedVersions);
      formData.append('published', String(data.published));

      // Add files
      if (files.coverImage) formData.append('coverImage', files.coverImage);
      if (files.bannerImage) formData.append('bannerImage', files.bannerImage);
      if (files.pluginFile) formData.append('pluginFile', files.pluginFile);

      const response = await fetch('/api/admin/plugins', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'No se pudo crear el recurso');
      }

      router.push('/admin/plugins');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-sm border border-[#2d2a26] bg-[#181512] p-6">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-500">Nuevo recurso</p>
        <h1 className="text-3xl font-bold text-[#e8e4db]">Cargar contenido al marketplace</h1>
        <p className="mt-2 max-w-2xl text-[#a89968]">
          Sube plugins, setups, configs, builds, webs o assets. Al publicarlo aparecerá en el catálogo público.
        </p>
      </div>

      {error && (
        <div className="rounded-sm border border-red-500/50 bg-red-500/20 p-4 text-red-400">
          {error}
        </div>
      )}

      <div>
        <PluginForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitLabel="Guardar recurso"
        />
      </div>
    </div>
  );
}
