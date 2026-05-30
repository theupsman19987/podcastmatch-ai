import { type Metadata } from "next"
import { DNAProvider } from "@/components/onboarding/dna-context"
import { DNAWizard } from "@/components/onboarding/dna-wizard"

export const metadata: Metadata = {
  title: "Creator DNA Assessment | PodcastMatch AI",
  description: "Tell us about yourself so we can find your perfect podcast matches.",
  robots: { index: false, follow: false },
}

export default function CreatorDNAPage() {
  return (
    <DNAProvider>
      <DNAWizard />
    </DNAProvider>
  )
}
