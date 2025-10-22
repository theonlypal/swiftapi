import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { User, Usage } from '@/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, usageData] = await Promise.all([
          api.getCurrentUser(),
          api.getUsage(),
        ]);
        setUser(userData);
        setUsage(usageData);
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  const tierLimits = {
    free: 1000,
    indie: 10000,
    pro: 100000,
    enterprise: Infinity,
  };

  const tierNames = {
    free: 'Free',
    indie: 'Indie',
    pro: 'Pro',
    enterprise: 'Enterprise',
  };

  const usagePercentage = user && usage
    ? (usage.calls.month / tierLimits[user.tier]) * 100
    : 0;

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="text-sm font-medium text-gray-500">Current Tier</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">
              {user && tierNames[user.tier]}
            </div>
          </div>

          <div className="card">
            <div className="text-sm font-medium text-gray-500">API Calls Today</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">
              {usage?.calls.today.toLocaleString() || 0}
            </div>
          </div>

          <div className="card">
            <div className="text-sm font-medium text-gray-500">API Calls This Month</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">
              {usage?.calls.month.toLocaleString() || 0}
            </div>
          </div>

          <div className="card">
            <div className="text-sm font-medium text-gray-500">Monthly Volume</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">
              ${user?.monthly_volume.toFixed(2) || 0}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Usage This Month</h3>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-500">
                {usage?.calls.month.toLocaleString()} / {user && tierLimits[user.tier] === Infinity ? '∞' : tierLimits[user.tier].toLocaleString()} calls
              </span>
              <span className="font-medium text-gray-900">
                {usagePercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rate Limits</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Per Minute</span>
                  <span className="font-medium text-gray-900">
                    {usage?.rate_limits.minute_remaining || 0} remaining
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Per Hour</span>
                  <span className="font-medium text-gray-900">
                    {usage?.rate_limits.hour_remaining || 0} remaining
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Getting Started</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600 font-semibold">
                    1
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">Create an API Key</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Generate your first API key to start making requests to SwiftAPI.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600 font-semibold">
                    2
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">Read the Documentation</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Learn how to integrate SwiftAPI with your AI agents and applications.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600 font-semibold">
                    3
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">Start Building</h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Use our SDKs to integrate payments, billing, and identity into your AI agents.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
