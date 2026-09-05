import { db } from "@/server/db"
import { businesses, businessMembers, branches, googleLocations, profiles } from "@/server/db/schema"
import { eq, and } from "drizzle-orm"
import { policies } from "@/server/policies"
import { googlePlacesApi } from "@/server/integrations/google"

export const businessService = {
  /**
   * Completes the onboarding process by creating the business, branch, and optionally google location
   */
  async completeOnboarding(data: {
    business: { legalName: string; displayName: string; category: string }
    owner: { fullName: string; role: string; email: string; phone: string }
    location: { address: string; city: string; state: string; pinCode: string }
    google?: { placeId?: string; placeName?: string }
  }) {
    // 1. Get authenticated user
    const user = await policies.requireUser()

    // Ensure profile exists (it should via the Auth trigger, but let's double check)
    let profile = await db.query.profiles.findFirst({
      where: eq(profiles.authUserId, user.id)
    })

    if (!profile) {
      // Create the profile if it doesn't exist
      const [newProfile] = await db.insert(profiles).values({
        authUserId: user.id,
        email: user.email!, // Assuming user has email from Supabase auth
        fullName: data.owner.fullName,
        phone: data.owner.phone,
      }).returning()
      profile = newProfile
    } else {
      // Update profile with owner details
      await db.update(profiles).set({
        fullName: data.owner.fullName,
        phone: data.owner.phone,
      }).where(eq(profiles.id, profile.id))
    }

    // 2. Generate slug
    const baseSlug = data.business.displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    let slug = baseSlug
    let counter = 1
    
    // Simple collision check (could be optimized)
    while (true) {
      const existing = await db.query.businesses.findFirst({
        where: eq(businesses.slug, slug)
      })
      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // 3. Create records within a transaction
    return await db.transaction(async (tx) => {
      // Create Business
      const [business] = await tx.insert(businesses).values({
        legalName: data.business.legalName,
        displayName: data.business.displayName,
        slug,
        category: data.business.category,
        businessEmail: data.owner.email,
        businessPhone: data.owner.phone,
        ownerUserId: profile.id,
        onboardingStatus: "COMPLETED",
        workspaceStatus: "PAYMENT_PENDING" // Moves to next step
      }).returning()

      // Add Owner Role
      await tx.insert(businessMembers).values({
        businessId: business.id,
        userId: profile.id,
        role: "OWNER",
        status: "ACTIVE"
      })

      // Create Primary Branch
      const [branch] = await tx.insert(branches).values({
        businessId: business.id,
        name: "Main Branch",
        slug: "main",
        addressLine1: data.location.address,
        city: data.location.city,
        state: data.location.state,
        postalCode: data.location.pinCode,
        isPrimary: true
      }).returning()

      // Process Google Location if provided
      if (data.google?.placeId) {
        const placeDetails = await googlePlacesApi.getPlaceDetails(data.google.placeId)
        
        await tx.insert(googleLocations).values({
          businessId: business.id,
          branchId: branch.id,
          placeId: placeDetails.placeId,
          googleName: placeDetails.name,
          formattedAddress: placeDetails.address,
          latitude: placeDetails.lat?.toString(),
          longitude: placeDetails.lng?.toString(),
          mapsUri: placeDetails.mapsUri,
          writeReviewUri: placeDetails.writeReviewUri,
          ratingSnapshot: placeDetails.rating?.toString(),
          reviewCountSnapshot: placeDetails.reviews,
          verificationStatus: "VERIFIED"
        })
      }

      return business
    })
  },

  /**
   * Retrieves the current user's primary business
   */
  async getCurrentBusiness() {
    const user = await policies.requireUser()
    
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.authUserId, user.id)
    })

    if (!profile) return null

    // For simplicity in this demo, just grab the first active business they belong to
    const membership = await db.query.businessMembers.findFirst({
      where: and(
        eq(businessMembers.userId, profile.id),
        eq(businessMembers.status, "ACTIVE")
      ),
      with: {
        business: true
      }
    })

    if (!membership?.business) return null

    return membership.business
  }
}
