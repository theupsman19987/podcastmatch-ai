import { type Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const metadata: Metadata = {
  title: "Beta Metrics | Internal",
  robots: { index: false, follow: false },
}

// ── Access control ───────────────────────────────────────────
const ADMIN_EMAILS = ["theupsman1998@gmail.com"]

// ── Types ────────────────────────────────────────────────────
interface ActivationMetrics {
  total_users: number
  activated_users: number
  cta_users: number
  avg_hours_to_first_action: number | null
}

interface EngagementMetrics {
  total_outreaches: number
  total_outreach_users: number
  avg_outreach_per_user: number
  return_rate: number
  checkin_completion_rate: number
}

interface OutcomeMetrics {
  total_outreaches: number
  responses: number
  bookings: number
  follow_ups: number
  response_rate: number
  booking_rate: number
  follow_up_rate: number
}

interface ContactMethodRow {
  contact_method_rank: number
  total_outreaches: number
  responses: number
  bookings: number
  response_rate: number
  booking_rate: number
}

interface TopPodcastRow {
  podcast_name: string
  attempts: number
  response_rate: number
  booking_rate: number
}

interface MatchScoreRow {
  score_bucket: string
  attempts: number
  response_rate: number
  booking_rate: number
}

// ── Helpers ───────────────────────────────────────────────────
function pct(numerator: number, denominator: number): number {
  if (!denominator) return 0
  return Math.round((numerator / denominator) * 100)
}

function fmt(n: number | null | undefined, suffix = ""): string {
  if (n == null) return "—"
  return `${n}${suffix}`
}

// ── Page ─────────────────────────────────────────────────────
export default async function AdminMetricsPage() {
  // Auth gate
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    redirect("/dashboard")
  }

  const admin = createAdminClient()

  // Fetch all data in parallel
  const [
    activationRes,
    engagementRes,
    outcomeRes,
    contactMethodRes,
    topPodcastsRes,
    matchScoreRes,
  ] = await Promise.all([
    admin.rpc("get_admin_activation_metrics"),
    admin.rpc("get_admin_engagement_metrics"),
    admin.rpc("get_admin_outcome_metrics"),
    admin.rpc("get_contact_method_performance"),
    admin.rpc("get_admin_top_podcasts"),
    admin.rpc("get_admin_match_score_correlation"),
  ])

  // Parse with safe defaults
  const A = ((activationRes.data ?? {}) as unknown) as ActivationMetrics
  const E = ((engagementRes.data ?? {}) as unknown) as EngagementMetrics
  const O = ((outcomeRes.data ?? {}) as unknown) as OutcomeMetrics
  const contactMethods: ContactMethodRow[] = ((contactMethodRes.data ?? []) as unknown) as ContactMethodRow[]
  const topPodcasts: TopPodcastRow[] = ((topPodcastsRes.data ?? []) as unknown) as TopPodcastRow[]
  const matchScores: MatchScoreRow[] = ((matchScoreRes.data ?? []) as unknown) as MatchScoreRow[]

  // Derived percentages (activation/cta are % of total_users)
  const activationRate = pct(A.activated_users ?? 0, A.total_users ?? 0)
  const ctaClickRate = pct(A.cta_users ?? 0, A.total_users ?? 0)

  // Red flag thresholds
  const flags = [
    { label: "CTA click rate", value: ctaClickRate,          threshold: 30, display: `${ctaClickRate}%` },
    { label: "Response rate",  value: O.response_rate ?? 0,  threshold: 15, display: `${O.response_rate ?? 0}%` },
    { label: "Booking rate",   value: O.booking_rate ?? 0,   threshold: 5,  display: `${O.booking_rate ?? 0}%` },
    { label: "Return rate",    value: E.return_rate ?? 0,    threshold: 20, display: `${E.return_rate ?? 0}%` },
  ]
  const hasFlags = flags.some(f => f.value < f.threshold)

  const now = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="flex flex-col gap-8 px-4 py-6 md:px-6 lg:px-8 max-w-screen-2xl mx-auto w-full">

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Beta Metrics Dashboard</h1>
          <p className="text-xs text-gray-500 mt-0.5">Internal only · not user-facing</p>
        </div>
        <span className="text-xs text-gray-600 mt-1">Fetched {now} ET</span>
      </div>

      {/* ── Snapshot row (always visible) ────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SnapCard label="Total Users"      value={fmt(A.total_users)} />
        <SnapCard label="Total Outreaches" value={fmt(O.total_outreaches)} />
        <SnapCard label="Response Rate"    value={`${O.response_rate ?? 0}%`} red={(O.response_rate ?? 0) < 15} />
        <SnapCard label="Booking Rate"     value={`${O.booking_rate ?? 0}%`}  red={(O.booking_rate ?? 0) < 5} />
      </div>

      {/* ── Red Flags ─────────────────────────────────────────── */}
      <div className={`rounded-lg border p-4 ${hasFlags ? "bg-red-950/30 border-red-900/50" : "bg-emerald-950/20 border-emerald-900/40"}`}>
        <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${hasFlags ? "text-red-400" : "text-emerald-500"}`}>
          {hasFlags ? "Red Flags" : "All Clear"}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {flags.map(f => {
            const bad = f.value < f.threshold
            return (
              <div key={f.label} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${bad ? "bg-red-500" : "bg-emerald-500"}`} />
                <span className={`text-sm ${bad ? "text-red-300" : "text-gray-400"}`}>
                  {f.label}: <strong className="text-white">{f.display}</strong>
                  <span className={`ml-1 text-xs ${bad ? "text-red-500" : "text-gray-600"}`}>
                    (need {f.threshold}%+)
                  </span>
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Section 1: Activation ────────────────────────────── */}
      <Section label="1 — Activation">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Activation Rate"
            value={`${activationRate}%`}
            sub={`${A.activated_users ?? 0} of ${A.total_users ?? 0} users reached match results`}
          />
          <StatCard
            label="CTA Click Rate"
            value={`${ctaClickRate}%`}
            sub={`${A.cta_users ?? 0} users clicked apply / email / message`}
            red={ctaClickRate < 30}
          />
          <StatCard
            label="Time to First Action"
            value={A.avg_hours_to_first_action != null ? `${A.avg_hours_to_first_action}h` : "—"}
            sub="avg hours from onboarding start → first CTA click"
          />
        </div>
      </Section>

      {/* ── Section 2: Engagement ────────────────────────────── */}
      <Section label="2 — Engagement">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Avg Outreach per User"
            value={fmt(E.avg_outreach_per_user ?? 0)}
            sub={`${E.total_outreaches ?? 0} total outreaches · ${E.total_outreach_users ?? 0} users`}
          />
          <StatCard
            label="Return Rate (24–72h)"
            value={`${E.return_rate ?? 0}%`}
            sub="users who returned within 3 days of first session"
            red={(E.return_rate ?? 0) < 20}
          />
          <StatCard
            label="Outcome Check-in Completion"
            value={`${E.checkin_completion_rate ?? 0}%`}
            sub="outreaches with follow-up / response / booking logged"
          />
        </div>
      </Section>

      {/* ── Section 3: Outcomes ──────────────────────────────── */}
      <Section label="3 — Outcomes" note="Most Important">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Response Rate"
            value={`${O.response_rate ?? 0}%`}
            sub={`${O.responses ?? 0} responses from ${O.total_outreaches ?? 0} outreaches`}
            red={(O.response_rate ?? 0) < 15}
            large
          />
          <StatCard
            label="Booking Rate"
            value={`${O.booking_rate ?? 0}%`}
            sub={`${O.bookings ?? 0} bookings from ${O.total_outreaches ?? 0} outreaches`}
            red={(O.booking_rate ?? 0) < 5}
            large
          />
          <StatCard
            label="Follow-Up Rate"
            value={`${O.follow_up_rate ?? 0}%`}
            sub={`${O.follow_ups ?? 0} follow-ups from ${O.total_outreaches ?? 0} outreaches`}
            large
          />
        </div>
      </Section>

      {/* ── Section 4: System Intelligence ───────────────────── */}
      <Section label="4 — System Intelligence">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Contact method performance */}
          <DataTable
            title="Contact Method Performance"
            headers={["Method Rank", "Attempts", "Response Rate", "Booking Rate"]}
            empty="No data yet — need 3+ attempts per method."
            rows={contactMethods.map(r => [
              `Rank ${r.contact_method_rank}`,
              String(r.total_outreaches),
              `${r.response_rate}%`,
              `${r.booking_rate}%`,
            ])}
          />

          {/* Match score vs outcome */}
          <DataTable
            title="Match Score vs Outcome"
            headers={["Score Bucket", "Attempts", "Response Rate", "Booking Rate"]}
            empty="No data yet — outreaches need to be linked to matched podcasts."
            rows={matchScores.map(r => [
              r.score_bucket,
              String(r.attempts),
              `${r.response_rate}%`,
              `${r.booking_rate}%`,
            ])}
          />
        </div>

        {/* Top converting podcasts */}
        <div className="mt-6">
          <DataTable
            title="Top Converting Podcasts"
            headers={["Podcast", "Attempts", "Response Rate", "Booking Rate"]}
            empty="No outreach data yet."
            wide
            rows={topPodcasts.map(r => [
              r.podcast_name,
              String(r.attempts),
              `${r.response_rate}%`,
              `${r.booking_rate}%`,
            ])}
          />
        </div>
      </Section>

    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────

function Section({ label, note, children }: {
  label: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Section {label}</p>
        {note && <span className="text-xs text-yellow-500/80">{note}</span>}
      </div>
      {children}
    </div>
  )
}

function SnapCard({ label, value, red }: { label: string; value: string; red?: boolean }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className={`text-2xl font-bold ${red ? "text-red-400" : "text-white"}`}>{value}</p>
    </div>
  )
}

function StatCard({ label, value, sub, red = false, large = false }: {
  label: string
  value: string
  sub: string
  red?: boolean
  large?: boolean
}) {
  return (
    <div className={`bg-gray-900 rounded-lg p-4 border ${large ? "border-gray-700" : "border-gray-800"}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`font-bold mb-1 ${large ? "text-4xl" : "text-3xl"} ${red ? "text-red-400" : "text-white"}`}>
        {value}
      </p>
      <p className="text-xs text-gray-500">{sub}</p>
    </div>
  )
}

function DataTable({ title, headers, rows, empty, wide }: {
  title: string
  headers: string[]
  rows: string[][]
  empty: string
  wide?: boolean
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <p className="text-sm font-semibold text-gray-300 mb-3">{title}</p>
      {rows.length === 0 ? (
        <p className="text-sm text-gray-600">{empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {headers.map((h, i) => (
                  <th
                    key={h}
                    className={`pb-2 text-xs text-gray-500 font-medium ${i === 0 ? "text-left" : "text-right"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b border-gray-800/40 last:border-0">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`py-2 ${ci === 0 ? `text-gray-300 ${wide ? "max-w-xs truncate" : ""}` : "text-right text-gray-400"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
