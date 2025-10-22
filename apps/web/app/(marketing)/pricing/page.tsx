import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold text-neutral-900">
            SwiftAPI
          </Link>
          <Link
            href="/m"
            className="bg-neutral-900 text-white px-5 py-2 rounded hover:bg-neutral-800"
          >
            Try Free
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl font-bold mb-4 text-neutral-900">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-neutral-600">
            Choose the plan that fits your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="border border-neutral-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Free</h2>
            <div className="mb-6">
              <span className="text-5xl font-bold text-neutral-900">$0</span>
              <span className="text-neutral-600">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs mt-0.5">
                  ✓
                </span>
                <span className="text-neutral-700">2 executions per month</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs mt-0.5">
                  ✓
                </span>
                <span className="text-neutral-700">Basic command parsing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs mt-0.5">
                  ✓
                </span>
                <span className="text-neutral-700">7-day log retention</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs mt-0.5">
                  ✓
                </span>
                <span className="text-neutral-700">Email support</span>
              </li>
            </ul>
            <Link
              href="/m"
              className="block text-center bg-white text-neutral-900 px-6 py-3 rounded font-medium border border-neutral-300 hover:border-neutral-400"
            >
              Get Started
            </Link>
          </div>

          <div className="border-2 border-neutral-900 rounded-lg p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neutral-900 text-white px-4 py-1 rounded text-sm font-medium">
              Most Popular
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Pro</h2>
            <div className="mb-6">
              <span className="text-5xl font-bold text-neutral-900">$99</span>
              <span className="text-neutral-600">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs mt-0.5">
                  ✓
                </span>
                <span className="text-neutral-700">Unlimited executions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs mt-0.5">
                  ✓
                </span>
                <span className="text-neutral-700">Advanced AI parsing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs mt-0.5">
                  ✓
                </span>
                <span className="text-neutral-700">90-day log retention</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs mt-0.5">
                  ✓
                </span>
                <span className="text-neutral-700">Priority support</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs mt-0.5">
                  ✓
                </span>
                <span className="text-neutral-700">Production deployments</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs mt-0.5">
                  ✓
                </span>
                <span className="text-neutral-700">Live execution logs</span>
              </li>
            </ul>
            <Link
              href="/m"
              className="block text-center bg-neutral-900 text-white px-6 py-3 rounded font-medium hover:bg-neutral-800"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-neutral-500">
            All plans include secure execution, commit tracking, and basic analytics.
          </p>
        </div>
      </main>
    </div>
  );
}
