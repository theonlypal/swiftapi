'use client';

import { useState } from 'react';
import { Play, FileText, Pencil } from 'lucide-react';

interface JobCardMobileProps {
  job: {
    id: string;
    name: string;
    url: string;
    schedule: string;
    lastRun?: {
      ok: boolean;
      startedAt: Date;
      durationMs: number;
    } | null;
  };
}

export function JobCardMobile({ job }: JobCardMobileProps) {
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    try {
      await fetch(`/api/jobs/${job.id}/run`, { method: 'POST' });
      window.location.reload();
    } catch (error) {
      console.error('Run failed:', error);
    } finally {
      setRunning(false);
    }
  };

  const statusColor = job.lastRun
    ? job.lastRun.ok
      ? 'bg-green-500'
      : 'bg-red-500'
    : 'bg-gray-400';

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${statusColor}`} />
          <h3 className="font-semibold text-sm">{job.name}</h3>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {job.schedule}
        </span>
      </div>

      <p className="text-xs text-gray-600 mb-3 truncate">{job.url}</p>

      {job.lastRun && (
        <div className="text-xs text-gray-500 mb-3">
          Last: {new Date(job.lastRun.startedAt).toLocaleTimeString()} (
          {job.lastRun.durationMs}ms)
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleRun}
          disabled={running}
          className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white text-sm py-2 px-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <Play size={14} />
          {running ? 'Running...' : 'Run'}
        </button>
        <button className="flex items-center justify-center gap-1 border border-gray-300 text-gray-700 text-sm py-2 px-3 rounded hover:bg-gray-50">
          <FileText size={14} />
        </button>
        <button className="flex items-center justify-center gap-1 border border-gray-300 text-gray-700 text-sm py-2 px-3 rounded hover:bg-gray-50">
          <Pencil size={14} />
        </button>
      </div>
    </div>
  );
}
