import { type Metadata }   from "next"
import { createClient }    from "@/lib/supabase/server"
import { ActivationFlow }  from "@/components/onboarding/activation-flow"

export const metadata: Metadata = {
  title:  "Get Started | PodcastMatch AI",
  robots: { index: false, follow: false },
}

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const rawName   = (user?.user_metadata?.full_name as string | undefined) ?? ""
  const firstName = rawName.split(" ")[0] || ""

  return (
    <div className="min-h-screen bg-background">
      <ActivationFlow initialFirstName={firstName} />
    </div>
  )
}
