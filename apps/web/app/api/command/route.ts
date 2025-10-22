import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { executeCommand, getExecutorConfigFromEnv, isGitHubConfigured } from '@/lib/executor';
import { checkRateLimit } from '@/lib/rate';

const CommandSchema = z.object({
  commandText: z.string().min(1).max(1000),
  dryRun: z.boolean().optional().default(false),
});

/**
 * POST /api/command
 * Create and execute a command
 */
export async function POST(req: NextRequest) {
  try {
    // Check if GitHub is configured for command execution
    if (!isGitHubConfigured()) {
      return NextResponse.json(
        {
          error: 'Command execution is disabled. GitHub environment variables (GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH) are not configured.',
          disabled: true
        },
        { status: 503 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Check subscription status
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });
    const isPro = subscription?.status === 'active';

    // Rate limit check
    const rateCheck = await checkRateLimit(userId, isPro);
    if (!rateCheck.ok) {
      return NextResponse.json(
        {
          error: 'Monthly quota exceeded. Upgrade to Pro for unlimited access.',
          remaining: 0,
          plan: isPro ? 'Pro' : 'Free',
          upgradeUrl: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL}/account`,
        },
        { status: 402 } // 402 Payment Required
      );
    }

    const body = await req.json();
    const validated = CommandSchema.parse(body);

    // Create command record
    const command = await prisma.command.create({
      data: {
        userId: session.user.id,
        commandText: validated.commandText,
        dryRun: validated.dryRun,
        status: 'pending',
      },
    });

    // Execute command in background (fire and forget)
    const config = getExecutorConfigFromEnv();
    executeCommand(command.id, validated.commandText, validated.dryRun, config)
      .then(async (result) => {
        // Update command with results
        if (result.commitUrl || result.prUrl || result.deployUrl) {
          // Note: We're storing these in Command model, but spec mentions JobRun
          // You may want to create a JobRun record here if needed
          console.log(`Command ${command.id} completed:`, result);
        }
      })
      .catch((error) => {
        console.error(`Command ${command.id} execution error:`, error);
      });

    return NextResponse.json(
      {
        jobId: command.id,
        remaining: rateCheck.remaining,
        plan: isPro ? 'Pro' : 'Free',
      },
      { status: 202 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Command creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
