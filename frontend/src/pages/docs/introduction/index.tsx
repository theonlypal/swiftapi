import React, { useState } from 'react';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

const FeatureCard: React.FC<{
  title: string,
  description: string,
  icon: React.ReactNode
}> = ({ title, description, icon }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-3 hover:bg-white/10 transition-all duration-300">
    <div className="text-2xl text-blue-400">{icon}</div>
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const CodeTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'python' | 'typescript'>('python');

  const pythonCode = `from swiftapi import SwiftAPI

api = SwiftAPI(api_key='your_api_key')
payment = api.payments.create(
    amount=100,  # USD cents
    agent_id='agent_123'
)`;

  const typescriptCode = `import { SwiftAPI } from '@swiftapi/client';

const api = new SwiftAPI('your_api_key');
const payment = await api.payments.create({
    amount: 100,  // USD cents
    agentId: 'agent_123'
});`;

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('python')}
          className={`px-4 py-2 ${activeTab === 'python'
            ? 'bg-white/10 text-white'
            : 'text-gray-500 hover:text-white'}`}
        >
          Python
        </button>
        <button
          onClick={() => setActiveTab('typescript')}
          className={`px-4 py-2 ${activeTab === 'typescript'
            ? 'bg-white/10 text-white'
            : 'text-gray-500 hover:text-white'}`}
        >
          TypeScript
        </button>
      </div>
      <pre className="p-4 text-sm text-white font-mono overflow-x-auto">
        <code>{activeTab === 'python' ? pythonCode : typescriptCode}</code>
      </pre>
    </div>
  );
};

export default function DocsIntroduction() {
  const features = [
    {
      title: 'Simple Pricing',
      description: '2% fee or $0.05/call, whichever is less',
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.024-.879-1.024-2.303 0-3.182s2.683-.879 3.707 0l.293.261V6" />
      </svg>
    },
    {
      title: 'AI-First Design',
      description: 'Optimized infrastructure for AI agent payments',
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    },
    {
      title: 'Instant Settlement',
      description: 'Real-time payment processing and transfers',
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    },
    {
      title: 'Complete API Coverage',
      description: '10 comprehensive REST endpoints',
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m-16.5 0v-1.5c0-.621.504-1.125 1.125-1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12c.621 0 1.125.504 1.125 1.125M12 15.375v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125m0 0c.621 0 1.125.504 1.125 1.125M11.25 16.5c0-.621.504-1.125 1.125-1.125M12 15.375c0-.621.504-1.125 1.125-1.125M12 15.375v2.25m0-3.375c0 .621-.504 1.125-1.125 1.125m0 0h7.5" />
      </svg>
    },
    {
      title: 'Production SDKs',
      description: 'Official libraries for major languages',
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    },
    {
      title: 'Developer-Friendly',
      description: 'Intuitive APIs with comprehensive documentation',
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 0c.233.046.458.11.676.192m-7.5 0A9.06 9.06 0 0 0 6.75 6.75M12 3v3.75m0 0a9.06 9.06 0 0 1 1.5.124m-1.5-.124a9.06 9.06 0 0 0-1.5.124M12 3v3.75c0 .621.504 1.125 1.125 1.125M12 3v3.75c0 .621-.504 1.125-1.125 1.125m0 0h7.5c.621 0 1.125.504 1.125 1.125v3.375" />
      </svg>
    }
  ];

  return (
    <div className={`${inter.className} bg-gray-950 min-h-screen text-white`}>
      <Head>
        <title>SwiftAPI - Payment Infrastructure for AI Agents</title>
        <meta name="description" content="Seamless payment solutions for AI-driven platforms" />
      </Head>

      <main className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Payment Infrastructure for AI Agents
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            SwiftAPI provides a powerful, scalable payment platform designed specifically for AI-driven applications,
            enabling seamless financial transactions with unprecedented simplicity and efficiency.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/docs/quickstart"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/pricing"
              className="border border-white/20 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </section>

        {/* Code Example */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Start Accepting Payments in Minutes</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Our intuitive SDKs make integrating payments as simple as three lines of code.
            </p>
          </div>
          <CodeTabs />
        </section>

        {/* Architecture Overview */}
        <section className="mb-16 bg-gray-900 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Architecture Overview</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Scalable Infrastructure</h3>
              <p className="text-gray-400">
                Built on a microservices architecture with global edge caching,
                designed to handle high-volume, low-latency transactions for AI agents.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Multi-Tier Support</h3>
              <p className="text-gray-400">
                Flexible subscription model with four tiers: FREE, INDIE, PRO, and ENTERPRISE,
                catering to developers and businesses of all sizes.
              </p>
            </div>
          </div>
        </section>

        {/* Next Steps CTA */}
        <section className="text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl py-16">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Payments?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Join hundreds of innovative AI platforms leveraging SwiftAPI's cutting-edge payment infrastructure.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/docs/quickstart"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="border border-white/20 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-8 text-center text-gray-500">
        <p>&copy; 2025 SwiftAPI. All rights reserved.</p>
      </footer>
    </div>
  );
}