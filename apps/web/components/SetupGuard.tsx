'use client';

import { useEffect, useState } from 'react';

interface EnvCheck {
  key: string;
  present: boolean;
  description: string;
  category: 'critical' | 'optional';
}

// CRITICAL: App won't work at all without these
const CRITICAL_ENV_VARS = [
  { key: 'NEXTAUTH_SECRET', description: 'NextAuth.js secret for session encryption - authentication will fail' },
];

// OPTIONAL: Features will be disabled but app still works
const OPTIONAL_ENV_VARS = [
  { key: 'DATABASE_URL', description: 'Database connection string - app will run in demo mode without database' },
  { key: 'STRIPE_SECRET_KEY', description: 'Stripe secret key - billing features will be disabled' },
  { key: 'STRIPE_PRICE_ID', description: 'Stripe price ID - subscriptions will be unavailable' },
  { key: 'STRIPE_WEBHOOK_SECRET', description: 'Stripe webhook secret - webhook processing will be disabled' },
  { key: 'NEXT_PUBLIC_SITE_URL', description: 'Public site URL - will fallback to window.location.origin' },
  { key: 'GITHUB_TOKEN', description: 'GitHub personal access token - command execution will be disabled' },
  { key: 'GITHUB_OWNER', description: 'GitHub repository owner - command execution will be disabled' },
  { key: 'GITHUB_REPO', description: 'GitHub repository name - command execution will be disabled' },
  { key: 'GITHUB_BRANCH', description: 'GitHub branch name - command execution will be disabled' },
];

export function SetupGuard({ children }: { children: React.ReactNode }) {
  const [checks, setChecks] = useState<EnvCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [criticalMissing, setCriticalMissing] = useState(false);

  useEffect(() => {
    async function checkEnvVars() {
      try {
        const response = await fetch('/api/setup/check');
        const data = await response.json();

        const criticalResults = CRITICAL_ENV_VARS.map(({ key, description }) => ({
          key,
          description,
          present: data.env?.[key] === true,
          category: 'critical' as const,
        }));

        const optionalResults = OPTIONAL_ENV_VARS.map(({ key, description }) => ({
          key,
          description,
          present: data.env?.[key] === true,
          category: 'optional' as const,
        }));

        const allChecks = [...criticalResults, ...optionalResults];
        setChecks(allChecks);

        // Only block if CRITICAL vars are missing
        setCriticalMissing(criticalResults.some(check => !check.present));
      } catch (error) {
        console.error('Failed to check environment variables:', error);
        const criticalResults = CRITICAL_ENV_VARS.map(({ key, description }) => ({
          key,
          description,
          present: false,
          category: 'critical' as const,
        }));
        const optionalResults = OPTIONAL_ENV_VARS.map(({ key, description }) => ({
          key,
          description,
          present: false,
          category: 'optional' as const,
        }));
        setChecks([...criticalResults, ...optionalResults]);
        setCriticalMissing(true);
      } finally {
        setLoading(false);
      }
    }

    checkEnvVars();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Checking system configuration...</p>
        </div>
      </div>
    );
  }

  // Only BLOCK if critical vars are missing
  if (criticalMissing) {
    const missingCritical = checks.filter(check => check.category === 'critical' && !check.present);
    const presentVars = checks.filter(check => check.present);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6">
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h1 className="text-2xl font-bold text-white">Critical Setup Required</h1>
                  <p className="text-red-100 text-sm mt-1">
                    {missingCritical.length} critical environment variable{missingCritical.length !== 1 ? 's are' : ' is'} missing - app cannot start
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-300 text-sm leading-relaxed">
                  SwiftAPI requires critical environment variables to be configured before the application can run.
                  Please add the following missing variables to your <code className="bg-slate-800 px-2 py-1 rounded text-blue-400">.env.local</code> file.
                </p>
              </div>

              {/* Missing Critical Variables */}
              <div>
                <h2 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Missing Critical Variables ({missingCritical.length})
                </h2>
                <div className="space-y-3">
                  {missingCritical.map((check) => (
                    <div key={check.key} className="bg-red-950/30 border border-red-900/50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <code className="text-red-400 font-mono text-sm font-semibold">{check.key}</code>
                          <p className="text-slate-400 text-sm mt-1">{check.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Present Variables */}
              {presentVars.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Configured Variables ({presentVars.length})
                  </h2>
                  <div className="space-y-2">
                    {presentVars.map((check) => (
                      <div key={check.key} className="bg-green-950/30 border border-green-900/50 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <code className="text-green-400 font-mono text-sm">{check.key}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Setup Instructions */}
              <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Setup Instructions
                </h3>
                <ol className="text-slate-300 text-sm space-y-2 ml-7 list-decimal">
                  <li>Copy <code className="bg-slate-800 px-2 py-0.5 rounded text-blue-400">.env.example</code> to <code className="bg-slate-800 px-2 py-0.5 rounded text-blue-400">.env.local</code></li>
                  <li>Fill in the critical environment variables listed above</li>
                  <li>Restart the development server</li>
                  <li>This page will automatically redirect once all critical variables are configured</li>
                </ol>
              </div>

              {/* Refresh Button */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Check Again
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-slate-500 text-sm">
            <p>For more information, see the <code className="bg-slate-800 px-2 py-0.5 rounded">README.md</code> file</p>
          </div>
        </div>
      </div>
    );
  }

  // Show warning banner for missing optional vars, but allow site to load
  const missingOptional = checks.filter(check => check.category === 'optional' && !check.present);

  return (
    <>
      {missingOptional.length > 0 && (
        <div className="bg-yellow-900/30 border-b border-yellow-800/50 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-yellow-200">
                Some features are disabled due to missing environment variables
              </p>
              <p className="text-xs text-yellow-300 mt-1">
                Missing: {missingOptional.map(check => check.key).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
