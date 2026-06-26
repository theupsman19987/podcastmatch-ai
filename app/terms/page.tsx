import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: {
    absolute: "Terms of Service | PodcastMatch AI",
  },
  description:
    "PodcastMatch AI Terms of Service — the rules and expectations for using our podcast guest matching platform.",
  alternates: {
    canonical: "https://podcastmatchai.com/terms",
  },
}

const EFFECTIVE_DATE = "June 25, 2026"
const CONTACT_EMAIL  = "support@podcastmatchai.com"

export default function TermsPage() {
  return (
    <main id="main-content" className="min-h-screen py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        <div className="mb-12">
          <p className="text-label mb-3">Legal</p>
          <h1 className="text-h1 mb-4">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">
            Effective date: {EFFECTIVE_DATE}
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By creating an account or using PodcastMatch AI (&ldquo;the Service&rdquo;), you agree to
              these Terms of Service. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. What PodcastMatch AI Is</h2>
            <p>
              PodcastMatch AI is an AI-powered podcast guest matching platform. The Service helps
              speakers, authors, coaches, consultants, and creators discover podcast opportunities
              aligned with their expertise, audience, and positioning goals.
            </p>
            <p className="mt-4">
              PodcastMatch AI provides discovery tools, match scoring, outreach templates, and
              visibility analytics. We do not guarantee podcast bookings, responses from podcast
              hosts, or any specific business outcomes from using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Beta Status</h2>
            <p>
              PodcastMatch AI is currently in active beta. The platform is under active development.
              Features, pricing, and availability may change. Beta access does not guarantee
              continued access to any specific feature or pricing tier.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Your Account</h2>
            <p>You are responsible for:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Keeping your login credentials secure</li>
              <li>All activity that occurs under your account</li>
              <li>Providing accurate information when creating your profile</li>
              <li>Notifying us promptly if you suspect unauthorized account access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Use the Service for spam, unsolicited mass outreach, or misleading pitches</li>
              <li>Misrepresent your credentials, expertise, or audience in your creator profile</li>
              <li>Attempt to scrape, copy, or systematically extract podcast host data from the platform</li>
              <li>Circumvent security controls or access other users&apos; accounts</li>
              <li>Use the Service for any unlawful purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Intellectual Property</h2>
            <p>
              The PodcastMatch AI platform, including its AI matching algorithms, scoring systems,
              user interface, and content, is owned by PodcastMatch AI and protected by applicable
              intellectual property laws.
            </p>
            <p className="mt-4">
              Content you create (your profile, bio, DNA assessment answers) remains yours. By
              submitting it to the platform, you grant us a limited license to use it to provide
              the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Payments and Subscriptions</h2>
            <p>
              Paid plans are processed through Stripe. Subscription billing occurs on the cycle
              chosen at signup. You may cancel at any time. Refund eligibility is handled on a
              case-by-case basis — contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
                {CONTACT_EMAIL}
              </a>{" "}
              within 7 days of a charge if you have a billing concern.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
            <p>
              PodcastMatch AI provides the Service &ldquo;as is.&rdquo; We make no guarantees about
              podcast booking outcomes, host responses, audience growth, or business results from
              using the platform. To the maximum extent permitted by law, our liability for any
              claims arising from use of the Service is limited to the amount you paid us in the
              30 days preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Termination</h2>
            <p>
              Either party may terminate the relationship at any time. You may delete your account
              from your account settings or by contacting us. We may suspend or terminate accounts
              that violate these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. We will update the effective date at the
              top of this page. Continued use of the Service after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Contact</h2>
            <p>
              Questions about these Terms? Contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
                {CONTACT_EMAIL}
              </a>{" "}
              or through our{" "}
              <Link href="/contact" className="text-primary hover:underline">
                contact page
              </Link>
              .
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}
