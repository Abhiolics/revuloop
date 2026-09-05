import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Profiles
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  authUserId: uuid("auth_user_id").notNull().unique(), // maps to auth.users.id
  fullName: text("full_name"),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  avatarUrl: text("avatar_url"),
  platformRole: text("platform_role").default("USER").notNull(),
  status: text("status").default("ACTIVE").notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

// Businesses
export const businesses = pgTable("businesses", {
  id: uuid("id").primaryKey().defaultRandom(),
  legalName: text("legal_name").notNull(),
  displayName: text("display_name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  logoUrl: text("logo_url"),
  businessEmail: text("business_email"),
  businessPhone: text("business_phone"),
  onboardingStatus: text("onboarding_status").default("ONBOARDING_INCOMPLETE").notNull(),
  workspaceStatus: text("workspace_status").default("DRAFT").notNull(),
  timezone: text("timezone").default("Asia/Kolkata").notNull(),
  currency: text("currency").default("INR").notNull(),
  ownerUserId: uuid("owner_user_id").references(() => profiles.id).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
})

// Business Members (Roles)
export const businessMembers = pgTable("business_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id).notNull(),
  userId: uuid("user_id").references(() => profiles.id).notNull(),
  role: text("role").notNull(), // OWNER, MANAGER, STAFF, VIEWER
  status: text("status").default("ACTIVE").notNull(),
  invitedBy: uuid("invited_by").references(() => profiles.id),
  invitedAt: timestamp("invited_at", { withTimezone: true }),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  unq: uniqueIndex("business_members_business_id_user_id_idx").on(table.businessId, table.userId),
}))

// Branches
export const branches = pgTable("branches", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id).notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  email: text("email"),
  phone: text("phone"),
  addressLine1: text("address_line_1").notNull(),
  addressLine2: text("address_line_2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  countryCode: text("country_code").default("IN").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  timezone: text("timezone").default("Asia/Kolkata").notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  status: text("status").default("ACTIVE").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

// Google Locations
export const googleLocations = pgTable("google_locations", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id).notNull(),
  branchId: uuid("branch_id").references(() => branches.id).notNull().unique(),
  placeId: text("place_id").notNull(),
  googleName: text("google_name"),
  formattedAddress: text("formatted_address"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  mapsUri: text("maps_uri"),
  writeReviewUri: text("write_review_uri"),
  reviewsUri: text("reviews_uri"),
  ratingSnapshot: text("rating_snapshot"),
  reviewCountSnapshot: integer("review_count_snapshot"),
  verificationStatus: text("verification_status").default("PENDING").notNull(),
  lastValidatedAt: timestamp("last_validated_at", { withTimezone: true }),
  rawMetadata: jsonb("raw_metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

// Plans
export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  billingInterval: text("billing_interval").notNull(), // MONTHLY, YEARLY
  amountPaise: integer("amount_paise").notNull(),
  currency: text("currency").default("INR").notNull(),
  trialDays: integer("trial_days").default(0).notNull(),
  locationLimit: integer("location_limit").notNull(),
  memberLimit: integer("member_limit").notNull(),
  qrLimit: integer("qr_limit").notNull(),
  monthlyScanLimit: integer("monthly_scan_limit").notNull(),
  features: jsonb("features"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

// Subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id).notNull().unique(),
  planId: uuid("plan_id").references(() => plans.id).notNull(),
  provider: text("provider").default("RAZORPAY").notNull(),
  providerSubscriptionId: text("provider_subscription_id"),
  providerCustomerId: text("provider_customer_id"),
  status: text("status").notNull(), // ACTIVE, TRIALING, CANCELLED, etc.
  billingInterval: text("billing_interval").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  amountPaise: integer("amount_paise").notNull(),
  currency: text("currency").default("INR").notNull(),
  trialStartsAt: timestamp("trial_starts_at", { withTimezone: true }),
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

// Payments
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id).notNull(),
  subscriptionId: uuid("subscription_id").references(() => subscriptions.id),
  planId: uuid("plan_id").references(() => plans.id),
  provider: text("provider").default("RAZORPAY").notNull(),
  providerOrderId: text("provider_order_id"),
  providerPaymentId: text("provider_payment_id"),
  providerSignatureReference: text("provider_signature_reference"),
  amountPaise: integer("amount_paise").notNull(),
  currency: text("currency").default("INR").notNull(),
  status: text("status").notNull(),
  method: text("method"),
  failureCode: text("failure_code"),
  failureDescription: text("failure_description"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

// Payment Webhook Events
export const paymentWebhookEvents = pgTable("payment_webhook_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  provider: text("provider").notNull(),
  providerEventId: text("provider_event_id").notNull().unique(),
  eventType: text("event_type").notNull(),
  payloadHash: text("payload_hash"),
  processingStatus: text("processing_status").notNull(),
  receivedAt: timestamp("received_at", { withTimezone: true }).defaultNow().notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  failureReason: text("failure_reason"),
  retryCount: integer("retry_count").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

// QR Codes
export const qrCodes = pgTable("qr_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id).notNull(),
  branchId: uuid("branch_id").references(() => branches.id).notNull(),
  googleLocationId: uuid("google_location_id").references(() => googleLocations.id),
  name: text("name").notNull(),
  publicToken: text("public_token").notNull().unique(),
  slug: text("slug").notNull(),
  placementType: text("placement_type").notNull(),
  destinationType: text("destination_type").default("FEEDBACK_FORM").notNull(),
  status: text("status").default("ACTIVE").notNull(),
  styleConfig: jsonb("style_config"),
  scanCountCache: integer("scan_count_cache").default(0).notNull(),
  feedbackCountCache: integer("feedback_count_cache").default(0).notNull(),
  createdBy: uuid("created_by").references(() => profiles.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
})

// QR Scans
export const qrScans = pgTable("qr_scans", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id).notNull(),
  branchId: uuid("branch_id").references(() => branches.id).notNull(),
  qrCodeId: uuid("qr_code_id").references(() => qrCodes.id).notNull(),
  sessionId: text("session_id"),
  visitorHash: text("visitor_hash"),
  userAgentCategory: text("user_agent_category"),
  referrer: text("referrer"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  ipHash: text("ip_hash"),
  countryCode: text("country_code"),
  city: text("city"),
  scannedAt: timestamp("scanned_at", { withTimezone: true }).defaultNow().notNull(),
})

// Customers
export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id).notNull(),
  fullName: text("full_name"),
  email: text("email"),
  phone: text("phone"),
  firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).defaultNow().notNull(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).defaultNow().notNull(),
  totalFeedbackCount: integer("total_feedback_count").default(0).notNull(),
  averageRating: text("average_rating"),
  status: text("status").default("ACTIVE").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
})

// Feedback
export const feedback = pgTable("feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id).notNull(),
  branchId: uuid("branch_id").references(() => branches.id).notNull(),
  qrCodeId: uuid("qr_code_id").references(() => qrCodes.id),
  customerId: uuid("customer_id").references(() => customers.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  status: text("status").default("NEW").notNull(),
  sentiment: text("sentiment"),
  assignedTo: uuid("assigned_to").references(() => profiles.id),
  resolvedBy: uuid("resolved_by").references(() => profiles.id),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
})

// Customer Consents
export const customerConsents = pgTable("customer_consents", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id).notNull(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  consentType: text("consent_type").notNull(),
  status: text("status").notNull(),
  consentTextVersion: text("consent_text_version"),
  source: text("source"),
  ipHash: text("ip_hash"),
  userAgent: text("user_agent"),
  grantedAt: timestamp("granted_at", { withTimezone: true }),
  withdrawnAt: timestamp("withdrawn_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

// Feedback Notes
export const feedbackNotes = pgTable("feedback_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id).notNull(),
  feedbackId: uuid("feedback_id").references(() => feedback.id).notNull(),
  authorUserId: uuid("author_user_id").references(() => profiles.id).notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
})

// Email Deliveries
export const emailDeliveries = pgTable("email_deliveries", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id),
  recipient: text("recipient").notNull(), // Masked in logs/dashboard
  templateKey: text("template_key").notNull(),
  providerMessageId: text("provider_message_id"),
  status: text("status").notNull(),
  failureReason: text("failure_reason"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

// Audit Logs
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessId: uuid("business_id").references(() => businesses.id),
  actorUserId: uuid("actor_user_id").references(() => profiles.id),
  actorType: text("actor_type").notNull(),
  action: text("action").notNull(),
  resourceType: text("resource_type"),
  resourceId: text("resource_id"),
  beforeSnapshot: jsonb("before_snapshot"),
  afterSnapshot: jsonb("after_snapshot"),
  ipHash: text("ip_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

// RELATIONS DEFINITIONS

export const qrCodesRelations = relations(qrCodes, ({ one }) => ({
  business: one(businesses, {
    fields: [qrCodes.businessId],
    references: [businesses.id],
  }),
  branch: one(branches, {
    fields: [qrCodes.branchId],
    references: [branches.id],
  }),
}));

export const businessesRelations = relations(businesses, ({ many }) => ({
  branches: many(branches),
  members: many(businessMembers),
  qrCodes: many(qrCodes),
  feedback: many(feedback),
}));

export const businessMembersRelations = relations(businessMembers, ({ one }) => ({
  business: one(businesses, {
    fields: [businessMembers.businessId],
    references: [businesses.id],
  }),
}));

export const branchesRelations = relations(branches, ({ one }) => ({
  business: one(businesses, {
    fields: [branches.businessId],
    references: [businesses.id],
  }),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
  customer: one(customers, {
    fields: [feedback.customerId],
    references: [customers.id],
  }),
}));
