import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/');
  }

  const jobs = await prisma.job.findMany({
    where: { userId: session.user.id },
    include: {
      runs: {
        orderBy: { startedAt: 'desc' },
        take: 1,
      },
    },
  });

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const isPro = subscription?.status === 'active';

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
          {!isPro && (
            <button
              onClick={async () => {
                const res = await fetch('/api/stripe/checkout', { method: 'POST' });
                const { url } = await res.json();
                window.location.href = url;
              }}
              className="bg-neutral-900 text-white px-6 py-2 rounded hover:bg-neutral-800"
            >
              Upgrade to Pro
            </button>
          )}
        </div>

        <div className="border border-neutral-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-neutral-900">
            Plan: {isPro ? 'Pro' : 'Free'}
          </h2>
          <p className="text-neutral-600">
            {isPro
              ? 'You have access to all Pro features.'
              : 'Upgrade to unlock unlimited executions and advanced features.'}
          </p>
        </div>

        <div className="border border-neutral-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-neutral-900">Your Jobs ({jobs.length})</h2>
          {jobs.length === 0 ? (
            <p className="text-neutral-500">No jobs yet. Create your first job.</p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job: any) => (
                <div key={job.id} className="border border-neutral-200 p-4 rounded">
                  <h3 className="font-semibold text-neutral-900">{job.name}</h3>
                  <p className="text-sm text-neutral-600">{job.url}</p>
                  <p className="text-xs text-neutral-500 mt-2">
                    Schedule: {job.schedule} | Status:{' '}
                    <span className={job.runs[0]?.ok ? 'text-green-600' : 'text-red-600'}>
                      {job.runs[0]?.ok ? 'Pass' : 'Fail'}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
