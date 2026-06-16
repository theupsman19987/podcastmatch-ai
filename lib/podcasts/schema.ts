/* ═══════════════════════════════════════════════════════════
   Podcast Data Schema — Phase 2 Intelligence Types

   PodcastRecord    — canonical import-layer type (any source)
   CuratedPodcast   — maps the full `podcasts` Supabase table
   ContactIntelligence — contact fields + rank
   AudienceIntelligence — audience targeting fields
   GuestIntelligence    — guest policy fields
   IntelligenceScores   — matching/scoring fields
   ═══════════════════════════════════════════════════════════ */

export type DataSource =
  | "podcast-index"
  | "apple"
  | "spotify"
  | "listen-notes"
  | "podchaser"
  | "curated"
  | "mock"

export type ActivityStatus = "active" | "hiatus" | "inactive"

export type EnrichmentStatus = "pending" | "partial" | "complete"

/** 1 = best (booking form) → 7 = last resort (no contact found) */
export type ContactMethodRank = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type ContactConfidence = "low" | "medium" | "high"

export type PreferredContactMethod =
  | "booking_form"
  | "producer_email"
  | "booking_email"
  | "host_email"
  | "linkedin"
  | "instagram"
  | "none"

export type PublishingFrequency =
  | "daily"
  | "multiple_weekly"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "irregular"

export type ExperienceLevel = "beginner" | "intermediate" | "advanced" | "expert" | "all"

export type GuestExperienceLevel = "emerging" | "established" | "expert" | "any"

export type GuestFrequency =
  | "every_episode"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "occasional"
  | "rarely"

/* ── Contact Intelligence ─────────────────────────────────── */
export interface ContactIntelligence {
  primaryEmail?:           string | null
  producerName?:           string | null
  producerEmail?:          string | null
  hostEmail?:              string | null
  bookingEmail?:           string | null
  contactFormUrl?:         string | null
  bookingLink?:            string | null
  instagramUrl?:           string | null
  linkedinUrl?:            string | null
  youtubeUrl?:             string | null
  twitterUrl?:             string | null
  contactMethodRank:       ContactMethodRank
  preferredContactMethod?: PreferredContactMethod | null
  contactConfidence:       ContactConfidence
  contactVerifiedAt?:      string | null
  outreachReady:           boolean
  contactNotes?:           string | null
}

/* ── Audience Intelligence ────────────────────────────────── */
export interface AudienceIntelligence {
  targetAudience?:          string | null
  audiencePainPoints:       string[]
  audienceGoals:            string[]
  industryFocus:            string[]
  experienceLevel?:         ExperienceLevel | null
  geographicFocus?:         string | null
  faithBased:               boolean
  businessFocused:          boolean
  personalDevelopment:      boolean
  leadershipFocused:        boolean
  entrepreneurshipFocused:  boolean
}

/* ── Guest Intelligence ───────────────────────────────────── */
export interface GuestIntelligence {
  acceptsGuests:            boolean
  guestRequirements?:       string | null
  typicalGuestType?:        string | null
  guestApplicationRequired: boolean
  guestExpertiseAreas:      string[]
  guestExperienceLevel?:    GuestExperienceLevel | null
  remoteInterviews:         boolean
  videoInterviews:          boolean
  audioOnly:                boolean
  interviewLengthMin?:      number | null
  avgGuestFrequency?:       GuestFrequency | null
}

/* ── Intelligence Scores ─────────────────────────────────── */
export interface IntelligenceScores {
  authorityScore:           number  // 0–100 credibility & longevity
  guestFriendlinessScore:   number  // 0–100 openness to guests
  visibilityScore:          number  // 0–100 cross-platform reach
  responseProbabilityScore: number  // 0–100 likelihood of reply
  audienceAlignmentScore:   number  // 0–100 set at match-time, per creator
  matchQualityScore:        number  // 0–100 composite of all 4 podcast scores
}

/* ── Data Quality Flags ───────────────────────────────────── */
export interface DataQualityFlags {
  isDuplicate:          boolean
  duplicateOf?:         string | null
  websiteVerified:      boolean
  websiteVerifiedAt?:   string | null
  publishingVerified:   boolean
  lastVerifiedAt?:      string | null
  abandonedFlag:        boolean
  categoryStandardized: boolean
}

/* ── Canonical podcast record (import layer) ──────────────── */
export interface PodcastRecord {
  id:             string       // normalized: source_externalId (e.g. "pi_920666")
  externalId:     string       // raw ID from source API
  source:         DataSource

  name:           string
  host:           string
  description:    string

  categories:     string[]
  rawCategories?: string[]

  rssFeed:        string
  website?:       string
  appleUrl?:      string
  spotifyUrl?:    string
  podcastUrl?:    string

  episodeCount:   number
  lastPublished?: string
  language:       string

  artwork?:       string

  guestFriendly:  boolean
  activityStatus: ActivityStatus
  importedAt:     string
}

/* ── Curated podcast (full `podcasts` Supabase table row) ─── */
export interface CuratedPodcast {
  // Identity
  id:                      string
  slug:                    string

  // Basic metadata
  podcastName:             string
  hostName:                string
  coHostName:              string | null
  description:             string | null
  artworkUrl:              string | null

  // Taxonomy
  category:                string
  subcategory:             string | null
  categories:              string[]
  publishingFrequency:     PublishingFrequency | null

  // Platform links
  rssFeedUrl:              string | null
  website:                 string | null
  appleUrl:                string | null
  spotifyUrl:              string | null

  // Content stats
  episodeCount:            number
  lastEpisodeDate:         string | null
  language:                string
  activityStatus:          ActivityStatus

  // Intelligence groups
  contact:                 ContactIntelligence
  audience:                AudienceIntelligence
  guest:                   GuestIntelligence
  scores:                  IntelligenceScores
  quality:                 DataQualityFlags

  // RSS enrichment cache
  rssOwnerName:            string | null
  rssOwnerEmail:           string | null
  rssParsedAt:             string | null

  // Admin
  enrichmentStatus:        EnrichmentStatus
  qualityScore:            number
  curated:                 boolean
  notes:                   string | null

  createdAt:               string
  updatedAt:               string
}

/* ── Search / filter params ───────────────────────────────── */
export interface PodcastSearchParams {
  q?:                      string
  category?:               string
  language?:               string
  activityStatus?:         ActivityStatus
  guestFriendly?:          boolean
  faithBased?:             boolean
  businessFocused?:        boolean
  personalDevelopment?:    boolean
  leadershipFocused?:      boolean
  entrepreneurshipFocused?: boolean
  minAuthorityScore?:      number
  minVisibilityScore?:     number
  outreachReady?:          boolean
  page?:                   number
  pageSize?:               number
}

/* ── API response envelope ────────────────────────────────── */
export interface PodcastApiResponse {
  data:       import("@/components/discovery/mock-data").DiscoveryPodcast[]
  total:      number
  page:       number
  pageSize:   number
  totalPages: number
  source:     DataSource | "mock"
}

/* ── Duplicate detection ─────────────────────────────────── */
export interface DeduplicationResult {
  unique:     PodcastRecord[]
  duplicates: Array<{ kept: PodcastRecord; duplicate: PodcastRecord; reason: string }>
}

/* ── Intelligence summary (from podcast_intelligence_summary view) ── */
export interface IntelligenceSummary {
  totalPodcasts:      number
  active:             number
  onHiatus:           number
  inactive:           number
  abandoned:          number
  duplicates:         number
  acceptsGuests:      number
  outreachReady:      number
  hasBookingForm:     number
  hasProducerEmail:   number
  noContact:          number
  faithBased:         number
  businessFocused:    number
  personalDevelopment: number
  leadershipFocused:  number
  entrepreneurshipFocused: number
  avgAuthorityScore:  number
  avgFriendlinessScore: number
  avgVisibilityScore: number
  avgResponseScore:   number
  fullyEnriched:      number
  curated:            number
}
