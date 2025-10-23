import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { CodeBlock } from '@/components/CodeBlock';
import { DocumentationLayout } from '@/components/DocumentationLayout';

export default function PythonSDKDocumentation() {
  return (
    <DocumentationLayout>
      <Head>
        <title>Swift API - Python SDK Documentation</title>
        <meta name="description" content="Comprehensive guide to using the Swift API Python SDK" />
      </Head>

      <div className="prose prose-invert max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Swift API Python SDK</h1>

        {/* 1. SDK Overview */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p>
            The Swift API Python SDK provides a powerful, intuitive interface for
            integrating payment, subscription, and API key management functionality
            into your Python applications. Designed for simplicity and flexibility,
            the SDK supports both synchronous and asynchronous operations.
          </p>
        </section>

        {/* 2. Installation */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Installation</h2>
          <CodeBlock language="bash">
            {`pip install swiftapi`}
          </CodeBlock>

          <h3 className="text-xl font-medium mt-4">Compatibility</h3>
          <ul className="list-disc pl-5">
            <li>Python 3.8+</li>
            <li>pip 19.0+</li>
          </ul>

          <h3 className="text-xl font-medium mt-4">Troubleshooting</h3>
          <CodeBlock language="bash">
            {`# If you encounter installation issues
pip install --upgrade pip
pip install swiftapi --upgrade

# For virtual environment
python -m venv swiftapi_env
source swiftapi_env/bin/activate  # On Windows: swiftapi_env\\Scripts\\activate
pip install swiftapi`}
          </CodeBlock>
        </section>

        {/* 3. Authentication */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
          <CodeBlock language="python">
            {`from swiftapi import SwiftAPI

# Initialize with your API key
client = SwiftAPI(api_key='your_api_key_here')

# Optional: Configure environment (default is production)
client = SwiftAPI(
    api_key='your_api_key',
    environment='sandbox'  # Use 'production' for live transactions
)`}
          </CodeBlock>
        </section>

        {/* 4. Quick Example */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Example: Create a Payment</h2>
          <CodeBlock language="python">
            {`# Create a simple payment
payment = client.payments.create(
    amount=100.00,
    currency='USD',
    description='Product Purchase',
    customer_email='user@example.com'
)

print(payment.id)  # Prints the payment transaction ID`}
          </CodeBlock>
        </section>

        {/* 5. Available Methods */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Available Methods</h2>

          <h3 className="text-xl font-medium">Payments</h3>
          <CodeBlock language="python">
            {`# Create a payment
payment = client.payments.create(
    amount=50.00,
    currency='USD',
    payment_method='credit_card'
)

# List recent payments
recent_payments = client.payments.list(
    limit=10,
    status='completed'
)`}
          </CodeBlock>

          <h3 className="text-xl font-medium mt-4">Subscriptions</h3>
          <CodeBlock language="python">
            {`# Create a subscription
subscription = client.subscriptions.create(
    plan_id='pro_monthly',
    customer_email='user@example.com'
)

# Cancel a subscription
client.subscriptions.cancel(subscription.id)`}
          </CodeBlock>

          <h3 className="text-xl font-medium mt-4">API Keys</h3>
          <CodeBlock language="python">
            {`# Create a new API key
new_key = client.api_keys.create(
    name='Backend Service',
    permissions=['payments:read', 'subscriptions:write']
)

# List existing API keys
api_keys = client.api_keys.list()`}
          </CodeBlock>
        </section>

        {/* 6. Error Handling */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Error Handling</h2>
          <CodeBlock language="python">
            {`from swiftapi.exceptions import (
    AuthenticationError,
    InvalidRequestError,
    RateLimitError
)

try:
    payment = client.payments.create(amount=-100)
except InvalidRequestError as e:
    print(f"Invalid request: {e}")
    # Handle specific validation errors
except AuthenticationError:
    print("Invalid API credentials")
except RateLimitError:
    print("Too many requests. Please try again later.")`}
          </CodeBlock>
        </section>

        {/* 7. Advanced Features */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Advanced Features</h2>

          <h3 className="text-xl font-medium">Async Support</h3>
          <CodeBlock language="python">
            {`import asyncio
from swiftapi import AsyncSwiftAPI

async def async_payment():
    async_client = AsyncSwiftAPI(api_key='your_key')
    payment = await async_client.payments.create(
        amount=100.00,
        currency='USD'
    )
    return payment

# In an async context
result = asyncio.run(async_payment())`}
          </CodeBlock>

          <h3 className="text-xl font-medium mt-4">Retry Mechanism</h3>
          <CodeBlock language="python">
            {`# Configurable retry strategy
client = SwiftAPI(
    api_key='your_key',
    max_retries=3,  # Number of retries
    retry_delay=1   # Delay between retries (seconds)
)`}
          </CodeBlock>
        </section>

        {/* 8. Best Practices */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
          <ul className="list-disc pl-5">
            <li>Always use environment variables for API keys</li>
            <li>Handle exceptions gracefully</li>
            <li>Use async methods for better performance in I/O-bound applications</li>
            <li>Implement proper logging for tracking API interactions</li>
            <li>Keep your SDK updated to the latest version</li>
          </ul>
        </section>

        {/* Links to Full Documentation */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
          <p>
            <Link
              href="/docs/api-reference"
              className="text-blue-500 hover:underline"
            >
              → View Full API Reference
            </Link>
          </p>
        </section>
      </div>
    </DocumentationLayout>
  );
}