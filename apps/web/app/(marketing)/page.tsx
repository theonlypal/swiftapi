import { HeroDemo } from '@/components/HeroDemo';
import { Check } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="py-6 px-8 flex justify-between items-center">
        <div className="text-2xl font-bold">SwiftAPI Jobs</div>
        <a
          href="/api/auth/signin"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Start Free
        </a>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6">
            Monitor Your APIs
            <br />
            <span className="text-blue-600">On Autopilot</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Schedule API calls, validate responses, get instant alerts.
            Perfect for monitoring webhooks, health checks, and data pipelines.
          </p>
          <a
            href="/api/auth/signin"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Start Monitoring Free
          </a>
        </div>

        <HeroDemo />

        <div className="grid md:grid-cols-2 gap-8 mt-20">
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Free</h2>
            <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-500">/mo</span></div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <Check size={20} className="text-green-500" />
                <span>1 Job</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={20} className="text-green-500" />
                <span>15-minute intervals</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={20} className="text-green-500" />
                <span>7-day logs</span>
              </li>
            </ul>
            <a
              href="/api/auth/signin"
              className="block text-center bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200"
            >
              Get Started
            </a>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-lg shadow text-white">
            <h2 className="text-2xl font-bold mb-4">Pro</h2>
            <div className="text-4xl font-bold mb-6">$19<span className="text-lg opacity-75">/mo</span></div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <Check size={20} />
                <span>20 Jobs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={20} />
                <span>1-minute intervals</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={20} />
                <span>90-day logs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={20} />
                <span>Telegram alerts</span>
              </li>
            </ul>
            <a
              href="/api/auth/signin"
              className="block text-center bg-white text-blue-600 py-3 rounded-lg hover:bg-gray-100 font-semibold"
            >
              Start Pro Trial
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
