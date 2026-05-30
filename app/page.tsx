import { Hero } from "@/components/sections/hero"
import { StatsSection } from "@/components/sections/stats"
import { HowItWorksSection } from "@/components/sections/how-it-works"
import { SearchExperienceSection } from "@/components/sections/search-experience"
import { FeaturedPodcastsSection } from "@/components/sections/featured-podcasts"
import { TestimonialsSection } from "@/components/sections/testimonials"
import { PricingSection } from "@/components/sections/pricing"
import { FinalCtaSection } from "@/components/sections/final-cta"

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <StatsSection />
      <HowItWorksSection />
      <SearchExperienceSection />
      <FeaturedPodcastsSection />
      <TestimonialsSection />
      <PricingSection />
      <FinalCtaSection />
    </main>
  )
}
