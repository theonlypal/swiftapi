import { JobsListMobile } from '@/components/JobsListMobile';
import { RefreshCcw } from 'lucide-react';

export const revalidate = 0; // no cache

export default async function MobilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[480px] mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">SwiftAPI Jobs</h1>
          <button
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <RefreshCcw size={20} />
          </button>
        </div>

        <JobsListMobile />
      </div>
    </div>
  );
}
