import type { NextConfig } from "next"

/* ═══════════════════════════════════════════════════════════════
   Production configuration for PodcastMatch AI.
   ═══════════════════════════════════════════════════════════════ */

const nextConfig: NextConfig = {

  /* ── Performance ────────────────────────────────────────────── */
  poweredByHeader: false,      // Remove X-Powered-By: Next.js
  compress:        true,       // Enable gzip/brotli
  reactStrictMode: true,

  /* ── Image optimisation ─────────────────────────────────────── */
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
    remotePatterns: [
      /* Podcast Index artwork CDN */
      { protocol: "https", hostname: "**.podcastindex.org" },
      { protocol: "https", hostname: "**.podnews.net" },
      /* Common podcast artwork hosts */
      { protocol: "https", hostname: "**.libsyn.com" },
      { protocol: "https", hostname: "**.buzzsprout.com" },
      { protocol: "https", hostname: "**.podcastics.com" },
      { protocol: "https", hostname: "**.spreaker.com" },
      { protocol: "https", hostname: "**.anchor.fm" },
      { protocol: "https", hostname: "**.simplecast.com" },
      { protocol: "https", hostname: "**.transistor.fm" },
      { protocol: "https", hostname: "**.captivate.fm" },
      { protocol: "https", hostname: "**.zencast.fm" },
      { protocol: "https", hostname: "media.rss.com" },
      /* Apple Podcasts artwork */
      { protocol: "https", hostname: "**.mzstatic.com" },
      { protocol: "https", hostname: "**.apple.com" },
      /* Supabase storage */
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },

  /* ── Security headers ───────────────────────────────────────── */
  async headers() {
    const securityHeaders = [
      /* Prevent click-jacking */
      { key: "X-Frame-Options",        value: "SAMEORIGIN" },
      /* Block MIME-type sniffing */
      { key: "X-Content-Type-Options", value: "nosniff" },
      /* Control referrer info */
      { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
      /* Force HTTPS */
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      /* Permissions policy */
      {
        key:   "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
      /* DNS prefetch for performance */
      { key: "X-DNS-Prefetch-Control", value: "on" },
    ]

    return [
      {
        /* Apply to all routes */
        source:  "/:path*",
        headers: securityHeaders,
      },
      {
        /* Cache static assets aggressively */
        source:  "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ]
  },

  /* ── Supabase proxy ─────────────────────────────────────────── */
  // Browser calls https://podcastmatchai.com/sb/* (same-origin, no mixed-content).
  // Next.js server-side rewrites to Kong over plain HTTP — browser never sees it.
  // /auth/v1/* is a second rewrite so GOTRUE_SITE_URL can be the bare domain root
  // (https://www.podcastmatchai.com) and GoTrue email links resolve through the proxy.
  async rewrites() {
    const kong = "http://supabasekong-nzt6wv9k32n45xzst6vd5mmk.72.62.168.96.sslip.io"
    return [
      { source: "/sb/:path*",     destination: `${kong}/:path*` },
      { source: "/auth/v1/:path*", destination: `${kong}/auth/v1/:path*` },
    ]
  },

  /* ── Redirects ──────────────────────────────────────────────── */
  async redirects() {
    return [
      /* Legacy-friendly alias */
      { source: "/dashboard/discover", destination: "/dashboard", permanent: false },
    ]
  },

  /* ── Compiler ───────────────────────────────────────────────── */
  compiler: {
    /* Remove console.log in production */
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },
}

export default nextConfig
