import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

interface CheckoutRequestBody {
  productId: string;
  productName: string;
  price: number;
  quantity?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json();

    const { productId, productName, price, quantity = 1 } = body;

    // Validar entrada
    if (!productId || !productName || !price) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos: productId, productName, price' },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: 'El precio debe ser mayor a 0' },
        { status: 400 }
      );
    }

    // Obtener URLs del dominio actual
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Crear sesión de checkout
    const session = await createCheckoutSession({
      productId,
      productName,
      price,
      quantity,
      successUrl: `${origin}/checkout/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/products/${productId}`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout API error:', error);

    const message = error instanceof Error ? error.message : 'Error desconocido';

    return NextResponse.json(
      { error: `Error al procesar checkout: ${message}` },
      { status: 500 }
    );
  }
}
