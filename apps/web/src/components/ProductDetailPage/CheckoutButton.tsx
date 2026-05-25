'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingCart } from 'lucide-react';

interface CheckoutButtonProps {
  productId: string;
  productName: string;
  price: number;
  disabled?: boolean;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  productId,
  productName,
  price,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error(
          'Stripe no está configurado. Por favor, agrega NEXT_PUBLIC_STRIPE_PUBLIC_KEY a .env.local'
        );
      }

      if (publicKey.includes('your_key')) {
        throw new Error(
          'Stripe key vacía. Reemplaza pk_test_your_key_here con tu clave real'
        );
      }

      // Llamar a la API para crear la sesión de checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          productName,
          price,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la sesión de checkout');
      }

      const { sessionId } = await response.json();

      // Redirigir a Stripe Checkout
      const stripe = await import('@stripe/js').then((m) => m.loadStripe(publicKey));

      if (!stripe) {
        throw new Error('No se pudo cargar Stripe');
      }

      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (redirectError) {
        throw new Error(redirectError.message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      console.error('Checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleCheckout}
        disabled={disabled || isLoading}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 text-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Comprar Ahora ${price.toFixed(2)}
          </>
        )}
      </Button>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  );
};
