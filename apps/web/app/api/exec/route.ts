import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate';
import { safeDb, isDatabaseAvailable } from '@/lib/prisma';
import { z } from 'zod';

const ExecSchema = z.object({
  url: z.string().url(),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).default('GET'),
  headers: z.record(z.string(), z.string()).optional(),
  body: z.any().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Check if database is available
    if (!isDatabaseAvailable() || !safeDb) {
      return NextResponse.json(
        {
          error: 'Database not configured',
          message: 'API execution requires database. Please configure DATABASE_URL environment variable.',
          demoMode: true
        },
        { status: 503 }
      );
    }

    // Auth via session or API key
    const session = await getServerSession(authOptions);
    const authHeader = req.headers.get('authorization');
    let userId: string | null = null;
    let isPro = false;

    if (session?.user?.id) {
      userId = session.user.id;
    } else if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // API key validation. Production systems should use bcrypt or similar hashing.
      const apiKey = await safeDb.apiKey.findFirst({
        where: { keyHash: token },
      });
      if (apiKey) {
        userId = apiKey.userId;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check subscription
    const subscription = await safeDb.subscription.findUnique({
      where: { userId },
    });
    isPro = subscription?.status === 'active';

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
    const validated = ExecSchema.parse(body);

    const start = Date.now();

    const response = await fetch(validated.url, {
      method: validated.method,
      headers: {
        ...validated.headers,
        'User-Agent': 'SwiftAPI-Exec/1.0',
      },
      body: validated.body ? JSON.stringify(validated.body) : undefined,
    });

    const data = await response.text();
    const durationMs = Date.now() - start;

    return NextResponse.json({
      status: response.status,
      data: data.substring(0, 10000), // Limit response size
      durationMs,
      remaining: rateCheck.remaining,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Exec error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
