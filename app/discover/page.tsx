import type { Metadata } from "next"
import { DiscoverPageContent } from "./discover-client"

export const metadata: Metadata = {
  title: "Find Podcasts To Be A Guest On | PodcastMatch AI",
  description:
    "Discover podcast opportunities matched to your expertise, audience, message, and outreach readiness with PodcastMatch AI.",
  alternates: {
    canonical: "https://podcastmatchai.com/discover",
  },
  openGraph: {
    title:       "Find Podcasts To Be A Guest On | PodcastMatch AI",
    description:
      "Discover podcast opportunities matched to your expertise, audience, message, and outreach readiness.",
    url: "https://podcastmatchai.com/discover",
  },
}

export default function DiscoverPage() {
  return <DiscoverPageContent />
}
