import { z } from "zod"

const envSchema = z.object({
  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  DATABASE_URL: z.string().url(),
  DIRECT_DATABASE_URL: z.string().url().optional(),

  // Razorpay
  RAZORPAY_KEY_ID: z.string().optional().nullable().transform(v => v || undefined),
  RAZORPAY_KEY_SECRET: z.string().optional().nullable().transform(v => v || undefined),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional().nullable().transform(v => v || undefined),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional().nullable().transform(v => v || undefined),

  // Google
  GOOGLE_MAPS_API_KEY: z.string().optional().nullable().transform(v => v || undefined),

  // Email
  RESEND_API_KEY: z.string().optional().nullable().transform(v => v || undefined),
  EMAIL_FROM: z.string().email().default("noreply@revuloop.com"),

  // Integrations
  REDIS_URL: z.string().url().optional(),
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),

  // Security
  CRON_SECRET: z.string().min(1).optional(),
  ENCRYPTION_KEY: z.string().min(1).optional(),
})

// Extract the process.env object safely, mapping standard keys to match the schema
const processEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_DATABASE_URL: process.env.DIRECT_DATABASE_URL,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  REDIS_URL: process.env.REDIS_URL,
  SENTRY_DSN: process.env.SENTRY_DSN,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  CRON_SECRET: process.env.CRON_SECRET,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
}

const parsed = envSchema.safeParse(processEnv)

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors)
  throw new Error("Invalid environment variables")
}

export const env = parsed.data
