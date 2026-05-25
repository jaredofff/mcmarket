"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Copy } from 'lucide-react';

interface TechnicalInfoProps {
  compatible_versions: string[];
  dependencies: string[];
  current_version: string;
  current_hash: string;
  last_updated: string;
}

export default function TechnicalInfo({
  compatible_versions,
  dependencies,
  current_version,
  current_hash,
  last_updated,
}: TechnicalInfoProps) {
  const [copiedHash, setCopiedHash] = React.useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Compatible Versions */}
      <Card className="bg-zinc-900 border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-zinc-50 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Compatible Versions
        </h3>
        <div className="flex flex-wrap gap-2">
          {compatible_versions.map((version) => (
            <Badge
              key={version}
              className="bg-emerald-900/30 text-emerald-400 border border-emerald-700/50 px-3 py-2"
            >
              {version}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-zinc-400 mt-4">
          ✓ Fully tested and optimized for Bukkit/Paper/Spigot platforms
        </p>
      </Card>

      {/* Dependencies */}
      {dependencies && dependencies.length > 0 && (
        <Card className="bg-zinc-900 border-zinc-800 p-6">
          <h3 className="text-lg font-semibold text-zinc-50 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            Dependencies
          </h3>
          <div className="space-y-3">
            {dependencies.map((dep, idx) => (
              <div
                key={idx}
                className="p-3 bg-zinc-800/50 border border-amber-700/30 rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-amber-400 text-sm">{dep}</p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Install before using this plugin
                  </p>
                </div>
                <span className="text-amber-400 text-lg">⚠️</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-400 mt-4">
            💡 These are required dependencies. Missing any of them will cause this plugin to fail on startup.
          </p>
        </Card>
      )}

      {/* Version Hash */}
      <Card className="bg-zinc-900 border-zinc-800 p-6">
        <h3 className="text-lg font-semibold text-zinc-50 mb-4">
          Version & Integrity
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Current Version
            </p>
            <p className="text-2xl font-bold text-emerald-400">v{current_version}</p>
            <p className="text-xs text-zinc-500 mt-1">
              Released {formatDate(last_updated)}
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              SHA-256 Hash
            </p>
            <div className="relative">
              <code className="block w-full bg-zinc-800/50 text-zinc-300 p-3 rounded-lg text-xs font-mono break-all border border-zinc-700">
                {current_hash}
              </code>
              <button
                onClick={() => copyToClipboard(current_hash)}
                className="absolute top-2 right-2 p-2 hover:bg-zinc-700 rounded transition-colors"
                title="Copy hash"
              >
                <Copy
                  className={`w-4 h-4 transition-colors ${
                    copiedHash ? 'text-emerald-400' : 'text-zinc-400'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              ✓ Verify file integrity by comparing SHA-256 hashes
            </p>
          </div>
        </div>
      </Card>

      {/* Security Notice */}
      <Card className="bg-emerald-900/10 border-emerald-700/30 p-6">
        <p className="text-sm text-emerald-300 flex gap-3">
          <span className="text-lg flex-shrink-0">🔒</span>
          <span>
            Every download includes a unique watermark for authentication and integrity verification. 
            Your license is automatically linked to your server on first run.
          </span>
        </p>
      </Card>
    </div>
  );
}
