import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { evaluate } from '@/lib/jsonpath';
import { sendAlert } from '@/lib/alerts';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id, userId: session.user.id },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

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
      sampleBody = text.substring(0, 2000); // Truncate to 2KB

      // Evaluate success
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

    const jobRun = await prisma.jobRun.create({
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
        `[ALERT] Job *${job.name}* failed!\nStatus: ${statusCode}\nError: ${errorMsg || 'Check expected vs actual'}`
      );
    }

    return NextResponse.json(jobRun);
  } catch (error) {
    console.error('Job run error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
