import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/');
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const isPro = subscription?.status === 'active';

  const jobCount = await prisma.job.count({
    where: { userId: session.user.id },
  });

  const runCount = await prisma.jobRun.count({
    where: { job: { userId: session.user.id } },
  });

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyRuns = await prisma.jobRun.count({
    where: {
      job: { userId: session.user.id },
      startedAt: {
        gte: new Date(currentYear, currentMonth, 1),
        lt: new Date(currentYear, currentMonth + 1, 1),
      },
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold text-neutral-900">
            SwiftAPI
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/m" className="text-neutral-600 hover:text-neutral-900">
              Execute
            </Link>
            <Link href="/logs" className="text-neutral-600 hover:text-neutral-900">
              Logs
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">Account</h1>

        <div className="space-y-6">
          <div className="border border-neutral-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Current Plan</h2>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-neutral-900">
                  {isPro ? 'Pro' : 'Free'}
                </p>
                <p className="text-neutral-600">
                  {isPro ? '$99/month' : '$0/month'}
                </p>
              </div>
              {!isPro && (
                <Link
                  href="/pricing"
                  className="bg-neutral-900 text-white px-6 py-3 rounded font-medium hover:bg-neutral-800"
                >
                  Upgrade to Pro
                </Link>
              )}
            </div>
            {isPro && subscription?.currentPeriodEnd && (
              <p className="text-sm text-neutral-500">
                Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="border border-neutral-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Usage</h2>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-neutral-500 mb-1">This Month</p>
                <p className="text-3xl font-bold text-neutral-900">{monthlyRuns}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  {isPro ? 'Unlimited' : `of 2 runs`}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Total Jobs</p>
                <p className="text-3xl font-bold text-neutral-900">{jobCount}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">All Time Runs</p>
                <p className="text-3xl font-bold text-neutral-900">{runCount}</p>
              </div>
            </div>
          </div>

          <div className="border border-neutral-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Account Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-500">Email</p>
                <p className="text-neutral-900">{session.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">User ID</p>
                <p className="text-neutral-900 font-mono text-sm">{session.user.id}</p>
              </div>
            </div>
          </div>

          {isPro && (
            <div className="border border-neutral-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Billing</h2>
              <p className="text-neutral-600 mb-4">
                Manage your subscription and billing information
              </p>
              <button
                onClick={async () => {
                  const res = await fetch('/api/stripe/portal', { method: 'POST' });
                  const { url } = await res.json();
                  window.location.href = url;
                }}
                className="bg-white text-neutral-900 px-6 py-3 rounded font-medium border border-neutral-300 hover:border-neutral-400"
              >
                Manage Subscription
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
