"use client";

import React from 'react';
import Markdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Download, Heart, Share2, ShieldCheck } from 'lucide-react';
import PricingCard from './ProductDetailPage/PricingCard';
import TechnicalInfo from './ProductDetailPage/TechnicalInfo';
import ChangelogSection from './ProductDetailPage/ChangelogSection';
import ReviewsSection from './ProductDetailPage/ReviewsSection';

interface ProductDetailPageProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    rating: number;
    reviewCount: number;
    downloads: number;
    image: string;
    gallery?: string[];
    videoUrl?: string;
    compatible_versions: string[];
    dependencies: string[];
    current_version: string;
    current_hash: string;
    last_updated: string;
    changelogs: Changelog[];
    features: string[];
    tags: string[];
  };
  isWishlisted?: boolean;
}

interface Changelog {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: {
    type: 'added' | 'fixed' | 'improved' | 'removed';
    text: string;
  }[];
}

export default function ProductDetailPage({
  product,
  isWishlisted = false,
}: ProductDetailPageProps) {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [isSaving, setIsSaving] = React.useState(false);
  const [wishlisted, setWishlisted] = React.useState(isWishlisted);

  const handleWishlistToggle = () => {
    setWishlisted((current) => !current);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Header Section */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-10 h-10 rounded-lg object-cover border border-zinc-700"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">{product.name}</h1>
              <p className="text-sm text-zinc-400">v{product.current_version}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                navigator.share?.({ 
                  title: product.name,
                  text: `Check out ${product.name} on MC Market`,
                  url: window.location.href
                });
              }}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5 text-zinc-400" />
            </button>
            <button
              onClick={handleWishlistToggle}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  wishlisted ? 'fill-red-500 text-red-500' : 'text-zinc-400'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="space-y-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-video rounded-xl object-cover border border-zinc-800"
              />
              
              {/* Stats Bar */}
              <div className="flex flex-wrap gap-4 items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < Math.floor(product.rating)
                              ? 'text-amber-400'
                              : 'text-zinc-700'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-zinc-400">
                      {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-zinc-400">
                    <Download className="w-4 h-4" />
                    {product.downloads.toLocaleString()} downloads
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                >
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Verified Official
                </Badge>
              </div>
            </div>

            {/* Description and Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-4 bg-zinc-900 border border-zinc-800">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-zinc-800"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="technical"
                  className="data-[state=active]:bg-zinc-800"
                >
                  Technical
                </TabsTrigger>
                <TabsTrigger
                  value="changelog"
                  className="data-[state=active]:bg-zinc-800"
                >
                  Changelog
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-zinc-800"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="prose prose-invert max-w-none">
                  <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                    <Markdown>
                      {product.description}
                    </Markdown>
                  </div>
                </div>

                {/* Features List */}
                {product.features && product.features.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-zinc-50">
                      Key Features
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800"
                        >
                          <span className="text-emerald-400 font-bold shrink-0">
                            ✓
                          </span>
                          <span className="text-sm text-zinc-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4">
                    {product.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Technical Tab */}
              <TabsContent value="technical">
                <TechnicalInfo
                  compatible_versions={product.compatible_versions}
                  dependencies={product.dependencies}
                  current_version={product.current_version}
                  current_hash={product.current_hash}
                  last_updated={product.last_updated}
                />
              </TabsContent>

              {/* Changelog Tab */}
              <TabsContent value="changelog">
                <ChangelogSection changelogs={product.changelogs} />
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <ReviewsSection productId={product.id} rating={product.rating} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Pricing Card (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PricingCard
                productId={product.id}
                price={product.price}
                productName={product.name}
                compatible_versions={product.compatible_versions}
                dependencies={product.dependencies}
                current_version={product.current_version}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
