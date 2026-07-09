// ===========================================
// Razorpay Checkout API Route
// ===========================================
// POST /api/razorpay/checkout
//
// Creates a Razorpay subscription instance and returns its ID.
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import dbConnect from '@/lib/db';
import getRazorpayClient from '@/lib/razorpay';
import Subscription from '@/models/Subscription';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await request.json();
    if (!plan || !['STARTER', 'PRO'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Fetch or create user subscription record to ensure DB entry
    let userSubscription = await Subscription.findOne({
      organizationId: session.organizationId,
    });

    if (!userSubscription) {
      userSubscription = await Subscription.create({
        organizationId: session.organizationId,
        plan: 'FREE',
        status: 'active',
        limits: {
          maxChatbots: 1,
          maxWebsites: 1,
          maxMessages: 500,
        },
        usage: {
          messagesUsed: 0,
          chatbotsCreated: 0,
        },
      });
    }

    // Check if we should run in mock mode due to missing/placeholder credentials
    const isMockMode =
      !process.env.RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID.includes('placeholder') ||
      !process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_KEY_SECRET.includes('placeholder');

    if (isMockMode) {
      console.log(`[Razorpay Checkout] Running in Mock Mode for plan: ${plan}`);
      return NextResponse.json({
        subscriptionId: `sub_mock_${plan}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        keyId: 'rzp_test_mock',
        email: session.email,
        name: session.name,
        isMock: true,
      });
    }

    try {
      const razorpay = getRazorpayClient();

      // Map plan settings
      const planName = plan === 'PRO' ? 'EchoDesk Pro' : 'EchoDesk Starter';
      const planAmount = plan === 'PRO' ? 249900 : 79900; // in paise (₹2499 vs ₹799)
      const planDescription =
        plan === 'PRO'
          ? '10 AI chatbots, 10 websites, 50,000 AI messages/month'
          : '3 AI chatbots, 3 websites, 10,000 AI messages/month';

      // Find if the Plan already exists in Razorpay to avoid duplicates
      let razorpayPlanId = '';
      try {
        const plansResponse = (await razorpay.plans.all()) as any;
        const matchedPlan = plansResponse.items?.find(
          (p: any) =>
            p.item?.name === planName &&
            p.item?.amount === planAmount &&
            p.period === 'monthly'
        );
        if (matchedPlan) {
          razorpayPlanId = matchedPlan.id;
        }
      } catch (err) {
        console.warn('Failed to query existing Razorpay plans, will attempt to create:', err);
      }

      // If plan doesn't exist, create it
      if (!razorpayPlanId) {
        const createdPlan = (await razorpay.plans.create({
          period: 'monthly',
          interval: 1,
          item: {
            name: planName,
            amount: planAmount,
            currency: 'INR',
            description: planDescription,
          },
        })) as any;
        razorpayPlanId = createdPlan.id;
      }

      // Create Razorpay subscription
      const razorpaySubscription = (await razorpay.subscriptions.create({
        plan_id: razorpayPlanId,
        customer_notify: 1,
        total_count: 60, // 60 months (5 years)
        quantity: 1,
        notes: {
          organizationId: session.organizationId,
          plan: plan,
        },
      })) as any;

      return NextResponse.json({
        subscriptionId: razorpaySubscription.id,
        keyId: process.env.RAZORPAY_KEY_ID,
        email: session.email,
        name: session.name,
        isMock: false,
      });
    } catch (err) {
      console.warn('Razorpay API failed. Falling back to Mock Mode checkout:', err);
      return NextResponse.json({
        subscriptionId: `sub_mock_${plan}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        keyId: 'rzp_test_mock',
        email: session.email,
        name: session.name,
        isMock: true,
      });
    }
  } catch (error) {
    console.error('Razorpay checkout error:', error);
    return NextResponse.json(
      { error: 'Razorpay checkout initialization failed' },
      { status: 500 }
    );
  }
}
