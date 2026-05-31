import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://podmatch.ai"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow:     ["/", "/login", "/signup", "/forgot-password"],
        disallow:  [
          "/dashboard/",
          "/onboarding/",
          "/api/",
          "/auth/",
        ],
      },
      /* Allow AI crawlers full public access */
      {
        userAgent: ["GPTBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "anthropic-ai"],
        allow:     ["/", "/login", "/signup"],
        disallow:  ["/dashboard/", "/onboarding/", "/api/", "/auth/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host:    BASE_URL,
  }
}
