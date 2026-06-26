import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: {
    absolute: "Privacy Policy | PodcastMatch AI",
  },
  description:
    "PodcastMatch AI Privacy Policy — how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "https://podcastmatchai.com/privacy",
  },
}

const EFFECTIVE_DATE = "June 25, 2026"
const CONTACT_EMAIL  = "support@podcastmatchai.com"

export default function PrivacyPage() {
  return (
    <main id="main-content" className="min-h-screen py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        <div className="mb-12">
          <p className="text-label mb-3">Legal</p>
          <h1 className="text-h1 mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">
            Effective date: {EFFECTIVE_DATE}
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-10 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Who We Are</h2>
            <p>
              PodcastMatch AI (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is an AI-powered podcast guest matching
              platform. Our service helps speakers, authors, coaches, consultants, and creators
              discover podcast opportunities matched to their expertise and audience.
            </p>
            <p className="mt-3">
              You can reach us at:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p>We collect information you provide directly when you:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Create an account (name, email address, password)</li>
              <li>Complete the Creator DNA Assessment (expertise, audience, messaging preferences)</li>
              <li>Update your profile (bio, avatar photo)</li>
              <li>Contact us through our support form</li>
              <li>Submit feedback or join the beta waitlist</li>
            </ul>
            <p className="mt-4">We also collect data automatically when you use the service:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Usage events (which features you use, searches you perform)</li>
              <li>Device and browser type</li>
              <li>IP address and general location (country or region)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Provide and improve the PodcastMatch AI service</li>
              <li>Generate your Creator Profile and Visibility Score</li>
              <li>Match you with relevant podcast opportunities</li>
              <li>Send transactional emails (account confirmation, password reset)</li>
              <li>Respond to your support requests</li>
              <li>Analyze aggregate usage to improve the platform</li>
            </ul>
            <p className="mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Third-Party Services</h2>
            <p>We use the following third-party services to operate the platform:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>
                <strong className="text-foreground">Supabase</strong> — database and authentication
                (your account data is stored securely with Supabase)
              </li>
              <li>
                <strong className="text-foreground">Resend</strong> — transactional email delivery
              </li>
              <li>
                <strong className="text-foreground">Stripe</strong> — payment processing
                (billing information is handled directly by Stripe and never stored on our servers)
              </li>
            </ul>
            <p className="mt-4">
              Each third-party service operates under its own privacy policy and data protection
              standards.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active. You may request
              deletion of your account and personal data at any time by contacting us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
                {CONTACT_EMAIL}
              </a>
              . We will process deletion requests within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Cookies</h2>
            <p>
              PodcastMatch AI uses session cookies required for authentication and keeping you logged
              in. We do not use third-party advertising cookies or tracking pixels.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict certain processing</li>
              <li>Export your data in a portable format</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Security</h2>
            <p>
              We use industry-standard measures to protect your data, including encrypted connections
              (HTTPS), secure database access controls, and row-level security policies on all user
              data. No method of transmission over the internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the
              effective date at the top of this page. Continued use of the service after changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Contact</h2>
            <p>
              Questions about this Privacy Policy? Contact us at{" "}
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
