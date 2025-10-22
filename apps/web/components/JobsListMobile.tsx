import { JobCardMobile } from './JobCardMobile';

async function getJobs() {
  // Placeholder for server-side job fetching with session authentication
  return [];
}

export async function JobsListMobile() {
  const jobs = await getJobs();

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        <p>No executions yet.</p>
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
