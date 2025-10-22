import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe, STRIPE_CONFIG, isStripeConfigured } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!isStripeConfigured || !stripe) {
      return NextResponse.json(
        { error: 'Billing features are disabled. Stripe environment variables are not configured.' },
        { status: 503 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (existingSubscription?.status === 'active') {
      return NextResponse.json(
        { error: 'You already have an active subscription' },
        { status: 400 }
      );
    }

    // Get site URL from environment
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // Check if we need to create a new customer or use existing
    let customerId = existingSubscription?.customerId;

    if (!customerId) {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          userId,
        },
      });
      customerId = customer.id;
    }

    // Create Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: userId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_CONFIG.PRICE_ID,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          userId,
        },
        trial_period_days: 0, // No trial, immediate billing
      },
      success_url: `${siteUrl}/account?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/account?canceled=true`,
      metadata: {
        userId,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
    });

    // Store customer ID if it's new
    if (existingSubscription && !existingSubscription.customerId) {
      await prisma.subscription.update({
        where: { userId },
        data: { customerId },
      });
    }

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
