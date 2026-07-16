"use client";

import { useState, useEffect } from "react";
import { Check, Loader2, Sparkles, ShieldAlert } from "lucide-react";
import type { ISubscription } from "@/types";

interface PricingClientProps {
  subscription: ISubscription;
  userEmail: string;
  userName: string;
}

export default function PricingClient({ subscription, userEmail, userName }: PricingClientProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rzpLoaded, setRzpLoaded] = useState(false);

  // Load Razorpay Checkout.js script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRzpLoaded(true);
    script.onerror = () => console.error("Failed to load Razorpay SDK");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const plans = [
    {
      id: "FREE",
      name: "Free Plan",
      price: "₹0",
      description: "Ideal for testing and small personal projects",
      limits: [
        "1 AI chatbot",
        "1 website deployment",
        "500 AI messages/month",
        "Standard support",
      ],
      cta: "Current Plan",
      isFree: true,
    },
    {
      id: "STARTER",
      name: "Starter Plan",
      price: "₹799",
      description: "Perfect for growing sites & customer service",
      limits: [
        "3 AI chatbots",
        "3 website deployments",
        "10,000 AI messages/month",
        "Fast response support",
        "Custom widget branding",
      ],
      cta: "Upgrade",
      isFree: false,
    },
    {
      id: "PRO",
      name: "Pro Plan",
      price: "₹2499",
      description: "For high-traffic businesses needing maximum reach",
      limits: [
        "10 AI chatbots",
        "10 website deployments",
        "50,000 AI messages/month",
        "Priority 24/7 support",
        "Custom widget branding",
        "Advanced training context limit",
      ],
      cta: "Upgrade",
      isFree: false,
      popular: true,
    },
  ];

  const currentPlan = subscription?.plan || "FREE";

  async function handleUpgrade(planId: string) {
    if (planId === "FREE") return;
    if (!rzpLoaded) {
      setError("Razorpay SDK is loading, please try again in a second.");
      return;
    }
    setLoadingPlan(planId);
    setError(null);

    try {
      // 1. Create the subscription on the backend
      const res = await fetch("/api/razorpay/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate checkout");
      }

      const { subscriptionId, keyId, email, name, isMock } = data;

      // 2. Handle Mock Mode bypass
      if (isMock) {
        console.log("[Razorpay Frontend] Running in Mock Mode. Simulating checkout...");
        setTimeout(async () => {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_payment_id: `pay_mock_${Date.now()}`,
                razorpay_subscription_id: subscriptionId,
                razorpay_signature: "mock_signature",
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Mock payment verification failed");
            }

            window.location.href = "/dashboard?checkout=success";
          } catch (err: any) {
            setError(err.message || "Mock payment verification failed");
            setLoadingPlan(null);
          }
        }, 1200);
        return;
      }

      // 3. Open the Razorpay checkout modal for real payments
      const options = {
        key: keyId,
        subscription_id: subscriptionId,
        name: "EchoDesk",
        description: planId === "PRO" ? "Pro Plan Subscription" : "Starter Plan Subscription",
        handler: async function (response: any) {
          setLoadingPlan(planId);
          try {
            // Verify payment signature on backend
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verification failed");
            }

            // Redirect on success
            window.location.href = "/dashboard?checkout=success";
          } catch (err: any) {
            setError(err.message || "Payment verification failed");
            setLoadingPlan(null);
          }
        },
        prefill: {
          name: name || userName || "",
          email: email || userEmail || "",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function () {
            setLoadingPlan(null);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoadingPlan(null);
    }
  }

  return (
    <div className="animate-fade-in space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0f0f15] dark:text-white">
          Simple, Transparent Plans
        </h1>
        <p className="text-sm sm:text-base text-[#5f6368] dark:text-[#94a3b8] max-w-xl mx-auto">
          Scale your automated support workspace seamlessly. Choose the plan that fits your customer interaction volume.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl max-w-xl mx-auto text-sm animate-fade-in">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch pt-4">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const isLoading = loadingPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`glass-card p-6 sm:p-8 flex flex-col justify-between border relative overflow-hidden transition-all duration-300 ${
                plan.popular
                  ? "border-[#6366f1] shadow-[0_0_24px_rgba(99,102,241,0.06)] dark:shadow-[0_0_32px_rgba(99,102,241,0.08)] bg-white dark:bg-[#0c0c16]/90 lg:scale-[1.03] z-10"
                  : "border-black/[0.05] dark:border-white/[0.06] bg-white dark:bg-[#0c0c14]"
              }`}
            >
              {/* Glow Accent for Popular */}
              {plan.popular && (
                <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#6366f1] to-transparent" />
              )}

              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#6366f1]/20 bg-[#6366f1]/5 text-[#6366f1] text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#0f0f15] dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-[#5f6368] dark:text-[#94a3b8] leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#0f0f15] dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-xs text-[#5f6368] dark:text-[#94a3b8]">
                    / month
                  </span>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-black/[0.05] dark:bg-white/[0.06]" />

                {/* Features */}
                <ul className="space-y-3.5">
                  {plan.limits.map((limit, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-xs text-[#5f6368] dark:text-[#94a3b8]"
                    >
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{limit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button */}
              <div className="mt-8 pt-4">
                {plan.isFree ? (
                  isCurrent ? (
                    <button
                      disabled
                      className="w-full btn-secondary justify-center !py-3 text-xs font-semibold uppercase tracking-wider cursor-default opacity-80"
                    >
                      Current Plan ✓
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full btn-secondary justify-center !py-3 text-xs font-semibold uppercase tracking-wider cursor-default opacity-50"
                    >
                      Free Tier
                    </button>
                  )
                ) : isCurrent ? (
                  <button
                    disabled
                    className="w-full btn-primary justify-center !py-3 text-xs font-semibold uppercase tracking-wider cursor-default"
                    style={{
                      background: "transparent",
                      borderColor: "var(--border-glow)",
                      color: "currentColor",
                    }}
                  >
                    Current Plan ✓
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={!!loadingPlan}
                    className={`w-full justify-center !py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer flex items-center gap-2 ${
                      plan.popular ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      plan.cta
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee */}
      <div className="text-center text-xs text-[#5f6368] dark:text-[#475569] pt-6 max-w-md mx-auto">
        Payments processed securely via Razorpay. Cancel or change plans at any time from your Billing Dashboard.
      </div>
    </div>
  );
}
