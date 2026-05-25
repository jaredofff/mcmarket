import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Compra exitosa - MC Market',
  description: 'Tu compra ha sido procesada exitosamente',
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-emerald-400" />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">¡Compra Exitosa!</h1>
          <p className="text-zinc-400">
            Tu transacción ha sido procesada correctamente. Recibirás un email de
            confirmación en breve.
          </p>
        </div>

        <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 space-y-2 text-left">
          <p className="text-sm text-zinc-400">
            <span className="font-semibold">Próximos pasos:</span>
          </p>
          <ul className="text-sm text-zinc-300 space-y-1 list-disc list-inside">
            <li>Revisa tu email para instrucciones de acceso</li>
            <li>Descarga tu producto desde el panel de cliente</li>
            <li>Accede a actualizaciones y soporte premium</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link href="/dashboard" className="block">
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
              Ir al Panel de Control
            </Button>
          </Link>
          <Link href="/products" className="block">
            <Button variant="outline" className="w-full">
              Explorar Más Productos
            </Button>
          </Link>
        </div>

        <p className="text-xs text-zinc-500">
          ¿Preguntas? Contáctanos en{' '}
          <a href="mailto:support@mcmarket.com" className="text-emerald-400 hover:underline">
            support@mcmarket.com
          </a>
        </p>
      </div>
    </div>
  );
}
