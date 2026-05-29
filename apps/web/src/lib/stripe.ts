// Stripe ha sido eliminado de este proyecto.
// Este archivo exporta stubs para evitar errores de importación en tiempo de compilación.

console.warn('Stripe package removed — server checkout disabled.');

export const stripe = null as unknown as Record<string, any>;

export interface CheckoutSessionParams {
  productId: string;
  productName: string;
  price: number;
  currency?: string;
  quantity?: number;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(_params: CheckoutSessionParams) {
  throw new Error('Stripe ha sido eliminado del proyecto. createCheckoutSession no está disponible.');
}
