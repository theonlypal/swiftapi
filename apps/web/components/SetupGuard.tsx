'use client';

import { useEffect, useState } from 'react';

interface EnvCheck {
  key: string;
  present: boolean;
  description: string;
}

const REQUIRED_ENV_VARS = [
  { key: 'NEXTAUTH_SECRET', description: 'NextAuth.js secret for session encryption' },
  { key: 'STRIPE_SECRET_KEY', description: 'Stripe secret key for payment processing' },
  { key: 'STRIPE_PRICE_ID', description: 'Stripe price ID for Pro plan subscription' },
  { key: 'STRIPE_WEBHOOK_SECRET', description: 'Stripe webhook secret for event verification' },
  { key: 'NEXT_PUBLIC_SITE_URL', description: 'Public site URL for redirects and callbacks' },
  { key: 'GITHUB_TOKEN', description: 'GitHub personal access token for API operations' },
  { key: 'GITHUB_OWNER', description: 'GitHub repository owner username or organization' },
  { key: 'GITHUB_REPO', description: 'GitHub repository name' },
  { key: 'GITHUB_BRANCH', description: 'GitHub branch name for commits' },
];

export function SetupGuard({ children }: { children: React.ReactNode }) {
  const [checks, setChecks] = useState<EnvCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [allPresent, setAllPresent] = useState(false);

  useEffect(() => {
    async function checkEnvVars() {
      try {
        const response = await fetch('/api/setup/check');
        const data = await response.json();

        const results = REQUIRED_ENV_VARS.map(({ key, description }) => ({
          key,
          description,
          present: data.env?.[key] === true,
        }));

        setChecks(results);
        setAllPresent(results.every(check => check.present));
      } catch (error) {
        console.error('Failed to check environment variables:', error);
        setChecks(REQUIRED_ENV_VARS.map(({ key, description }) => ({
          key,
          description,
          present: false,
        })));
        setAllPresent(false);
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

  if (!allPresent) {
    const missingVars = checks.filter(check => !check.present);
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
                  <h1 className="text-2xl font-bold text-white">Setup Required</h1>
                  <p className="text-red-100 text-sm mt-1">
                    {missingVars.length} environment variable{missingVars.length !== 1 ? 's are' : ' is'} missing
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-300 text-sm leading-relaxed">
                  SwiftAPI requires environment variables to be configured before the application can run.
                  Please add the following missing variables to your <code className="bg-slate-800 px-2 py-1 rounded text-blue-400">.env.local</code> file.
                </p>
              </div>

              {/* Missing Variables */}
              {missingVars.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Missing Variables ({missingVars.length})
                  </h2>
                  <div className="space-y-3">
                    {missingVars.map((check) => (
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
              )}

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
                  <li>Fill in all required environment variables listed above</li>
                  <li>Restart the development server</li>
                  <li>This page will automatically redirect once all variables are configured</li>
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

  return <>{children}</>;
}
