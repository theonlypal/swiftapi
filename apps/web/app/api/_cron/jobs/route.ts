import { NextRequest, NextResponse } from 'next/server';
import { safeDb, isDatabaseAvailable } from '@/lib/prisma';
import { evaluate } from '@/lib/jsonpath';
import { sendAlert } from '@/lib/alerts';

const CRON_SECRET = process.env.CRON_SECRET || 'dev-secret';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if database is available
    if (!isDatabaseAvailable() || !safeDb) {
      console.warn('[Cron] Database not configured - skipping job execution');
      return NextResponse.json({
        executed: 0,
        results: [],
        message: 'Database not configured - no jobs to execute',
        demoMode: true
      });
    }

    // Select jobs to run based on schedule
    const now = new Date();
    const jobs = await safeDb.job.findMany({
      where: { paused: false },
      include: {
        runs: {
          orderBy: { startedAt: 'desc' },
          take: 1,
        },
      },
    });

    const dueJobs = jobs.filter((job: any) => {
      const lastRun = job.runs[0]?.startedAt || new Date(0);
      const minutesSinceLastRun = (now.getTime() - lastRun.getTime()) / 1000 / 60;

      switch (job.schedule) {
        case '1m':
          return minutesSinceLastRun >= 1;
        case '5m':
          return minutesSinceLastRun >= 5;
        case '15m':
          return minutesSinceLastRun >= 15;
        case 'hourly':
          return minutesSinceLastRun >= 60;
        default:
          return false;
      }
    });

    console.log(`[Cron] ${dueJobs.length} jobs due`);

    // Run jobs with concurrency limit
    const results = [];
    const CONCURRENCY = 8;
    for (let i = 0; i < dueJobs.length; i += CONCURRENCY) {
      const batch = dueJobs.slice(i, i + CONCURRENCY);
      const batchResults = await Promise.all(batch.map(runJob));
      results.push(...batchResults);
    }

    return NextResponse.json({ executed: results.length, results });
  } catch (error) {
    console.error('[Cron] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function runJob(job: any) {
  const start = Date.now();
  let statusCode = 0;
  let ok = false;
  let errorMsg: string | null = null;
  let sampleBody: string | null = null;

  try {
    const headers: Record<string, string> = job.headersEnc
      ? JSON.parse(job.headersEnc)
      : {};
    const body = job.bodyEnc ? JSON.parse(job.bodyEnc) : undefined;

    const response = await fetch(job.url, {
      method: job.method,
      headers: {
        ...headers,
        'User-Agent': 'SwiftAPI-Jobs/1.0',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    statusCode = response.status;
    const text = await response.text();
    sampleBody = text.substring(0, 2000);

    ok = statusCode === job.expectStatus;

    if (ok && job.expectJsonPath && job.expectValue) {
      const actualValue = evaluate(text, job.expectJsonPath);
      ok = actualValue === job.expectValue;
    }
  } catch (error: any) {
    errorMsg = error.message || 'Network error';
    ok = false;
  }

  const durationMs = Date.now() - start;

  // Only create job run if database is available
  if (safeDb) {
    const jobRun = await safeDb.jobRun.create({
      data: {
        jobId: job.id,
        durationMs,
        statusCode,
        ok,
        errorMsg,
        sampleBody,
      },
    });

    if (!ok) {
      await sendAlert(
        `[ALERT] Job *${job.name}* failed!\nStatus: ${statusCode}\nError: ${errorMsg || 'Check conditions'}`
      );
    }
  }

  return { jobId: job.id, ok, durationMs };
}
