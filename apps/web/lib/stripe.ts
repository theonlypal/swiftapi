import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
  appInfo: {
    name: 'SwiftAPI',
    version: '1.0.0',
    url: 'https://swiftapi.dev',
  },
  maxNetworkRetries: 2,
});

// Stripe configuration constants
export const STRIPE_CONFIG = {
  PRICE_ID: process.env.STRIPE_PRICE_ID || '',
  WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  PRO_PLAN_AMOUNT: 9900, // $99.00 in cents
  CURRENCY: 'usd',
} as const;
