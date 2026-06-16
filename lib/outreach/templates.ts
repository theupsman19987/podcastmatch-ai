/* ═══════════════════════════════════════════════════════════
   Outreach Templates — rank-specific pitch copy.
   Auto-substitutes known values (podcast name, host name).
   Remaining placeholders (in CAPS) are for the user to fill.
   ═══════════════════════════════════════════════════════════ */

import type { ContactMethodRank } from "@/lib/podcasts/schema"

export interface OutreachTemplate {
  rank:      ContactMethodRank
  method:    string
  subject?:  string   // email subject line (ranks 2-4)
  body:      string
}

export interface TemplateVars {
  podcastName:  string
  producerName?: string | null
  hostName?:    string | null
}

/* ── Raw templates with {{slot}} substitution markers ───── */
const RAW_TEMPLATES: Record<Exclude<ContactMethodRank, 7>, Omit<OutreachTemplate, "rank">> = {
  1: {
    method:  "Booking Form",
    body:
`Hi {{podcastName}} Team,

I'd love to be considered as a guest on your show.

I help [YOUR AUDIENCE] achieve [RESULT] through [YOUR METHOD], and I believe your audience would benefit from a conversation around [SPECIFIC TOPIC].

A few topic ideas:

• [TOPIC 1]
• [TOPIC 2]
• [TOPIC 3]

I've personally [YOUR CREDIBILITY/STORY], and I focus on delivering practical, real-world value your listeners can apply immediately.

Thank you for the opportunity — I'd love to contribute.

– [YOUR NAME]`,
  },

  2: {
    method:  "Producer Email",
    subject: "Guest Idea for {{podcastName}}",
    body:
`Hi {{producerName}},

I'm reaching out with a potential guest idea for {{podcastName}}.

I work with [YOUR AUDIENCE] and help them [RESULT] through [YOUR METHOD].

I believe your audience would connect with topics like:

• [TOPIC 1]
• [TOPIC 2]
• [TOPIC 3]

I'd love to contribute if this aligns with your upcoming episodes.

Thank you for your time,
[YOUR NAME]`,
  },

  3: {
    method:  "Booking Email",
    subject: "Guest Idea for {{podcastName}}",
    body:
`Hi {{podcastName}} Team,

I'm reaching out with a potential guest idea for your show.

I work with [YOUR AUDIENCE] and help them [RESULT] through [YOUR METHOD].

I believe your audience would connect with topics like:

• [TOPIC 1]
• [TOPIC 2]
• [TOPIC 3]

I'd love to contribute if this aligns with your upcoming episodes.

Thank you for your time,
[YOUR NAME]`,
  },

  4: {
    method:  "Host Email",
    subject: "Appreciate your show — guest idea",
    body:
`Hi {{hostName}},

I've been following your work and really appreciate the conversations you're having on {{podcastName}}.

I wanted to reach out with a potential guest idea. My work focuses on [YOUR TOPIC — what you help people with], and I think it would resonate with your audience.

I'd love to bring a real, practical conversation your listeners can take action on.

If it's a fit, I'd be honored to join you.

– [YOUR NAME]`,
  },

  5: {
    method: "LinkedIn",
    body:
`Hi {{hostName}}, I came across {{podcastName}} and really respect what you're building.

I help [YOUR AUDIENCE] with [YOUR TOPIC] and I think your audience would connect with that message.

Would love to explore being a guest if it aligns — happy to share more.`,
  },

  6: {
    method: "Instagram DM",
    body:
`Hey — love what you're doing with {{podcastName}}.

I help people [YOUR TOPIC]. Would love to come on as a guest if you're open to it.`,
  },
}

/* ── Substitution helper ─────────────────────────────────── */
function substitute(text: string, vars: TemplateVars): string {
  return text
    .replace(/\{\{podcastName\}\}/g,  vars.podcastName)
    .replace(/\{\{producerName\}\}/g, vars.producerName ?? "Team")
    .replace(/\{\{hostName\}\}/g,     vars.hostName ?? vars.podcastName)
}

/* ── Public API ──────────────────────────────────────────── */
export function getOutreachTemplate(
  rank: Exclude<ContactMethodRank, 7>,
  vars: TemplateVars
): OutreachTemplate {
  const raw = RAW_TEMPLATES[rank]
  return {
    rank,
    method:  raw.method,
    subject: raw.subject  ? substitute(raw.subject,  vars) : undefined,
    body:    substitute(raw.body, vars),
  }
}
