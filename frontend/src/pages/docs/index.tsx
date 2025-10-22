import Link from 'next/link';
import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function DocsHome() {
  return (
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      {/* Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                SwiftAPI
              </span>
              <span className="ml-3 text-sm text-gray-500">Documentation</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition">
                Home
              </Link>
              <Link href="/login" className="btn-primary text-sm">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-b from-primary-50 to-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            SwiftAPI Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Complete guide to building and monetizing AI agents with SwiftAPI.
            Accept payments, manage subscriptions, and track usage with a single API.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* What is SwiftAPI */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What is SwiftAPI?</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-4">
              SwiftAPI is a unified infrastructure platform for AI agent developers. Instead of
              building payment processing, subscription management, API key authentication, and
              usage tracking from scratch, you integrate SwiftAPI and get everything in one API.
            </p>
            <p className="text-gray-700 mb-4">
              We handle the complex infrastructure so you can focus on building amazing AI agents.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign Up & Choose Plan</h3>
              <p className="text-gray-600">
                Create your account and select a subscription tier based on your usage needs:
                Free (1K calls), Indie ($49/mo), Pro ($199/mo), or Enterprise ($999/mo).
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Integrate Our SDK</h3>
              <p className="text-gray-600">
                Install our Python or TypeScript SDK and add your API key. Start processing
                payments, creating subscriptions, and tracking usage in just 5 lines of code.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-pink-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">We Collect Fees</h3>
              <p className="text-gray-600">
                For every payment your AI agent processes, we automatically capture our platform
                fee (2% of transaction OR $0.05 per call, whichever is less). You keep the rest.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Model Explained */}
        <section className="mb-16 bg-amber-50 border-2 border-amber-200 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">💰 Pricing Model Explained</h2>
          <div className="space-y-4 text-gray-700">
            <p className="text-lg font-semibold">You pay SwiftAPI in two ways:</p>

            <div className="bg-white p-6 rounded-lg border border-amber-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Monthly Subscription</h3>
              <p className="mb-2">Based on your API call volume:</p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Free:</strong> $0/month for 1,000 API calls</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Indie:</strong> $49/month for 10,000 API calls</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Pro:</strong> $199/month for 100,000 API calls</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  <span><strong>Enterprise:</strong> $999/month for unlimited API calls</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg border border-amber-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Transaction Fees</h3>
              <p className="mb-3">For every payment processed through SwiftAPI:</p>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-300 mb-3">
                <p className="text-lg font-bold text-gray-900">
                  2% of transaction amount OR $0.05 per API call (whichever is less)
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Example 1: Large Transaction</p>
                  <p className="text-sm">Your user pays $1,000 through your AI agent</p>
                  <ul className="text-sm ml-4 mt-1 space-y-1">
                    <li>→ 2% fee = $20</li>
                    <li>→ Per-call fee = $0.05</li>
                    <li className="font-semibold text-primary-600">→ We charge: $0.05 (the lesser amount)</li>
                    <li className="font-semibold text-green-600">→ You receive: $999.95</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 mb-1">Example 2: Small Transaction</p>
                  <p className="text-sm">Your user pays $2 through your AI agent</p>
                  <ul className="text-sm ml-4 mt-1 space-y-1">
                    <li>→ 2% fee = $0.04</li>
                    <li>→ Per-call fee = $0.05</li>
                    <li className="font-semibold text-primary-600">→ We charge: $0.04 (the lesser amount)</li>
                    <li className="font-semibold text-green-600">→ You receive: $1.96</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
              <p className="font-semibold text-gray-900">
                💡 This means SwiftAPI is extremely cost-effective for high-volume applications
                while still being profitable for low-volume use cases.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Start Guides</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/docs/getting-started" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200 hover:border-primary-500 transition">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition">
                  Getting Started →
                </h3>
                <p className="text-gray-600">
                  Create your account, get your API key, and make your first request in 5 minutes.
                </p>
              </div>
            </Link>

            <Link href="/docs/integration" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200 hover:border-primary-500 transition">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition">
                  Integration Guide →
                </h3>
                <p className="text-gray-600">
                  Step-by-step guide to integrate SwiftAPI into your AI agent application.
                </p>
              </div>
            </Link>

            <Link href="/docs/sdk/python" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200 hover:border-primary-500 transition">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition">
                  Python SDK →
                </h3>
                <p className="text-gray-600">
                  Complete reference for the SwiftAPI Python SDK with examples and best practices.
                </p>
              </div>
            </Link>

            <Link href="/docs/sdk/typescript" className="group">
              <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200 hover:border-primary-500 transition">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition">
                  TypeScript SDK →
                </h3>
                <p className="text-gray-600">
                  Complete reference for the SwiftAPI TypeScript SDK with full type definitions.
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Core Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Core Features</h2>
          <div className="space-y-4">
            <details className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <summary className="text-xl font-semibold text-gray-900 cursor-pointer">
                Payment Processing
              </summary>
              <div className="mt-4 text-gray-700 space-y-2">
                <p>Accept payments from your AI agent users using Stripe infrastructure:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Credit card payments (Visa, Mastercard, Amex, etc.)</li>
                  <li>ACH bank transfers</li>
                  <li>International payment methods</li>
                  <li>Automatic fee capture (2% or $0.05/call)</li>
                  <li>Instant payouts to your bank account</li>
                  <li>Full payment history and receipts</li>
                </ul>
              </div>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <summary className="text-xl font-semibold text-gray-900 cursor-pointer">
                Subscription Management
              </summary>
              <div className="mt-4 text-gray-700 space-y-2">
                <p>Create and manage recurring subscriptions for your users:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Monthly and annual billing cycles</li>
                  <li>Automatic proration on upgrades/downgrades</li>
                  <li>Trial periods and promotional pricing</li>
                  <li>Subscription lifecycle management (active, paused, cancelled)</li>
                  <li>Dunning management for failed payments</li>
                  <li>Customer portal for self-service</li>
                </ul>
              </div>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <summary className="text-xl font-semibold text-gray-900 cursor-pointer">
                API Key Authentication
              </summary>
              <div className="mt-4 text-gray-700 space-y-2">
                <p>Secure API access with industry-standard authentication:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>JWT tokens for user sessions</li>
                  <li>API keys for server-to-server communication</li>
                  <li>Rotating secrets and key revocation</li>
                  <li>Per-key usage tracking</li>
                  <li>IP whitelisting (Enterprise)</li>
                  <li>Webhook signature verification</li>
                </ul>
              </div>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <summary className="text-xl font-semibold text-gray-900 cursor-pointer">
                Usage Tracking & Analytics
              </summary>
              <div className="mt-4 text-gray-700 space-y-2">
                <p>Monitor and analyze your AI agent's performance:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Real-time API call counting</li>
                  <li>Per-user usage breakdown</li>
                  <li>Rate limiting by tier (10-5000 req/min)</li>
                  <li>Historical usage reports</li>
                  <li>Revenue analytics dashboard</li>
                  <li>Export data to CSV/JSON</li>
                </ul>
              </div>
            </details>
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Common Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered SaaS</h3>
              <p className="text-gray-600 mb-3">
                Build a subscription-based AI tool and let SwiftAPI handle billing, usage metering, and payments.
              </p>
              <code className="text-sm bg-gray-50 p-2 rounded block">
                client.create_subscription("pro", user_id)
              </code>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Pay-Per-Use AI Agents</h3>
              <p className="text-gray-600 mb-3">
                Charge users per AI interaction, image generation, or analysis request.
              </p>
              <code className="text-sm bg-gray-50 p-2 rounded block">
                client.create_payment(9.99, metadata={'{'}...{'}'})
              </code>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">API Marketplace</h3>
              <p className="text-gray-600 mb-3">
                Create a marketplace of AI capabilities where each API call is metered and billed.
              </p>
              <code className="text-sm bg-gray-50 p-2 rounded block">
                usage = client.get_usage()
              </code>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">White-Label AI Platform</h3>
              <p className="text-gray-600 mb-3">
                Build AI infrastructure for other companies and handle multi-tenant billing.
              </p>
              <code className="text-sm bg-gray-50 p-2 rounded block">
                client.create_api_key(customer_id)
              </code>
            </div>
          </div>
        </section>

        {/* Support */}
        <section className="bg-gray-100 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Community Support</h3>
              <p className="text-gray-600 text-sm mb-3">Free tier users can ask questions on GitHub Discussions.</p>
              <a href="https://github.com/theonlypal/swiftapi/discussions" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Visit GitHub →
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 text-sm mb-3">Indie and Pro users get 24-48 hour email support.</p>
              <a href="mailto:support@getswiftapi.com" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                support@getswiftapi.com →
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Priority Support</h3>
              <p className="text-gray-600 text-sm mb-3">Enterprise users get dedicated support and phone access.</p>
              <Link href="/signup" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Upgrade to Enterprise →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
