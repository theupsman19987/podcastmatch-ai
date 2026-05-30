import * as React from "react"
import {
  webSiteSchema,
  organizationSchema,
  softwareApplicationSchema,
  speakableSchema,
} from "@/lib/seo/schemas"

/* ═══════════════════════════════════════════════════════════
   JsonLd components — render JSON-LD structured data as
   <script type="application/ld+json"> tags in <head>.

   HomepageJsonLd: drop in app/layout.tsx <head> block.
   PageJsonLd: use on inner pages (FAQ, category, feature).

   Next.js App Router usage:
     // app/layout.tsx
     <head>
       <HomepageJsonLd />
     </head>

     // app/podcasts/[category]/page.tsx
     import { faqPageSchema, breadcrumbSchema } from "@/lib/seo/schemas"
     <PageJsonLd schemas={[faqPageSchema(items), breadcrumbSchema(crumbs)]} />

   Each schema is minified (no whitespace) to reduce HTML payload.
   ═══════════════════════════════════════════════════════════ */

function SchemaScript({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  )
}

/* ── Homepage schemas ────────────────────────────────── */
export function HomepageJsonLd() {
  return (
    <>
      <SchemaScript schema={webSiteSchema()} />
      <SchemaScript schema={organizationSchema()} />
      <SchemaScript schema={softwareApplicationSchema()} />
      <SchemaScript schema={speakableSchema()} />
    </>
  )
}

/* ── Generic per-page renderer ───────────────────────── */
export function PageJsonLd({ schemas }: { schemas: object[] }) {
  return (
    <>
      {schemas.map((schema, i) => (
        <SchemaScript key={i} schema={schema} />
      ))}
    </>
  )
}
