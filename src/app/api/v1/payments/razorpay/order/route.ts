import { NextResponse } from "next/server"
import { policies } from "@/server/policies"
import { db } from "@/server/db"
import { plans, payments } from "@/server/db/schema"
import { razorpayService } from "@/server/integrations/razorpay"
import { businessService } from "@/server/services/businessService"
import { z } from "zod"
import { eq } from "drizzle-orm"

const orderSchema = z.object({
  planId: z.string().uuid(),
})

export async function POST(request: Request) {
  try {
    const user = await policies.requireUser()
    const business = await businessService.getCurrentBusiness()

    if (!business) {
      return NextResponse.json({ error: "No active business found" }, { status: 404 })
    }

    // Verify role is high enough
    const { role } = await policies.requireBusinessAccess(business.id, ["OWNER", "MANAGER"])

    const body = await request.json()
    const parsed = orderSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request data", details: parsed.error }, { status: 400 })
    }

    const { planId } = parsed.data

    const plan = await db.query.plans.findFirst({
      where: eq(plans.id, planId)
    })

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    // Create Razorpay Order
    const razorpayOrder = await razorpayService.createOrder({
      amountPaise: plan.amountPaise,
      receiptId: `rcpt_${business.id.substring(0,8)}_${Date.now()}`,
      notes: {
        businessId: business.id,
        planId: plan.id
      }
    })

    // Store pending payment in DB
    const [paymentRecord] = await db.insert(payments).values({
      businessId: business.id,
      planId: plan.id,
      amountPaise: plan.amountPaise,
      currency: "INR",
      status: "CREATED",
      providerOrderId: razorpayOrder.id,
    }).returning()

    return NextResponse.json({ 
      data: {
        orderId: razorpayOrder.id,
        amount: plan.amountPaise,
        currency: "INR",
        paymentId: paymentRecord.id
      }
    })

  } catch (error: any) {
    console.error("Order Creation Error:", error)
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 })
  }
}
