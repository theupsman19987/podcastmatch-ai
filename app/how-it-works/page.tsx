import type { Metadata } from "next"
import { HowItWorksPageContent } from "./how-it-works-client"

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Discover how PodcastMatch AI's visibility intelligence system analyzes your expertise, scores your authority, and connects you with high-alignment podcast opportunities.",
  openGraph: {
    title: "How It Works | PodcastMatch AI",
    description:
      "Not a podcast directory. A Visibility Intelligence Platform. See how your Visibility Score is built, what it means, and how it connects you to the right opportunities.",
    url: "https://podcastmatchai.com/how-it-works",
  },
}

export default function HowItWorksPage() {
  return <HowItWorksPageContent />
}
