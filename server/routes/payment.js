import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/User.js";

const router = express.Router();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Payment Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body; // Amount in INR

    const options = {
      amount: amount * 100, // Razorpay works in paise (1 INR = 100 paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Add credits to the user's account
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { credits: creditsToAdd } },
        { new: true }
      );

      return res.json({
        success: true,
        message: "Payment verified successfully!",
        credits: updatedUser.credits,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;