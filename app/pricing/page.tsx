import type { Metadata } from "next"
import { PricingPageContent } from "./pricing-client"

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Invest in your visibility. One podcast appearance can generate new clients, speaking opportunities, book sales, and partnerships that far outweigh the subscription cost.",
  openGraph: {
    title: "Pricing | PodcastMatch AI",
    description:
      "Transparent plans for speakers, authors, coaches, and experts. Start free. Upgrade when the value is undeniable.",
    url: "https://podcastmatchai.com/pricing",
  },
}

export default function PricingPage() {
  return <PricingPageContent />
}
