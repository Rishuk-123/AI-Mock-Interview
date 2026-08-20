import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const router = express.Router();

// Guard clause to ensure keys are defined before initializing
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error(
    "CRITICAL WARNING: Razorpay Key ID or Secret is missing in environment variables!"
  );
}

// Initialize Razorpay instance lazily / safely
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// Create Payment Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body; // Amount in INR

    if (!amount || isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Valid amount is required" });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("Razorpay Create Order Error:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Order creation failed" });
  }
});

// Verify Payment Signature & Add Credits
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      creditsToAdd,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Missing payment parameters" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    // Add credits securely using $inc
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { credits: Number(creditsToAdd) || 10 } },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully!",
      credits: updatedUser.credits,
    });
  } catch (err) {
    console.error("Razorpay Verify Payment Error:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Verification failed" });
  }
});

export default router;