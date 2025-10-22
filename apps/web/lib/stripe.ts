import Stripe from 'stripe';

// Check if Stripe is configured
export const isStripeConfigured = !!(
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_PRICE_ID &&
  process.env.STRIPE_WEBHOOK_SECRET
);

// Only initialize Stripe if configured, otherwise set to null
// This allows the app to run without Stripe, just with billing features disabled
export const stripe = isStripeConfigured
  ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-09-30.clover',
      typescript: true,
      appInfo: {
        name: 'SwiftAPI',
        version: '1.0.0',
        url: 'https://swiftapi.dev',
      },
      maxNetworkRetries: 2,
    })
  : null;

// Stripe configuration constants
export const STRIPE_CONFIG = {
  PRICE_ID: process.env.STRIPE_PRICE_ID || '',
  WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  PRO_PLAN_AMOUNT: 9900, // $99.00 in cents
  CURRENCY: 'usd',
} as const;
