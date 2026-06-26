import type { Metadata } from "next"
import { PricingPageContent } from "./pricing-client"

export const metadata: Metadata = {
  title: {
    absolute: "PodcastMatch AI Pricing | Podcast Guest Matching Plans",
  },
  description:
    "Choose a PodcastMatch AI plan built for creators who want better podcast discovery, outreach support, and visibility growth. Invest in your visibility.",
  alternates: {
    canonical: "https://podcastmatchai.com/pricing",
  },
  openGraph: {
    title:       "PodcastMatch AI Pricing | Podcast Guest Matching Plans",
    description:
      "Transparent plans for speakers, authors, coaches, and experts. Start free. Upgrade when the value is undeniable.",
    url: "https://podcastmatchai.com/pricing",
  },
}

export default function PricingPage() {
  return <PricingPageContent />
}
