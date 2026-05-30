import type { Metadata } from "next"
import { Syne, Inter, Geist_Mono } from "next/font/google"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/layout/footer"
import { HomepageJsonLd } from "@/components/seo/json-ld"
import { ConditionalShell } from "@/components/layout/conditional-shell"
import "./globals.css"

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "PodcastMatch AI — AI-Powered Podcast Guest Booking Platform",
  description:
    "PodcastMatch AI uses intelligent matching to connect speakers, authors, coaches, and creators with verified, actively-booking podcast hosts. Find your perfect podcast audience in minutes.",
  keywords: [
    "podcast guest booking",
    "AI podcast matching",
    "podcast discovery",
    "speaker visibility",
    "podcast guesting platform",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
        {/* Skip-to-content — keyboard accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999]
                     focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm
                     focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        {/* Navbar + Footer are hidden on /login and /signup */}
        <ConditionalShell navbar={<Navbar />} footer={<Footer />}>
          {children}
        </ConditionalShell>
      </body>
    </html>
  )
}
