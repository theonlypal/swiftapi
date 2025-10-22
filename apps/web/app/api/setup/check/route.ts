import { NextResponse } from 'next/server';

// Critical vars - app won't work without these
const CRITICAL_ENV_VARS = [
  'NEXTAUTH_SECRET',
];

// Optional vars - features will be disabled but app still works
const OPTIONAL_ENV_VARS = [
  'DATABASE_URL',
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

  // Check all vars (critical + optional)
  const allVars = [...CRITICAL_ENV_VARS, ...OPTIONAL_ENV_VARS];

  for (const key of allVars) {
    // Check if the environment variable exists and is not empty
    env[key] = !!(process.env[key] && process.env[key].trim() !== '');
  }

  const allPresent = Object.values(env).every(present => present);
  const criticalPresent = CRITICAL_ENV_VARS.every(key => env[key]);

  return NextResponse.json({
    env,
    allPresent,
    criticalPresent,
    timestamp: new Date().toISOString(),
  });
}
