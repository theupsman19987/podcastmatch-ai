import { type Metadata } from "next"
import { SettingsShell } from "@/components/settings/settings-shell"

export const metadata: Metadata = {
  title:  "Settings | PodcastMatch AI",
  robots: { index: false, follow: false },
}

export default function SettingsPage() {
  return <SettingsShell />
}
