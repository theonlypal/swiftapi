import React from 'react';
import CodeBlock from '@/components/docs/CodeBlock';

export default function PaymentsApiReference() {
  const requestParameters = [
    {
      name: 'amount',
      type: 'integer',
      required: true,
      description: 'Payment amount in cents',
      example: 1000 // $10.00
    },
    {
      name: 'currency',
      type: 'string',
      required: false,
      description: 'Three-letter ISO currency code',
      default: '"usd"',
      example: '"usd"'
    },
    {
      name: 'metadata',
      type: 'object',
      required: false,
      description: 'Optional custom key-value pairs for additional context',
      example: '{ "order_id": "12345", "customer_note": "Gift purchase" }'
    }
  ];

  const responseFields = [
    {
      name: 'id',
      type: 'string',
      description: 'Unique identifier for the payment transaction',
      example: '"py_123456789"'
    },
    {
      name: 'amount',
      type: 'integer',
      description: 'Original payment amount in cents',
      example: 1000
    },
    {
      name: 'fee_amount',
      type: 'float',
      description: 'SwiftAPI processing fee (2% or $0.05, whichever is less)',
      example: 0.05
    },
    {
      name: 'currency',
      type: 'string',
      description: 'Currency code used for the transaction',
      example: '"usd"'
    },
    {
      name: 'status',
      type: 'string',
      description: 'Current status of the payment',
      example: '"succeeded"',
      possibleValues: ['"succeeded"', '"failed"', '"pending"']
    },
    {
      name: 'created_at',
      type: 'timestamp',
      description: 'Timestamp of payment creation (ISO 8601 format)',
      example: '"2025-10-23T15:30:45.123Z"'
    }
  ];

  const pythonExample = `
import swiftapi

client = swiftapi.Client(api_key='your_api_key')

try:
    payment = client.payments.create(
        amount=1000,  # $10.00
        currency='usd',
        metadata={
            'order_id': '12345',
            'customer_note': 'Gift purchase'
        }
    )
    print(payment.id)  # Payment transaction ID
except swiftapi.PaymentError as e:
    print(f"Payment failed: {e}")
`;

  const typescriptExample = `
import SwiftAPI from '@swiftapi/client';

const client = new SwiftAPI.Client('your_api_key');

try {
  const payment = await client.payments.create({
    amount: 1000,  // $10.00
    currency: 'usd',
    metadata: {
      order_id: '12345',
      customer_note: 'Gift purchase'
    }
  });
  console.log(payment.id);  // Payment transaction ID
} catch (error) {
  console.error('Payment failed', error);
}
`;

  const curlExample = `
# Process a payment
curl https://api.swiftapi.com/payments \\
  -X POST \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 1000,
    "currency": "usd",
    "metadata": {
      "order_id": "12345",
      "customer_note": "Gift purchase"
    }
  }'
`;

  const errorExamples = [
    {
      code: 400,
      type: 'invalid_amount',
      description: 'Amount must be a positive integer in cents',
      example: '{ "error": "invalid_amount", "message": "Amount must be greater than zero" }'
    },
    {
      code: 401,
      type: 'authentication_required',
      description: 'Missing or invalid API key',
      example: '{ "error": "authentication_required", "message": "No valid API key provided" }'
    },
    {
      code: 429,
      type: 'rate_limit_exceeded',
      description: 'Too many requests in a short period',
      example: '{ "error": "rate_limit_exceeded", "message": "Rate limit of 100 requests/minute exceeded" }'
    }
  ];

  const relatedEndpoints = [
    {
      name: 'GET /payments',
      description: 'Retrieve a list of past payment transactions'
    },
    {
      name: 'GET /payments/{id}',
      description: 'Retrieve details of a specific payment transaction'
    },
    {
      name: 'POST /refunds',
      description: 'Process a refund for a completed payment'
    }
  ];

  return (
    <div className="api-reference payments-endpoint">
      <h1>POST /payments</h1>
      <p className="endpoint-description">
        Process a payment with automatic 2% transaction fee, capped at $0.05.
      </p>

      <section className="authentication">
        <h2>Authentication</h2>
        <p>Requires a valid Bearer token in the Authorization header.</p>
      </section>

      <section className="request-parameters">
        <h2>Request Parameters</h2>
        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Type</th>
              <th>Required</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {requestParameters.map((param) => (
              <tr key={param.name}>
                <td>{param.name}</td>
                <td>{param.type}</td>
                <td>{param.required ? 'Yes' : 'No'}</td>
                <td>{param.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="fee-calculation">
        <h2>Fee Calculation</h2>
        <p>
          A 2% transaction fee is automatically applied, with a maximum cap of $0.05.
          Examples:
          <ul>
            <li>$10.00 payment: Fee = $0.20 (2%)</li>
            <li>$3.00 payment: Fee = $0.05 (capped)</li>
            <li>$500.00 payment: Fee = $0.05 (capped)</li>
          </ul>
        </p>
      </section>

      <section className="code-examples">
        <h2>Code Examples</h2>
        <div className="example-tabs">
          <CodeBlock
            language="python"
            title="Python"
            code={pythonExample}
          />
          <CodeBlock
            language="typescript"
            title="TypeScript"
            code={typescriptExample}
          />
          <CodeBlock
            language="bash"
            title="cURL"
            code={curlExample}
          />
        </div>
      </section>

      <section className="response-fields">
        <h2>Response Fields</h2>
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {responseFields.map((field) => (
              <tr key={field.name}>
                <td>{field.name}</td>
                <td>{field.type}</td>
                <td>{field.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="error-handling">
        <h2>Error Responses</h2>
        {errorExamples.map((error) => (
          <div key={error.code} className="error-block">
            <h3>{error.code}: {error.type}</h3>
            <p>{error.description}</p>
            <CodeBlock
              language="json"
              code={JSON.stringify(JSON.parse(error.example), null, 2)}
            />
          </div>
        ))}
      </section>

      <section className="related-endpoints">
        <h2>Related Endpoints</h2>
        <ul>
          {relatedEndpoints.map((endpoint) => (
            <li key={endpoint.name}>
              <strong>{endpoint.name}</strong>: {endpoint.description}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}