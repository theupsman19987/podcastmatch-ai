import type { Metadata } from "next"
import { DiscoverPageContent } from "./discover-client"

export const metadata: Metadata = {
  title: "Discover Opportunities",
  description:
    "AI-powered visibility discovery. Curated podcast opportunities matched to your expertise, audience, and goals — not a keyword search.",
  openGraph: {
    title: "Discover Podcast Opportunities | PodcastMatch AI",
    description:
      "AI-powered visibility discovery. Curated podcast opportunities matched to your expertise, audience, and goals.",
    url: "https://podcastmatchai.com/discover",
  },
}

export default function DiscoverPage() {
  return <DiscoverPageContent />
}
