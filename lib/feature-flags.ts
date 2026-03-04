// Feature flags for the application
// Toggle features on/off during development

export const featureFlags = {
  // Landing page features
  showTrustBadge: false, // Social proof stars in hero
  showCustomerLogos: false, // Customer logo carousel
  
  // Dashboard features
  enableSemanticSearch: true, // Command bar with cmd+k
  enableCoverLetters: false, // Cover letter generation
  
  // Experimental features
  enableAIRewrite: false, // AI resume rewriting
  enableBulkUpload: false, // Upload multiple resumes at once
} as const

export type FeatureFlag = keyof typeof featureFlags

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return featureFlags[flag]
}
