/* ═══════════════════════════════════════════════════════════
   SEO Schema builders — JSON-LD structured data.

   How to use on new pages:
     import { webPageSchema, breadcrumbSchema, faqPageSchema } from "@/lib/seo/schemas"
     export async function generateMetadata() { ... }
     // in JSX: <PageJsonLd schemas={[webPageSchema(...), breadcrumbSchema(...)]} />

   Scale paths:
   - Podcast category pages: webPageSchema + softwareApplicationSchema
   - FAQ pages: faqPageSchema(items) from CMS/database
   - Blog/GEO content: articleSchema (add when needed)
   - Speaker niche pages: webPageSchema + breadcrumbSchema + reviewSchema
   ═══════════════════════════════════════════════════════════ */

export const SITE_CONFIG = {
  url:         "https://podcastmatchai.com",
  name:        "PodcastMatch AI",
  description:
    "PodcastMatch AI is an AI-powered podcast guest matching platform that helps creators, coaches, speakers, authors, and entrepreneurs discover high-fit podcast opportunities through advanced audience alignment scoring and host activity intelligence.",
  logoUrl:     "https://podcastmatchai.com/logo.png",
  twitterUrl:  "https://twitter.com/podmatchai",
  linkedinUrl: "https://linkedin.com/company/podmatchai",
  instagramUrl: "https://instagram.com/podmatchai",
  youtubeUrl:  "https://youtube.com/@podmatchai",
} as const

/* ── SoftwareApplication ─────────────────────────────── */
export function softwareApplicationSchema() {
  return {
    "@context":              "https://schema.org",
    "@type":                 "SoftwareApplication",
    "name":                  SITE_CONFIG.name,
    "applicationCategory":   "BusinessApplication",
    "applicationSubCategory": "PodcastDiscoveryPlatform",
    "operatingSystem":       "Web",
    "description":           SITE_CONFIG.description,
    "url":                   SITE_CONFIG.url,
    "inLanguage":            "en-US",
    "offers": [
      {
        "@type":         "Offer",
        "name":          "Starter",
        "price":         "29.00",
        "priceCurrency": "USD",
        "priceValidUntil": "2026-12-31",
        "description":   "AI Podcast Discovery — 50 matches/month, Audience Alignment Scoring",
      },
      {
        "@type":         "Offer",
        "name":          "Professional",
        "price":         "79.00",
        "priceCurrency": "USD",
        "priceValidUntil": "2026-12-31",
        "description":   "Unlimited AI Podcast Matches, Advanced Visibility Analytics, AI Pitch Personalization",
      },
      {
        "@type":         "Offer",
        "name":          "Visibility Pro",
        "price":         "149.00",
        "priceCurrency": "USD",
        "priceValidUntil": "2026-12-31",
        "description":   "White-glove podcast visibility service with dedicated strategist",
      },
    ],
    "featureList": [
      "AI Podcast Guest Matching",
      "Audience Alignment Scoring",
      "Host Activity Insights",
      "Podcast Visibility Analytics",
      "AI-Generated Pitch Personalization",
      "Booking Probability Scoring",
      "Creator Opportunity Queue",
      "Podcast Outreach Intelligence",
    ],
  }
}

/* ── Organization ────────────────────────────────────── */
export function organizationSchema() {
  return {
    "@context":     "https://schema.org",
    "@type":        "Organization",
    "name":         SITE_CONFIG.name,
    "url":          SITE_CONFIG.url,
    "logo": {
      "@type": "ImageObject",
      "url":   SITE_CONFIG.logoUrl,
    },
    "description":  SITE_CONFIG.description,
    "foundingDate": "2024",
    "knowsAbout": [
      "Podcast Guest Matching",
      "AI Podcast Discovery",
      "Creator Visibility",
      "Podcast Audience Alignment",
      "Speaker Podcast Outreach",
      "Podcast Guest Opportunities",
      "Podcast Visibility Analytics",
      "Creator Growth Marketing",
    ],
    "sameAs": [
      SITE_CONFIG.twitterUrl,
      SITE_CONFIG.linkedinUrl,
      SITE_CONFIG.instagramUrl,
      SITE_CONFIG.youtubeUrl,
    ],
    "contactPoint": {
      "@type":             "ContactPoint",
      "contactType":       "customer support",
      "availableLanguage": "English",
    },
  }
}

/* ── WebSite ─────────────────────────────────────────── */
export function webSiteSchema() {
  return {
    "@context":   "https://schema.org",
    "@type":      "WebSite",
    "name":       SITE_CONFIG.name,
    "url":        SITE_CONFIG.url,
    "description": SITE_CONFIG.description,
    "inLanguage": "en-US",
    "potentialAction": {
      "@type":  "SearchAction",
      "target": {
        "@type":       "EntryPoint",
        "urlTemplate": `${SITE_CONFIG.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    "publisher": {
      "@type": "Organization",
      "name":  SITE_CONFIG.name,
      "url":   SITE_CONFIG.url,
    },
  }
}

/* ── FAQPage — pass CMS/static items ────────────────── */
export interface FaqItem {
  question: string
  answer:   string
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    "@context":   "https://schema.org",
    "@type":      "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name":  item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text":  item.answer,
      },
    })),
  }
}

/* ── BreadcrumbList — for inner pages ───────────────── */
export interface BreadcrumbItem {
  name: string
  url:  string
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context":        "https://schema.org",
    "@type":           "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type":    "ListItem",
      "position": index + 1,
      "name":     item.name,
      "item":     item.url,
    })),
  }
}

/* ── WebPage — for standard content pages ───────────── */
export interface WebPageOpts {
  title:         string
  description:   string
  url:           string
  datePublished?: string
  dateModified?:  string
}

export function webPageSchema(opts: WebPageOpts) {
  return {
    "@context":   "https://schema.org",
    "@type":      "WebPage",
    "name":       opts.title,
    "description": opts.description,
    "url":        opts.url,
    "inLanguage": "en-US",
    "isPartOf":   { "@type": "WebSite", "url": SITE_CONFIG.url },
    "publisher":  {
      "@type": "Organization",
      "name":  SITE_CONFIG.name,
      "url":   SITE_CONFIG.url,
    },
    ...(opts.datePublished && { "datePublished": opts.datePublished }),
    ...(opts.dateModified  && { "dateModified":  opts.dateModified  }),
  }
}

/* ── Speakable — AI assistant & voice search ─────────
   References data-speakable CSS selectors on key blocks.
   Add data-speakable="hero-headline" to the h1 in hero.tsx
   and data-speakable="geo-description" to the GEO footer section.
   ──────────────────────────────────────────────────── */
export function speakableSchema() {
  return {
    "@context":  "https://schema.org",
    "@type":     "WebPage",
    "url":       SITE_CONFIG.url,
    "speakable": {
      "@type":      "SpeakableSpecification",
      "cssSelector": [
        "[data-speakable='hero-headline']",
        "[data-speakable='geo-description']",
        "[data-speakable='product-description']",
      ],
    },
  }
}

/* ── Review schema — wire when real reviews available ─
   Placeholder structure for future Trustpilot / G2 integration.
   ──────────────────────────────────────────────────── */
export interface ReviewItem {
  author:      string
  ratingValue: number
  body:        string
  datePublished: string
}

export function reviewSchema(reviews: ReviewItem[]) {
  return reviews.map(r => ({
    "@context": "https://schema.org",
    "@type":    "Review",
    "author": {
      "@type": "Person",
      "name":  r.author,
    },
    "reviewRating": {
      "@type":       "Rating",
      "ratingValue": r.ratingValue,
      "bestRating":  5,
    },
    "reviewBody":    r.body,
    "datePublished": r.datePublished,
    "itemReviewed": {
      "@type": "SoftwareApplication",
      "name":  SITE_CONFIG.name,
    },
  }))
}
