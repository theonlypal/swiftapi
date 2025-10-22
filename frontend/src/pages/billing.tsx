import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { User, TierEnum } from '@/types';

export default function Billing() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.getCurrentUser();
        setUser(data);
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleUpgrade = async (tier: TierEnum) => {
    setUpgrading(true);
    try {
      const result = await api.createSubscription(tier);
      if (result.client_secret) {
        window.location.href = `https://checkout.stripe.com/pay/${result.client_secret}`;
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error('Upgrade failed', err);
    } finally {
      setUpgrading(false);
    }
  };

  const tiers = [
    {
      name: 'Free',
      tier: TierEnum.FREE,
      price: 0,
      calls: '1,000',
      features: [
        '1,000 API calls/month',
        '10 requests/minute',
        '100 requests/hour',
        'Basic support',
      ],
    },
    {
      name: 'Indie',
      tier: TierEnum.INDIE,
      price: 49,
      calls: '10,000',
      features: [
        '10,000 API calls/month',
        '100 requests/minute',
        '5,000 requests/hour',
        'Email support',
        'Usage analytics',
      ],
    },
    {
      name: 'Pro',
      tier: TierEnum.PRO,
      price: 199,
      calls: '100,000',
      features: [
        '100,000 API calls/month',
        '500 requests/minute',
        '50,000 requests/hour',
        'Priority support',
        'Advanced analytics',
        'Dedicated account manager',
      ],
    },
    {
      name: 'Enterprise',
      tier: TierEnum.ENTERPRISE,
      price: 999,
      calls: 'Unlimited',
      features: [
        'Unlimited API calls',
        '5,000 requests/minute',
        'Unlimited requests/hour',
        '24/7 phone support',
        'Custom integrations',
        'SLA guarantees',
        'Dedicated infrastructure',
      ],
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Billing & Subscriptions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Choose the plan that works best for your needs
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {tiers.map((plan) => {
            const isCurrentTier = user?.tier === plan.tier;
            const isDowngrade = user && tiers.findIndex(t => t.tier === user.tier) > tiers.findIndex(t => t.tier === plan.tier);

            return (
              <div
                key={plan.tier}
                className={`card ${
                  isCurrentTier ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                {isCurrentTier && (
                  <div className="absolute top-0 right-0 -mt-3 -mr-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-500 text-white">
                      Current Plan
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline justify-center">
                    <span className="text-4xl font-extrabold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{plan.calls} calls/month</p>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-primary-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-3 text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  {isCurrentTier ? (
                    <button className="btn-secondary w-full" disabled>
                      Current Plan
                    </button>
                  ) : isDowngrade ? (
                    <button
                      onClick={() => handleUpgrade(plan.tier)}
                      className="btn-secondary w-full"
                      disabled={upgrading}
                    >
                      {upgrading ? 'Processing...' : 'Downgrade'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan.tier)}
                      className="btn-primary w-full"
                      disabled={upgrading}
                    >
                      {upgrading ? 'Processing...' : 'Upgrade'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Fees</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Payment Processing Fee</span>
              <span className="text-sm font-medium text-gray-900">2% or $0.05 per call (whichever is less)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Payout Schedule</span>
              <span className="text-sm font-medium text-gray-900">Weekly</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Minimum Payout</span>
              <span className="text-sm font-medium text-gray-900">$10</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
