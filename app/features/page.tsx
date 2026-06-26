import type { Metadata } from "next"
import { FeaturesPageContent } from "./features-client"

export const metadata: Metadata = {
  title: {
    absolute: "Podcast Guest Outreach Software | PodcastMatch AI Features",
  },
  description:
    "Explore podcast discovery, audience matching, host activity signals, pitch support, saved matches, and booking readiness tools for speakers, authors, coaches, and creators.",
  alternates: {
    canonical: "https://podcastmatchai.com/features",
  },
  openGraph: {
    title:       "Podcast Guest Outreach Software | PodcastMatch AI Features",
    description:
      "Everything you need to grow your podcast visibility — AI matching, discovery engine, improvement roadmap, and growth tracking.",
    url: "https://podcastmatchai.com/features",
  },
}

export default function FeaturesPage() {
  return <FeaturesPageContent />
}
