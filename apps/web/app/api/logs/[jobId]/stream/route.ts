import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { safeDb, isDatabaseAvailable } from '@/lib/prisma';
import { createSSEStream } from '@/lib/sse';

/**
 * GET /api/logs/[jobId]/stream
 * Stream live logs via Server-Sent Events
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    // Check if database is available
    if (!isDatabaseAvailable() || !safeDb) {
      return NextResponse.json(
        {
          error: 'Database not configured',
          message: 'Log streaming requires database. Please configure DATABASE_URL environment variable.',
          demoMode: true
        },
        { status: 503 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobId } = params;

    // Verify command exists and user has access
    const command = await safeDb.command.findUnique({
      where: { id: jobId },
      select: { userId: true, status: true },
    });

    if (!command) {
      return NextResponse.json({ error: 'Command not found' }, { status: 404 });
    }

    if (command.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Create SSE stream
    const stream = createSSEStream(jobId);

    // Return SSE response with proper headers
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable nginx buffering
      },
    });
  } catch (error) {
    console.error('SSE stream error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
