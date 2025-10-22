import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId || session.client_reference_id;

        if (!userId) break;

        const subscriptionData = (await stripe.subscriptions.retrieve(
          session.subscription as string
        )) as unknown as Stripe.Subscription;

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            status: subscriptionData.status,
            priceId: subscriptionData.items.data[0].price.id,
            currentPeriodEnd: new Date((subscriptionData as any).current_period_end * 1000),
          },
          update: {
            status: subscriptionData.status,
            priceId: subscriptionData.items.data[0].price.id,
            currentPeriodEnd: new Date((subscriptionData as any).current_period_end * 1000),
          },
        });
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const userId = subscription.metadata?.userId;

        if (!userId) break;

        await prisma.subscription.update({
          where: { userId },
          data: {
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
        break;
      }

      case 'invoice.payment_succeeded':
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        // Additional logging or handling if needed
        console.log(`Invoice ${event.type}:`, invoice.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
