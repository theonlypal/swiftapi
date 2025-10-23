import React from 'react';
import Link from 'next/link';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// Navigation Card Type
interface NavCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

// Navigation Card Component
const NavCard: React.FC<NavCardProps> = ({ title, description, href, icon }) => (
  <Link
    href={href}
    className="group block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all"
  >
    <div className="flex items-center mb-3">
      <div className="mr-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition">
        {title} →
      </h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </Link>
);

export default function DocsHome() {
  const navCards: NavCardProps[] = [
    {
      title: 'Introduction',
      description: 'Learn what SwiftAPI is and how it simplifies AI agent infrastructure.',
      href: '/docs/introduction',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: 'Quickstart',
      description: 'Get up and running with SwiftAPI in 5 minutes.',
      href: '/docs/quickstart',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: 'API Reference',
      description: 'Comprehensive documentation for all SwiftAPI endpoints.',
      href: '/docs/api-reference/payments/process',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      )
    },
    {
      title: 'Python SDK',
      description: 'Complete SDK reference for Python developers.',
      href: '/docs/sdks/python',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.979 6.476-5 7.775C6.817 19.567 9.713 21 13 21c3.193 0 6-1.397 6-3.636V8.91c0-2.474-1.845-4.423-4.265-4.423H8.48c-1.435 0-2.614-.986-2.614-2.247v-.383c0-.962.774-1.75 1.734-1.75H16" />
        </svg>
      )
    },
    {
      title: 'TypeScript SDK',
      description: 'Full SDK documentation with type definitions.',
      href: '/docs/sdks/typescript',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            SwiftAPI Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Streamline payments, subscriptions, and infrastructure for AI agents.
            One API to handle billing, authentication, and usage tracking.
          </p>

          {/* Search Bar Placeholder */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
              />
              <kbd className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-100 border border-gray-300 px-2 py-1 rounded text-xs text-gray-600">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Navigation Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {navCards.map((card, index) => (
              <NavCard key={index} {...card} />
            ))}
          </div>
        </div>
      </div>

      {/* Popular Topics & Recent Updates */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Popular Topics */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Popular Topics</h2>
            <div className="space-y-4">
              {[
                { title: 'Authentication Best Practices', href: '/docs/security/auth' },
                { title: 'Handling Payments in AI Agents', href: '/docs/payments/guide' },
                { title: 'Rate Limiting & Performance', href: '/docs/performance/rate-limits' },
                { title: 'Subscription Management', href: '/docs/billing/subscriptions' }
              ].map((topic, index) => (
                <Link
                  key={index}
                  href={topic.href}
                  className="block px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition"
                >
                  <span className="text-gray-900 font-medium">{topic.title} →</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Updates */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent Updates</h2>
            <div className="space-y-4">
              {[
                { version: 'v1.2.0', description: 'Added TypeScript SDK support', date: '2025-09-15' },
                { version: 'v1.1.5', description: 'Improved payment processing', date: '2025-08-22' },
                { version: 'v1.1.0', description: 'New API endpoint for subscriptions', date: '2025-07-10' }
              ].map((update, index) => (
                <div
                  key={index}
                  className="bg-white px-4 py-3 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-gray-900 mr-2">{update.version}</span>
                      <span className="text-gray-600 text-sm">{update.description}</span>
                    </div>
                    <span className="text-xs text-gray-500">{update.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Need Help?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Community Support',
                description: 'Free tier users can ask questions on GitHub Discussions.',
                linkText: 'Visit GitHub →',
                linkHref: 'https://github.com/theonlypal/swiftapi/discussions'
              },
              {
                title: 'Email Support',
                description: 'Indie and Pro users get 24-48 hour email support.',
                linkText: 'support@getswiftapi.com →',
                linkHref: 'mailto:support@getswiftapi.com'
              },
              {
                title: 'Priority Support',
                description: 'Enterprise users get dedicated support and phone access.',
                linkText: 'Upgrade to Enterprise →',
                linkHref: '/signup'
              }
            ].map((support, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{support.title}</h3>
                <p className="text-gray-600 mb-4">{support.description}</p>
                <Link
                  href={support.linkHref}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {support.linkText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}