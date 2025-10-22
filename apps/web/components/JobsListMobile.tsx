import { JobCardMobile } from './JobCardMobile';

async function getJobs() {
  // Server component - fetch jobs
  // In production, this would use proper session handling
  return [];
}

export async function JobsListMobile() {
  const jobs = await getJobs();

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No jobs yet. Create one from the dashboard!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job: any) => (
        <JobCardMobile key={job.id} job={job} />
      ))}
    </div>
  );
}
