import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface CheckoutRequestBody {
  productId: string;
  productName: string;
  price: number;
  quantity?: number;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe no configurado' },
        { status: 503 }
      );
    }

    // Importar Stripe dinámicamente para evitar error en build
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-12-18',
    });

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
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              metadata: {
                productId,
              },
            },
            unit_amount: Math.round(price * 100),
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/checkout/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/products/${productId}`,
      customer_email_collection: {
        enabled: true,
      },
      metadata: {
        productId,
      },
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
