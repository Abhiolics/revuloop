"use server"

import { db } from "@/server/db"
import { feedback, customers, qrScans, qrCodes } from "@/server/db/schema"
import { eq, and, sql, desc, count, avg } from "drizzle-orm"
import { businessService } from "@/server/services/businessService"
import { policies } from "@/server/policies"

export async function getDashboardStatsAction() {
  try {
    const business = await businessService.getCurrentBusiness()
    if (!business) return { error: "No active business found" }
    
    // Auth check
    await policies.requireBusinessAccess(business.id)

    // Aggregate feedback stats
    const feedbackStats = await db.select({
      total: count(),
      averageRating: avg(feedback.rating),
      positive: count(sql`CASE WHEN ${feedback.sentiment} = 'POSITIVE' THEN 1 END`),
      neutral: count(sql`CASE WHEN ${feedback.sentiment} = 'NEUTRAL' THEN 1 END`),
      negative: count(sql`CASE WHEN ${feedback.sentiment} = 'NEGATIVE' THEN 1 END`),
    }).from(feedback).where(eq(feedback.businessId, business.id))

    // Customer count
    const [{ totalCustomers }] = await db.select({
      totalCustomers: count()
    }).from(customers).where(eq(customers.businessId, business.id))

    const stats = feedbackStats[0] || { total: 0, averageRating: "0", positive: 0, neutral: 0, negative: 0 }

    return {
      success: true,
      data: {
        totalFeedback: stats.total,
        averageRating: Number(stats.averageRating || 0).toFixed(1),
        totalCustomers,
        sentimentBreakdown: {
          positive: stats.positive,
          neutral: stats.neutral,
          negative: stats.negative
        }
      }
    }
  } catch (error: any) {
    return { error: error.message || "Failed to fetch dashboard stats" }
  }
}

export async function getRecentFeedbackAction(limit = 10) {
  try {
    const business = await businessService.getCurrentBusiness()
    if (!business) return { error: "No active business found" }
    
    await policies.requireBusinessAccess(business.id)

    const recentFeedback = await db.query.feedback.findMany({
      where: eq(feedback.businessId, business.id),
      orderBy: [desc(feedback.submittedAt)],
      limit,
      with: {
        customer: true,
      }
    })

    return { success: true, data: recentFeedback }
  } catch (error: any) {
    return { error: error.message || "Failed to fetch recent feedback" }
  }
}

export async function getDashboardBusinessAction() {
  try {
    const business = await businessService.getCurrentBusiness()
    if (!business) return { error: "No active business found" }
    
    return { 
      success: true, 
      data: { 
        name: business.displayName, 
        slug: business.slug,
        legalName: business.legalName,
        businessEmail: business.businessEmail,
        businessPhone: business.businessPhone,
        currency: business.currency,
        timezone: business.timezone
      } 
    }
  } catch (error: any) {
    return { error: error.message || "Failed to fetch business" }
  }
}
