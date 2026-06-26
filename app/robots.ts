import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://podcastmatchai.com"

const PUBLIC_PAGES = [
  "/",
  "/discover",
  "/how-it-works",
  "/features",
  "/pricing",
  "/success",
  "/contact",
  "/login",
  "/signup",
]

const PRIVATE_PATHS = [
  "/dashboard/",
  "/onboarding/",
  "/api/",
  "/auth/",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      /* Standard crawlers */
      {
        userAgent: "*",
        allow:     PUBLIC_PAGES,
        disallow:  PRIVATE_PATHS,
      },
      /* AI crawlers — explicit access to all public content */
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "anthropic-ai",
          "Googlebot",
          "Bytespider",
          "Meta-ExternalAgent",
        ],
        allow:    PUBLIC_PAGES,
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host:    BASE_URL,
  }
}
