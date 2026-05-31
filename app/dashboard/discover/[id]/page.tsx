import type { Metadata } from "next"
import { MOCK_PODCASTS } from "@/components/discovery/mock-data"
import { PROFILE_EXTENSION } from "@/components/podcast-profile/profile-mock"
import { ProfileHeader } from "@/components/podcast-profile/profile-header"
import { AIMatchPanel } from "@/components/podcast-profile/ai-match-panel"
import { PodcastDetails } from "@/components/podcast-profile/podcast-details"
import { HostActivity } from "@/components/podcast-profile/host-activity"
import { AudienceAlignment } from "@/components/podcast-profile/audience-alignment"
import { ProfileActions, MobileActionBar } from "@/components/podcast-profile/profile-actions"
import { RelatedPodcasts } from "@/components/podcast-profile/related-podcasts"
import { PodcastLinks } from "@/components/podcast-profile/podcast-links"

/* ═══════════════════════════════════════════════════════════
   AI Match Details + Podcast Profile page.
   Route: /dashboard/discover/[id]
   Layout: ProfileHeader | [Left column · Right sidebar]
           RelatedPodcasts (full width)

   Backend integration:
     - Replace MOCK_PODCASTS.find() with fetch(`/api/podcasts/${id}`)
     - Replace PROFILE_EXTENSION with fetch(`/api/podcasts/${id}/profile`)
     - All UI components are already typed and wired — swap data sources only.
   ═══════════════════════════════════════════════════════════ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const podcast = MOCK_PODCASTS.find(p => p.id === id)
  return {
    title: podcast
      ? `${podcast.name} — PodcastMatch AI`
      : "Podcast Profile — PodcastMatch AI",
    description: podcast?.description,
  }
}

export default async function PodcastProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const podcast = MOCK_PODCASTS.find(p => p.id === id) ?? MOCK_PODCASTS[0]

  /* Related: other podcasts with at least one shared category (excluding current) */
  const related = MOCK_PODCASTS
    .filter(p => p.id !== podcast.id && p.categories.some(c => podcast.categories.includes(c)))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4)

  return (
    <>
      {/* Bottom mobile bar — fixed */}
      <MobileActionBar podcast={podcast} />

      <div className="flex flex-col gap-7 max-w-[1400px] pb-24 lg:pb-0">

        {/* ── Profile header ──────────────────────────── */}
        <ProfileHeader podcast={podcast} />

        {/* ── Main layout ─────────────────────────────── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-7">

          {/* ── Left column ───────────────────────────── */}
          <div className="flex flex-1 flex-col gap-6 min-w-0">

            <AIMatchPanel
              podcast={podcast}
              aiFactors={PROFILE_EXTENSION.aiFactors}
            />

            <PodcastDetails
              podcast={podcast}
              episodeLength={PROFILE_EXTENSION.episodeLength}
              publishingSchedule={PROFILE_EXTENSION.publishingSchedule}
              guestStyle={PROFILE_EXTENSION.guestStyle}
              totalEpisodes={PROFILE_EXTENSION.totalEpisodes}
              estimatedReach={PROFILE_EXTENSION.estimatedReach}
              recentEpisodes={PROFILE_EXTENSION.recentEpisodes}
            />

            <HostActivity
              activity={PROFILE_EXTENSION.recentActivity}
              hostProfile={PROFILE_EXTENSION.hostProfile}
            />

            <AudienceAlignment
              podcast={podcast}
              audienceSegments={PROFILE_EXTENSION.audienceSegments}
              audienceSignals={PROFILE_EXTENSION.audienceSignals}
            />

            <PodcastLinks podcast={podcast} />

          </div>

          {/* ── Right sidebar (desktop only) ──────────── */}
          <div className="hidden lg:flex lg:w-[300px] xl:w-[320px] shrink-0 flex-col">
            <div className="sticky top-[calc(3.5rem+1.5rem)]">
              <ProfileActions podcast={podcast} />
            </div>
          </div>

        </div>

        {/* ── Related podcasts ────────────────────────── */}
        <RelatedPodcasts related={related} />

      </div>
    </>
  )
}
