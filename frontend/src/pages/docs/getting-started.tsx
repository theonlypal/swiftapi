import Link from 'next/link';
import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function GettingStarted() {
  return (
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      {/* Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/docs" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                SwiftAPI
              </span>
              <span className="ml-3 text-sm text-gray-500">Docs / Getting Started</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition text-sm">
                Home
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900 transition text-sm">
                Docs
              </Link>
              <Link href="/login" className="btn-primary text-sm">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Getting Started with SwiftAPI</h1>
        <p className="text-xl text-gray-600 mb-8">
          Learn how to integrate SwiftAPI into your AI agent in under 10 minutes.
        </p>

        {/* Step 1 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">1</span>
            Create Your Account
          </h2>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 mb-4">
              Visit <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-medium">https://swiftapi.ai/signup</Link> and create your account.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2"><strong>Required information:</strong></p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Email address</li>
                <li>• Password (minimum 8 characters)</li>
                <li>• Agree to Terms of Service</li>
              </ul>
            </div>
            <p className="text-gray-700">
              You'll be automatically enrolled in the <strong>Free tier</strong> which includes
              1,000 API calls per month at no cost.
            </p>
          </div>
        </section>

        {/* Step 2 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">2</span>
            Generate Your API Key
          </h2>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 mb-4">
              After logging in, navigate to the <strong>API Keys</strong> section in your dashboard.
            </p>
            <ol className="space-y-3 text-gray-700 mb-4">
              <li className="flex items-start">
                <span className="font-semibold mr-2">1.</span>
                <span>Click "Create API Key"</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">2.</span>
                <span>Give your key a descriptive name (e.g., "Production Key")</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">3.</span>
                <span>Click "Generate"</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">4.</span>
                <span><strong>Important:</strong> Copy and save your API key immediately - you won't be able to see it again!</span>
              </li>
            </ol>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-900 mb-1">🔒 Security Best Practices</p>
              <ul className="text-sm text-yellow-800 space-y-1 ml-4">
                <li>• Never commit API keys to version control</li>
                <li>• Store keys in environment variables</li>
                <li>• Rotate keys periodically</li>
                <li>• Use different keys for development and production</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 3 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">3</span>
            Install the SDK
          </h2>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 mb-4">Choose your preferred language:</p>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Python</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>pip install swiftapi</code>
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">TypeScript / JavaScript</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>npm install @swiftapi/sdk</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Step 4 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">4</span>
            Make Your First Request
          </h2>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 mb-4">Initialize the client and test the connection:</p>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Python Example</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`from swiftapi import SwiftAPI

# Initialize with your API key
client = SwiftAPI(api_key="sk_your_api_key_here")

# Test the connection
user = client.get_current_user()
print(f"Connected as: ${'{'} user.email ${'}'}")
print(f"Current tier: ${'{'} user.tier ${'}'}")

# Check your usage
usage = client.get_usage()
print(f"API calls this month: ${'{'} usage.calls.month ${'}'}")
print(f"Rate limit: ${'{'} usage.rate_limits.minute_remaining ${'}'} calls/min remaining")`}</code>
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">TypeScript Example</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`import { SwiftAPI } from '@swiftapi/sdk';

// Initialize with your API key
const client = new SwiftAPI({
  apiKey: process.env.SWIFTAPI_KEY
});

// Test the connection
const user = await client.getCurrentUser();
console.log(\`Connected as: \$\{user.email\}\`);
console.log(\`Current tier: \$\{user.tier\}\`);

// Check your usage
const usage = await client.getUsage();
console.log(\`API calls this month: \$\{usage.calls.month\}\`);
console.log(\`Rate limit: \$\{usage.rate_limits.minute_remaining\} calls/min\`);`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Step 5 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">5</span>
            Process Your First Payment
          </h2>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 mb-4">
              Here's how to charge a user for using your AI agent:
            </p>

            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-4">
              <code>{`# Process a $9.99 payment
transaction = client.create_payment(
    amount=9.99,
    currency="usd",
    metadata=${'{'}"user_id": "user_123", "service": "ai_analysis", "prompt_tokens": 1500${'}'}
)

print(f"Transaction ID: ${'{'} transaction.id ${'}'}")
print(f"Amount charged: $${'{'} transaction.amount ${'}'}")
print(f"SwiftAPI fee: $${'{'} transaction.fee_amount ${'}'}")
print(f"You receive: $${'{'} transaction.amount - transaction.fee_amount ${'}'}")
print(f"Status: ${'{'} transaction.status ${'}'}")`}</code>
            </pre>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">💡 How Fees Work</p>
              <p className="text-sm text-blue-800 mb-2">
                For a $9.99 transaction:
              </p>
              <ul className="text-sm text-blue-800 space-y-1 ml-4">
                <li>• 2% of $9.99 = $0.20</li>
                <li>• Per-call fee = $0.05</li>
                <li>• <strong>SwiftAPI charges: $0.05</strong> (the lesser amount)</li>
                <li>• <strong>You receive: $9.94</strong></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 6 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">6</span>
            Understand Your Costs
          </h2>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 mb-4">
              As a SwiftAPI customer, you pay two fees:
            </p>

            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">1. Monthly Subscription</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Based on how many API calls your application makes to SwiftAPI:
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white p-3 rounded border border-amber-300">
                    <div className="font-semibold">Free Tier</div>
                    <div className="text-gray-600">$0/month</div>
                    <div className="text-gray-500 text-xs mt-1">Up to 1,000 calls</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-amber-300">
                    <div className="font-semibold">Indie Tier</div>
                    <div className="text-gray-600">$49/month</div>
                    <div className="text-gray-500 text-xs mt-1">Up to 10,000 calls</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-amber-300">
                    <div className="font-semibold">Pro Tier</div>
                    <div className="text-gray-600">$199/month</div>
                    <div className="text-gray-500 text-xs mt-1">Up to 100,000 calls</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-amber-300">
                    <div className="font-semibold">Enterprise</div>
                    <div className="text-gray-600">$999/month</div>
                    <div className="text-gray-500 text-xs mt-1">Unlimited calls</div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">2. Transaction Fees</h3>
                <p className="text-sm text-gray-700 mb-2">
                  For every payment processed through SwiftAPI:
                </p>
                <div className="bg-white p-3 rounded border border-green-300">
                  <p className="font-semibold text-lg text-gray-900">
                    2% of transaction OR $0.05 per call
                  </p>
                  <p className="text-sm text-gray-600 mt-1">(Whichever is less)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 7 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">7</span>
            Set Up Webhooks (Optional)
          </h2>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 mb-4">
              Get notified when payments succeed, fail, or subscriptions change:
            </p>

            <ol className="space-y-3 text-gray-700 mb-4">
              <li className="flex items-start">
                <span className="font-semibold mr-2">1.</span>
                <span>Go to Dashboard → Settings → Webhooks</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">2.</span>
                <span>Add your endpoint URL (e.g., https://youragent.com/webhooks/swiftapi)</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">3.</span>
                <span>Select events to listen for:</span>
              </li>
            </ol>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• <code>payment.succeeded</code> - Payment completed successfully</li>
                <li>• <code>payment.failed</code> - Payment failed</li>
                <li>• <code>subscription.created</code> - New subscription</li>
                <li>• <code>subscription.updated</code> - Subscription tier changed</li>
                <li>• <code>subscription.cancelled</code> - Subscription ended</li>
              </ul>
            </div>

            <p className="text-sm text-gray-600">
              Example webhook handler code is available in the <Link href="/docs/webhooks" className="text-primary-600 hover:text-primary-700 font-medium">Webhooks documentation</Link>.
            </p>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎉 You're Ready to Go!</h2>
          <p className="text-gray-700 mb-6">
            You now have everything set up to start accepting payments and managing users through SwiftAPI.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/docs/sdk/python" className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary-500 transition">
              <h3 className="font-semibold text-gray-900 mb-1">Python SDK →</h3>
              <p className="text-sm text-gray-600">Full SDK reference with all methods</p>
            </Link>

            <Link href="/docs/sdk/typescript" className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary-500 transition">
              <h3 className="font-semibold text-gray-900 mb-1">TypeScript SDK →</h3>
              <p className="text-sm text-gray-600">Complete type definitions and examples</p>
            </Link>

            <Link href="/docs/examples" className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary-500 transition">
              <h3 className="font-semibold text-gray-900 mb-1">Code Examples →</h3>
              <p className="text-sm text-gray-600">Real-world integration patterns</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
