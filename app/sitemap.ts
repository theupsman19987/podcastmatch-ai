import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://podcastmatchai.com"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    /* ── Core marketing pages ─────────────────────────── */
    {
      url:             BASE_URL,
      lastModified:    new Date("2026-06-25"),
      changeFrequency: "weekly",
      priority:        1.0,
    },
    {
      url:             `${BASE_URL}/discover`,
      lastModified:    new Date("2026-06-25"),
      changeFrequency: "weekly",
      priority:        0.9,
    },
    {
      url:             `${BASE_URL}/how-it-works`,
      lastModified:    new Date("2026-06-25"),
      changeFrequency: "monthly",
      priority:        0.8,
    },
    {
      url:             `${BASE_URL}/features`,
      lastModified:    new Date("2026-06-25"),
      changeFrequency: "monthly",
      priority:        0.8,
    },
    {
      url:             `${BASE_URL}/pricing`,
      lastModified:    new Date("2026-06-25"),
      changeFrequency: "monthly",
      priority:        0.8,
    },
    {
      url:             `${BASE_URL}/success`,
      lastModified:    new Date("2026-06-25"),
      changeFrequency: "monthly",
      priority:        0.7,
    },
    {
      url:             `${BASE_URL}/contact`,
      lastModified:    new Date("2026-06-25"),
      changeFrequency: "yearly",
      priority:        0.6,
    },

    /* ── Auth pages ────────────────────────────────────── */
    {
      url:             `${BASE_URL}/signup`,
      lastModified:    new Date("2026-06-25"),
      changeFrequency: "monthly",
      priority:        0.9,
    },
    {
      url:             `${BASE_URL}/login`,
      lastModified:    new Date("2026-06-25"),
      changeFrequency: "monthly",
      priority:        0.6,
    },

    /* ── Legal ─────────────────────────────────────────── */
    {
      url:             `${BASE_URL}/privacy`,
      lastModified:    new Date("2026-06-25"),
      changeFrequency: "yearly",
      priority:        0.3,
    },
    {
      url:             `${BASE_URL}/terms`,
      lastModified:    new Date("2026-06-25"),
      changeFrequency: "yearly",
      priority:        0.3,
    },
  ]
}
