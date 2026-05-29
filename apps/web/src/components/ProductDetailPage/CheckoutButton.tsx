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
      // Stripe ha sido eliminado del proyecto; no realizar llamadas de pago.
      throw new Error('El sistema de pagos (Stripe) ha sido eliminado. Checkout no disponible.');
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
