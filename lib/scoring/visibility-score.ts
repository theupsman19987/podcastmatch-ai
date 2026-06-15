/* ═══════════════════════════════════════════════════════════
   Visibility Scoring Engine
   Pure functions — no DB calls, no side effects.
   Scores presence + structure + completion only.
   ═══════════════════════════════════════════════════════════ */

export interface ScoreInput {
  /* Profile */
  bio:             string | null
  websiteUrl:      string | null
  avatarUrl:       string | null
  fullName:        string | null
  /* Creator profile */
  speakingTopics:          string[]
  brandIdentityPopulated:  boolean
  audienceProfilePopulated: boolean
  /* DNA assessment */
  dnaCompleted:            boolean
  dnaCompletedAt:          string | null
  dnaPublishedWork:        string | null   /* s6_publishedWork  */
  dnaAudienceType:         string | null   /* s3_audienceType   */
  dnaAudienceChallenge:    string | null   /* s3_audienceChallenge */
  dnaAudienceOutcome:      string | null   /* s3_audienceOutcome   */
  dnaOneRememberedThing:   string | null   /* s7_oneRememberedThing */
  /* Activity */
  savedCount:              number
  profileUpdatedAt:        string | null
}

export interface ScoreBreakdown {
  authority: number   /* 0–25 */
  clarity:   number   /* 0–20 */
  audience:  number   /* 0–20 */
  readiness: number   /* 0–20 */
  growth:    number   /* 0–15 */
  total:     number   /* 0–100 */
}

/* Improvement flags — true = already achieved, no points to gain */
export interface ImprovementFlags {
  websiteAdded:             boolean   /* AUTHORITY +8  */
  mediaKitReady:            boolean   /* AUTHORITY +6  */
  publishedWork:            boolean   /* AUTHORITY +6  */
  bioSubstantial:           boolean   /* AUTHORITY +5  */
  oneLinerPresent:          boolean   /* CLARITY   +5  */
  topicsDefined:            boolean   /* CLARITY   +7  */
  assessmentComplete:       boolean   /* CLARITY   +8  */
  audienceDescribed:        boolean   /* AUDIENCE  +6  */
  audienceChallengeDefined: boolean   /* AUDIENCE  +7  */
  audienceOutcomeDefined:   boolean   /* AUDIENCE  +7  */
  bioCompleted:             boolean   /* READINESS +5  */
  profileComplete:          boolean   /* READINESS +10 */
  bookingReady:             boolean   /* READINESS +5  */
  recentActivity:           boolean   /* GROWTH    +5  */
  hasSavedMatches:          boolean   /* GROWTH    +5  */
  recentAssessment:         boolean   /* GROWTH    +5  */
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(Math.max(Math.round(n), lo), hi)
}

function daysSince(iso: string | null): number {
  if (!iso) return 9999
  return (Date.now() - new Date(iso).getTime()) / 86_400_000
}

/* ── Individual flag computations ─────────────────────────── */
export function computeFlags(i: ScoreInput): ImprovementFlags {
  const bioLen = (i.bio ?? "").trim().length

  /* Profile completeness (8 key fields) */
  const completionFields = [
    bioLen > 50,
    !!i.avatarUrl,
    !!i.websiteUrl?.trim(),
    i.dnaCompleted,
    i.speakingTopics.length >= 3,
    !!i.fullName?.trim(),
    i.brandIdentityPopulated,
    !!i.dnaAudienceType?.trim(),
  ]
  const filledCount  = completionFields.filter(Boolean).length
  const profilePct   = filledCount / completionFields.length

  return {
    websiteAdded:             !!i.websiteUrl?.trim(),
    mediaKitReady:            i.dnaCompleted && bioLen > 50,
    publishedWork:            !!i.dnaPublishedWork && !i.dnaPublishedWork.toLowerCase().includes("none"),
    bioSubstantial:           bioLen > 100,
    oneLinerPresent:          i.dnaCompleted && !!i.dnaOneRememberedThing?.trim(),
    topicsDefined:            i.speakingTopics.length >= 3,
    assessmentComplete:       i.dnaCompleted,
    audienceDescribed:        !!i.dnaAudienceType?.trim() || i.audienceProfilePopulated,
    audienceChallengeDefined: (i.dnaAudienceChallenge?.trim().length ?? 0) > 20,
    audienceOutcomeDefined:   (i.dnaAudienceOutcome?.trim().length ?? 0) > 20,
    bioCompleted:             bioLen > 50,
    profileComplete:          profilePct >= 0.75,
    bookingReady:             !!i.websiteUrl?.trim() && bioLen > 50 && i.dnaCompleted,
    recentActivity:           daysSince(i.profileUpdatedAt) <= 7,
    hasSavedMatches:          i.savedCount > 0,
    recentAssessment:         i.dnaCompleted && daysSince(i.dnaCompletedAt) <= 30,
  }
}

/* ── Main scoring function ────────────────────────────────── */
export function computeScore(i: ScoreInput): { breakdown: ScoreBreakdown; flags: ImprovementFlags } {
  const f = computeFlags(i)

  const authority = clamp(
    (f.websiteAdded   ? 8 : 0) +
    (f.mediaKitReady  ? 6 : 0) +
    (f.publishedWork  ? 6 : 0) +
    (f.bioSubstantial ? 5 : 0),
    0, 25
  )

  const clarity = clamp(
    (f.oneLinerPresent    ? 5 : 0) +
    (f.topicsDefined      ? 7 : 0) +
    (f.assessmentComplete ? 8 : 0),
    0, 20
  )

  const audience = clamp(
    (f.audienceDescribed        ? 6 : 0) +
    (f.audienceChallengeDefined ? 7 : 0) +
    (f.audienceOutcomeDefined   ? 7 : 0),
    0, 20
  )

  const readiness = clamp(
    (f.bioCompleted    ? 5  : 0) +
    (f.profileComplete ? 10 : 0) +
    (f.bookingReady    ? 5  : 0),
    0, 20
  )

  const growth = clamp(
    (f.recentActivity  ? 5 : 0) +
    (f.hasSavedMatches ? 5 : 0) +
    (f.recentAssessment? 5 : 0),
    0, 15
  )

  const total = clamp(authority + clarity + audience + readiness + growth, 0, 100)

  return {
    breakdown: { authority, clarity, audience, readiness, growth, total },
    flags: f,
  }
}
