import { NextResponse } from "next/server"
import { db } from "@/server/db"
import { paymentWebhookEvents, payments, businesses } from "@/server/db/schema"
import { razorpayService } from "@/server/integrations/razorpay"
import { eq } from "drizzle-orm"

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get("x-razorpay-signature") || ""

    const isValid = razorpayService.verifyWebhookSignature(rawBody, signature)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const payload = JSON.parse(rawBody)
    const eventType = payload.event
    const eventId = request.headers.get("x-razorpay-event-id") || `evt_${Date.now()}_${Math.random()}`

    // Deduplicate event
    const existingEvent = await db.query.paymentWebhookEvents.findFirst({
      where: eq(paymentWebhookEvents.providerEventId, eventId)
    })

    if (existingEvent) {
      return NextResponse.json({ received: true, note: "Already processed" })
    }

    // Save event
    const [webhookEvent] = await db.insert(paymentWebhookEvents).values({
      provider: "RAZORPAY",
      providerEventId: eventId,
      eventType,
      processingStatus: "PENDING",
      payloadHash: signature, // Or hash of payload
    }).returning()

    // Process event transactionally
    await db.transaction(async (tx) => {
      try {
        if (eventType === "payment.captured" || eventType === "payment.authorized") {
          const paymentEntity = payload.payload.payment.entity
          const orderId = paymentEntity.order_id

          if (orderId) {
            const paymentRecord = await tx.query.payments.findFirst({
              where: eq(payments.providerOrderId, orderId)
            })

            if (paymentRecord && paymentRecord.status !== "CAPTURED") {
              await tx.update(payments).set({
                status: eventType === "payment.captured" ? "CAPTURED" : "AUTHORIZED",
                providerPaymentId: paymentEntity.id,
                paidAt: new Date(paymentEntity.created_at * 1000)
              }).where(eq(payments.id, paymentRecord.id))

              // Activate workspace if not already
              await tx.update(businesses).set({
                workspaceStatus: "ACTIVE"
              }).where(eq(businesses.id, paymentRecord.businessId))
            }
          }
        }

        // Mark event as processed
        await tx.update(paymentWebhookEvents).set({
          processingStatus: "PROCESSED",
          processedAt: new Date()
        }).where(eq(paymentWebhookEvents.id, webhookEvent.id))

      } catch (err: any) {
        // Mark event as failed
        await tx.update(paymentWebhookEvents).set({
          processingStatus: "FAILED",
          failureReason: err.message
        }).where(eq(paymentWebhookEvents.id, webhookEvent.id))
        throw err
      }
    })

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error("Webhook Processing Error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
