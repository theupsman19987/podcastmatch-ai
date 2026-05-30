export type SettingsSectionId =
  | "profile"
  | "creator-prefs"
  | "account"
  | "notifications"
  | "subscription"
  | "billing-history"
  | "security"
  | "danger-zone"

// ─── User ────────────────────────────────────────────────────────────────────

export interface MockUser {
  name: string
  title: string
  bio: string
  website: string
  location: string
  email: string
  username: string
  social: { twitter: string; linkedin: string; youtube: string; instagram: string }
  plan: "free" | "creator-pro" | "visibility-pro" | "enterprise"
  memberSince: string
}

export const MOCK_USER: MockUser = {
  name:      "Jordan Mills",
  title:     "High Performance Coach & Author",
  bio:       "I help ambitious professionals escape burnout and build sustainable success systems that actually last. Combining neuroscience with lived experience to make high performance feel achievable.",
  website:   "jordanmills.co",
  location:  "Austin, TX",
  email:     "jordan@jordanmills.co",
  username:  "jordanmills",
  social:    { twitter: "@jordanmills", linkedin: "in/jordanmills", youtube: "jordanmillsco", instagram: "@jordanmills" },
  plan:      "creator-pro",
  memberSince: "November 2024",
}

// ─── Creator Preferences ─────────────────────────────────────────────────────

export const ALL_PODCAST_CATEGORIES = [
  "Business & Entrepreneurship", "Personal Development", "Leadership",
  "Health & Wellness", "Mindset & Purpose", "Finance & Investing",
  "Marketing & Branding", "Technology", "Spirituality & Faith",
  "Education & Learning", "Society & Culture", "Parenting & Family",
  "Arts & Culture", "Sports & Fitness", "Science & Research",
  "True Crime", "Comedy & Entertainment",
]

export const ALL_FORMATS = [
  "Long-form Interview (60+ min)", "Short-form Interview (30 min)",
  "Story-driven Narrative", "Panel Discussion", "Solo Show",
  "Q&A Format", "Roundtable", "Documentary Style",
]

export const VISIBILITY_GOALS = [
  "Build authority in my niche",
  "Grow my audience & following",
  "Find new clients or customers",
  "Promote a book or product launch",
  "Network with industry leaders",
  "Establish thought leadership",
]

export const MOCK_PREFS = {
  categories:      ["Personal Development", "Leadership", "Business & Entrepreneurship", "Health & Wellness"],
  audienceInterests: ["High Performance", "Burnout Recovery", "Entrepreneurship", "Executive Coaching"],
  speakingTopics:  ["Sustainable Success", "Burnout Prevention", "High Performance", "Neuroscience of Success"],
  visibilityGoal:  "Build authority in my niche",
  formats:         ["Long-form Interview (60+ min)", "Story-driven Narrative"],
}

// ─── Notifications ───────────────────────────────────────────────────────────

export interface NotificationPref {
  id: string
  label: string
  description: string
  enabled: boolean
}

export const MOCK_NOTIFICATIONS: NotificationPref[] = [
  { id: "new-match",       label: "New Match Alerts",       description: "Get notified when AI finds a new podcast match for you.",    enabled: true  },
  { id: "visibility",      label: "Visibility Insights",    description: "Weekly updates on your visibility score and trends.",        enabled: true  },
  { id: "opportunities",   label: "Opportunity Updates",    description: "Alerts when saved podcasts open guest spots.",              enabled: true  },
  { id: "announcements",   label: "Platform Announcements", description: "News about new PodcastMatch AI features and updates.",      enabled: false },
  { id: "email",           label: "Email Notifications",    description: "Receive all notifications via email as well as in-app.",    enabled: true  },
  { id: "digest",          label: "Weekly Digest",          description: "A curated summary of your week delivered every Monday.",    enabled: false },
]

// ─── Plans ───────────────────────────────────────────────────────────────────

export interface Plan {
  id: "free" | "creator-pro" | "visibility-pro" | "enterprise"
  name: string
  price: string
  period: string
  tagline: string
  features: string[]
  cta: string
  popular?: boolean
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    tagline: "Get started at no cost",
    features: [
      "3 AI podcast matches per month",
      "Basic creator profile",
      "2 podcast categories",
      "Community access",
      "Email support",
    ],
    cta: "Current Plan",
  },
  {
    id: "creator-pro",
    name: "Creator Pro",
    price: "$49",
    period: "/month",
    tagline: "For serious creators ready to grow",
    popular: true,
    features: [
      "Unlimited AI podcast matches",
      "Full DNA-driven creator profile",
      "All 17 podcast categories",
      "AI Insights & Strength Dashboard",
      "Outreach Pipeline (unlimited)",
      "Saved Opportunities tracker",
      "Analytics Dashboard",
      "Priority email support",
    ],
    cta: "Upgrade to Pro",
  },
  {
    id: "visibility-pro",
    name: "Visibility Pro",
    price: "$99",
    period: "/month",
    tagline: "Maximum reach and white-glove service",
    features: [
      "Everything in Creator Pro",
      "Priority podcast placement",
      "Dedicated visibility strategist",
      "White-glove onboarding session",
      "Custom outreach templates",
      "Guest booking assistance",
      "Monthly performance review",
      "Phone & chat support",
    ],
    cta: "Upgrade to Visibility Pro",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    tagline: "For teams and agencies",
    features: [
      "Everything in Visibility Pro",
      "Multi-seat team access",
      "Custom API integrations",
      "Dedicated account manager",
      "Custom reporting & analytics",
      "SLA guarantee",
      "Custom contract & billing",
    ],
    cta: "Contact Sales",
  },
]

export const BILLING_SUMMARY = {
  plan:          "Creator Pro",
  amount:        "$49.00",
  nextBilling:   "June 1, 2026",
  paymentMethod: "Visa ending in 4242",
  billingCycle:  "Monthly",
}

// ─── Invoices ────────────────────────────────────────────────────────────────

export type InvoiceStatus = "paid" | "pending" | "failed"

export interface Invoice {
  id: string
  date: string
  description: string
  amount: string
  status: InvoiceStatus
}

export const MOCK_INVOICES: Invoice[] = [
  { id: "INV-0012", date: "May 1, 2026",      description: "Creator Pro — Monthly",   amount: "$49.00", status: "paid"    },
  { id: "INV-0011", date: "Apr 1, 2026",      description: "Creator Pro — Monthly",   amount: "$49.00", status: "paid"    },
  { id: "INV-0010", date: "Mar 1, 2026",      description: "Creator Pro — Monthly",   amount: "$49.00", status: "paid"    },
  { id: "INV-0009", date: "Feb 1, 2026",      description: "Creator Pro — Monthly",   amount: "$49.00", status: "paid"    },
  { id: "INV-0008", date: "Jan 1, 2026",      description: "Creator Pro — Monthly",   amount: "$49.00", status: "paid"    },
  { id: "INV-0007", date: "Dec 1, 2025",      description: "Creator Pro — Monthly",   amount: "$49.00", status: "paid"    },
  { id: "INV-0006", date: "Nov 1, 2025",      description: "Creator Pro — Monthly",   amount: "$49.00", status: "paid"    },
]

// ─── Security ────────────────────────────────────────────────────────────────

export interface Session {
  id: string
  device: string
  browser: string
  location: string
  lastActive: string
  current: boolean
}

export const MOCK_SESSIONS: Session[] = [
  { id: "s1", device: "MacBook Pro",   browser: "Chrome 124",   location: "Austin, TX",   lastActive: "Now",          current: true  },
  { id: "s2", device: "iPhone 15 Pro", browser: "Safari 17",    location: "Austin, TX",   lastActive: "2 hours ago",  current: false },
  { id: "s3", device: "Windows PC",    browser: "Chrome 123",   location: "New York, NY", lastActive: "3 days ago",   current: false },
]

export interface SecurityCheck {
  id: string
  label: string
  status: "done" | "warn" | "missing"
  detail: string
}

export const SECURITY_CHECKS: SecurityCheck[] = [
  { id: "2fa",      label: "Two-Factor Authentication", status: "missing", detail: "Not enabled — strongly recommended"   },
  { id: "password", label: "Strong Password",           status: "done",    detail: "Last changed 45 days ago"             },
  { id: "alerts",   label: "Login Alerts",              status: "done",    detail: "Email alerts are active"              },
  { id: "email",    label: "Email Verified",            status: "done",    detail: "jordan@jordanmills.co"               },
  { id: "session",  label: "Session Review",            status: "warn",    detail: "1 session from unfamiliar location"   },
]
