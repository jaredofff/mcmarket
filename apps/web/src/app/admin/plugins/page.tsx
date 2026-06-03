'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Plus, Search, UploadCloud } from 'lucide-react';
import PluginTable from '../components/PluginTable';

export const runtime = 'edge';

interface Plugin {
  id: string;
  title: string;
  slug?: string;
  author: string;
  tier: string;
  status: 'published' | 'draft';
  createdAt: string;
}

export default function PluginsPage() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPlugins = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          search: searchTerm,
          status: filterStatus === 'all' ? '' : filterStatus,
        });

        const response = await fetch(`/api/admin/plugins?${params}`);
        if (!response.ok) throw new Error('No se pudieron cargar los recursos');

        const data = await response.json();
        setPlugins(data.plugins || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.total || 0);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los recursos');
      } finally {
        setLoading(false);
      }
    };

    fetchPlugins();
  }, [searchTerm, filterStatus, currentPage]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/plugins/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('No se pudo eliminar el recurso');

      setPlugins(plugins.filter((p) => p.id !== id));
      setTotalItems((current) => Math.max(0, current - 1));
    } catch (err) {
      console.error('Delete failed:', err);
      throw err;
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/plugins/${id}/publish`, {
        method: 'PATCH',
      });

      if (!response.ok) throw new Error('No se pudo publicar el recurso');

      const updatedPlugin = await response.json();
      setPlugins(plugins.map((p) => (p.id === id ? updatedPlugin : p)));
    } catch (err) {
      console.error('Publish failed:', err);
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-500">Administración</p>
          <h1 className="text-3xl font-bold text-[#e8e4db]">Recursos del marketplace</h1>
          <p className="mt-1 text-[#a89968]">Carga, publica y organiza todos los recursos que aparecen en la tienda.</p>
        </div>
        <Link
          href="/admin/plugins/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-linear-to-b from-amber-400 to-yellow-600 px-5 text-sm font-black text-[#141311] shadow-[0_3px_0_#92400e] transition-all hover:brightness-110"
        >
          <Plus size={20} />
          Nuevo recurso
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-sm border border-[#2d2a26] bg-[#1a1714] p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-sm border border-amber-500/20 bg-amber-500/10 text-amber-400">
            <Package size={20} />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#6b6459]">Total</p>
          <p className="mt-1 font-outfit text-3xl font-black text-amber-400">{totalItems}</p>
        </div>
        <div className="rounded-sm border border-[#2d2a26] bg-[#1a1714] p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-sm border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <UploadCloud size={20} />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#6b6459]">Publicados en esta vista</p>
          <p className="mt-1 font-outfit text-3xl font-black text-emerald-400">
            {plugins.filter((plugin) => plugin.status === 'published').length}
          </p>
        </div>
        <div className="rounded-sm border border-[#2d2a26] bg-[#1a1714] p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-sm border border-yellow-500/20 bg-yellow-500/10 text-yellow-400">
            <Package size={20} />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#6b6459]">Borradores en esta vista</p>
          <p className="mt-1 font-outfit text-3xl font-black text-yellow-400">
            {plugins.filter((plugin) => plugin.status === 'draft').length}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-sm border border-red-500/50 bg-red-500/20 p-4 text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 rounded-sm border border-[#2d2a26] bg-[#1a1714] p-4 md:grid-cols-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a89968]" size={20} />
          <input
            type="text"
            placeholder="Buscar por título, autor o descripción..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="h-11 w-full rounded-sm border border-[#3d3830] bg-[#141311] py-2 pl-10 pr-4 text-[#e8e4db] placeholder-[#6b6459] focus:border-amber-500/50 focus:outline-none"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value as 'all' | 'published' | 'draft');
            setCurrentPage(1);
          }}
          className="h-11 rounded-sm border border-[#3d3830] bg-[#141311] px-4 py-2 font-bold text-[#e8e4db] focus:border-amber-500/50 focus:outline-none"
        >
          <option value="all">Todos los estados</option>
          <option value="published">Publicados</option>
          <option value="draft">Borradores</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-sm border border-[#2d2a26] bg-[#1a1714] p-4">
        <PluginTable
          plugins={plugins}
          isLoading={loading}
          onDelete={handleDelete}
          onPublish={handlePublish}
        />
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="rounded-sm border border-[#3d3830] bg-[#1a1714] px-4 py-2 font-bold text-[#a89968] transition-colors hover:text-amber-400 disabled:opacity-50"
          >
            Anterior
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            if (pageNum < currentPage - 2 || pageNum > currentPage + 2) return null;

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`rounded-sm px-4 py-2 font-bold transition-colors ${
                  currentPage === pageNum
                    ? 'border border-amber-500/50 bg-amber-500/20 text-amber-400'
                    : 'border border-[#3d3830] bg-[#1a1714] text-[#a89968] hover:text-amber-400'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="rounded-sm border border-[#3d3830] bg-[#1a1714] px-4 py-2 font-bold text-[#a89968] transition-colors hover:text-amber-400 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
