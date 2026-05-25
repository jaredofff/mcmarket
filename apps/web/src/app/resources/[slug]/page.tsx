'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';

interface PluginVersion {
  id: string;
  version: string;
  releaseDate: Date;
  changelog: string;
  fileSize: number;
  fileHash: string;
}

interface PluginDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  descriptionHtml: string;
  author: string;
  version: string;
  tags: string[];
  categories: string[];
  testedVersions: string[];
  dependencies: string[];
  coverImage: string;
  bannerImage?: string;
  images: string[];
  sourceUrl: string;
  isVipOnly: boolean;
  downloadCount: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  latestVersion?: PluginVersion;
  allVersions?: PluginVersion[];
}

export default function ResourceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [plugin, setPlugin] = useState<PluginDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'changelog' | 'versions' | 'gallery'>(
    'details',
  );
  const [selectedVersion, setSelectedVersion] = useState<PluginVersion | null>(null);

  useEffect(() => {
    const fetchPlugin = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/plugins/${slug}`);
        setPlugin(response.data);
        setSelectedVersion(response.data.latestVersion);
      } catch (err) {
        setError('No se encontró el plugin');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlugin();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error || !plugin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{error || 'Plugin no encontrado'}</h1>
          <Link href="/marketplace" className="text-cyan-500 hover:text-cyan-400">
            Volver al marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Banner */}
      {plugin.bannerImage && (
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
          <Image
            src={plugin.bannerImage}
            alt={plugin.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent"></div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex gap-6 mb-8 -mt-24 relative z-10">
          <div className="flex-shrink-0">
            <Image
              src={plugin.coverImage}
              alt={plugin.title}
              width={160}
              height={160}
              className="rounded-lg shadow-lg border-4 border-gray-800"
            />
          </div>

          <div className="flex-1 flex flex-col justify-end">
            <h1 className="text-4xl font-bold mb-2">{plugin.title}</h1>
            <p className="text-xl text-gray-400 mb-4">por {plugin.author}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {plugin.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm border border-cyan-500/50"
                >
                  {cat}
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              {plugin.isVipOnly && (
                <div className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded text-white font-bold">
                  ✨ VIP
                </div>
              )}
              <button className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-bold transition">
                Descargar v{plugin.version}
              </button>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div>
            <p className="text-gray-400 text-sm">Descargas</p>
            <p className="text-xl font-bold">{plugin.downloadCount}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Calificación</p>
            <p className="text-xl font-bold">{plugin.rating.toFixed(1)} ⭐</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Versión</p>
            <p className="text-xl font-bold">{plugin.version}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Versiones</p>
            <p className="text-xl font-bold">{plugin.allVersions?.length || 1}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <div className="flex gap-8">
            {(['details', 'changelog', 'versions', 'gallery'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 border-b-2 font-semibold capitalize transition ${
                  activeTab === tab
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab === 'changelog' ? 'Cambios' : tab === 'versions' ? 'Versiones' : tab === 'gallery' ? 'Galería' : 'Detalles'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === 'details' && (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Descripción</h2>
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: plugin.descriptionHtml }}
                />
              </div>

              <div className="space-y-6">
                {/* Tags */}
                {plugin.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3">Etiquetas</h3>
                    <div className="flex flex-wrap gap-2">
                      {plugin.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-800 text-gray-300 rounded text-sm hover:bg-gray-700 cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tested Versions */}
                {plugin.testedVersions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3">Versiones Testadas</h3>
                    <div className="space-y-1">
                      {plugin.testedVersions.map((ver) => (
                        <p key={ver} className="text-gray-300">
                          ✓ {ver}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dependencies */}
                {plugin.dependencies.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3">Dependencias</h3>
                    <div className="space-y-1">
                      {plugin.dependencies.map((dep) => (
                        <p key={dep} className="text-gray-300">
                          • {dep}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Source Link */}
                <a
                  href={plugin.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded border border-gray-700 text-sm transition"
                >
                  Ver en BuiltByBit ↗
                </a>
              </div>
            </div>
          )}

          {activeTab === 'changelog' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Registro de Cambios</h2>
              {selectedVersion?.changelog ? (
                <div className="bg-gray-800 p-4 rounded border border-gray-700 whitespace-pre-wrap">
                  {selectedVersion.changelog}
                </div>
              ) : (
                <p className="text-gray-400">No hay información de cambios</p>
              )}
            </div>
          )}

          {activeTab === 'versions' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Todas las Versiones</h2>
              {plugin.allVersions && plugin.allVersions.length > 0 ? (
                <div className="space-y-3">
                  {plugin.allVersions.map((ver) => (
                    <div
                      key={ver.id}
                      className={`p-4 rounded border cursor-pointer transition ${
                        selectedVersion?.id === ver.id
                          ? 'bg-cyan-500/10 border-cyan-500'
                          : 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                      }`}
                      onClick={() => setSelectedVersion(ver)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold">v{ver.version}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(ver.releaseDate).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <p className="text-sm text-gray-400">
                          {(ver.fileSize / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No hay versiones disponibles</p>
              )}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Galería</h2>
              {plugin.images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plugin.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded overflow-hidden border border-gray-700">
                      <Image
                        src={img}
                        alt={`Imagen ${idx + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No hay imágenes disponibles</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-gray-400 text-sm py-8 border-t border-gray-700">
          <p>Importado el {new Date(plugin.createdAt).toLocaleDateString('es-ES')}</p>
          <Link href="/marketplace" className="text-cyan-500 hover:text-cyan-400">
            ← Volver al marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
