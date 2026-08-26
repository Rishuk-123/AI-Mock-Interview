import  { useState } from "react";
import { Check, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/authStore";

const plans = [
  {
    name: "Free",
    price: 0,
    credits: 100,
    description: "Perfect for beginners starting interview preparation.",
    features: [
      "100 AI Interview Credits",
      "Basic Performance Report",
      "Voice Interview Access",
      "Limited History Tracking",
    ],
    buttonText: "Active Plan",
    disabled: true,
    popular: false,
  },
  {
    name: "Starter Pack",
    price: 100,
    credits: 150,
    description: "Great for focused practice and skill improvement.",
    features: [
      "150 AI Interview Credits",
      "Detailed Feedback",
      "Performance Analytics",
      "Full Interview History",
    ],
    buttonText: "Upgrade Now",
    disabled: false,
    popular: true,
  },
  {
    name: "Pro Premium",
    price: 499,
    credits: 1000,
    description: "Ideal for active job seekers needing deep analytics.",
    features: [
      "1000 AI Interview Credits",
      "Advanced PDF Performance Reports",
      "Voice & Video Interview Access",
      "Unlimited History Tracking",
      "Priority AI Feedback Generation",
    ],
    buttonText: "Upgrade Now",
    disabled: false,
    popular: false,
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.setUser || state.updateUser);

  const [loadingPlan, setLoadingPlan] = useState(null);
  const [showCreditModal, setShowCreditModal] = useState(false);

  const userCredits = user?.credits ?? 0;
  const ENOUGH_CREDITS_THRESHOLD = 50; // Threshold for triggering the "Action Not Required" modal

  const handleUpgrade = async (plan) => {
    if (plan.price === 0) return;

    // Trigger modal if user has sufficient credits
    if (userCredits >= ENOUGH_CREDITS_THRESHOLD) {
      setShowCreditModal(true);
      return;
    }

    setLoadingPlan(plan.name);
    const baseURL =
      import.meta.env.VITE_API_URL || "https://ai-mock-interview-kn7p.onrender.com";

    try {
      const { data } = await axios.post(`${baseURL}/api/payment/create-order`, {
        amount: plan.price,
      });

      if (!data.success) throw new Error("Order creation failed");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "AI Mock Interview",
        description: `Upgrade to ${plan.name} (${plan.credits} Credits)`,
        order_id: data.order.id,
        handler: async (response) => {
          const verifyRes = await axios.post(`${baseURL}/api/payment/verify-payment`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userId: user?._id || user?.id,
            creditsToAdd: plan.credits,
          });

          if (verifyRes.data.success) {
            alert(`Payment successful! New Credit Balance: ${verifyRes.data.credits}`);
            if (updateUser) {
              updateUser({ ...user, credits: verifyRes.data.credits });
            }
            navigate("/dashboard");
          }
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Payment failed");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mx-auto max-w-7xl mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 rounded-full bg-white p-3 text-slate-700 shadow-sm transition hover:bg-slate-100 border border-slate-200 cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Choose Your Plan
        </h1>
        <p className="mt-4 text-lg font-medium text-slate-600">
          Flexible pricing to match your interview preparation goals.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              plan.popular
                ? "border-2 border-blue-600 ring-2 ring-blue-600/20"
                : "border border-slate-200"
            }`}
          >
            {/* Most Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                Most Popular
              </div>
            )}

            <div>
              <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
              <p className="mt-2 text-sm text-slate-500 min-h-[40px]">
                {plan.description}
              </p>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-slate-900">
                  ₹{plan.price}
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  / month
                </span>
              </div>

              {/* Features List */}
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleUpgrade(plan)}
              disabled={plan.disabled || loadingPlan === plan.name}
              className={`mt-8 w-full rounded-2xl py-3.5 text-sm font-bold transition shadow-md cursor-pointer ${
                plan.disabled
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-blue-600 text-white hover:bg-blue-500 active:scale-95"
              }`}
            >
              {loadingPlan === plan.name ? "Processing..." : plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Action Not Required Modal */}
      {showCreditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white">
                <AlertCircle size={24} strokeWidth={2.5} />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              Action Not Required
            </h3>

            <p className="mt-3 text-sm font-medium text-slate-500 leading-relaxed">
              You already have enough credits to continue your preparation.
            </p>

            <button
              onClick={() => setShowCreditModal(false)}
              className="mt-8 w-full rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-95 cursor-pointer shadow-md"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}