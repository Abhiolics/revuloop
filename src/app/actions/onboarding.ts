"use server"

import { businessService } from "@/server/services/businessService"
import { redirect } from "next/navigation"

export async function completeOnboardingAction(data: any) {
  try {
    await businessService.completeOnboarding(data)
    
    // Redirect to subscription/checkout once completed
    // Since we are inside a server action, this redirect throws an error that Next.js catches
    // to perform the redirect. We must NOT catch it and return {error} below.
  } catch (error: any) {
    console.error("Onboarding Error:", error)
    return { error: error.message || "Failed to complete onboarding" }
  }
  
  redirect("/checkout")
}
