import Razorpay from "razorpay"
import { env } from "@/lib/env"
import crypto from "crypto"

export const razorpayClient = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID || "dummy_key",
  key_secret: env.RAZORPAY_KEY_SECRET || "dummy_secret",
})

export const razorpayService = {
  /**
   * Creates a Razorpay Order for a checkout session
   */
  async createOrder({ amountPaise, receiptId, notes }: { amountPaise: number, receiptId: string, notes?: Record<string, string> }) {
    if (!env.RAZORPAY_KEY_ID) {
      console.warn("RAZORPAY_KEY_ID is missing. Creating a mock order.")
      return {
        id: "order_mock_" + Math.random().toString(36).substring(7),
        amount: amountPaise,
        currency: "INR",
        receipt: receiptId,
      }
    }

    try {
      const order = await razorpayClient.orders.create({
        amount: amountPaise,
        currency: "INR",
        receipt: receiptId,
        notes,
      })
      return order
    } catch (error) {
      console.error("Razorpay Create Order Error:", error)
      throw new Error("Failed to create payment order")
    }
  },

  /**
   * Verifies the Razorpay payment signature
   */
  verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
    if (!env.RAZORPAY_KEY_SECRET) {
      console.warn("RAZORPAY_KEY_SECRET is missing. Skipping signature verification for mock payment.")
      return true
    }

    const body = orderId + "|" + paymentId
    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex")
      
    return expectedSignature === signature
  },
  
  /**
   * Verifies the Razorpay webhook signature
   */
  verifyWebhookSignature(body: string, signature: string) {
    if (!env.RAZORPAY_WEBHOOK_SECRET) {
      return true // for local dev without secrets
    }
    
    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex")
      
    return expectedSignature === signature
  }
}
