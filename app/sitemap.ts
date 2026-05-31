import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://podmatch.ai"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    /* ── Marketing / public pages ─────────────────────────── */
    {
      url:             BASE_URL,
      lastModified:    now,
      changeFrequency: "weekly",
      priority:        1.0,
    },
    {
      url:             `${BASE_URL}/login`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.8,
    },
    {
      url:             `${BASE_URL}/signup`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.9,
    },
    {
      url:             `${BASE_URL}/forgot-password`,
      lastModified:    now,
      changeFrequency: "yearly",
      priority:        0.3,
    },

    /* ── Onboarding ───────────────────────────────────────── */
    {
      url:             `${BASE_URL}/onboarding/creator-dna`,
      lastModified:    now,
      changeFrequency: "monthly",
      priority:        0.7,
    },

    /* ── Legal ────────────────────────────────────────────── */
    {
      url:             `${BASE_URL}/privacy`,
      lastModified:    now,
      changeFrequency: "yearly",
      priority:        0.4,
    },
    {
      url:             `${BASE_URL}/terms`,
      lastModified:    now,
      changeFrequency: "yearly",
      priority:        0.4,
    },
  ]
}
