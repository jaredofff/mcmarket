'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, CheckCircle, Clock, Plus, TrendingUp } from 'lucide-react';

interface DashboardStats {
  totalPlugins: number;
  publishedPlugins: number;
  draftPlugins: number;
  totalDownloads: number;
  recentPlugins: Array<{
    id: string;
    title: string;
    author: string;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-amber-500/5 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Plugins */}
        <div className="p-6 bg-[#1a1714] border border-amber-500/20 rounded-lg hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#a89968] text-sm font-medium">Total Plugins</p>
              <p className="text-3xl font-bold text-amber-500 mt-2">
                {stats?.totalPlugins || 0}
              </p>
            </div>
            <Package className="text-amber-500/30" size={40} />
          </div>
        </div>

        {/* Published */}
        <div className="p-6 bg-[#1a1714] border border-green-500/20 rounded-lg hover:border-green-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Published</p>
              <p className="text-3xl font-bold text-green-500 mt-2">
                {stats?.publishedPlugins || 0}
              </p>
            </div>
            <CheckCircle className="text-green-500/30" size={40} />
          </div>
        </div>

        {/* Drafts */}
        <div className="p-6 bg-[#1a1714] border border-yellow-500/20 rounded-lg hover:border-yellow-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Drafts</p>
              <p className="text-3xl font-bold text-yellow-500 mt-2">
                {stats?.draftPlugins || 0}
              </p>
            </div>
            <Clock className="text-yellow-500/30" size={40} />
          </div>
        </div>

        {/* Total Downloads */}
        <div className="p-6 bg-[#1a1714] border border-blue-500/20 rounded-lg hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Downloads</p>
              <p className="text-3xl font-bold text-blue-500 mt-2">
                {stats?.totalDownloads || 0}
              </p>
            </div>
            <TrendingUp className="text-blue-500/30" size={40} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/plugins/new"
          className="p-6 bg-[#1a1714] border border-amber-500/20 rounded-lg hover:border-amber-500/40 transition-colors flex items-center justify-between group"
        >
          <div>
            <h3 className="text-amber-500 font-semibold mb-1">Create New Plugin</h3>
            <p className="text-[#a89968] text-sm">Add a new plugin to the marketplace</p>
          </div>
          <Plus className="text-amber-500/30 group-hover:text-amber-500/60 transition-colors" size={32} />
        </Link>

        <Link
          href="/admin/plugins"
          className="p-6 bg-[#1a1714] border border-blue-500/20 rounded-lg hover:border-blue-500/40 transition-colors flex items-center justify-between group"
        >
          <div>
            <h3 className="text-blue-400 font-semibold mb-1">View All Plugins</h3>
            <p className="text-[#a89968] text-sm">Manage all plugins in the system</p>
          </div>
          <Package className="text-blue-400/30 group-hover:text-blue-400/60 transition-colors" size={32} />
        </Link>
      </div>

      {/* Recent Plugins */}
      {stats?.recentPlugins && stats.recentPlugins.length > 0 && (
        <div className="p-6 bg-[#1a1714] border border-amber-500/20 rounded-lg">
          <h2 className="text-amber-500 font-semibold mb-4">Recent Plugins</h2>
          <div className="space-y-3">
            {stats.recentPlugins.map((plugin) => (
              <Link
                key={plugin.id}
                href={`/admin/plugins/${plugin.id}/edit`}
                className="flex items-center justify-between p-3 bg-amber-500/5 hover:bg-amber-500/10 rounded-lg transition-colors"
              >
                <div>
                  <p className="text-[#e8e4db] font-medium">{plugin.title}</p>
                  <p className="text-[#a89968] text-sm">by {plugin.author}</p>
                </div>
                <p className="text-[#a89968] text-sm">
                  {new Date(plugin.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
