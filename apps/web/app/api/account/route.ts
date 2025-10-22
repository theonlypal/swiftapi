import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user data
    const user = await prisma.user.findUnique({
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
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    // Determine plan and status
    const isPro = subscription?.status === 'active';
    const plan = isPro ? 'Pro' : 'Free';

    // Calculate usage for current month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);

    const usage = await prisma.usage.findFirst({
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

    if (subscription?.customerId) {
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
