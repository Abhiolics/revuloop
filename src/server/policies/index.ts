import { db } from "@/server/db"
import { businessMembers } from "@/server/db/schema"
import { eq, and } from "drizzle-orm"
import { createClient } from "@/server/auth/supabase"

export type Role = "OWNER" | "MANAGER" | "STAFF" | "VIEWER" | "PLATFORM_ADMIN"

export class AuthorizationError extends Error {
  constructor(message: string = "Unauthorized access to business resources") {
    super(message)
    this.name = "AuthorizationError"
  }
}

export const policies = {
  /**
   * Resolves the current authenticated user from Supabase.
   * Throws if not authenticated.
   */
  async requireUser() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      throw new AuthorizationError("Authentication required")
    }
    
    return user
  },

  /**
   * Ensures the authenticated user has access to the specified business.
   * Returns the user's role in that business.
   * Throws if unauthorized.
   */
  async requireBusinessAccess(businessId: string, allowedRoles?: Role[]) {
    const user = await this.requireUser()
    
    const membership = await db.query.businessMembers.findFirst({
      where: and(
        eq(businessMembers.businessId, businessId),
        eq(businessMembers.userId, user.id) // user.id maps to profiles.authUserId in our schema, wait, profiles.id is different!
      )
    })

    // Note: In a real implementation, we need to map auth.users.id to profiles.id
    // Let's fetch the profile ID first.
    const profile = await db.query.profiles.findFirst({
      where: (profiles, { eq }) => eq(profiles.authUserId, user.id)
    })

    if (!profile) {
      throw new AuthorizationError("User profile not found")
    }

    const actualMembership = await db.query.businessMembers.findFirst({
      where: and(
        eq(businessMembers.businessId, businessId),
        eq(businessMembers.userId, profile.id)
      )
    })

    if (!actualMembership || actualMembership.status !== "ACTIVE") {
      throw new AuthorizationError()
    }

    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(actualMembership.role as Role)) {
        throw new AuthorizationError(`Requires one of: ${allowedRoles.join(", ")}`)
      }
    }

    return {
      user,
      profile,
      role: actualMembership.role as Role,
      membership: actualMembership
    }
  },

  /**
   * Ensures the user is a platform admin.
   */
  async requirePlatformAdmin() {
    const user = await this.requireUser()
    
    const profile = await db.query.profiles.findFirst({
      where: (profiles, { eq }) => eq(profiles.authUserId, user.id)
    })

    if (!profile || profile.platformRole !== "PLATFORM_ADMIN") {
      throw new AuthorizationError("Requires platform admin privileges")
    }

    return { user, profile }
  }
}
