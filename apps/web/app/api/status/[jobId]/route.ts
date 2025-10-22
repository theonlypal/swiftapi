import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { safeDb, isDatabaseAvailable } from '@/lib/prisma';

/**
 * GET /api/status/[jobId]
 * Get command execution status and details
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
          message: 'Status tracking requires database. Please configure DATABASE_URL environment variable.',
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

    // Fetch command with phases
    const command = await safeDb.command.findUnique({
      where: { id: jobId },
      include: {
        phases: {
          orderBy: { startedAt: 'asc' },
        },
      },
    });

    if (!command) {
      return NextResponse.json({ error: 'Command not found' }, { status: 404 });
    }

    // Verify ownership
    if (command.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Format phases for response
    const phases = command.phases.map((phase) => ({
      name: phase.name,
      status: phase.status,
      startedAt: phase.startedAt?.toISOString(),
      completedAt: phase.completedAt?.toISOString(),
      logs: phase.logs,
    }));

    // Extract links from command
    const links: {
      commitUrl?: string;
      prUrl?: string;
      deployUrl?: string;
    } = {
      commitUrl: command.commitUrl || undefined,
      prUrl: command.prUrl || undefined,
      deployUrl: command.deployUrl || undefined,
    };

    return NextResponse.json({
      status: command.status,
      phases,
      links,
      createdAt: command.createdAt.toISOString(),
      completedAt: command.completedAt?.toISOString(),
      commandText: command.commandText,
      dryRun: command.dryRun,
    });
  } catch (error) {
    console.error('Status fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
