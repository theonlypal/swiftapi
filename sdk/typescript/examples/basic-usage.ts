/**
 * Basic usage examples for SwiftAPI TypeScript SDK
 */

import { SwiftAPI, TierEnum } from '../src';

async function main() {
  // Initialize client with API key
  const client = new SwiftAPI({ apiKey: 'sk_your_api_key_here' });

  // Or authenticate with email/password
  // const client = new SwiftAPI();
  // await client.login('your@email.com', 'your_password');

  // Get current user information
  const user = await client.getCurrentUser();
  console.log(`Email: ${user.email}`);
  console.log(`Tier: ${user.tier}`);
  console.log(`Monthly volume: $${user.monthly_volume.toFixed(2)}`);

  // Create a new API key
  const newKey = await client.createAPIKey('My Production Key');
  console.log(`\nNew API key created: ${newKey.key}`);
  console.log(`Key ID: ${newKey.id}`);

  // List all API keys
  const keys = await client.listAPIKeys();
  console.log(`\nTotal API keys: ${keys.length}`);
  keys.forEach((key) => {
    const status = key.is_active ? 'Active' : 'Revoked';
    console.log(`  - ${key.name}: ${status}`);
  });

  // Get usage statistics
  const usage = await client.getUsage();
  console.log(`\nUsage Statistics:`);
  console.log(`  API calls today: ${usage.calls.today}`);
  console.log(`  API calls this month: ${usage.calls.month}`);
  console.log(`  Rate limit (minute): ${usage.rate_limits.minute_remaining} remaining`);
  console.log(`  Rate limit (hour): ${usage.rate_limits.hour_remaining} remaining`);

  // Create a payment
  const transaction = await client.createPayment(100.0, 'usd', {
    order_id: 'ORDER_12345',
  });
  console.log(`\nPayment created:`);
  console.log(`  Transaction ID: ${transaction.id}`);
  console.log(`  Amount: $${transaction.amount.toFixed(2)}`);
  console.log(`  Fee: $${transaction.fee_amount.toFixed(2)}`);
  console.log(`  Status: ${transaction.status}`);

  // Upgrade subscription
  const subscription = await client.createSubscription(TierEnum.PRO);
  console.log(`\nSubscription upgrade initiated:`);
  console.log(`  Tier: ${subscription.tier}`);
  console.log(`  Status: ${subscription.status}`);
  if (subscription.client_secret) {
    console.log(`  Complete payment with client secret: ${subscription.client_secret}`);
  }
}

main().catch(console.error);
