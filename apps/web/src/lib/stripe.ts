import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!stripeSecret) {
  console.warn('⚠️  STRIPE_SECRET_KEY no configurada. Las funciones de servidor no funcionarán.');
}

export const stripe = new Stripe(stripeSecret || '', {
  apiVersion: '2024-12-18.acpi' as any,
});

export interface CheckoutSessionParams {
  productId: string;
  productName: string;
  price: number;
  currency?: string;
  quantity?: number;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(params: CheckoutSessionParams) {
  const {
    productId,
    productName,
    price,
    currency = 'usd',
    quantity = 1,
    successUrl,
    cancelUrl,
  } = params;

  const session = await (stripe.checkout.sessions.create as any)({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency,
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
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email_collection: {
      enabled: true,
    },
    metadata: {
      productId,
    },
  });

  return session;
}
