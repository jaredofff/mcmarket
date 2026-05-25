'use client';

import React from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const StripeSetupGuide: React.FC = () => {
  const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
  const isNotConfigured = !publicKey || publicKey.includes('your_key');

  if (!isNotConfigured) {
    return null;
  }

  return (
    <Card className="bg-amber-500/10 border border-amber-500/30 p-4">
      <div className="flex gap-3">
        <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-2 text-sm">
          <p className="font-semibold text-amber-400">Stripe no está configurado</p>
          <p className="text-zinc-300">
            Para habilitar compras, debes:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-zinc-400 ml-2">
            <li>
              Crear una cuenta en{' '}
              <a
                href="https://dashboard.stripe.com/register"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline inline-flex items-center gap-1"
              >
                Stripe
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              Ir a{' '}
              <a
                href="https://dashboard.stripe.com/apikeys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline inline-flex items-center gap-1"
              >
                API Keys
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>Copiar tu "Publishable key" (comienza con pk_test_)</li>
            <li>
              Pegar en <code className="bg-zinc-800 px-2 py-1 rounded text-xs">.env.local</code>:
              <pre className="bg-zinc-800 p-2 rounded mt-1 text-xs overflow-auto">
                {`NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...`}
              </pre>
            </li>
            <li>Reiniciar el servidor</li>
          </ol>
        </div>
      </div>
    </Card>
  );
};
