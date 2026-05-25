'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Plus } from 'lucide-react';
import PluginTable from '../components/PluginTable';

interface Plugin {
  id: string;
  title: string;
  author: string;
  price: number;
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
        if (!response.ok) throw new Error('Failed to fetch plugins');

        const data = await response.json();
        setPlugins(data.plugins);
        setTotalPages(data.totalPages);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load plugins');
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

      if (!response.ok) throw new Error('Failed to delete plugin');

      setPlugins(plugins.filter((p) => p.id !== id));
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

      if (!response.ok) throw new Error('Failed to publish plugin');

      const updatedPlugin = await response.json();
      setPlugins(plugins.map((p) => (p.id === id ? updatedPlugin : p)));
    } catch (err) {
      console.error('Publish failed:', err);
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-500">Plugins</h1>
          <p className="text-[#a89968] mt-1">Manage marketplace plugins</p>
        </div>
        <Link
          href="/admin/plugins/new"
          className="inline-flex items-center gap-2 px-6 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          New Plugin
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a89968]" size={20} />
          <input
            type="text"
            placeholder="Search plugins..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-[#1a1714] border border-amber-500/20 rounded-lg text-[#e8e4db] placeholder-[#a89968] focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value as 'all' | 'published' | 'draft');
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-[#1a1714] border border-amber-500/20 rounded-lg text-[#e8e4db] focus:outline-none focus:border-amber-500/50"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {/* Table */}
      <div className="p-4 bg-[#1a1714] border border-amber-500/20 rounded-lg overflow-hidden">
        <PluginTable
          plugins={plugins}
          isLoading={loading}
          onDelete={handleDelete}
          onPublish={handlePublish}
        />
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-50 text-amber-500 rounded-lg transition-colors"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            if (pageNum < currentPage - 2 || pageNum > currentPage + 2) return null;

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === pageNum
                    ? 'bg-amber-500/30 text-amber-500 border border-amber-500/50'
                    : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-50 text-amber-500 rounded-lg transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
