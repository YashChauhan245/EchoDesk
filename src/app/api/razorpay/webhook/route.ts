// ===========================================
// Razorpay Webhook Listener Route
// ===========================================
// POST /api/razorpay/webhook
//
// Processes Razorpay asynchronous events:
// - subscription.charged
// - subscription.cancelled
// - subscription.halted
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import Subscription from '@/models/Subscription';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-razorpay-signature');
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error('Webhook Error: Missing x-razorpay-signature or RAZORPAY_WEBHOOK_SECRET');
    return NextResponse.json(
      { error: 'Missing webhook verification requirements' },
      { status: 400 }
    );
  }

  let rawBody = '';
  try {
    rawBody = await request.text();
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read raw body' }, { status: 400 });
  }

  // Verify Razorpay Webhook Signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  if (expectedSignature !== signature) {
    console.error('Webhook Error: Webhook signature verification failed');
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    const eventData = JSON.parse(rawBody);
    const event = eventData.event;
    const subscriptionEntity = eventData.payload?.subscription?.entity;

    if (!subscriptionEntity) {
      console.warn('Webhook received empty subscription entity payload.');
      return NextResponse.json({ received: true });
    }

    const subscriptionId = subscriptionEntity.id;
    const organizationId = subscriptionEntity.notes?.organizationId;
    const plan = subscriptionEntity.notes?.plan as 'STARTER' | 'PRO' | undefined;

    await dbConnect();

    switch (event) {
      case 'subscription.charged': {
        if (!organizationId || !plan) {
          console.warn('Charged webhook received but missing metadata notes.');
          break;
        }

        const currentPeriodEnd = subscriptionEntity.current_end
          ? new Date(subscriptionEntity.current_end * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        const limits = {
          maxChatbots: plan === 'PRO' ? 10 : 3,
          maxWebsites: plan === 'PRO' ? 10 : 3,
          maxMessages: plan === 'PRO' ? 50000 : 10000,
        };

        await Subscription.findOneAndUpdate(
          { organizationId },
          {
            organizationId,
            plan,
            status: 'active',
            razorpaySubscriptionId: subscriptionId,
            currentPeriodEnd,
            limits,
            // Reset message usage for the new billing cycle
            $set: { 'usage.messagesUsed': 0 },
          },
          { upsert: true }
        );

        console.log(`[Razorpay Webhook] Charged renewal successful for org: ${organizationId}, plan: ${plan}`);
        break;
      }

      case 'subscription.cancelled':
      case 'subscription.halted': {
        // Downgrade organization to FREE tier
        await Subscription.findOneAndUpdate(
          { razorpaySubscriptionId: subscriptionId },
          {
            plan: 'FREE',
            status: 'inactive',
            currentPeriodEnd: undefined,
            limits: {
              maxChatbots: 1,
              maxWebsites: 1,
              maxMessages: 500,
            },
          }
        );

        console.log(`[Razorpay Webhook] Cancelled subscription: ${subscriptionId}, downgraded to FREE.`);
        break;
      }

      default:
        console.log(`[Razorpay Webhook] Unhandled event type: ${event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Razorpay Webhook processing logic failed:', error);
    return NextResponse.json(
      { error: 'Webhook processing logic failed' },
      { status: 500 }
    );
  }
}
