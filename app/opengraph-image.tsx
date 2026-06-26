import { ImageResponse } from "next/og"

export const runtime     = "edge"
export const alt         = "PodcastMatch AI — AI Podcast Matching for Creators"
export const size        = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#080c14",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* Purple glow — top left */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-80px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)",
          }}
        />
        {/* Cyan glow — bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            right: "-60px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 65%)",
          }}
        />

        {/* Mic icon box */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "88px",
            height: "88px",
            borderRadius: "22px",
            background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
            marginBottom: "36px",
            boxShadow: "0 0 40px rgba(124,58,237,0.5)",
          }}
        >
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="8" y1="22" x2="16" y2="22" />
          </svg>
        </div>

        {/* Brand name */}
        <div
          style={{
            display: "flex",
            fontSize: "72px",
            fontWeight: "800",
            letterSpacing: "-2px",
            marginBottom: "18px",
          }}
        >
          <span style={{ color: "#ffffff" }}>PodcastMatch&nbsp;</span>
          <span style={{ color: "#a78bfa" }}>AI</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "52px",
            letterSpacing: "0.3px",
          }}
        >
          AI Podcast Matching for Creators
        </div>

        {/* Audience pills */}
        <div style={{ display: "flex", gap: "14px" }}>
          {["Speakers", "Authors", "Coaches", "Consultants"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(124,58,237,0.12)",
                border: "1px solid rgba(167,139,250,0.25)",
                borderRadius: "100px",
                padding: "10px 22px",
                color: "#a78bfa",
                fontSize: "17px",
                fontWeight: "500",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: "36px",
            color: "rgba(255,255,255,0.22)",
            fontSize: "19px",
            letterSpacing: "0.5px",
          }}
        >
          podcastmatchai.com
        </div>
      </div>
    ),
    { ...size },
  )
}
