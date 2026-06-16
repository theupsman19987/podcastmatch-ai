-- ═══════════════════════════════════════════════════════════════════════════
--  PodcastMatch AI — Phase 1 Curated Podcast Seed Data
--  25 high-quality podcasts, enrichment-ready.
--
--  Run AFTER migration 003_podcast_contact_intelligence.sql
--  Paste into: Supabase Studio → SQL Editor → New Query → Run
--  Safe to re-run (ON CONFLICT DO NOTHING).
--
--  Contact fields are NULL until RSS parser + admin research runs.
--  Use /api/admin/rss-enrich to populate rss_owner_* fields.
--  Admins add producer_email / booking_link manually via Studio.
--
--  enrichment_status meanings:
--    pending  — just added, no contact data yet
--    partial  — RSS parsed or some fields filled
--    complete — all key contact fields verified
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO public.podcasts (
  slug, podcast_name, host_name, description,
  category, categories,
  website, rss_feed_url,
  episode_count, last_episode_date, activity_status,
  accepts_guests, typical_guest_type, guest_requirements,
  contact_form_url, booking_link,
  enrichment_status, quality_score, curated
) VALUES

-- ── ENTREPRENEURSHIP ───────────────────────────────────────────────────────

(
  'entrepreneurs-on-fire',
  'Entrepreneurs on Fire',
  'John Lee Dumas',
  'Daily interviews with the world''s most successful entrepreneurs. One of the most prolific business podcasts, with over 3,500 episodes. JLD is known for being highly guest-friendly and having a streamlined booking process.',
  'Entrepreneurship',
  ARRAY['Entrepreneurship','Business'],
  'https://www.eofire.com',
  'https://feeds.libsyn.com/36637/rss',
  3600, '2025-06-01', 'active',
  true, 'Entrepreneurs, founders, authors, coaches',
  'Must be an entrepreneur with a story of failure → success. Fire Nation audience. 7-day booking lead time.',
  NULL, 'https://www.eofire.com/guest',
  'partial', 93, true
),

(
  'my-first-million',
  'My First Million',
  'Sam Parr & Shaan Puri',
  'Sam and Shaan riff on business ideas, trends, and how to build wealth. Known for spotting opportunities and bringing in guests who are actively building companies. Highly engaging, conversational format.',
  'Entrepreneurship',
  ARRAY['Entrepreneurship','Business'],
  'https://www.mfmpod.com',
  NULL,
  420, '2025-06-01', 'active',
  true, 'Operators, founders, investors, idea-stage entrepreneurs',
  'Guest must have an interesting business story or contrarian insight. Not a fit for speaking coaches or pure thought leaders.',
  NULL, NULL,
  'pending', 91, true
),

(
  'how-i-built-this',
  'How I Built This',
  'Guy Raz',
  'NPR''s flagship entrepreneurship show. Guy Raz interviews the world''s best-known entrepreneurs about the stories behind their companies. Highly curated guest list — typically Fortune 500 founders or cult-brand builders.',
  'Entrepreneurship',
  ARRAY['Entrepreneurship','Business','Society & Culture'],
  'https://www.npr.org/podcasts/510313/how-i-built-this',
  'https://feeds.npr.org/510313/podcast.xml',
  350, '2025-06-01', 'active',
  true, 'Iconic brand founders, billion-dollar company builders',
  'NPR produced — guests are typically well-known company founders. Not suitable for cold pitches; requires NPR producer relationship.',
  NULL, NULL,
  'pending', 95, true
),

(
  'founders-podcast',
  'Founders',
  'David Senra',
  'David reads every biography and autobiography of the world''s greatest founders and distills lessons into episodes. Solo format — does not interview guests.',
  'Entrepreneurship',
  ARRAY['Entrepreneurship','Business','Education'],
  'https://www.founderspodcast.com',
  NULL,
  400, '2025-06-01', 'active',
  false, NULL, NULL,
  NULL, NULL,
  'pending', 91, true
),

-- ── BUSINESS ───────────────────────────────────────────────────────────────

(
  'tim-ferriss-show',
  'The Tim Ferriss Show',
  'Tim Ferriss',
  'Tim deconstructs world-class performers to extract tactics, tools, and routines. One of the most downloaded business podcasts ever. Guest list is highly selective — typically authors, athletes, scientists, or business legends.',
  'Business',
  ARRAY['Business','Personal Development','Entrepreneurship'],
  'https://tim.blog/podcast',
  'https://rss.art19.com/tim-ferriss-show',
  750, '2025-06-01', 'active',
  true, 'World-class performers, authors, scientists, athletes, investors',
  'Extremely selective. Tim personally chooses all guests based on unique insights or world-class expertise. No cold pitches accepted — relationship-based only.',
  NULL, NULL,
  'pending', 96, true
),

(
  'garyvee-audio-experience',
  'The GaryVee Audio Experience',
  'Gary Vaynerchuk',
  'Keynotes, interviews, podcasts, and business advice from Gary Vaynerchuk, chairman of VaynerX. Mix of solo episodes and conversations with entrepreneurs and celebrities.',
  'Business',
  ARRAY['Business','Marketing','Entrepreneurship'],
  'https://www.garyvaynerchuk.com/podcast',
  NULL,
  3200, '2025-06-01', 'active',
  true, 'Entrepreneurs, athletes, celebrities, marketers',
  'Guest selection handled by Gary''s team. Social proof and large following helps significantly.',
  NULL, NULL,
  'pending', 80, true
),

(
  'smart-passive-income',
  'Smart Passive Income',
  'Pat Flynn',
  'Pat Flynn teaches entrepreneurs how to build passive income streams. Highly guest-friendly — Pat''s audience loves hearing from people who have built successful online businesses, courses, and communities.',
  'Business',
  ARRAY['Business','Entrepreneurship','Marketing'],
  'https://www.smartpassiveincome.com',
  'https://feeds.simplecast.com/BJk54Y3V',
  600, '2025-06-01', 'active',
  true, 'Online entrepreneurs, course creators, community builders',
  'Must have a tangible online business story. Audience is aspirational entrepreneurs looking for real tactics.',
  'https://www.smartpassiveincome.com/contact',
  NULL,
  'partial', 85, true
),

-- ── MARKETING ──────────────────────────────────────────────────────────────

(
  'social-media-marketing',
  'Social Media Marketing Podcast',
  'Michael Stelzner',
  'The go-to podcast for social media marketers. Michael Stelzner interviews practitioners about what''s working right now in social. Highly guest-friendly with a dedicated guest submission process.',
  'Marketing',
  ARRAY['Marketing','Business'],
  'https://www.socialmediaexaminer.com/shows/social-media-marketing-podcast',
  NULL,
  720, '2025-06-01', 'active',
  true, 'Social media practitioners, platform specialists, digital marketers',
  'Must have real, current social media results to share. No theory — audience wants actionable tactics.',
  'https://www.socialmediaexaminer.com/contact',
  NULL,
  'partial', 82, true
),

(
  'marketing-school',
  'Marketing School',
  'Neil Patel & Eric Siu',
  'Daily 10-minute marketing lessons from Neil Patel and Eric Siu. Occasional guests but primarily a duo show. Audience is growth-focused marketers and founders.',
  'Marketing',
  ARRAY['Marketing','Entrepreneurship','Business'],
  'https://www.marketingschool.io',
  'https://feeds.simplecast.com/SL_MBIij',
  2100, '2025-06-01', 'active',
  true, 'Growth marketers, CMOs, agency owners',
  'Guests must have demonstrable marketing wins or unique data-driven insights.',
  NULL, NULL,
  'pending', 80, true
),

(
  'marketing-over-coffee',
  'Marketing Over Coffee',
  'John Wall & Christopher Penn',
  'Marketing topics from the venerable long-running podcast. Conversational tone covering both classic and cutting-edge marketing. Strong B2B marketing audience. Openly accepts guest pitches.',
  'Marketing',
  ARRAY['Marketing','Technology','Business'],
  'https://www.marketingovercoffee.com',
  NULL,
  720, '2025-06-01', 'active',
  true, 'Marketing technology vendors, B2B marketing practitioners, MarTech experts',
  'Great fit for MarTech products, data-driven marketers, and B2B growth specialists. Must have a genuine marketing story — not a PR pitch.',
  'https://www.marketingovercoffee.com/contact',
  NULL,
  'partial', 75, true
),

-- ── PERSONAL DEVELOPMENT ───────────────────────────────────────────────────

(
  'school-of-greatness',
  'School of Greatness',
  'Lewis Howes',
  'Lewis Howes interviews world-class performers in business, sports, and life. One of the top personal development podcasts. Known for deep, long-form conversations. Actively books guests through an open pitch process.',
  'Personal Development',
  ARRAY['Personal Development','Business','Health & Wellness'],
  'https://lewishowes.com/podcast',
  'https://feeds.megaphone.fm/SIC4582505639',
  1500, '2025-06-01', 'active',
  true, 'Authors, athletes, business leaders, mindset experts',
  'Must have a compelling personal story of overcoming adversity. Book or major platform a plus. Audience resonates with authenticity and vulnerability.',
  'https://lewishowes.com/contact',
  NULL,
  'partial', 87, true
),

(
  'impact-theory',
  'Impact Theory',
  'Tom Bilyeu',
  'Tom Bilyeu (Quest Nutrition co-founder) interviews world-class performers to extract the mindset needed to build a successful life. Deep, intellectual conversations on consciousness, entrepreneurship, and human performance.',
  'Personal Development',
  ARRAY['Personal Development','Business','Health & Wellness'],
  'https://impacttheory.com',
  NULL,
  700, '2025-06-01', 'active',
  true, 'Neuroscientists, authors, entrepreneurs, performance experts',
  'Guests should have a compelling story about transforming their mindset or achieving something extraordinary. Science-backed insights valued.',
  'https://impacttheory.com/contact',
  NULL,
  'partial', 85, true
),

(
  'ed-mylett-show',
  'The Ed Mylett Show',
  'Ed Mylett',
  'Ed Mylett interviews top performers in business, sports, and life. High-energy, motivational tone with deep tactical content. Audience is ambitious entrepreneurs and peak performers.',
  'Personal Development',
  ARRAY['Personal Development','Business','Leadership'],
  'https://www.edmylett.com/podcast',
  NULL,
  350, '2025-06-01', 'active',
  true, 'High-performers, athletes, entrepreneurs, authors',
  'Guests must be at the top of their field. Energy and enthusiasm match the show''s tone.',
  NULL, NULL,
  'pending', 83, true
),

-- ── LEADERSHIP ────────────────────────────────────────────────────────────

(
  'entreleadership',
  'EntreLeadership',
  'Dave Ramsey & Ramsey Personalities',
  'The Ramsey Network''s leadership and business podcast. Practical, faith-values-adjacent business advice for small business owners and leaders. Large, loyal conservative business audience.',
  'Leadership',
  ARRAY['Leadership','Business','Entrepreneurship'],
  'https://www.ramseysolutions.com/business/entreleadership-podcast',
  'https://feeds.megaphone.fm/entreleadership',
  450, '2025-06-01', 'active',
  true, 'Small business leaders, entrepreneurs, managers',
  'Guests should align with the Ramsey brand values (debt-free, faith-positive). Business authors and leadership experts are a strong fit.',
  'https://www.ramseysolutions.com/contact',
  NULL,
  'partial', 83, true
),

(
  'groeschel-leadership',
  'Craig Groeschel Leadership Podcast',
  'Craig Groeschel',
  'Craig Groeschel (pastor of Life.Church, one of the largest churches in the US) shares practical leadership development content. Audience skews faith-adjacent but crosses into general business leadership.',
  'Leadership',
  ARRAY['Leadership','Faith & Spirituality','Personal Development'],
  'https://www.life.church/leadershippodcast',
  NULL,
  185, '2025-06-01', 'active',
  true, 'Faith-based leaders, nonprofit executives, pastors, organizational leaders',
  'Strong fit for leadership authors, coaches, and speakers who can connect with a faith-positive audience.',
  'https://www.life.church/contact',
  NULL,
  'pending', 80, true
),

-- ── HEALTH & WELLNESS ──────────────────────────────────────────────────────

(
  'huberman-lab',
  'Huberman Lab',
  'Andrew Huberman',
  'Neuroscience professor Andrew Huberman from Stanford covers science-based tools for everyday life. One of the fastest-growing podcasts ever. Highly selective guest list — primarily scientists and clinicians with peer-reviewed research.',
  'Health & Wellness',
  ARRAY['Health & Wellness','Science','Personal Development'],
  'https://www.hubermanlab.com',
  'https://rss.art19.com/huberman-lab',
  220, '2025-06-01', 'active',
  true, 'Researchers, physicians, neuroscientists, performance scientists',
  'Must have significant peer-reviewed research credentials. Huberman is very selective. Produces are scientists first — no wellness influencers without hard data.',
  NULL, NULL,
  'pending', 96, true
),

(
  'ben-greenfield-life',
  'Ben Greenfield Life',
  'Ben Greenfield',
  'Ben Greenfield interviews top experts in biohacking, fitness, nutrition, and human performance. Among the most comprehensive health podcasts. Ben actively books guests with unique research or protocols.',
  'Health & Wellness',
  ARRAY['Health & Wellness','Science','Personal Development'],
  'https://bengreenfieldlife.com/podcast',
  NULL,
  550, '2025-06-01', 'active',
  true, 'Biohackers, physicians, researchers, performance coaches, longevity experts',
  'Niche scientific content preferred. Ben''s audience is highly educated and skeptical — guests need real credentials or unique protocols.',
  'https://bengreenfieldlife.com/contact',
  NULL,
  'partial', 82, true
),

(
  'doctors-farmacy',
  'The Doctor''s Farmacy',
  'Mark Hyman',
  'Dr. Mark Hyman interviews leaders in functional and integrative medicine. Highly influential in the wellness space. Guest list is primarily physicians, researchers, and authors with a health-focused book or practice.',
  'Health & Wellness',
  ARRAY['Health & Wellness','Science','Personal Development'],
  'https://drhyman.com/podcast',
  NULL,
  800, '2025-06-01', 'active',
  true, 'Integrative medicine doctors, health authors, nutritionists, researchers',
  'Medical credentials or a published health book strongly preferred. Functional medicine perspective aligns best.',
  'https://drhyman.com/contact',
  NULL,
  'pending', 85, true
),

-- ── TECHNOLOGY ────────────────────────────────────────────────────────────

(
  'lex-fridman',
  'Lex Fridman Podcast',
  'Lex Fridman',
  'Long-form conversations about science, technology, history, philosophy, and the human condition. Lex is an AI researcher at MIT. Guests include world-leading scientists, CEOs, athletes, and politicians. Extremely selective — top of his list globally.',
  'Technology',
  ARRAY['Technology','Science','Society & Culture'],
  'https://lexfridman.com/podcast',
  'https://lexfridman.com/feed/podcast/',
  420, '2025-06-01', 'active',
  true, 'World-leading experts in science, tech, politics, philosophy',
  'Must be at the absolute top of their field globally. Lex personally manages his guest list. Relationship-based — not suitable for cold outreach.',
  NULL, NULL,
  'pending', 97, true
),

(
  'this-week-in-startups',
  'This Week in Startups',
  'Jason Calacanis',
  'Jason Calacanis (angel investor, founder) interviews startup founders and covers the startup ecosystem. One of the oldest and most respected tech podcasts. Actively books interesting startup founders and investors.',
  'Technology',
  ARRAY['Technology','Entrepreneurship','Business'],
  'https://thisweekinstartups.com',
  NULL,
  1800, '2025-06-01', 'active',
  true, 'Startup founders, VCs, angel investors, tech operators',
  'Must be actively building or investing in a notable startup. Bootstrappers welcome but VC-backed companies with traction get priority.',
  'https://thisweekinstartups.com/contact',
  NULL,
  'partial', 82, true
),

-- ── FINANCE & INVESTING ────────────────────────────────────────────────────

(
  'we-study-billionaires',
  'We Study Billionaires',
  'Preston Pysh & Stig Brodersen',
  'The Investor''s Podcast Network flagship show. Deep-dives into the investment philosophies of the world''s most successful investors. Top finance podcast globally. Books guests who are serious investors or financial authors.',
  'Finance & Investing',
  ARRAY['Finance & Investing','Business'],
  'https://www.theinvestorspodcast.com',
  NULL,
  700, '2025-06-01', 'active',
  true, 'Value investors, hedge fund managers, financial authors, macro economists',
  'Must have a serious investment framework or have authored a notable finance book. No retail investment content.',
  'https://www.theinvestorspodcast.com/contact',
  NULL,
  'partial', 87, true
),

(
  'choosefi',
  'ChooseFI',
  'Jonathan Mendonsa & Brad Barrett',
  'The flagship financial independence podcast. Covers FIRE (Financial Independence, Retire Early) strategies, tax optimization, and intentional living. Very guest-friendly — built on community and sharing diverse perspectives.',
  'Finance & Investing',
  ARRAY['Finance & Investing','Personal Development'],
  'https://www.choosefi.com',
  NULL,
  450, '2025-06-01', 'active',
  true, 'Financial bloggers, FI success stories, tax specialists, real estate investors',
  'Best fit: someone who achieved financial independence and wants to share their story. Personal finance professionals with actionable FI-aligned advice also welcome.',
  'https://www.choosefi.com/contact',
  NULL,
  'partial', 80, true
),

-- ── WOMEN IN BUSINESS ──────────────────────────────────────────────────────

(
  'goal-digger',
  'Goal Digger Podcast',
  'Jenna Kutcher',
  'Jenna Kutcher interviews inspiring women entrepreneurs and experts on marketing, social media, and building a business with intention. Top women in business podcast. Highly guest-friendly with a clear submission process.',
  'Women in Business',
  ARRAY['Women in Business','Marketing','Entrepreneurship'],
  'https://jennakutcher.com/podcast',
  NULL,
  620, '2025-06-01', 'active',
  true, 'Women entrepreneurs, marketing experts, social media strategists, wellness coaches',
  'Best fit for women who have built businesses or have expertise in digital marketing, branding, or entrepreneurship. Authentic story is key.',
  'https://jennakutcher.com/pitch',
  NULL,
  'partial', 84, true
),

(
  'being-boss',
  'Being Boss',
  'Emily Thompson',
  'Emily Thompson interviews creative entrepreneurs on building a business and life you love. Authenticity and creative business-building take center stage. Highly community-oriented with an engaged, loyal audience.',
  'Women in Business',
  ARRAY['Women in Business','Entrepreneurship','Personal Development'],
  'https://www.beingboss.club',
  NULL,
  430, '2025-06-01', 'active',
  true, 'Creative entrepreneurs, freelancers, coaches, designers, consultants',
  'Must be a creative entrepreneur with a real story about building a business. Authentic over polished.',
  'https://www.beingboss.club/contact',
  NULL,
  'partial', 78, true
),

-- ── EDUCATION ─────────────────────────────────────────────────────────────

(
  'ted-talks-daily',
  'TED Talks Daily',
  'TED (Various Speakers)',
  'TED''s official daily podcast delivers the best talks from the TED archive and new TED conferences. Speakers are global thought leaders, scientists, and change-makers selected by TED''s curatorial team.',
  'Education',
  ARRAY['Education','Society & Culture','Science'],
  'https://www.ted.com/podcast',
  'https://feeds.feedburner.com/TEDTalks_audio',
  3200, '2025-06-01', 'active',
  false, NULL, 'TED speaker applications only — not a traditional podcast booking.',
  'https://www.ted.com/participate/organize-a-local-tedx-event', NULL,
  'partial', 90, true
)

ON CONFLICT (slug) DO NOTHING;
