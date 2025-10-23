import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import CodeBlock from '@/components/CodeBlock';

const inter = Inter({ subsets: ['latin'] });

const LANGUAGES = ['TypeScript', 'Python', 'cURL'] as const;
type Language = typeof LANGUAGES[number];

export default function QuickstartGuide() {
  const [activeLanguage, setActiveLanguage] = useState<Language>('TypeScript');

  const installCommands = {
    TypeScript: 'npm install swiftapi',
    Python: 'pip install swiftapi',
    cURL: '# No installation needed for cURL'
  };

  const authExamples = {
    TypeScript: `import SwiftAPI from 'swiftapi';

const api = new SwiftAPI('YOUR_API_KEY');`,
    Python: `from swiftapi import SwiftAPI

api = SwiftAPI('YOUR_API_KEY')`,
    cURL: `curl https://api.swiftapi.com/v1/payments \\
  -H "Authorization: Bearer YOUR_API_KEY"`
  };

  const paymentExamples = {
    TypeScript: `const payment = await api.payments.create({
  amount: 100.00,  // $100 USD
  currency: 'USD',
  description: 'Product Purchase'
});

console.log(payment);
// Expected output:
// {
//   id: 'pay_123456',
//   status: 'completed',
//   amount: 100.00,
//   fee: 2.99
// }`,
    Python: `payment = api.payments.create(
    amount=100.00,  # $100 USD
    currency='USD',
    description='Product Purchase'
)

print(payment)
# Expected output:
# {
#   'id': 'pay_123456',
#   'status': 'completed',
#   'amount': 100.00,
#   'fee': 2.99
# }`,
    cURL: `curl -X POST https://api.swiftapi.com/v1/payments \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 100.00,
    "currency": "USD",
    "description": "Product Purchase"
  }'

# Expected response:
# {
#   "id": "pay_123456",
#   "status": "completed",
#   "amount": 100.00,
#   "fee": 2.99
# }`
  };

  return (
    <div className={`${inter.className} bg-white text-gray-900`}>
      <Head>
        <title>SwiftAPI Quickstart Guide</title>
        <meta name="description" content="Get started with SwiftAPI payments in under 5 minutes" />
      </Head>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">
          SwiftAPI Quickstart Guide
        </h1>

        <section className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">🚀 Overview</h2>
          <p className="text-lg mb-4">
            Welcome to SwiftAPI! This guide will help you process your first payment
            in just 30 seconds. We'll walk you through creating an account,
            getting your API key, and making your first transaction.
          </p>
          <div className="flex justify-center">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Create Free Account
            </Link>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Language Selection
          </h2>
          <div className="flex space-x-4 mb-4">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLanguage(lang)}
                className={`px-4 py-2 rounded-lg ${
                  activeLanguage === lang
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Step 1: Create Account
          </h2>
          <p className="mb-4">
            Sign up for a free SwiftAPI account to get started:
          </p>
          <Link
            href="/signup"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Create Account
          </Link>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Step 2: Get API Key
          </h2>
          <p className="mb-4">
            After creating your account, navigate to the Dashboard > API Keys
            section to generate your first API key.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <strong>Pro Tip:</strong> Keep your API key confidential and
            never expose it in client-side code or public repositories.
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Step 3: Install SDK
          </h2>
          <CodeBlock
            language="bash"
            code={installCommands[activeLanguage]}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Step 4: Authenticate
          </h2>
          <CodeBlock
            language={activeLanguage.toLowerCase()}
            code={authExamples[activeLanguage]}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Step 5: Make First Payment
          </h2>
          <CodeBlock
            language={activeLanguage.toLowerCase()}
            code={paymentExamples[activeLanguage]}
          />
          <div className="bg-green-50 p-4 rounded-lg mt-4">
            <strong>Fee Calculation:</strong> A standard 2.9% + $0.30 fee
            is applied to each transaction. In the $100 example,
            the fee would be $2.99.
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Step 6: View in Dashboard
          </h2>
          <p className="mb-4">
            All transactions are automatically logged in your SwiftAPI dashboard.
            Navigate to Transactions to view detailed payment information.
          </p>
        </section>

        <section className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Next Steps
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <Link
                href="/docs/api-reference"
                className="text-blue-600 hover:underline"
              >
                Explore Full API Reference
              </Link>
            </li>
            <li>
              <Link
                href="/docs/webhooks"
                className="text-blue-600 hover:underline"
              >
                Set Up Webhooks for Real-time Notifications
              </Link>
            </li>
            <li>
              <Link
                href="/support"
                className="text-blue-600 hover:underline"
              >
                Contact Support for Advanced Integration
              </Link>
            </li>
          </ul>
        </section>

        <div className="text-center mt-12">
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Start Free Trial
          </Link>
        </div>
      </main>

      <footer className="bg-gray-100 py-8 text-center">
        <p>
          &copy; {new Date().getFullYear()} SwiftAPI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}