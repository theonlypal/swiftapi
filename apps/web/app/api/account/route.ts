import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { safeDb, isDatabaseAvailable } from '@/lib/prisma';
import { stripe, isStripeConfigured } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // If database is not available, return demo mode data
    if (!isDatabaseAvailable() || !safeDb) {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      monthStart.setHours(0, 0, 0, 0);

      return NextResponse.json({
        user: {
          id: session.user.id,
          name: session.user.name || 'Demo User',
          email: session.user.email || 'demo@example.com',
          image: session.user.image || null,
          createdAt: new Date(),
        },
        subscription: {
          plan: 'Free',
          status: 'inactive',
          currentPeriodEnd: null,
        },
        usage: {
          count: 0,
          limit: 2,
          remaining: 2,
          periodStart: monthStart,
        },
        billingPortalUrl: null,
        demoMode: true,
      });
    }

    // Fetch user data
    const user = await safeDb.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch subscription data
    const subscription = await safeDb.subscription.findUnique({
      where: { userId },
    });

    // Determine plan and status
    const isPro = subscription?.status === 'active';
    const plan = isPro ? 'Pro' : 'Free';

    // Calculate usage for current month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);

    const usage = await safeDb.usage.findFirst({
      where: {
        userId,
        periodStart: {
          gte: monthStart,
        },
      },
      orderBy: {
        periodStart: 'desc',
      },
    });

    const usageCount = usage?.count || 0;
    const usageLimit = isPro ? 'Unlimited' : 2;

    // Generate billing portal URL if user has a Stripe customer ID
    let billingPortalUrl: string | null = null;

    if (subscription?.customerId && isStripeConfigured && stripe) {
      try {
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: subscription.customerId,
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL}/account`,
        });
        billingPortalUrl = portalSession.url;
      } catch (error) {
        console.error('Failed to create billing portal session:', error);
        // Continue without billing portal URL
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
      },
      subscription: {
        plan,
        status: subscription?.status || 'inactive',
        currentPeriodEnd: subscription?.currentPeriodEnd || null,
      },
      usage: {
        count: usageCount,
        limit: usageLimit,
        remaining: isPro ? 'Unlimited' : Math.max(0, 2 - usageCount),
        periodStart: monthStart,
      },
      billingPortalUrl,
    });
  } catch (error) {
    console.error('Account API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
