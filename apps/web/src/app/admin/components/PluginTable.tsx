'use client';

import Link from 'next/link';
import { Trash2, Edit, Eye, CheckCircle, Circle } from 'lucide-react';
import { useState } from 'react';

interface Plugin {
  id: string;
  title: string;
  author: string;
  price: number;
  status: 'published' | 'draft';
  createdAt: string;
}

interface PluginTableProps {
  plugins: Plugin[];
  isLoading?: boolean;
  onDelete?: (id: string) => Promise<void>;
  onPublish?: (id: string) => Promise<void>;
}

export default function PluginTable({
  plugins,
  isLoading = false,
  onDelete,
  onPublish,
}: PluginTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [publishing, setPublishing] = useState<Set<string>>(new Set());

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plugin?')) return;
    if (!onDelete) return;

    setDeleting(new Set(deleting).add(id));
    try {
      await onDelete(id);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleting((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handlePublish = async (id: string) => {
    if (!onPublish) return;

    setPublishing(new Set(publishing).add(id));
    try {
      await onPublish(id);
    } catch (error) {
      console.error('Publish failed:', error);
    } finally {
      setPublishing((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-amber-500/5 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (plugins.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#a89968] mb-4">No plugins found</p>
        <Link
          href="/admin/plugins/new"
          className="inline-block px-6 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 rounded-lg transition-colors font-medium"
        >
          Create First Plugin
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-amber-500/20">
            <th className="text-left px-4 py-3 text-[#a89968] font-semibold">Title</th>
            <th className="text-left px-4 py-3 text-[#a89968] font-semibold">Author</th>
            <th className="text-right px-4 py-3 text-[#a89968] font-semibold">Price</th>
            <th className="text-left px-4 py-3 text-[#a89968] font-semibold">Status</th>
            <th className="text-left px-4 py-3 text-[#a89968] font-semibold">Created</th>
            <th className="text-right px-4 py-3 text-[#a89968] font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {plugins.map((plugin) => (
            <tr
              key={plugin.id}
              className="border-b border-amber-500/10 hover:bg-amber-500/5 transition-colors"
            >
              <td className="px-4 py-3 text-[#e8e4db]">{plugin.title}</td>
              <td className="px-4 py-3 text-[#a89968]">{plugin.author}</td>
              <td className="px-4 py-3 text-right text-amber-500 font-medium">
                ${plugin.price.toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {plugin.status === 'published' ? (
                    <>
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-green-500 text-sm font-medium">Published</span>
                    </>
                  ) : (
                    <>
                      <Circle size={16} className="text-yellow-500" />
                      <span className="text-yellow-500 text-sm font-medium">Draft</span>
                    </>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-[#a89968] text-sm">
                {new Date(plugin.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-end">
                  <Link
                    href={`/admin/plugins/${plugin.id}/edit`}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </Link>

                  {plugin.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(plugin.id)}
                      disabled={publishing.has(plugin.id)}
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded transition-colors disabled:opacity-50"
                      title="Publish"
                    >
                      {publishing.has(plugin.id) ? '...' : <CheckCircle size={16} />}
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(plugin.id)}
                    disabled={deleting.has(plugin.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    {deleting.has(plugin.id) ? '...' : <Trash2 size={16} />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
