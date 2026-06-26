import type { Metadata } from "next"
import { HowItWorksPageContent } from "./how-it-works-client"

export const metadata: Metadata = {
  title: {
    absolute: "How PodcastMatch AI Works | Podcast Guest Matching Explained",
  },
  description:
    "See how PodcastMatch AI analyzes creator identity, audience fit, podcast relevance, and host activity signals to recommend better podcast opportunities for speakers, authors, and coaches.",
  alternates: {
    canonical: "https://podcastmatchai.com/how-it-works",
  },
  openGraph: {
    title:       "How PodcastMatch AI Works | Podcast Guest Matching Explained",
    description:
      "Not a podcast directory. A Visibility Intelligence Platform. See how your Visibility Score is built, what it means, and how it connects you to the right opportunities.",
    url: "https://podcastmatchai.com/how-it-works",
  },
}

export default function HowItWorksPage() {
  return <HowItWorksPageContent />
}
