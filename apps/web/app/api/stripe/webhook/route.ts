import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG, isStripeConfigured } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  // Check if Stripe is configured
  if (!isStripeConfigured || !stripe) {
    console.error('Webhook error: Stripe is not configured');
    return NextResponse.json(
      { error: 'Stripe webhooks are disabled. Stripe environment variables are not configured.' },
      { status: 503 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    console.error('Webhook error: No signature provided');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_CONFIG.WEBHOOK_SECRET
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`Webhook received: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId || session.client_reference_id;
        const customerId = session.customer as string;

        if (!userId) {
          console.error('No userId found in checkout session metadata');
          break;
        }

        // Retrieve the subscription details
        const subscriptionId = session.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        console.log(`Creating subscription for user ${userId}`);

        // Create or update subscription record
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            customerId,
            subscriptionId,
            status: subscription.status,
            priceId: subscription.items.data[0].price.id,
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          },
          update: {
            customerId,
            subscriptionId,
            status: subscription.status,
            priceId: subscription.items.data[0].price.id,
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          },
        });

        console.log(`Subscription created/updated successfully for user ${userId}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) {
          // Try to find user by subscription ID
          const existingSubscription = await prisma.subscription.findUnique({
            where: { subscriptionId: subscription.id },
          });

          if (existingSubscription) {
            await prisma.subscription.update({
              where: { id: existingSubscription.id },
              data: {
                status: subscription.status,
                priceId: subscription.items.data[0].price.id,
                currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
              },
            });
            console.log(`Subscription updated for user ${existingSubscription.userId}`);
          } else {
            console.error('No userId in metadata and no matching subscription found');
          }
          break;
        }

        await prisma.subscription.update({
          where: { userId },
          data: {
            status: subscription.status,
            priceId: subscription.items.data[0].price.id,
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          },
        });

        console.log(`Subscription updated for user ${userId}, status: ${subscription.status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) {
          // Try to find user by subscription ID
          const existingSubscription = await prisma.subscription.findUnique({
            where: { subscriptionId: subscription.id },
          });

          if (existingSubscription) {
            await prisma.subscription.update({
              where: { id: existingSubscription.id },
              data: {
                status: 'canceled',
                currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
              },
            });
            console.log(`Subscription canceled for user ${existingSubscription.userId}`);
          } else {
            console.error('No userId in metadata and no matching subscription found');
          }
          break;
        }

        // Update subscription to canceled status (downgrade to free)
        await prisma.subscription.update({
          where: { userId },
          data: {
            status: 'canceled',
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          },
        });

        console.log(`Subscription deleted for user ${userId}, downgraded to free`);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;

        if (subscriptionId) {
          // Find subscription and ensure status is active
          const existingSubscription = await prisma.subscription.findUnique({
            where: { subscriptionId },
          });

          if (existingSubscription) {
            await prisma.subscription.update({
              where: { id: existingSubscription.id },
              data: { status: 'active' },
            });
            console.log(`Payment succeeded for subscription ${subscriptionId}`);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;

        if (subscriptionId) {
          // Find subscription and mark as past_due
          const existingSubscription = await prisma.subscription.findUnique({
            where: { subscriptionId },
          });

          if (existingSubscription) {
            await prisma.subscription.update({
              where: { id: existingSubscription.id },
              data: { status: 'past_due' },
            });
            console.log(`Payment failed for subscription ${subscriptionId}`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      {
        error: 'Webhook handler failed',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
