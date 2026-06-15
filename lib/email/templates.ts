/* ═══════════════════════════════════════════════════════════
   PodcastMatch AI — Email Templates
   All HTML is inline-styled for maximum email client compat.
   ═══════════════════════════════════════════════════════════ */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://podcastmatchai.com"

const base = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PodcastMatch AI</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d14;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Logo header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#3b82f6,#06b6d4);border-radius:10px;padding:10px 14px;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:13px;font-weight:700;letter-spacing:0.5px;">🎙</span>
                  </td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">PodcastMatch <span style="color:#3b82f6;">AI</span></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content card -->
          <tr>
            <td style="background:#16162a;border:1px solid #2a2a45;border-radius:16px;padding:40px 36px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="color:#5a5a7a;font-size:12px;margin:0;line-height:1.6;">
                PodcastMatch AI · Visibility Intelligence Platform<br/>
                <a href="${APP_URL}" style="color:#3b82f6;text-decoration:none;">${APP_URL.replace("https://","")}</a>
                &nbsp;·&nbsp;
                <a href="${APP_URL}/unsubscribe" style="color:#5a5a7a;text-decoration:none;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

/* ── Welcome email (new user signup) ──────────────────────── */
export function welcomeEmailHtml(firstName: string): string {
  return base(`
    <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 8px;line-height:1.3;">
      Welcome, ${firstName}! 🎙️
    </h1>
    <p style="color:#8888aa;font-size:15px;line-height:1.7;margin:0 0 28px;">
      Your Visibility Intelligence account is ready. You're one step closer to getting
      discovered by the podcasts that are the right fit for your expertise and message.
    </p>

    <!-- Divider -->
    <div style="height:1px;background:linear-gradient(90deg,transparent,#2a2a45,transparent);margin:0 0 28px;"></div>

    <!-- Steps -->
    <p style="color:#aaaacc;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:0 0 20px;">
      Get started in 3 steps
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="padding-bottom:16px;vertical-align:top;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#1e2040;border-radius:8px;width:32px;height:32px;text-align:center;vertical-align:middle;font-size:14px;font-weight:700;color:#3b82f6;padding:0 10px;">01</td>
              <td style="padding-left:14px;vertical-align:middle;">
                <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0 0 2px;">Complete Your Visibility Profile</p>
                <p style="color:#7777aa;font-size:13px;margin:0;">Answer guided questions to help our AI understand your expertise and goals.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding-bottom:16px;vertical-align:top;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#1e2040;border-radius:8px;width:32px;height:32px;text-align:center;vertical-align:middle;font-size:14px;font-weight:700;color:#06b6d4;padding:0 10px;">02</td>
              <td style="padding-left:14px;vertical-align:middle;">
                <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0 0 2px;">Get Your Visibility Score</p>
                <p style="color:#7777aa;font-size:13px;margin:0;">See your authority, audience alignment, and podcast readiness — all in one number.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:top;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#1e2040;border-radius:8px;width:32px;height:32px;text-align:center;vertical-align:middle;font-size:14px;font-weight:700;color:#d4a017;padding:0 10px;">03</td>
              <td style="padding-left:14px;vertical-align:middle;">
                <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0 0 2px;">Discover High-Match Opportunities</p>
                <p style="color:#7777aa;font-size:13px;margin:0;">Receive curated podcast recommendations based on your profile and visibility data.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Divider -->
    <div style="height:1px;background:linear-gradient(90deg,transparent,#2a2a45,transparent);margin:0 0 28px;"></div>

    <!-- CTA -->
    <table cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="border-radius:10px;background:linear-gradient(135deg,#3b82f6,#06b6d4);padding:1px;">
          <a href="${APP_URL}/dashboard"
             style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#06b6d4);color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:13px 32px;border-radius:9px;">
            Go to Your Dashboard →
          </a>
        </td>
      </tr>
    </table>

    <p style="color:#5a5a7a;font-size:13px;margin:24px 0 0;line-height:1.6;">
      If you have any questions, just reply to this email — we read every message.
    </p>
  `)
}

export function welcomeEmailText(firstName: string): string {
  return `
Welcome to PodcastMatch AI, ${firstName}!

Your Visibility Intelligence account is ready.

Get started in 3 steps:
1. Complete Your Visibility Profile
2. Get Your Visibility Score
3. Discover High-Match Opportunities

Go to your dashboard: ${APP_URL}/dashboard

Questions? Reply to this email — we read every message.

— The PodcastMatch AI Team
`.trim()
}

/* ── Newsletter subscriber confirmation ───────────────────── */
export function subscriberConfirmHtml(email: string): string {
  return base(`
    <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0 0 12px;">
      You're on the list ✅
    </h1>
    <p style="color:#8888aa;font-size:15px;line-height:1.7;margin:0 0 24px;">
      Thanks for subscribing to PodcastMatch AI updates. We'll send you visibility
      tips, new features, and podcast opportunities — nothing else.
    </p>
    <p style="color:#5a5a7a;font-size:13px;margin:0;">
      Subscribed as: <span style="color:#aaaacc;">${email}</span>
    </p>
  `)
}

/* ── Admin notification — new subscriber ──────────────────── */
export function adminSubscriberHtml(email: string, source = "footer"): string {
  return base(`
    <h2 style="color:#ffffff;font-size:20px;font-weight:700;margin:0 0 16px;">
      📬 New Subscriber
    </h2>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="color:#8888aa;font-size:14px;padding:8px 0;border-bottom:1px solid #2a2a45;">Email</td>
        <td style="color:#ffffff;font-size:14px;padding:8px 0;border-bottom:1px solid #2a2a45;text-align:right;">${email}</td>
      </tr>
      <tr>
        <td style="color:#8888aa;font-size:14px;padding:8px 0;border-bottom:1px solid #2a2a45;">Source</td>
        <td style="color:#ffffff;font-size:14px;padding:8px 0;border-bottom:1px solid #2a2a45;text-align:right;">${source}</td>
      </tr>
      <tr>
        <td style="color:#8888aa;font-size:14px;padding:8px 0;">Time</td>
        <td style="color:#ffffff;font-size:14px;padding:8px 0;text-align:right;">${new Date().toUTCString()}</td>
      </tr>
    </table>
  `)
}

/* ── Contact form — admin notification ───────────────────── */
export function contactNotificationHtml(
  name: string, email: string, subject: string, message: string
): string {
  return base(`
    <h2 style="color:#ffffff;font-size:20px;font-weight:700;margin:0 0 16px;">
      📩 New Contact Message
    </h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="color:#8888aa;font-size:14px;padding:8px 0;border-bottom:1px solid #2a2a45;">From</td>
        <td style="color:#ffffff;font-size:14px;padding:8px 0;border-bottom:1px solid #2a2a45;text-align:right;">${name}</td>
      </tr>
      <tr>
        <td style="color:#8888aa;font-size:14px;padding:8px 0;border-bottom:1px solid #2a2a45;">Email</td>
        <td style="color:#ffffff;font-size:14px;padding:8px 0;border-bottom:1px solid #2a2a45;text-align:right;">
          <a href="mailto:${email}" style="color:#3b82f6;text-decoration:none;">${email}</a>
        </td>
      </tr>
      <tr>
        <td style="color:#8888aa;font-size:14px;padding:8px 0;border-bottom:1px solid #2a2a45;">Subject</td>
        <td style="color:#ffffff;font-size:14px;padding:8px 0;border-bottom:1px solid #2a2a45;text-align:right;">${subject}</td>
      </tr>
      <tr>
        <td style="color:#8888aa;font-size:14px;padding:8px 0;">Time</td>
        <td style="color:#ffffff;font-size:14px;padding:8px 0;text-align:right;">${new Date().toUTCString()}</td>
      </tr>
    </table>
    <p style="color:#aaaacc;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Message</p>
    <div style="background:#1a1a2e;border:1px solid #2a2a45;border-radius:10px;padding:20px;">
      <p style="color:#ccccdd;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${message}</p>
    </div>
    <p style="color:#5a5a7a;font-size:13px;margin:20px 0 0;">
      Reply directly to <a href="mailto:${email}" style="color:#3b82f6;text-decoration:none;">${email}</a> to respond.
    </p>
  `)
}

/* ── Contact form — sender confirmation ──────────────────── */
export function contactConfirmHtml(name: string): string {
  return base(`
    <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0 0 12px;">
      Message received ✅
    </h1>
    <p style="color:#8888aa;font-size:15px;line-height:1.7;margin:0 0 24px;">
      Hi ${name}, thanks for reaching out. We've received your message and will
      get back to you within 1–2 business days.
    </p>
    <div style="height:1px;background:linear-gradient(90deg,transparent,#2a2a45,transparent);margin:0 0 24px;"></div>
    <p style="color:#7777aa;font-size:14px;line-height:1.6;margin:0 0 20px;">
      In the meantime, feel free to explore the platform or check out how AI matching works.
    </p>
    <table cellpadding="0" cellspacing="0">
      <tr>
        <td style="border-radius:10px;background:linear-gradient(135deg,#3b82f6,#06b6d4);padding:1px;">
          <a href="${APP_URL}"
             style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#06b6d4);color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 28px;border-radius:9px;">
            Explore PodcastMatch AI →
          </a>
        </td>
      </tr>
    </table>
    <p style="color:#5a5a7a;font-size:13px;margin:24px 0 0;">
      — The PodcastMatch AI Team
    </p>
  `)
}

/* ── Admin notification — new signup ─────────────────────── */
export function adminSignupHtml(name: string, email: string): string {
  return base(`
    <h2 style="color:#ffffff;font-size:20px;font-weight:700;margin:0 0 16px;">
      🎉 New User Signed Up
    </h2>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="color:#8888aa;font-size:14px;padding:8px 0;border-bottom:1px solid #2a2a45;">Name</td>
        <td style="color:#ffffff;font-size:14px;padding:8px 0;border-bottom:1px solid #2a2a45;text-align:right;">${name}</td>
      </tr>
      <tr>
        <td style="color:#8888aa;font-size:14px;padding:8px 0;border-bottom:1px solid #2a2a45;">Email</td>
        <td style="color:#ffffff;font-size:14px;padding:8px 0;border-bottom:1px solid #2a2a45;text-align:right;">${email}</td>
      </tr>
      <tr>
        <td style="color:#8888aa;font-size:14px;padding:8px 0;">Time</td>
        <td style="color:#ffffff;font-size:14px;padding:8px 0;text-align:right;">${new Date().toUTCString()}</td>
      </tr>
    </table>
  `)
}
