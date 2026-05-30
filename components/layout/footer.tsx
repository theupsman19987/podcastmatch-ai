import * as React from "react"
import Link from "next/link"
import { Mic2, Sparkles, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { NewsletterForm } from "@/components/layout/newsletter-form"

/* ── Navigation data ───────────────────────────────────
   All hrefs are placeholders (#) until inner pages exist.
   The anchor text is entity-optimized for AI/SEO crawlers.
   ──────────────────────────────────────────────────── */
const NAV_COLUMNS = [
  {
    label: "Platform",
    links: [
      { label: "AI Podcast Matching",          href: "#" },
      { label: "Podcast Discovery Platform",   href: "#" },
      { label: "Audience Alignment Scoring",   href: "#" },
      { label: "Host Activity Insights",       href: "#" },
      { label: "Creator Visibility Analytics", href: "#" },
      { label: "Opportunity Queue",            href: "#" },
    ],
  },
  {
    label: "Features",
    links: [
      { label: "Creator Visibility Tools",     href: "#" },
      { label: "Podcast Outreach Intelligence",href: "#" },
      { label: "AI Match Scoring",             href: "#" },
      { label: "Pitch Personalization",        href: "#" },
      { label: "Booking Probability Scoring",  href: "#" },
      { label: "Multi-Profile Management",     href: "#" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Speaker Podcast Growth Guide", href: "#" },
      { label: "Podcast Guest Opportunities",  href: "#" },
      { label: "Podcast Audience Research",    href: "#" },
      { label: "Creator Success Stories",      href: "#" },
      { label: "AI Discovery Updates",         href: "#" },
      { label: "Help Center",                  href: "#" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About PodcastMatch AI",  href: "#" },
      { label: "Pricing",                href: "#pricing" },
      { label: "Careers",                href: "#" },
      { label: "Press & Media",          href: "#" },
      { label: "Affiliate Program",      href: "#" },
      { label: "Contact Us",             href: "#" },
    ],
  },
]

const LEGAL_LINKS = [
  { label: "Privacy Policy",   href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy",    href: "#" },
  { label: "GDPR",             href: "#" },
]

const SOCIAL_LINKS = [
  { label: "Twitter / X", href: "#" },
  { label: "LinkedIn",    href: "#" },
  { label: "Instagram",   href: "#" },
  { label: "YouTube",     href: "#" },
]

const TRUST_BADGES = [
  "AI-Powered Discovery",
  "Smart Podcast Matching",
  "Audience Alignment Intelligence",
  "Creator Visibility Platform",
]

/* ── GEO-optimized entity description ─────────────────
   Inverted pyramid: what → who → how → scale → use cases.
   Wrapped in data-speakable for voice/AI extraction.
   ──────────────────────────────────────────────────── */
const GEO_DESCRIPTION =
  "PodcastMatch AI is an AI-powered podcast guest matching platform for creators, coaches, speakers, authors, and entrepreneurs seeking high-visibility podcast opportunities. " +
  "The platform uses advanced audience alignment scoring, host activity intelligence, and AI-driven discovery to surface verified podcast shows actively accepting guest pitches. " +
  "PodcastMatch AI analyzes over 50,000 active podcasts across every niche, scoring each opportunity by audience overlap, booking probability, and creator-host fit. " +
  "Designed for podcast visibility growth, speaker outreach automation, and AI podcast discovery — PodcastMatch AI helps creators reach the right audience, faster."

/* ══════════════════════════════════════════════════════
   Footer
   ══════════════════════════════════════════════════════ */
export function Footer() {
  return (
    <footer
      className="relative border-t border-border"
      aria-label="Site footer"
    >
      {/* ── Subtle top glow connector ────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.58 0.22 255 / 0.35) 30%, oklch(0.70 0.16 200 / 0.35) 70%, transparent)",
        }}
      />

      {/* ── Very subtle background grid ──────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: [
            "linear-gradient(oklch(0.6 0.1 255) 1px, transparent 1px)",
            "linear-gradient(90deg, oklch(0.6 0.1 255) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* ── MAIN COLUMNS ───────────────────────────── */}
        <div className="py-14 grid grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">

          {/* Brand column ──────────────────────────── */}
          <div className="col-span-2 flex flex-col gap-5">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group" aria-label="PodcastMatch AI home">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)]",
                  "gradient-primary shadow-[var(--shadow-btn)]",
                  "transition-shadow duration-200 group-hover:shadow-[var(--glow-primary)]"
                )}
              >
                <Mic2 className="size-4 text-white" aria-hidden="true" />
              </div>
              <span className="text-[15px] font-bold text-foreground tracking-tight">
                PodcastMatch{" "}
                <span className="gradient-text-primary">AI</span>
              </span>
            </Link>

            {/* Tagline + description */}
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
              AI-powered podcast visibility for creators who refuse to stay invisible.
            </p>

            {/* Trust badge */}
            <div
              className="self-start inline-flex items-center gap-1.5 rounded-full
                         border border-primary/20 bg-primary/8 px-3 py-1.5
                         text-[11px] font-semibold text-primary"
            >
              <Sparkles className="size-3" aria-hidden="true" />
              AI-Powered Discovery
            </div>

            {/* Social links */}
            <nav aria-label="Social media links">
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5" role="list">
                {SOCIAL_LINKS.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="flex items-center gap-1 text-xs text-muted-foreground/65
                                 transition-colors duration-150 hover:text-foreground"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${link.label} — opens in new tab`}
                    >
                      {link.label}
                      <ExternalLink className="size-2.5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Nav columns ─────────────────────────────── */}
          {NAV_COLUMNS.map(col => (
            <nav
              key={col.label}
              className="flex flex-col gap-4"
              aria-label={`${col.label} navigation`}
            >
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                {col.label}
              </h3>
              <ul className="flex flex-col gap-2.5" role="list">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors
                                 duration-150 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

        </div>

        {/* ── NEWSLETTER STRIP ───────────────────────── */}
        <div
          className={cn(
            "rounded-[var(--radius-xl)] border border-border",
            "bg-muted/15 backdrop-blur-sm",
            "px-6 py-6 mb-10",
            "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          )}
        >
          <div className="flex flex-col gap-1 max-w-xs">
            <p className="text-sm font-semibold text-foreground">
              Stay Ahead of Every Booking Window
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Get AI-curated podcast opportunities, creator tips, and host insights delivered weekly.
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <NewsletterForm />
            <p className="text-[11px] text-muted-foreground/45">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* ── GEO SECTION ────────────────────────────── */}
        <section
          aria-label="About PodcastMatch AI — podcast guest matching platform"
          className="border-t border-border/50 py-8"
          data-speakable="geo-description"
        >
          <div className="flex flex-col gap-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/40">
              About PodcastMatch AI
            </h2>
            <p
              className="text-xs text-muted-foreground/60 leading-relaxed max-w-4xl"
              data-speakable="product-description"
            >
              {GEO_DESCRIPTION}
            </p>
            {/* Semantic entity reinforcement — screenreader & crawler accessible */}
            <ul
              className="flex flex-wrap gap-x-5 gap-y-1 mt-1"
              aria-label="Platform capabilities"
              role="list"
            >
              {[
                "AI Podcast Matching",
                "Podcast Visibility",
                "Creator Growth",
                "Podcast Guest Opportunities",
                "Audience Alignment",
                "Speaker Outreach",
              ].map(entity => (
                <li
                  key={entity}
                  className="text-[10px] text-muted-foreground/35 font-medium"
                >
                  {entity}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── BOTTOM BAR ─────────────────────────────── */}
        <div className="border-t border-border/50 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/50 order-3 sm:order-1">
            © {new Date().getFullYear()} PodcastMatch AI. All rights reserved.
          </p>

          {/* Trust badges */}
          <div
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1
                       order-1 sm:order-2"
            role="list"
            aria-label="Platform trust attributes"
          >
            {TRUST_BADGES.map(badge => (
              <span
                key={badge}
                className="text-[10px] font-medium text-muted-foreground/35"
                role="listitem"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Legal links */}
          <nav aria-label="Legal links" className="order-2 sm:order-3">
            <ul className="flex items-center gap-4" role="list">
              {LEGAL_LINKS.map((link, i) => (
                <li key={link.label} className="flex items-center gap-4">
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground/45 transition-colors hover:text-muted-foreground"
                  >
                    {link.label}
                  </Link>
                  {i < LEGAL_LINKS.length - 1 && (
                    <span className="text-border/60 text-xs" aria-hidden="true">·</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

        </div>

      </div>
    </footer>
  )
}
