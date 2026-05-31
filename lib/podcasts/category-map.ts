/* ═══════════════════════════════════════════════════════════
   Category Normalization — maps source-specific category
   strings to our 17 internal platform categories.

   FUTURE EXPANSION:
   Add new source mappings at the bottom. Each source can have
   different category vocabularies — they all normalize here.
   Internal categories never change; only mappings grow.
   ═══════════════════════════════════════════════════════════ */

/** The 17 canonical internal categories for PodcastMatch AI. */
export const INTERNAL_CATEGORIES = [
  "Business",
  "Entrepreneurship",
  "Marketing",
  "Leadership",
  "Finance & Investing",
  "Technology",
  "Health & Wellness",
  "Personal Development",
  "Faith & Spirituality",
  "Spirituality",
  "Women in Business",
  "Education",
  "Society & Culture",
  "Science",
  "Sports & Performance",
  "Parenting",
] as const

export type InternalCategory = typeof INTERNAL_CATEGORIES[number]

/* ── Podcast Index → internal ─────────────────────────────── */
const PODCAST_INDEX_MAP: Record<string, string[]> = {
  /* Business & Finance */
  "Business":              ["Business"],
  "Entrepreneurship":      ["Entrepreneurship", "Business"],
  "Investing":             ["Finance & Investing"],
  "Management":            ["Leadership"],
  "Marketing":             ["Marketing"],
  "Non-Profit":            ["Society & Culture"],

  /* Technology */
  "Technology":            ["Technology"],
  "Tech News":             ["Technology"],
  "Software How-To":       ["Technology", "Education"],
  "Gadgets":               ["Technology"],

  /* Health */
  "Health & Fitness":      ["Health & Wellness"],
  "Alternative Health":    ["Health & Wellness"],
  "Fitness":               ["Health & Wellness"],
  "Medicine":              ["Health & Wellness", "Science"],
  "Mental Health":         ["Health & Wellness", "Personal Development"],
  "Nutrition":             ["Health & Wellness"],
  "Sexuality":             ["Health & Wellness"],

  /* Science */
  "Science":               ["Science"],
  "Natural Sciences":      ["Science"],
  "Social Sciences":       ["Science", "Society & Culture"],
  "Astronomy":             ["Science"],
  "Earth Sciences":        ["Science"],
  "Life Sciences":         ["Science"],
  "Mathematics":           ["Science"],
  "Physics":               ["Science"],

  /* Sports */
  "Sports":                ["Sports & Performance"],
  "Football":              ["Sports & Performance"],
  "Soccer":                ["Sports & Performance"],
  "Baseball":              ["Sports & Performance"],
  "Basketball":            ["Sports & Performance"],
  "Running":               ["Sports & Performance"],
  "Swimming":              ["Sports & Performance"],
  "Tennis":                ["Sports & Performance"],
  "Wilderness":            ["Sports & Performance"],
  "Wrestling":             ["Sports & Performance"],
  "Golf":                  ["Sports & Performance"],
  "Hockey":                ["Sports & Performance"],

  /* Society & Culture */
  "Society & Culture":     ["Society & Culture"],
  "Documentary":           ["Society & Culture"],
  "Personal Journals":     ["Personal Development", "Society & Culture"],
  "Philosophy":            ["Personal Development", "Society & Culture"],
  "Places & Travel":       ["Society & Culture"],
  "Commentary":            ["Society & Culture"],
  "Relationships":         ["Personal Development", "Parenting"],
  "History":               ["Society & Culture", "Education"],

  /* Religion & Spirituality */
  "Religion & Spirituality": ["Faith & Spirituality"],
  "Buddhism":              ["Spirituality"],
  "Christianity":          ["Faith & Spirituality"],
  "Hinduism":              ["Spirituality"],
  "Islam":                 ["Faith & Spirituality"],
  "Judaism":               ["Faith & Spirituality"],
  "Spirituality":          ["Spirituality"],

  /* Education */
  "Education":             ["Education"],
  "Courses":               ["Education"],
  "How To":                ["Education"],
  "Language Learning":     ["Education"],
  "Self-Improvement":      ["Personal Development", "Education"],
  "Training":              ["Education"],

  /* Kids & Family */
  "Kids & Family":         ["Parenting"],
  "Parenting":             ["Parenting"],
  "Stories for Kids":      ["Parenting"],
  "Pets & Animals":        ["Parenting"],

  /* Arts */
  "Arts":                  ["Society & Culture"],
  "Books":                 ["Education", "Society & Culture"],
  "Design":                ["Technology", "Society & Culture"],
  "Fashion & Beauty":      ["Society & Culture"],
  "Food":                  ["Health & Wellness", "Society & Culture"],
  "Performing Arts":       ["Society & Culture"],
  "Visual Arts":           ["Society & Culture"],

  /* Misc */
  "Comedy":                ["Society & Culture"],
  "True Crime":            ["Society & Culture"],
  "News":                  ["Society & Culture"],
  "Government":            ["Society & Culture"],
  "Leisure":               ["Society & Culture"],
  "Music":                 ["Society & Culture"],
  "TV & Film":             ["Society & Culture"],
  "Fiction":               ["Society & Culture"],
  "Video Games":           ["Technology"],
  "Automotive":            ["Society & Culture"],
  "Aviation":              ["Society & Culture"],
}

/* ── Apple Podcasts → internal ────────────────────────────── */
const APPLE_MAP: Record<string, string[]> = {
  "Business":              ["Business"],
  "Entrepreneurship":      ["Entrepreneurship", "Business"],
  "Investing":             ["Finance & Investing"],
  "Management & Marketing":["Marketing", "Leadership"],
  "Non-Profit":            ["Society & Culture"],
  "Technology":            ["Technology"],
  "Health & Fitness":      ["Health & Wellness"],
  "Alternative Health":    ["Health & Wellness"],
  "Fitness & Nutrition":   ["Health & Wellness"],
  "Medicine":              ["Health & Wellness", "Science"],
  "Mental Health":         ["Health & Wellness", "Personal Development"],
  "Self-Improvement":      ["Personal Development"],
  "Education":             ["Education"],
  "How To":                ["Education"],
  "Language Learning":     ["Education"],
  "Science":               ["Science"],
  "Natural Sciences":      ["Science"],
  "Social Sciences":       ["Science", "Society & Culture"],
  "Sports & Recreation":   ["Sports & Performance"],
  "Society & Culture":     ["Society & Culture"],
  "Religion & Spirituality": ["Faith & Spirituality"],
  "Spirituality":          ["Spirituality"],
  "Christianity":          ["Faith & Spirituality"],
  "Kids & Family":         ["Parenting"],
  "Parenting":             ["Parenting"],
}

/* ── Listen Notes → internal (future) ────────────────────── */
const LISTEN_NOTES_MAP: Record<string, string[]> = {
  "Business":              ["Business"],
  "Entrepreneurship":      ["Entrepreneurship"],
  "Marketing":             ["Marketing"],
  "Finance":               ["Finance & Investing"],
  "Technology":            ["Technology"],
  "Health & Fitness":      ["Health & Wellness"],
  "Science":               ["Science"],
  "Sports":                ["Sports & Performance"],
  "Society & Culture":     ["Society & Culture"],
  "Religion & Spirituality": ["Faith & Spirituality"],
  "Education":             ["Education"],
  "Kids & Family":         ["Parenting"],
}

/* ── Master normalize function ────────────────────────────── */
type SourceType = "podcast-index" | "apple" | "listen-notes" | string

export function normalizeCategories(
  rawCategories: string[],
  source: SourceType
): string[] {
  const map = source === "apple"        ? APPLE_MAP
            : source === "listen-notes" ? LISTEN_NOTES_MAP
            : PODCAST_INDEX_MAP

  const result = new Set<string>()
  for (const raw of rawCategories) {
    const mapped = map[raw]
    if (mapped) {
      mapped.forEach(c => result.add(c))
    } else {
      // Try exact match against internal categories
      if (INTERNAL_CATEGORIES.includes(raw as InternalCategory)) {
        result.add(raw)
      }
      // Otherwise drop it (don't add unknown categories)
    }
  }

  const arr = Array.from(result)
  return arr.length > 0 ? arr : ["Society & Culture"] // fallback
}

/* ── Reverse: internal → Podcast Index search terms ─────── */
export const CATEGORY_SEARCH_TERMS: Record<string, string> = {
  "Business":             "business",
  "Entrepreneurship":     "entrepreneurship startup founders",
  "Marketing":            "marketing growth",
  "Leadership":           "leadership management",
  "Finance & Investing":  "investing finance money",
  "Technology":           "technology software",
  "Health & Wellness":    "health wellness fitness",
  "Personal Development": "self-improvement personal development",
  "Faith & Spirituality": "faith religion christianity",
  "Spirituality":         "spirituality mindfulness",
  "Women in Business":    "women business entrepreneurship",
  "Education":            "education learning",
  "Society & Culture":    "society culture",
  "Science":              "science",
  "Sports & Performance": "sports performance",
  "Parenting":            "parenting family kids",
}
