"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/server/auth/supabase"
import { z } from "zod"

const signUpSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function signUpAction(formData: FormData) {
  const supabase = await createClient()

  const data = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const parsed = signUpSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Success - usually requires email verification
  redirect("/verify?email=" + encodeURIComponent(data.email))
}

export async function loginAction(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function verifyOtpAction(email: string, otp: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'email',
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/onboarding")
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function resendVerificationAction(email: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/callback`,
    },
  })
  
  if (error) {
    return { error: error.message }
  }
  return { success: true }
}

export async function signInWithGoogleAction() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/callback`,
    },
  })

  if (data.url) {
    redirect(data.url)
  }

  if (error) {
    return { error: error.message }
  }
}
