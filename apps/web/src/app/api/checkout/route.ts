import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest) {
  return NextResponse.json(
    { error: 'El sistema de pagos (Stripe) ha sido eliminado. Checkout no disponible.' },
    { status: 410 }
  );
}
