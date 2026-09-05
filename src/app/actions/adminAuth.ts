"use server"

import { cookies } from "next/headers"
import crypto from "crypto"
import { Resend } from "resend"
import { db } from "@/server/db"
import { sql, count } from "drizzle-orm"
import { businesses, profiles, qrCodes, feedback } from "@/server/db/schema"

const ADMIN_EMAIL = "abhaysinghrajput1685@gmail.com"
const resend = new Resend(process.env.RESEND_API_KEY)
const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || "fallback_secret_key_if_missing"

export async function sendAdminOtpAction(email: string) {
  if (email.toLowerCase() !== ADMIN_EMAIL) {
    return { error: "Unauthorized email address." }
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  // Hash it
  const hash = crypto.createHmac('sha256', SECRET).update(otp).digest('hex')
  const expiresAt = Date.now() + 5 * 60 * 1000 // 5 mins to enter OTP

  const cookieStore = await cookies()
  cookieStore.set('admin_otp_hash', `${hash}.${expiresAt}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: 5 * 60,
  })

  // Send Email via Resend
  console.log(`\n===========================================`)
  console.log(`🔐 ADMIN OTP GENERATED: ${otp}`)
  console.log(`===========================================\n`)

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: ADMIN_EMAIL,
      subject: 'RevuLoop Admin Portal - Verification Code',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Admin Authentication</h2>
          <p>Your highly secure verification code is:</p>
          <h1 style="letter-spacing: 0.2em; color: #E85D3F;">${otp}</h1>
          <p>This code expires in 5 minutes.</p>
        </div>
      `
    })

    if (error) {
      console.error("Resend API returned an error:", error)
      // We still return success if in development so you can use the terminal code
      if (process.env.NODE_ENV !== 'production') {
        return { success: true, message: "Email failed but OTP logged to terminal." }
      }
      return { error: "Failed to send email. Check Resend configuration." }
    }

    return { success: true }
  } catch (err) {
    console.error("Resend error:", err)
    return { error: "Failed to send email via Resend." }
  }
}

export async function verifyAdminOtpAction(email: string, token: string) {
  if (email.toLowerCase() !== ADMIN_EMAIL) {
    return { error: "Unauthorized email address." }
  }

  const cookieStore = await cookies()
  const otpHashCookie = cookieStore.get('admin_otp_hash')

  if (!otpHashCookie) {
    return { error: "OTP expired or not requested." }
  }

  const [storedHash, expiresAt] = otpHashCookie.value.split('.')

  if (Date.now() > parseInt(expiresAt)) {
    return { error: "OTP has expired." }
  }

  const providedHash = crypto.createHmac('sha256', SECRET).update(token).digest('hex')

  if (providedHash !== storedHash) {
    return { error: "Invalid OTP code." }
  }

  // Verification successful. Clear the OTP cookie and set the session cookie.
  cookieStore.delete('admin_otp_hash')

  const sessionExpiresAt = Date.now() + 10 * 60 * 1000 // 10 mins from now
  const sessionSignature = crypto.createHmac('sha256', SECRET).update(sessionExpiresAt.toString()).digest('hex')

  cookieStore.set('admin_session', `${sessionExpiresAt}.${sessionSignature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: 10 * 60,
  })

  return { success: true }
}

export async function getAllBusinessesAdminAction() {
  try {
    // For simplicity, we can fetch all businesses and their owner profiles.
    // If we want exact counts of QRs and Feedback, we might need multiple queries or complex joins.
    // Let's do a basic fetch with relational queries for now.
    const allBiz = await db.query.businesses.findMany({
      with: {
        qrCodes: true,
        feedback: true
      },
      orderBy: (businesses, { desc }) => [desc(businesses.createdAt)]
    })

    const owners = await db.query.profiles.findMany()
    const ownerMap = new Map(owners.map(o => [o.id, o.fullName || o.email]))

    const formattedData = allBiz.map(biz => ({
      id: biz.id,
      name: biz.displayName,
      owner: ownerMap.get(biz.ownerUserId) || "Unknown",
      plan: "Free Trial", // Mock plan as subscriptions aren't fully fleshed out
      status: biz.workspaceStatus.toLowerCase(),
      mrr: 0, // Mock MRR
      qrs: biz.qrCodes?.length || 0,
      feedback: biz.feedback?.length || 0
    }))

    // Global Stats
    const totalMrr = 0;
    const activeBusinesses = allBiz.filter(b => b.workspaceStatus === "ACTIVE").length
    const totalFeedback = allBiz.reduce((sum, b) => sum + (b.feedback?.length || 0), 0)
    
    return { 
      success: true, 
      data: {
        businesses: formattedData,
        stats: {
          totalMrr,
          activeBusinesses,
          totalFeedback,
          failedPayments: 0
        }
      } 
    }
  } catch (error: any) {
    console.error("Admin fetch error:", error)
    return { error: "Failed to fetch admin data." }
  }
}

