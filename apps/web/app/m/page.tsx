'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobilePage() {
  const [command, setCommand] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExecute = async (dryRun: boolean = false) => {
    setIsExecuting(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const res = await fetch('/api/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, dryRun }),
      });

      clearInterval(interval);
      setProgress(100);

      if (res.ok) {
        const data = await res.json();
        alert(dryRun ? 'Dry run complete' : 'Execution complete');
      }
    } catch (error) {
      clearInterval(interval);
      alert('Error executing command');
    } finally {
      setIsExecuting(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-neutral-200">
        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-lg font-semibold text-neutral-900">
            SwiftAPI
          </Link>
          <Link href="/logs" className="text-sm text-neutral-600 hover:text-neutral-900">
            Logs
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Execute Command</h1>

        <div className="space-y-6">
          <div>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Type your command..."
              className="w-full px-4 py-4 text-lg border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
              disabled={isExecuting}
            />
          </div>

          {isExecuting && (
            <div className="w-full bg-neutral-100 rounded overflow-hidden">
              <div
                className="h-2 bg-neutral-900 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => handleExecute(false)}
              disabled={!command || isExecuting}
              className="flex-1 bg-neutral-900 text-white px-6 py-3 rounded font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExecuting ? 'Executing...' : 'Execute'}
            </button>
            <button
              onClick={() => handleExecute(true)}
              disabled={!command || isExecuting}
              className="flex-1 bg-white text-neutral-900 px-6 py-3 rounded font-medium border border-neutral-300 hover:border-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Dry Run
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-neutral-200">
            <p className="text-sm text-neutral-500 text-center">
              Need to check your previous executions?{' '}
              <Link href="/logs" className="text-neutral-900 font-medium">
                View Logs
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
