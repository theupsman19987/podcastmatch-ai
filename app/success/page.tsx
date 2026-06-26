import type { Metadata } from "next"
import { SuccessPageContent } from "./success-client"

export const metadata: Metadata = {
  title: {
    absolute: "Creator Success Stories | PodcastMatch AI Podcast Booking Results",
  },
  description:
    "Real speakers, authors, coaches, and experts growing their visibility through PodcastMatch AI. See the outcomes — not just the platform.",
  alternates: {
    canonical: "https://podcastmatchai.com/success",
  },
  openGraph: {
    title:       "Creator Success Stories | PodcastMatch AI Podcast Booking Results",
    description:
      "Real people. Real visibility. Real opportunities. See how creators are transforming their podcast presence.",
    url: "https://podcastmatchai.com/success",
  },
}

export default function SuccessPage() {
  return <SuccessPageContent />
}
