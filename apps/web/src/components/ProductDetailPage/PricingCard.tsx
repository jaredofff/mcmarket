'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ShieldCheck, Clock, Package } from 'lucide-react';
import { CheckoutButton } from './CheckoutButton';
import { StripeSetupGuide } from './StripeSetupGuide';

interface PricingCardProps {
  price: number;
  productId: string;
  productName: string;
  compatible_versions: string[];
  dependencies: string[];
  current_version: string;
}

export default function PricingCard({
  price,
  productId,
  productName,
  compatible_versions,
  dependencies,
  current_version,
}: PricingCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 p-6 space-y-6">
      {/* Price Section */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-400">One-time purchase</p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-zinc-50">${price.toFixed(2)}</span>
          <span className="text-sm text-zinc-500">USD</span>
        </div>
        <p className="text-xs text-zinc-500">Lifetime access + future updates</p>
      </div>

      {/* Stripe Setup Guide */}
      <StripeSetupGuide />

      {/* Checkout Button */}
      <CheckoutButton
        productId={productId}
        productName={productName}
        price={price}
      />

      {/* Trust Signals */}
      <div className="space-y-3 pt-4 border-t border-zinc-800">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-zinc-200 font-medium">Lifetime Updates</p>
            <p className="text-xs text-zinc-400">Always get the latest versions</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Package className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-zinc-200 font-medium">Multi-Server License</p>
            <p className="text-xs text-zinc-400">Use on up to 3 servers</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-zinc-200 font-medium">Priority Support</p>
            <p className="text-xs text-zinc-400">24h response time guarantee</p>
          </div>
        </div>
      </div>

      {/* Technical Quick Info */}
      <div className="space-y-4 pt-4 border-t border-zinc-800">
        <div>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Compatibility
          </p>
          <div className="flex flex-wrap gap-2">
            {compatible_versions.slice(0, 3).map((version) => (
              <Badge
                key={version}
                variant="secondary"
                className="bg-zinc-800/50 text-zinc-300 text-xs"
              >
                {version}
              </Badge>
            ))}
            {compatible_versions.length > 3 && (
              <Badge
                variant="secondary"
                className="bg-zinc-800/50 text-zinc-400 text-xs"
              >
                +{compatible_versions.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {dependencies && dependencies.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Dependencies
            </p>
            <div className="flex flex-wrap gap-2">
              {dependencies.map((dep) => (
                <Badge
                  key={dep}
                  variant="outline"
                  className="border-amber-500/30 text-amber-400 text-xs bg-amber-500/5"
                >
                  {dep}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Current Version
          </p>
          <p className="text-sm font-mono text-zinc-300 px-3 py-2 bg-zinc-800/30 rounded border border-zinc-700">
            {current_version}
          </p>
        </div>
      </div>

      {/* Footer Text */}
      <p className="text-xs text-zinc-500 text-center pt-2">
        🔒 Secure payment • 📋 License activation within 1 minute
      </p>
    </Card>
  );
}
