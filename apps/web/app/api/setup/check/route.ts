import { NextResponse } from 'next/server';

const REQUIRED_ENV_VARS = [
  'NEXTAUTH_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_PRICE_ID',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_SITE_URL',
  'GITHUB_TOKEN',
  'GITHUB_OWNER',
  'GITHUB_REPO',
  'GITHUB_BRANCH',
];

export async function GET() {
  const env: Record<string, boolean> = {};

  for (const key of REQUIRED_ENV_VARS) {
    // Check if the environment variable exists and is not empty
    env[key] = !!(process.env[key] && process.env[key].trim() !== '');
  }

  const allPresent = Object.values(env).every(present => present);

  return NextResponse.json({
    env,
    allPresent,
    timestamp: new Date().toISOString(),
  });
}
