'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PluginForm from '../../components/PluginForm';

export default function CreatePluginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      setIsLoading(true);
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

      const response = await fetch('/api/admin/plugins', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create plugin');
      }

      const result = await response.json();
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-amber-500">Create New Plugin</h1>
        <p className="text-[#a89968] mt-1">Add a new plugin to the marketplace</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="p-6 bg-[#1a1714] border border-amber-500/20 rounded-lg">
        <PluginForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitLabel="Create Plugin"
        />
      </div>
    </div>
  );
}
