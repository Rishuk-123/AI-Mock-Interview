import React, { useState } from "react";
import axios from "axios";

export default function BuyCredits({ userId, currentCredits, onPaymentSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async (amount, creditsToAdd) => {
    setLoading(true);
    const baseURL = import.meta.env.VITE_API_URL || "https://ai-mock-interview-kn7p.onrender.com";

    try {
      // 1. Create Order on Backend
      const { data } = await axios.post(`${baseURL}/api/payment/create-order`, { amount });

      if (!data.success) throw new Error("Failed to create Razorpay order");

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "AI Mock Interview",
        description: `Purchase ${creditsToAdd} Credits`,
        order_id: data.order.id,
        handler: async (response) => {
          // 3. Verify Payment
          const verifyRes = await axios.post(`${baseURL}/api/payment/verify-payment`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userId,
            creditsToAdd,
          });

          if (verifyRes.data.success) {
            alert("Payment successful! Credits added to your account.");
            if (onPaymentSuccess) onPaymentSuccess(verifyRes.data.credits);
          }
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-white max-w-sm mx-auto shadow-xl">
      <h3 className="text-xl font-bold">Buy Interview Credits</h3>
      <p className="text-slate-400 text-sm mt-1">
        Current Balance: <span className="text-blue-400 font-bold">{currentCredits} Credits</span>
      </p>

      <div className="mt-6 bg-slate-800 p-4 rounded-xl border border-slate-700">
        <div className="text-2xl font-black text-white">10 Credits</div>
        <p className="text-xs text-slate-400 mt-1">1 Credit = 1 Full AI Mock Interview</p>
        <div className="text-xl font-bold text-blue-400 mt-3">₹199</div>

        <button
          onClick={() => handleBuy(199, 10)}
          disabled={loading}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold py-2.5 rounded-xl transition shadow-lg shadow-blue-600/30 disabled:opacity-50 text-sm"
        >
          {loading ? "Processing..." : "Buy 10 Credits"}
        </button>
      </div>
    </div>
  );
}