import type { Metadata } from "next"
import { Hero } from "@/components/sections/hero"

export const metadata: Metadata = {
  title: {
    absolute: "PodcastMatch AI | AI Podcast Guest Booking Platform",
  },
  description:
    "PodcastMatch AI helps speakers, authors, coaches, consultants, and creators discover better-fit podcast opportunities, improve outreach, and build authority through intelligent podcast matching.",
  alternates: {
    canonical: "https://podcastmatchai.com",
  },
  openGraph: {
    title:       "PodcastMatch AI | AI Podcast Guest Booking Platform",
    description:
      "PodcastMatch AI helps speakers, authors, coaches, consultants, and creators discover better-fit podcast opportunities, improve outreach, and build authority through intelligent podcast matching.",
    url: "https://podcastmatchai.com",
  },
}
import { StatsSection } from "@/components/sections/stats"
import { HowItWorksSection } from "@/components/sections/how-it-works"
import { SearchExperienceSection } from "@/components/sections/search-experience"
import { FeaturedPodcastsSection } from "@/components/sections/featured-podcasts"
import { TestimonialsSection } from "@/components/sections/testimonials"
import { FinalCtaSection } from "@/components/sections/final-cta"

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <StatsSection />
      <HowItWorksSection />
      <SearchExperienceSection />
      <FeaturedPodcastsSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </main>
  )
}
