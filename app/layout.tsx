import type { Metadata, Viewport } from "next"
import { Syne, Inter, Geist_Mono } from "next/font/google"
import { Navbar }           from "@/components/navigation/navbar"
import { Footer }           from "@/components/layout/footer"
import { HomepageJsonLd }   from "@/components/seo/json-ld"
import { ConditionalShell } from "@/components/layout/conditional-shell"
import "./globals.css"

const syne = Syne({
  variable: "--font-syne",
  subsets:  ["latin"],
  weight:   ["400", "500", "600", "700", "800"],
  display:  "swap",
  preload:  true,
})

const inter = Inter({
  variable: "--font-inter",
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600", "700"],
  display:  "swap",
  preload:  true,
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets:  ["latin"],
  display:  "swap",
  preload:  false,
})

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://podcastmatchai.com"

export const viewport: Viewport = {
  themeColor:     "#7c3aed",
  width:          "device-width",
  initialScale:   1,
  maximumScale:   5,
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default:  "PodcastMatch AI — AI-Powered Podcast Guest Booking Platform",
    template: "%s | PodcastMatch AI",
  },

  description:
    "PodcastMatch AI uses intelligent matching to connect speakers, authors, coaches, and creators with verified, actively-booking podcast hosts. Find your perfect podcast audience in minutes.",

  keywords: [
    "podcast guest booking",
    "AI podcast matching",
    "podcast discovery",
    "speaker visibility",
    "podcast guesting platform",
    "podcast pitch automation",
    "find podcast guests",
    "podcast outreach tool",
    "creator visibility",
    "podcast marketing",
  ],

  authors:  [{ name: "PodcastMatch AI", url: BASE_URL }],
  creator:  "PodcastMatch AI",
  publisher: "PodcastMatch AI",

  /* ── Open Graph ──────────────────────────────────────────── */
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:          BASE_URL,
    siteName:    "PodcastMatch AI",
    title:       "PodcastMatch AI — AI-Powered Podcast Guest Booking",
    description:
      "Discover AI-matched podcast opportunities. Get personalized outreach angles, audience alignment scores, and visibility rankings — built for speakers, authors, coaches, and creators.",
  },

  /* ── Twitter / X ─────────────────────────────────────────── */
  twitter: {
    card:        "summary_large_image",
    site:        "@podmatchai",
    creator:     "@podmatchai",
    title:       "PodcastMatch AI — AI-Powered Podcast Guest Booking",
    description:
      "Discover AI-matched podcast opportunities. Built for speakers, authors, coaches, and creators.",
  },

  /* ── Robots ──────────────────────────────────────────────── */
  robots: {
    index:               true,
    follow:              true,
    googleBot: {
      index:             true,
      follow:            true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":     -1,
    },
  },

  /* ── App links / PWA ─────────────────────────────────────── */
  manifest:     "/manifest.json",
  icons: {
    icon:       [
      { url: "/favicon.ico",   sizes: "any" },
      { url: "/icon.svg",      type:  "image/svg+xml" },
    ],
    apple:      "/apple-touch-icon.png",
  },

  /* ── Alternate ───────────────────────────────────────────── */
  alternates: {
    canonical: BASE_URL,
  },

  /* ── Verification (fill in when accounts are set up) ─────── */
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${inter.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <HomepageJsonLd />
      </head>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999]
                     focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm
                     focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <ConditionalShell navbar={<Navbar />} footer={<Footer />}>
          {children}
        </ConditionalShell>
      </body>
    </html>
  )
}
