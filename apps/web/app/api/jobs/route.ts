import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const JobSchema = z.object({
  name: z.string().min(1).max(100),
  url: z.string().url(),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).default('GET'),
  headers: z.record(z.string(), z.string()).optional(),
  body: z.any().optional(),
  schedule: z.enum(['1m', '5m', '15m', 'hourly']).default('15m'),
  expectStatus: z.number().int().min(100).max(599).default(200),
  expectJsonPath: z.string().optional(),
  expectValue: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = JobSchema.parse(body);

    // Check subscription limits
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });
    const isPro = subscription?.status === 'active';

    const jobCount = await prisma.job.count({
      where: { userId: session.user.id },
    });

    const maxJobs = isPro ? 20 : 1;
    if (jobCount >= maxJobs) {
      return NextResponse.json(
        {
          error: 'Upgrade required',
          message: `Free tier allows ${maxJobs} job${maxJobs > 1 ? 's' : ''}. Upgrade to Pro for more.`,
        },
        { status: 402 }
      );
    }

    // Check schedule limits
    if (!isPro && ['1m', '5m'].includes(validated.schedule)) {
      return NextResponse.json(
        { error: 'Pro feature', message: 'Fast intervals require Pro subscription' },
        { status: 402 }
      );
    }

    // Simple storage (TODO: Encrypt headers/body for production)
    const job = await prisma.job.create({
      data: {
        userId: session.user.id,
        name: validated.name,
        url: validated.url,
        method: validated.method,
        headersEnc: validated.headers ? JSON.stringify(validated.headers) : null,
        bodyEnc: validated.body ? JSON.stringify(validated.body) : null,
        schedule: validated.schedule,
        expectStatus: validated.expectStatus,
        expectJsonPath: validated.expectJsonPath,
        expectValue: validated.expectValue,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Job creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobs = await prisma.job.findMany({
      where: { userId: session.user.id },
      include: {
        runs: {
          orderBy: { startedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const enriched = jobs.map((job: any) => ({
      ...job,
      lastRun: job.runs[0] || null,
      runs: undefined,
    }));

    return NextResponse.json(enriched);
  } catch (error) {
    console.error('Jobs fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
