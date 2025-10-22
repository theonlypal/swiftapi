'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Job {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

interface LogEntry {
  timestamp: string;
  message: string;
  level: 'info' | 'error' | 'success';
}

export default function LogsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      fetchLogs(selectedJob);
    }
  }, [selectedJob]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
        if (data.length > 0) {
          setSelectedJob(data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async (jobId: string) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/logs`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch logs', error);
    }
  };

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
            <Link href="/account" className="text-neutral-600 hover:text-neutral-900">
              Account
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">Execution Logs</h1>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-neutral-500">Loading...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 mb-4">No executions yet</p>
            <Link
              href="/m"
              className="inline-block bg-neutral-900 text-white px-6 py-3 rounded font-medium hover:bg-neutral-800"
            >
              Execute Your First Command
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Jobs</h2>
              <div className="space-y-2">
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJob(job.id)}
                    className={`w-full text-left p-4 rounded border ${
                      selectedJob === job.id
                        ? 'border-neutral-900 bg-neutral-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <p className="font-medium text-neutral-900 mb-1">{job.name}</p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          job.status === 'success'
                            ? 'bg-green-500'
                            : job.status === 'error'
                            ? 'bg-red-500'
                            : 'bg-neutral-400'
                        }`}
                      />
                      <span className="text-xs text-neutral-500">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="border border-neutral-200 rounded-lg">
                <div className="border-b border-neutral-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-neutral-900">Live Logs</h2>
                </div>
                <div className="p-6 bg-neutral-50 font-mono text-sm max-h-[600px] overflow-y-auto">
                  {logs.length === 0 ? (
                    <p className="text-neutral-500">No logs available for this job</p>
                  ) : (
                    <div className="space-y-1">
                      {logs.map((log, index) => (
                        <div
                          key={index}
                          className={`${
                            log.level === 'error'
                              ? 'text-red-600'
                              : log.level === 'success'
                              ? 'text-green-600'
                              : 'text-neutral-700'
                          }`}
                        >
                          <span className="text-neutral-400">
                            [{log.timestamp}]
                          </span>{' '}
                          {log.message}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
