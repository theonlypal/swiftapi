import Link from 'next/link';
import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function PricingDocs() {
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
              <span className="ml-3 text-sm text-gray-500">Docs / Pricing & Billing</span>
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing & Billing</h1>
        <p className="text-xl text-gray-600 mb-8">
          Complete breakdown of SwiftAPI costs and how billing works.
        </p>

        {/* Overview */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 border-2 border-amber-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Billing Overview</h2>
            <p className="text-gray-700 text-lg mb-4">
              SwiftAPI uses a two-part pricing model:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-amber-300">
                <h3 className="font-bold text-gray-900 mb-2">1. Monthly Subscription</h3>
                <p className="text-gray-700 text-sm">
                  Pay based on your API call volume tier (Free, Indie, Pro, Enterprise)
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-amber-300">
                <h3 className="font-bold text-gray-900 mb-2">2. Transaction Fees</h3>
                <p className="text-gray-700 text-sm">
                  2% or $0.05 per call (whichever is less) on payments processed
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Subscription Tiers */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Subscription Tiers</h2>

          <div className="space-y-6">
            {/* Free */}
            <div className="bg-white rounded-lg p-6 border-2 border-gray-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Free Tier</h3>
                  <p className="text-3xl font-bold text-primary-600 mt-2">$0<span className="text-lg text-gray-500">/month</span></p>
                </div>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  Perfect for Testing
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Included:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ 1,000 API calls per month</li>
                    <li>✓ 10 requests per minute</li>
                    <li>✓ 100 requests per hour</li>
                    <li>✓ Community support (GitHub)</li>
                    <li>✓ Full API access</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Transaction Fees:</p>
                  <p className="text-sm text-gray-600">2% or $0.05/call (whichever less)</p>
                  <p className="text-xs text-gray-500 mt-2">Same as all tiers</p>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                <strong>Best for:</strong> Prototyping, testing integrations, small side projects
              </div>
            </div>

            {/* Indie */}
            <div className="bg-white rounded-lg p-6 border-2 border-primary-500 relative">
              <div className="absolute -top-3 right-4 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Indie Tier</h3>
                  <p className="text-3xl font-bold text-primary-600 mt-2">$49<span className="text-lg text-gray-500">/month</span></p>
                </div>
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Included:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ 10,000 API calls per month</li>
                    <li>✓ 100 requests per minute</li>
                    <li>✓ 5,000 requests per hour</li>
                    <li>✓ Email support (24hr response)</li>
                    <li>✓ Usage analytics dashboard</li>
                    <li>✓ Custom API keys</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Transaction Fees:</p>
                  <p className="text-sm text-gray-600">2% or $0.05/call (whichever less)</p>
                  <p className="text-xs text-gray-500 mt-2">Process $24,500 to break even on subscription</p>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                <strong>Best for:</strong> Solo developers, indie hackers, early-stage startups
              </div>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-lg p-6 border-2 border-gray-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Pro Tier</h3>
                  <p className="text-3xl font-bold text-primary-600 mt-2">$199<span className="text-lg text-gray-500">/month</span></p>
                </div>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  High Volume
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Included:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✓ 100,000 API calls per month</li>
                    <li>✓ 500 requests per minute</li>
                    <li>✓ 50,000 requests per hour</li>
                    <li>✓ Priority email support (4hr response)</li>
                    <li>✓ Advanced analytics</li>
                    <li>✓ Dedicated account manager</li>
                    <li>✓ Custom rate limits</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Transaction Fees:</p>
                  <p className="text-sm text-gray-600">2% or $0.05/call (whichever less)</p>
                  <p className="text-xs text-gray-500 mt-2">Process $99,500 to break even on subscription</p>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                <strong>Best for:</strong> Growing startups, established products, high-traffic AI agents
              </div>
            </div>

            {/* Enterprise */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 border-2 border-gray-700 text-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold">Enterprise Tier</h3>
                  <p className="text-3xl font-bold text-yellow-400 mt-2">$999<span className="text-lg text-gray-300">/month</span></p>
                </div>
                <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  UNLIMITED
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold mb-2">Included:</p>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>✓ Unlimited API calls</li>
                    <li>✓ 5,000 requests per minute</li>
                    <li>✓ Unlimited requests per hour</li>
                    <li>✓ 24/7 phone support</li>
                    <li>✓ Custom integrations</li>
                    <li>✓ SLA guarantees (99.9% uptime)</li>
                    <li>✓ Dedicated infrastructure</li>
                    <li>✓ White-label options</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Transaction Fees:</p>
                  <p className="text-sm text-gray-300">2% or $0.05/call (whichever less)</p>
                  <p className="text-xs text-gray-400 mt-2">Custom pricing available for 7-figure volume</p>
                </div>
              </div>
              <div className="bg-yellow-400/10 p-3 rounded-lg text-sm text-yellow-200 border border-yellow-400/20">
                <strong>Best for:</strong> Large enterprises, high-scale platforms, mission-critical applications
              </div>
            </div>
          </div>
        </section>

        {/* Transaction Fees */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Transaction Fee Structure</h2>

          <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
            <div className="text-center mb-6">
              <p className="text-2xl font-bold text-gray-900 mb-2">
                2% of transaction amount OR $0.05 per API call
              </p>
              <p className="text-gray-600">(Whichever is less)</p>
            </div>

            <h3 className="font-bold text-gray-900 mb-4">Real-World Examples:</h3>

            <div className="space-y-4">
              {/* Example 1 */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">Small AI Query - $1.50</p>
                    <p className="text-sm text-gray-600">User pays for a quick AI analysis</p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                    Best Rate
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                  <div>
                    <p className="text-gray-600">2% fee: <span className="font-semibold">$0.03</span></p>
                    <p className="text-gray-600">Per-call fee: <span className="font-semibold">$0.05</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 font-bold">SwiftAPI takes: $0.03</p>
                    <p className="text-green-600 font-bold">You receive: $1.47</p>
                  </div>
                </div>
              </div>

              {/* Example 2 */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">Medium Service - $25</p>
                    <p className="text-sm text-gray-600">User pays for detailed AI report</p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                    Best Rate
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                  <div>
                    <p className="text-gray-600">2% fee: <span className="font-semibold">$0.50</span></p>
                    <p className="text-gray-600">Per-call fee: <span className="font-semibold">$0.05</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 font-bold">SwiftAPI takes: $0.05</p>
                    <p className="text-green-600 font-bold">You receive: $24.95</p>
                  </div>
                </div>
              </div>

              {/* Example 3 */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">Premium Service - $500</p>
                    <p className="text-sm text-gray-600">Enterprise AI solution</p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                    Best Rate
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                  <div>
                    <p className="text-gray-600">2% fee: <span className="font-semibold">$10.00</span></p>
                    <p className="text-gray-600">Per-call fee: <span className="font-semibold">$0.05</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 font-bold">SwiftAPI takes: $0.05</p>
                    <p className="text-green-600 font-bold">You receive: $499.95</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-1">💡 Key Insight</p>
              <p className="text-sm text-blue-800">
                For transactions over $2.50, you only pay $0.05 per call regardless of transaction size.
                This makes SwiftAPI extremely cost-effective for high-value AI services.
              </p>
            </div>
          </div>
        </section>

        {/* Monthly Cost Calculator */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Monthly Cost Examples</h2>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 mb-6">
              Here's what you'd pay monthly based on different usage scenarios:
            </p>

            <div className="space-y-6">
              {/* Scenario 1 */}
              <div className="border-l-4 border-primary-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">Scenario 1: Indie Developer</h3>
                <ul className="text-sm text-gray-600 space-y-1 mb-3">
                  <li>• 5,000 API calls per month</li>
                  <li>• Average transaction: $10</li>
                  <li>• Total revenue: $50,000/month</li>
                </ul>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-700">Subscription: <span className="font-bold">$49</span> (Indie tier)</p>
                  <p className="text-sm text-gray-700">Transaction fees: <span className="font-bold">$250</span> (5,000 × $0.05)</p>
                  <p className="text-sm text-gray-900 font-bold mt-2">Total SwiftAPI cost: $299/month</p>
                  <p className="text-sm text-green-600 font-bold">You keep: $49,701 (99.4% of revenue)</p>
                </div>
              </div>

              {/* Scenario 2 */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">Scenario 2: Growing Startup</h3>
                <ul className="text-sm text-gray-600 space-y-1 mb-3">
                  <li>• 75,000 API calls per month</li>
                  <li>• Average transaction: $25</li>
                  <li>• Total revenue: $1,875,000/month</li>
                </ul>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-700">Subscription: <span className="font-bold">$199</span> (Pro tier)</p>
                  <p className="text-sm text-gray-700">Transaction fees: <span className="font-bold">$3,750</span> (75,000 × $0.05)</p>
                  <p className="text-sm text-gray-900 font-bold mt-2">Total SwiftAPI cost: $3,949/month</p>
                  <p className="text-sm text-green-600 font-bold">You keep: $1,871,051 (99.8% of revenue)</p>
                </div>
              </div>

              {/* Scenario 3 */}
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-bold text-gray-900 mb-2">Scenario 3: Enterprise Platform</h3>
                <ul className="text-sm text-gray-600 space-y-1 mb-3">
                  <li>• 500,000 API calls per month</li>
                  <li>• Average transaction: $100</li>
                  <li>• Total revenue: $50,000,000/month</li>
                </ul>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-700">Subscription: <span className="font-bold">$999</span> (Enterprise tier)</p>
                  <p className="text-sm text-gray-700">Transaction fees: <span className="font-bold">$25,000</span> (500,000 × $0.05)</p>
                  <p className="text-sm text-gray-900 font-bold mt-2">Total SwiftAPI cost: $25,999/month</p>
                  <p className="text-sm text-green-600 font-bold">You keep: $49,974,001 (99.95% of revenue)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Billing Details */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Billing Details</h2>

          <div className="space-y-4">
            <details className="bg-white p-6 rounded-lg border border-gray-200">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                When are subscriptions billed?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                Subscriptions are billed monthly on the anniversary of your signup date. For example,
                if you upgrade to Pro on January 15th, you'll be billed on the 15th of every month.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-gray-200">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                When are transaction fees collected?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                Transaction fees are automatically deducted from each payment processed through SwiftAPI.
                The net amount (payment minus fee) is deposited to your connected bank account according
                to your payout schedule (daily, weekly, or monthly).
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-gray-200">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                What happens if I exceed my tier limit?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                If you exceed your monthly API call limit, your requests will be rate-limited until you
                upgrade to a higher tier. We'll send you email notifications at 80% and 95% of your limit
                so you can upgrade proactively.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-gray-200">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Can I change tiers mid-month?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                Yes! Upgrades are immediate and we prorate the difference. Downgrades take effect at the
                end of your current billing period. For example, if you upgrade from Indie ($49) to Pro
                ($199) halfway through the month, you'll pay $75 immediately (half of the $150 difference).
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-gray-200">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Are there any hidden fees?
              </summary>
              <p className="mt-3 text-gray-700 text-sm">
                No. The only costs are your monthly subscription and the 2%/$0.05 transaction fee (whichever
                is less). Stripe's payment processing fees are separate and deducted before your payout.
              </p>
            </details>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-xl mb-6 text-primary-100">
            Begin with the Free tier - no credit card required
          </p>
          <Link href="/signup" className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
            Create Free Account
          </Link>
        </section>
      </div>
    </div>
  );
}
