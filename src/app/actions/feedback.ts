"use server"

import { db } from "@/server/db"
import { feedback, qrCodes, qrScans, businesses, branches, customers, customerConsents } from "@/server/db/schema"
import { eq, and } from "drizzle-orm"
import { z } from "zod"

const feedbackSchema = z.object({
  qrToken: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  contact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
  }).optional(),
  consents: z.object({
    marketing: z.boolean().default(false),
  }).optional(),
})

export async function getPublicBusinessBySlugAction(slug: string) {
  try {
    const business = await db.query.businesses.findFirst({
      where: eq(businesses.slug, slug),
      columns: {
        id: true,
        displayName: true,
        slug: true,
        logoUrl: true
      }
    })
    
    if (!business) return { error: "Business not found" }
    
    return { success: true, data: business }
  } catch (error: any) {
    return { error: error.message || "Failed to fetch business" }
  }
}

export async function submitFeedbackAction(data: any) {
  try {
    const parsed = feedbackSchema.safeParse(data)
    if (!parsed.success) {
      return { error: "Invalid feedback data", details: parsed.error }
    }

    const { qrToken, rating, comment, contact, consents } = parsed.data

    // 1. Resolve QR token to business and branch
    let qr = await db.query.qrCodes.findFirst({
      where: and(
        eq(qrCodes.publicToken, qrToken),
        eq(qrCodes.status, "ACTIVE")
      ),
      with: {
        business: true,
        branch: true,
      }
    })

    if (!qr) {
      // Fallback: Check if qrToken is a business slug (for testing/development)
      const business = await db.query.businesses.findFirst({
        where: eq(businesses.slug, qrToken),
        with: { branches: true }
      })

      if (business && business.branches.length > 0) {
        // Create a default QR code on the fly for testing
        const [newQr] = await db.insert(qrCodes).values({
          businessId: business.id,
          branchId: business.branches[0].id,
          name: "Main Counter",
          publicToken: business.slug,
          slug: business.slug,
          placementType: "COUNTER",
        }).returning()

        qr = {
          ...newQr,
          business,
          branch: business.branches[0]
        } as any
      }
    }

    if (!qr || !qr.business || !qr.branch) {
      return { error: "Invalid or inactive QR code" }
    }

    if (qr.business.workspaceStatus !== "ACTIVE" && qr.business.workspaceStatus !== "TRIAL" && qr.business.workspaceStatus !== "PAYMENT_PENDING") {
      return { error: "Business is not active" }
    }

    await db.transaction(async (tx) => {
      // 2. Handle Customer creation/update
      let customerId = null
      
      if (contact && (contact.phone || contact.email)) {
        // Simple search for existing customer
        const conditions = []
        if (contact.email) conditions.push(eq(customers.email, contact.email))
        if (contact.phone) conditions.push(eq(customers.phone, contact.phone))
        
        // This is a bit simplified; ideally we check if EITHER match
        // Or we just insert new if not found. Let's just insert for this implementation
        const [customer] = await tx.insert(customers).values({
          businessId: qr.businessId,
          fullName: contact.name,
          email: contact.email || null,
          phone: contact.phone || null,
          totalFeedbackCount: 1, // Will need a trigger or periodic update to keep accurate
        }).returning()

        customerId = customer.id

        // 3. Handle Consent
        if (consents?.marketing) {
          await tx.insert(customerConsents).values({
            businessId: qr.businessId,
            customerId: customerId,
            consentType: "MARKETING_COMMUNICATIONS",
            status: "GRANTED",
            grantedAt: new Date()
          })
        }
      }

      // 4. Insert Feedback
      await tx.insert(feedback).values({
        businessId: qr.businessId,
        branchId: qr.branchId,
        qrCodeId: qr.id,
        customerId,
        rating,
        comment: comment || null,
        status: "NEW",
        sentiment: rating >= 4 ? "POSITIVE" : rating === 3 ? "NEUTRAL" : "NEGATIVE",
      })

      // 5. Update QR Scan Stats (Simplified)
      // Ideally this is handled by a separate scan tracking endpoint when they first load the page
      // But we'll increment feedback count here
      await tx.update(qrCodes).set({
        feedbackCountCache: qr.feedbackCountCache + 1
      }).where(eq(qrCodes.id, qr.id))
    })

    return { 
      success: true, 
      redirectUrl: `/r/${qr.business.slug}/thank-you?rating=${rating}`
    }
  } catch (error: any) {
    console.error("Feedback Submission Error:", error)
    return { error: `Failed to submit feedback: ${error.message || error}` }
  }
}
