import { Metadata } from "next"
import { ContactClient } from "./contact-client"

export const metadata: Metadata = {
  title: {
    absolute: "Contact PodcastMatch AI | Podcast Guest Matching Support",
  },
  description:
    "Contact PodcastMatch AI for questions about podcast matching, creator visibility, partnerships, feedback, and support.",
  alternates: {
    canonical: "https://podcastmatchai.com/contact",
  },
  openGraph: {
    title:       "Contact PodcastMatch AI | Podcast Guest Matching Support",
    description:
      "Contact PodcastMatch AI for questions about podcast matching, creator visibility, partnerships, feedback, and support.",
    url: "https://podcastmatchai.com/contact",
  },
}

export default function ContactPage() {
  return <ContactClient />
}
