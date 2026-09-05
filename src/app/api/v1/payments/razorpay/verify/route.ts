import { NextResponse } from "next/server"
import { policies } from "@/server/policies"
import { db } from "@/server/db"
import { payments, businesses, subscriptions } from "@/server/db/schema"
import { razorpayService } from "@/server/integrations/razorpay"
import { z } from "zod"
import { eq } from "drizzle-orm"
import { businessService } from "@/server/services/businessService"

const verifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
})

export async function POST(request: Request) {
  try {
    const user = await policies.requireUser()
    const business = await businessService.getCurrentBusiness()

    if (!business) {
      return NextResponse.json({ error: "No active business found" }, { status: 404 })
    }

    const { role } = await policies.requireBusinessAccess(business.id, ["OWNER", "MANAGER"])

    const body = await request.json()
    const parsed = verifySchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payment data" }, { status: 400 })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data

    const isValid = razorpayService.verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // Update payment record in a transaction
    await db.transaction(async (tx) => {
      const existingPayment = await tx.query.payments.findFirst({
        where: eq(payments.providerOrderId, razorpay_order_id)
      })

      if (!existingPayment) {
        throw new Error("Payment record not found")
      }

      await tx.update(payments).set({
        providerPaymentId: razorpay_payment_id,
        providerSignatureReference: razorpay_signature,
        status: "AUTHORIZED",
        paidAt: new Date()
      }).where(eq(payments.id, existingPayment.id))

      // Update workspace status
      await tx.update(businesses).set({
        workspaceStatus: "ACTIVE"
      }).where(eq(businesses.id, business.id))
      
      // We could create a subscription here if it was a recurring plan,
      // For one-off setup, we just activate the workspace.
    })

    return NextResponse.json({ data: { success: true } })

  } catch (error: any) {
    console.error("Payment Verification Error:", error)
    return NextResponse.json({ error: error.message || "Failed to verify payment" }, { status: 500 })
  }
}
