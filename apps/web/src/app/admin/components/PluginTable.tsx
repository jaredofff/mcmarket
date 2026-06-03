'use client';

import Link from 'next/link';
import { Trash2, Edit, CheckCircle, Circle, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface Plugin {
  id: string;
  title: string;
  author: string;
  tier: string;
  slug?: string;
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
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [publishing, setPublishing] = useState<Set<string>>(new Set());

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este recurso? Esta acción no se puede deshacer.')) return;
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
          <div key={i} className="h-16 animate-pulse rounded-sm bg-amber-500/5" />
        ))}
      </div>
    );
  }

  if (plugins.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="mb-2 font-outfit text-xl font-bold text-[#e8e4db]">No hay recursos todavía</p>
        <p className="mb-5 text-[#a89968]">Carga el primer recurso para empezar a poblar el marketplace.</p>
        <Link
          href="/admin/plugins/new"
          className="inline-block rounded-sm border border-amber-500/30 bg-amber-500/10 px-6 py-2 font-bold text-amber-400 transition-colors hover:bg-amber-500/20"
        >
          Crear primer recurso
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2d2a26]">
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-[#6b6459]">Recurso</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-[#6b6459]">Autor</th>
            <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-widest text-[#6b6459]">Rango</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-[#6b6459]">Estado</th>
            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-[#6b6459]">Creado</th>
            <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-widest text-[#6b6459]">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {plugins.map((plugin) => (
            <tr
              key={plugin.id}
              className="border-b border-[#2d2a26] transition-colors hover:bg-amber-500/5"
            >
              <td className="px-4 py-3">
                <div className="font-bold text-[#e8e4db]">{plugin.title}</div>
                {plugin.slug && <div className="mt-1 text-xs text-[#6b6459]">/{plugin.slug}</div>}
              </td>
              <td className="px-4 py-3 text-[#a89968]">{plugin.author}</td>
              <td className="px-4 py-3 text-right font-bold text-amber-400 uppercase">
                {plugin.tier === 'legend' ? 'Legend' : 'VIP'}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {plugin.status === 'published' ? (
                    <>
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-sm font-bold text-green-500">Publicado</span>
                    </>
                  ) : (
                    <>
                      <Circle size={16} className="text-yellow-500" />
                      <span className="text-sm font-bold text-yellow-500">Borrador</span>
                    </>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-[#a89968] text-sm">
                {new Date(plugin.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-end">
                  {plugin.status === 'published' && plugin.slug && (
                    <Link
                      href={`/plugins/${plugin.slug}`}
                      className="rounded-sm border border-[#2d2a26] bg-[#141311] p-2 text-[#a89968] transition-colors hover:border-amber-500/40 hover:text-amber-400"
                      title="Ver público"
                    >
                      <ExternalLink size={16} />
                    </Link>
                  )}
                  <Link
                    href={`/admin/plugins/${plugin.id}/edit`}
                    className="rounded-sm border border-blue-500/20 bg-blue-500/10 p-2 text-blue-400 transition-colors hover:bg-blue-500/20"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </Link>

                  {plugin.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(plugin.id)}
                      disabled={publishing.has(plugin.id)}
                      className="rounded-sm border border-green-500/20 bg-green-500/10 p-2 text-green-400 transition-colors hover:bg-green-500/20 disabled:opacity-50"
                      title="Publicar"
                    >
                      {publishing.has(plugin.id) ? '...' : <CheckCircle size={16} />}
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(plugin.id)}
                    disabled={deleting.has(plugin.id)}
                    className="rounded-sm border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                    title="Eliminar"
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
