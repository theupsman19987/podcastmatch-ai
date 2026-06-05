import type { Metadata } from "next"
import { FeaturesPageContent } from "./features-client"

export const metadata: Metadata = {
  title: "Features & Capabilities",
  description:
    "Discover the tools, intelligence, and insights designed to help speakers, authors, coaches, and experts get discovered by the right podcasts. Not a directory — a Visibility Intelligence Platform.",
  openGraph: {
    title: "Features & Capabilities | PodcastMatch AI",
    description:
      "Everything you need to grow your podcast visibility — AI matching, discovery engine, improvement roadmap, and growth tracking.",
    url: "https://podcastmatchai.com/features",
  },
}

export default function FeaturesPage() {
  return <FeaturesPageContent />
}
