"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

interface ChangelogItem {
  type: 'added' | 'fixed' | 'improved' | 'removed';
  text: string;
}

interface Changelog {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: ChangelogItem[];
}

interface ChangelogSectionProps {
  changelogs: Changelog[];
}

const changeTypeConfig = {
  added: {
    color: 'bg-emerald-900/20 border-emerald-700/50 text-emerald-400',
    icon: '✨',
    label: 'Added',
  },
  fixed: {
    color: 'bg-blue-900/20 border-blue-700/50 text-blue-400',
    icon: '🐛',
    label: 'Fixed',
  },
  improved: {
    color: 'bg-amber-900/20 border-amber-700/50 text-amber-400',
    icon: '⚡',
    label: 'Improved',
  },
  removed: {
    color: 'bg-red-900/20 border-red-700/50 text-red-400',
    icon: '🗑️',
    label: 'Removed',
  },
};

export default function ChangelogSection({ changelogs }: ChangelogSectionProps) {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(0);

  return (
    <div className="space-y-3">
      {changelogs && changelogs.length > 0 ? (
        changelogs.map((changelog, idx) => (
          <Card
            key={idx}
            className="bg-zinc-900 border-zinc-800 overflow-hidden transition-all"
          >
            <button
              onClick={() =>
                setExpandedIndex(expandedIndex === idx ? null : idx)
              }
              className="w-full p-6 hover:bg-zinc-800/50 transition-colors text-left flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl font-bold text-zinc-50">
                    v{changelog.version}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">
                    {new Date(changelog.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-sm text-zinc-300">{changelog.title}</p>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-zinc-400 transition-transform ${
                  expandedIndex === idx ? 'rotate-180' : ''
                }`}
              />
            </button>

            {expandedIndex === idx && (
              <div className="border-t border-zinc-800 p-6 bg-zinc-900/50 space-y-4">
                {/* Description */}
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {changelog.description}
                </p>

                {/* Changes List */}
                {changelog.changes && changelog.changes.length > 0 && (
                  <div className="space-y-2">
                    {changelog.changes.map((change, changeIdx) => {
                      const config =
                        changeTypeConfig[change.type];
                      return (
                        <div
                          key={changeIdx}
                          className={`flex gap-3 p-3 rounded-lg border ${config.color}`}
                        >
                          <span className="text-lg flex-shrink-0">
                            {config.icon}
                          </span>
                          <div className="flex-1">
                            <p className="text-xs font-semibold opacity-75 mb-1">
                              {config.label}
                            </p>
                            <p className="text-sm">{change.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Release Notes Link */}
                <div className="pt-2 border-t border-zinc-800/50">
                  <a
                    href={`#changelog/${changelog.version}`}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                  >
                    View full release notes →
                  </a>
                </div>
              </div>
            )}
          </Card>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-zinc-400">No changelog available yet</p>
        </div>
      )}

      {/* Timeline visualization */}
      {changelogs && changelogs.length > 0 && (
        <div className="mt-8 pt-8 border-t border-zinc-800">
          <h4 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">
            Release Timeline
          </h4>
          <div className="space-y-2">
            {changelogs.map((changelog, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 text-xs text-zinc-400 hover:text-zinc-300 transition-colors cursor-pointer"
                onClick={() => setExpandedIndex(idx)}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                <span>v{changelog.version}</span>
                <span className="text-zinc-600">•</span>
                <span>
                  {new Date(changelog.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
