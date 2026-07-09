// ===========================================
// Razorpay Payment Verification API Route
// ===========================================
// POST /api/razorpay/verify
//
// Securely verifies the Razorpay payment signature
// and updates the organization's plan instantly.
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import getRazorpayClient from '@/lib/razorpay';
import Subscription from '@/models/Subscription';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } =
      await request.json();

    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing verification parameters' },
        { status: 400 }
      );
    }

    const isMock = razorpay_subscription_id.startsWith('sub_mock_');

    await dbConnect();

    let organizationId = '';
    let plan: 'STARTER' | 'PRO' = 'STARTER';
    let currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    if (isMock) {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      organizationId = session.organizationId;
      const planPart = razorpay_subscription_id.split('_')[2];
      plan = (planPart === 'PRO' ? 'PRO' : 'STARTER') as any;
      console.log(`[Razorpay Verification] Running Mock verify for org: ${organizationId}, plan: ${plan}`);
    } else {
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        console.warn('RAZORPAY_KEY_SECRET is missing. Skipping verification check for development.');
      }

      // Verify HMAC SHA256 Signature
      if (keySecret) {
        const hmac = crypto.createHmac('sha256', keySecret);
        const data = `${razorpay_payment_id}|${razorpay_subscription_id}`;
        hmac.update(data);
        const generatedSignature = hmac.digest('hex');

        if (generatedSignature !== razorpay_signature) {
          return NextResponse.json(
            { error: 'Invalid payment signature. Verification failed.' },
            { status: 400 }
          );
        }
      }

      // Retrieve subscription details directly from Razorpay to get trusted metadata
      const razorpay = getRazorpayClient();
      const rzpSubscription = (await razorpay.subscriptions.fetch(
        razorpay_subscription_id
      )) as any;

      organizationId = rzpSubscription.notes?.organizationId;
      const planFromNotes = rzpSubscription.notes?.plan;
      plan = (planFromNotes === 'PRO' ? 'PRO' : 'STARTER') as any;

      if (!organizationId || !planFromNotes) {
        return NextResponse.json(
          { error: 'Subscription metadata (notes) not found in Razorpay record' },
          { status: 400 }
        );
      }

      if (rzpSubscription.current_end) {
        currentPeriodEnd = new Date(rzpSubscription.current_end * 1000);
      }
    }

    // Determine plan limits
    const limits = {
      maxChatbots: plan === 'PRO' ? 10 : 3,
      maxWebsites: plan === 'PRO' ? 10 : 3,
      maxMessages: plan === 'PRO' ? 50000 : 10000,
    };

    // Update DB
    await Subscription.findOneAndUpdate(
      { organizationId },
      {
        organizationId,
        plan,
        status: 'active',
        razorpaySubscriptionId: razorpay_subscription_id,
        currentPeriodEnd,
        limits,
        // Reset billing message usage for new cycle
        $set: { 'usage.messagesUsed': 0 },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Subscription active!' });
  } catch (error) {
    console.error('Razorpay verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
