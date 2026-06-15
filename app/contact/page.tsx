import { Metadata } from "next"
import { ContactClient } from "./contact-client"

export const metadata: Metadata = {
  title: "Contact Us — PodcastMatch AI",
  description: "Get in touch with the PodcastMatch AI team. We're here to help with questions, partnerships, and feedback.",
}

export default function ContactPage() {
  return <ContactClient />
}
