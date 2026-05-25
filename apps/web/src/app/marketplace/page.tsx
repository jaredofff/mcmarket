'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

interface Plugin {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  coverImage: string;
  categories: string[];
  tags: string[];
  version: string;
  downloadCount: number;
  rating: number;
  isVipOnly: boolean;
}

export default function MarketplacePage() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('recent');

  useEffect(() => {
    const fetchPlugins = async () => {
      try {
        setLoading(true);
        const params: Record<string, string | number | boolean | string[]> = {
          limit: 50,
          sortBy: sortBy === 'popular' ? 'downloads' : sortBy === 'rating' ? 'rating' : 'createdAt',
        };

        if (searchTerm) {
          params.search = searchTerm;
        }

        if (selectedCategory) {
          params.categories = [selectedCategory];
        }

        const response = await axios.get('/api/plugins/search', { params });
        setPlugins(response.data.items);
      } catch (error) {
        console.error('Error fetching plugins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlugins();
  }, [searchTerm, selectedCategory, sortBy]);

  const categories = [
    'Utilidad',
    'Diversión',
    'Economía',
    'PvP',
    'Administración',
    'Seguridad',
    'Mundo',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-4">Marketplace</h1>
          <p className="text-xl text-cyan-100">
            Descubre y descarga los mejores plugins de Minecraft
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="mb-8 space-y-6">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar plugins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
            <span className="absolute right-4 top-3 text-gray-500">🔍</span>
          </div>

          {/* Category Filter */}
          <div>
            <p className="text-gray-300 font-semibold mb-3">Categorías</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedCategory === null
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Todas
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg transition ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="flex gap-4">
            <label className="text-gray-300 flex items-center gap-2">
              Ordenar por:
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as 'recent' | 'popular' | 'rating')
                }
                className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="recent">Reciente</option>
                <option value="popular">Popular</option>
                <option value="rating">Calificación</option>
              </select>
            </label>
          </div>
        </div>

        {/* Plugin Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : plugins.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No se encontraron plugins</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {plugins.map((plugin) => (
              <Link
                key={plugin.id}
                href={`/resources/${plugin.slug}`}
                className="group relative bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-cyan-500 transition"
              >
                {/* Cover Image */}
                <div className="relative h-40 bg-gray-700">
                  <Image
                    src={plugin.coverImage}
                    alt={plugin.title}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-300"
                  />
                  {plugin.isVipOnly && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded text-white text-xs font-bold">
                      ✨ VIP
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-white mb-1 line-clamp-2">
                    {plugin.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">{plugin.author}</p>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {plugin.categories.slice(0, 2).map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-4 text-gray-400">
                      <span>⭐ {plugin.rating}</span>
                      <span>📥 {(plugin.downloadCount / 1000).toFixed(0)}k</span>
                    </div>
                    <span className="text-cyan-400 font-semibold">
                      v{plugin.version}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
