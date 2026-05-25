"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp } from 'lucide-react';

interface ReviewsSectionProps {
  productId: string;
  rating: number;
}

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  verified: boolean;
  date: string;
}

// Mock reviews - In production, these would come from an API
const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'ServerAdmin_Pro',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    rating: 5,
    title: 'Exactly what we needed!',
    content:
      'This plugin solved our server performance issues immediately. The configuration is intuitive and the support team responded within hours when we had questions. Highly recommend!',
    helpful: 42,
    verified: true,
    date: '2024-05-15',
  },
  {
    id: '2',
    author: 'MinecraftBuilder',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    rating: 4,
    title: 'Great tool, minor learning curve',
    content:
      'Solid plugin with powerful features. Documentation could be more detailed for advanced configurations, but the basics are straightforward. Support team is responsive.',
    helpful: 28,
    verified: true,
    date: '2024-05-10',
  },
  {
    id: '3',
    author: 'NetworkManager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    rating: 5,
    title: 'Perfect for multi-server setups',
    content:
      'Been using this across 5 servers for 3 months. No crashes, no issues. The auto-updater feature alone is worth the price. Makes server management so much easier.',
    helpful: 67,
    verified: true,
    date: '2024-05-05',
  },
];

export default function ReviewsSection({ productId, rating }: ReviewsSectionProps) {
  const [reviews, setReviews] = React.useState<Review[]>(MOCK_REVIEWS);
  const [sortBy, setSortBy] = React.useState<'recent' | 'helpful' | 'rating'>(
    'recent'
  );

  const handleHelpful = (reviewId: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
    );
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'recent') {
      return (
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }
    if (sortBy === 'helpful') {
      return b.helpful - a.helpful;
    }
    return b.rating - a.rating;
  });

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card className="bg-zinc-900 border-zinc-800 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-zinc-50 mb-1">
              {rating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-zinc-700'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-zinc-400">Based on {reviews.length} reviews</p>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviews.filter((r) => r.rating === stars).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-2 text-xs">
                  <span className="w-6 text-zinc-400">{stars}★</span>
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-zinc-500">{count}</span>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="flex items-center justify-center">
            <Button className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
              Write a Review
            </Button>
          </div>
        </div>
      </Card>

      {/* Sort Options */}
      <div className="flex gap-2">
        {(['recent', 'helpful', 'rating'] as const).map((option) => (
          <button
            key={option}
            onClick={() => setSortBy(option)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === option
                ? 'bg-zinc-700 text-zinc-50'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {option === 'recent'
              ? 'Most Recent'
              : option === 'helpful'
              ? 'Most Helpful'
              : 'Highest Rated'}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <Card key={review.id} className="bg-zinc-900 border-zinc-800 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <img
                    src={review.avatar}
                    alt={review.author}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-zinc-50">
                        {review.author}
                      </p>
                      {review.verified && (
                        <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded border border-emerald-700/50">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Title and Content */}
              <h4 className="font-semibold text-zinc-50 mb-2">
                {review.title}
              </h4>
              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                {review.content}
              </p>

              {/* Footer - Helpful Button */}
              <button
                onClick={() => handleHelpful(review.id)}
                className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                Helpful ({review.helpful})
              </button>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-400">No reviews yet. Be the first!</p>
          </div>
        )}
      </div>

      {/* Load More */}
      {reviews.length > 0 && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
}
