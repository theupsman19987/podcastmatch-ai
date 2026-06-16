-- ═══════════════════════════════════════════════════════════════════════════
--  PodcastMatch AI — Phase 1 Curated Podcast Seed Data
--  50 high-quality podcasts, enrichment-ready.
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
),

-- ══════════════════════════════════════════════════════════════════════════════
--  BATCH 2 — Podcasts 26–50
-- ══════════════════════════════════════════════════════════════════════════════

-- ── ENTREPRENEURSHIP (continued) ───────────────────────────────────────────

(
  'mixergy',
  'Mixergy',
  'Andrew Warner',
  'Andrew Warner does in-depth interviews with founders about how they built their companies — including the failures. Highly respected in the startup world for going deep on real numbers and hard lessons. One of the most guest-friendly shows for authentic business builders.',
  'Entrepreneurship',
  ARRAY['Entrepreneurship','Business'],
  'https://mixergy.com',
  NULL,
  1900, '2025-06-01', 'active',
  true, 'Startup founders, bootstrappers, SaaS builders',
  'Andrew goes very deep on revenue, tactics, and real business metrics. Guests must be comfortable sharing specifics. Authentic struggle + success stories over PR polish.',
  'https://mixergy.com/contact',
  NULL,
  'partial', 82, true
),

(
  'side-hustle-school',
  'Side Hustle School',
  'Chris Guillebeau',
  'Daily 10-minute episodes featuring real side hustle stories from real people. One of the most prolific business podcasts. Very guest-friendly — Chris actively seeks diverse stories of people earning extra income on the side.',
  'Entrepreneurship',
  ARRAY['Entrepreneurship','Business','Personal Development'],
  'https://sidehustleschool.com',
  NULL,
  2000, '2025-06-01', 'active',
  true, 'Side hustlers, solopreneurs, people building income alongside a day job',
  'Must have a real side hustle story — doesn''t need to be huge. Authenticity over scale. Chris wants variety: unusual niches, unexpected outcomes.',
  'https://sidehustleschool.com/contact',
  NULL,
  'partial', 78, true
),

-- ── BUSINESS (continued) ───────────────────────────────────────────────────

(
  'masters-of-scale',
  'Masters of Scale',
  'Reid Hoffman',
  'LinkedIn co-founder Reid Hoffman interviews the world''s top business leaders on how they scaled their companies. Narrative storytelling format with deep strategic insight. Highly selective — guests are typically Fortune 500 CEOs or iconic startup founders.',
  'Business',
  ARRAY['Business','Entrepreneurship','Leadership'],
  'https://mastersofscale.com',
  NULL,
  350, '2025-06-01', 'active',
  true, 'Tech CEOs, Fortune 500 executives, unicorn founders',
  'Very selective. Guests are typically household names. Relationship-based booking through the WaitWhat team.',
  NULL, NULL,
  'pending', 93, true
),

(
  'diary-of-a-ceo',
  'The Diary of a CEO',
  'Steven Bartlett',
  'Steven Bartlett (youngest Dragon on Dragon''s Den UK, founder of Social Chain) interviews leading entrepreneurs, scientists, and business icons. One of the fastest-growing business podcasts in Europe with a massive global audience.',
  'Business',
  ARRAY['Business','Entrepreneurship','Personal Development'],
  'https://stevenbartlett.com/the-diary-of-a-ceo-podcast',
  NULL,
  480, '2025-06-01', 'active',
  true, 'Business leaders, scientists, authors, high-profile entrepreneurs',
  'Steven''s team is very selective but responds to compelling pitches. Authors with a major book launch or experts with a genuinely contrarian insight get priority.',
  NULL, NULL,
  'pending', 92, true
),

(
  'acquired',
  'Acquired',
  'Ben Gilbert & David Rosenthal',
  'Deep-dive episodes on the stories of the greatest technology companies — 3-6 hours per episode. Ben and David go further than any other podcast on company histories, strategy, and compounding advantages. Very selective — primarily covers iconic companies rather than booking individual guests.',
  'Business',
  ARRAY['Business','Technology','Finance & Investing'],
  'https://www.acquired.fm',
  NULL,
  200, '2025-06-01', 'active',
  true, 'CEOs and executives of iconic technology companies being covered',
  'Not a traditional guest podcast. Guests are typically the founders or CEOs of the specific company being studied. Relationship-driven, not pitch-driven.',
  NULL, NULL,
  'pending', 94, true
),

-- ── MARKETING (continued) ──────────────────────────────────────────────────

(
  'online-marketing-made-easy',
  'Online Marketing Made Easy',
  'Amy Porterfield',
  'Amy Porterfield teaches entrepreneurs how to grow their email list, launch courses, and build digital businesses. One of the most trusted voices in online marketing. Openly accepts guest pitches and has an engaged, action-oriented audience of female entrepreneurs.',
  'Marketing',
  ARRAY['Marketing','Entrepreneurship','Women in Business'],
  'https://amyporterfield.com/podcast',
  NULL,
  650, '2025-06-01', 'active',
  true, 'Online course creators, email marketers, female entrepreneurs',
  'Guest must have proven online business tactics to teach. Amy''s audience wants actionable, step-by-step strategies. Digital marketing, list-building, and course launch expertise are ideal.',
  'https://amyporterfield.com/contact',
  NULL,
  'partial', 85, true
),

(
  'perpetual-traffic',
  'Perpetual Traffic',
  'Ralph Burns & Kasim Aslam',
  'The podcast for paid advertising professionals. Deep tactical content on Facebook ads, Google ads, and paid media strategy. Run by agency owners who are in the trenches daily. Very guest-friendly for ad practitioners with real results.',
  'Marketing',
  ARRAY['Marketing','Business','Technology'],
  'https://www.perpetualtraffic.com',
  NULL,
  580, '2025-06-01', 'active',
  true, 'Paid media specialists, agency owners, performance marketers, e-commerce brands',
  'Must have real paid advertising results to share — specific numbers, specific platforms, specific learnings. No theory — audience is made up of practitioners.',
  'https://www.perpetualtraffic.com/contact',
  NULL,
  'partial', 77, true
),

-- ── PERSONAL DEVELOPMENT (continued) ──────────────────────────────────────

(
  'marie-forleo',
  'The Marie Forleo Podcast',
  'Marie Forleo',
  'Marie Forleo helps entrepreneurs build businesses and lives they love. Warm, energetic format with occasional guests. Audience skews female entrepreneur. Strong platform for thought leadership, self-help, and business strategy books.',
  'Personal Development',
  ARRAY['Personal Development','Women in Business','Business'],
  'https://www.marieforleo.com/podcast',
  NULL,
  420, '2025-06-01', 'active',
  true, 'Female entrepreneurs, authors, coaches, thought leaders',
  'Best fit for authors of personal development or business books. Marie''s audience is aspirational and action-oriented. Must have a clear, deliverable insight for her audience.',
  'https://www.marieforleo.com/contact',
  NULL,
  'partial', 82, true
),

(
  'mindset-mentor',
  'The Mindset Mentor',
  'Rob Dial',
  'Rob Dial delivers daily mindset and motivation episodes aimed at entrepreneurs and high performers. One of the fastest-growing personal development podcasts. Actively books guests who can speak to high-performance, mental health, and business mindset.',
  'Personal Development',
  ARRAY['Personal Development','Business','Entrepreneurship'],
  'https://www.robdial.com/podcast',
  NULL,
  1500, '2025-06-01', 'active',
  true, 'Mindset coaches, therapists, high-performance entrepreneurs, authors',
  'Guests should have a compelling personal transformation story or expert framework for mental performance. Rob''s audience is young, ambitious, and looking for practical mindset shifts.',
  'https://www.robdial.com/contact',
  NULL,
  'partial', 79, true
),

(
  'tony-robbins-podcast',
  'Tony Robbins Podcast',
  'Tony Robbins',
  'Tony Robbins interviews the world''s top achievers in business, health, and life. One of the most recognized personal development brands globally. Guests are typically high-profile — world leaders, billionaires, athletes, and bestselling authors.',
  'Personal Development',
  ARRAY['Personal Development','Business','Leadership'],
  'https://www.tonyrobbins.com/podcast',
  NULL,
  300, '2025-06-01', 'active',
  true, 'World-class performers, bestselling authors, athletes, business icons',
  'Highly selective. Guest selection driven by Tony''s personal connections and his team. Guests must align with Tony''s brand of peak performance and abundance mindset.',
  NULL, NULL,
  'pending', 85, true
),

(
  'knowledge-project',
  'The Knowledge Project',
  'Shane Parrish',
  'Shane Parrish (Farnam Street) interviews world-class thinkers on decision-making, mental models, and the pursuit of mastery. Deep, long-form conversations with psychologists, investors, executives, and philosophers. Highly selective — quality over frequency.',
  'Personal Development',
  ARRAY['Personal Development','Business','Science'],
  'https://fs.blog/knowledge-project',
  NULL,
  200, '2025-06-01', 'active',
  true, 'World-class thinkers, investors, psychologists, executives, philosophers',
  'Shane prioritizes depth of thinking over celebrity. Guests must have a genuinely novel framework or insight. Relationship-driven.',
  NULL, NULL,
  'pending', 90, true
),

-- ── LEADERSHIP (continued) ────────────────────────────────────────────────

(
  'hbr-ideacast',
  'HBR IdeaCast',
  'Harvard Business Review',
  'The Harvard Business Review''s weekly podcast featuring thought leaders in business and management. One of the most credible leadership podcasts globally. Guests are typically HBR authors, researchers, or executives whose work is being featured.',
  'Leadership',
  ARRAY['Leadership','Business','Education'],
  'https://hbr.org/podcasts/ideacast',
  NULL,
  1000, '2025-06-01', 'active',
  true, 'Management researchers, HBR authors, C-suite executives, organizational psychologists',
  'Most guests have a connection to HBR — either a published article, case study, or book. Having an HBR article significantly improves chances. Contact HBR editorial team.',
  'https://hbr.org/contact-us',
  NULL,
  'partial', 87, true
),

-- ── HEALTH & WELLNESS (continued) ─────────────────────────────────────────

(
  'model-health-show',
  'The Model Health Show',
  'Shawn Stevenson',
  'Shawn Stevenson interviews leading experts on nutrition, sleep, fitness, and the science of optimal health. One of the top health podcasts in the US. Very guest-friendly with an active booking process.',
  'Health & Wellness',
  ARRAY['Health & Wellness','Science','Personal Development'],
  'https://themodelhealthshow.com',
  NULL,
  700, '2025-06-01', 'active',
  true, 'Nutritionists, sleep researchers, fitness experts, wellness physicians',
  'Guests must have scientific credibility or a compelling personal health transformation story. Shawn''s audience is serious about health optimization — not casual wellness content.',
  'https://themodelhealthshow.com/contact',
  NULL,
  'partial', 83, true
),

(
  'found-my-fitness',
  'Found My Fitness',
  'Dr. Rhonda Patrick',
  'Dr. Rhonda Patrick interviews scientists and researchers on longevity, nutrition, and human performance. Deep scientific content — Rhonda goes deeper on the research than almost anyone. Guest list is primarily academic researchers and physicians with peer-reviewed work.',
  'Health & Wellness',
  ARRAY['Health & Wellness','Science'],
  'https://www.foundmyfitness.com/podcast',
  NULL,
  250, '2025-06-01', 'active',
  true, 'Longevity researchers, physicians, neuroscientists, nutritional scientists',
  'Must have peer-reviewed research in longevity, nutrition, exercise, or neuroscience. Rhonda''s audience is highly sophisticated and scientifically literate.',
  'https://www.foundmyfitness.com/contact',
  NULL,
  'partial', 89, true
),

(
  'rich-roll',
  'Rich Roll Podcast',
  'Rich Roll',
  'Rich Roll (ultra-endurance athlete, author) hosts long-form conversations on plant-based nutrition, ultra-endurance, spirituality, and conscious entrepreneurship. Highly eclectic guest mix — athletes, authors, scientists, and spiritual leaders.',
  'Health & Wellness',
  ARRAY['Health & Wellness','Sports & Performance','Personal Development'],
  'https://www.richroll.com/podcast',
  NULL,
  850, '2025-06-01', 'active',
  true, 'Athletes, plant-based advocates, wellness authors, performance scientists',
  'Rich values depth and authenticity. Guests must have a genuine story of transformation — physical, mental, or spiritual. Vegan/plant-based angle is a strong fit but not required.',
  'https://www.richroll.com/contact',
  NULL,
  'partial', 83, true
),

-- ── TECHNOLOGY (continued) ────────────────────────────────────────────────

(
  'a16z-podcast',
  'a16z Podcast',
  'Andreessen Horowitz',
  'The Andreessen Horowitz (a16z) team covers technology trends, innovation, and the future of software. Guest list is typically a16z portfolio companies, researchers, and technology thought leaders. Highly influential in the VC and startup ecosystem.',
  'Technology',
  ARRAY['Technology','Business','Finance & Investing'],
  'https://a16z.com/podcast',
  NULL,
  700, '2025-06-01', 'active',
  true, 'Tech founders, researchers, VCs, software engineers building the future',
  'Guests are typically connected to the a16z ecosystem or have written something notable in the tech space. Portfolio company founders and research partners are primary.',
  NULL, NULL,
  'pending', 88, true
),

-- ── FINANCE & INVESTING (continued) ───────────────────────────────────────

(
  'afford-anything',
  'Afford Anything',
  'Paula Pant',
  'Paula Pant challenges the assumption that you can''t afford anything you want — you just have to make smart tradeoffs. Mix of real estate investing, financial independence, and mindset. Very guest-friendly with an active pitch process.',
  'Finance & Investing',
  ARRAY['Finance & Investing','Personal Development','Entrepreneurship'],
  'https://affordanything.com/podcast',
  NULL,
  500, '2025-06-01', 'active',
  true, 'Real estate investors, financial planners, FI bloggers, mindset coaches',
  'Guests must have a specific angle on wealth-building, real estate, or financial independence. Paula values nuance and intellectual honesty — no hype or get-rich-quick angles.',
  'https://affordanything.com/contact',
  NULL,
  'partial', 81, true
),

(
  'dave-ramsey-show',
  'The Dave Ramsey Show',
  'Dave Ramsey',
  'America''s most listened-to personal finance program. Dave Ramsey takes calls and interviews guests on getting out of debt, building wealth, and living generously. Massive conservative-leaning financial audience. Guest slots rare and selective.',
  'Finance & Investing',
  ARRAY['Finance & Investing','Leadership','Business'],
  'https://www.ramseysolutions.com/shows/the-ramsey-show',
  NULL,
  3500, '2025-06-01', 'active',
  true, 'Personal finance authors, debt-free success stories, small business owners',
  'Guests must align with Ramsey''s principles — debt-free living, cash envelope system, no crypto. Books on personal finance or business are ideal. Contact Ramsey producer team.',
  'https://www.ramseysolutions.com/contact',
  NULL,
  'partial', 87, true
),

-- ── WOMEN IN BUSINESS (continued) ──────────────────────────────────────────

(
  'we-can-do-hard-things',
  'We Can Do Hard Things',
  'Glennon Doyle & Abby Wambach',
  'Glennon Doyle and Abby Wambach have raw, honest conversations about life, womanhood, relationships, and social issues. Massive female audience. Guests span authors, activists, scientists, and cultural figures who challenge the status quo.',
  'Women in Business',
  ARRAY['Women in Business','Personal Development','Society & Culture'],
  'https://momastery.com/blog/we-can-do-hard-things',
  NULL,
  350, '2025-06-01', 'active',
  true, 'Female authors, activists, therapists, cultural figures, physicians',
  'Guests must fit the honest, vulnerability-forward tone. Glennon''s audience is predominantly women looking for permission to live authentically. Strong fit for memoir authors and mental health advocates.',
  NULL, NULL,
  'pending', 82, true
),

-- ── SPORTS & PERFORMANCE ──────────────────────────────────────────────────

(
  'finding-mastery',
  'Finding Mastery',
  'Michael Gervais',
  'Dr. Michael Gervais (sports psychologist to the Seattle Seahawks and world-class athletes) interviews high performers on the mental skills needed to be world-class. Deep, research-backed conversations on psychology, performance, and purpose.',
  'Sports & Performance',
  ARRAY['Sports & Performance','Personal Development','Health & Wellness'],
  'https://findingmastery.com/podcasts',
  NULL,
  380, '2025-06-01', 'active',
  true, 'Elite athletes, military special operators, C-suite executives, performance coaches',
  'Guests must have achieved peak performance at the top of their field. Mental performance story is key. Dr. Gervais values psychological depth over celebrity alone.',
  'https://findingmastery.com/contact',
  NULL,
  'partial', 88, true
),

(
  'the-sports-doctor',
  'The Sports Doctor',
  'Dr. Robert Weil',
  'Dr. Robert Weil covers sports medicine, injury prevention, and peak physical performance. Long-running show with a loyal sports medicine and fitness professional audience. Active guest booking process for practitioners and researchers.',
  'Sports & Performance',
  ARRAY['Sports & Performance','Health & Wellness'],
  'https://www.thesportsdoctor.com',
  NULL,
  900, '2025-06-01', 'active',
  true, 'Sports medicine physicians, physical therapists, trainers, researchers',
  'Must have expertise in sports medicine, injury prevention, nutrition for athletes, or physical performance. Clinical experience valued.',
  'https://www.thesportsdoctor.com/contact',
  NULL,
  'partial', 72, true
),

-- ── FAITH & SPIRITUALITY ───────────────────────────────────────────────────

(
  'elevation-with-steven-furtick',
  'Elevation with Steven Furtick',
  'Steven Furtick',
  'Pastor Steven Furtick of Elevation Church shares messages on faith, personal growth, and purpose. One of the most-downloaded faith-based podcasts globally. Primarily sermon-based — not a traditional interview show but occasionally features guest speakers.',
  'Faith & Spirituality',
  ARRAY['Faith & Spirituality','Personal Development'],
  'https://elevationchurch.org/podcasts',
  NULL,
  800, '2025-06-01', 'active',
  false, 'Guest speakers for Elevation Church events', NULL,
  'https://elevationchurch.org/contact',
  NULL,
  'partial', 82, true
),

(
  'the-daily-stoic',
  'The Daily Stoic Podcast',
  'Ryan Holiday',
  'Ryan Holiday shares daily Stoic wisdom and occasionally interviews authors, philosophers, and business leaders who embody Stoic principles. Ryan is a bestselling author (Obstacle is the Way, Ego is the Enemy). Strong fit for philosophy, history, and business crossover guests.',
  'Faith & Spirituality',
  ARRAY['Faith & Spirituality','Personal Development','Education'],
  'https://dailystoic.com/podcast',
  NULL,
  500, '2025-06-01', 'active',
  true, 'Philosophy authors, historians, athletes who practice Stoic principles',
  'Guests must have a genuine connection to Stoic philosophy or have written on timeless principles. Authors with a philosophy or self-mastery angle are ideal.',
  'https://dailystoic.com/contact',
  NULL,
  'partial', 83, true
),

-- ── SOCIETY & CULTURE / SCIENCE ───────────────────────────────────────────

(
  'revisionist-history',
  'Revisionist History',
  'Malcolm Gladwell',
  'Malcolm Gladwell re-examines overlooked or misunderstood events, people, and ideas from the past. Narrative non-fiction storytelling at its finest. Primarily a solo narrative show — occasional experts and interview subjects featured within episodes.',
  'Society & Culture',
  ARRAY['Society & Culture','Education','Science'],
  'https://www.pushkin.fm/podcasts/revisionist-history',
  NULL,
  100, '2025-06-01', 'active',
  true, 'Academics, historians, scientists, policy experts featured in Malcolm''s research',
  'Not a traditional guest booking — Malcolm approaches experts for his specific episode topics. Cold pitches are rarely effective. A strong academic publication or connection to Pushkin Industries helps.',
  NULL, NULL,
  'pending', 91, true
),

(
  'hidden-brain',
  'Hidden Brain',
  'Shankar Vedantam',
  'NPR''s Hidden Brain uses science and storytelling to reveal unconscious patterns that drive human behavior. Shankar Vedantam interviews researchers and psychologists. Highly curated — guests are typically academics with peer-reviewed research that connects to everyday life.',
  'Society & Culture',
  ARRAY['Society & Culture','Science','Education'],
  'https://hiddenbrain.org',
  'https://feeds.npr.org/510308/podcast.xml',
  400, '2025-06-01', 'active',
  true, 'Psychologists, behavioral economists, neuroscientists, social scientists',
  'NPR produced — guests are primarily academic researchers. Must have peer-reviewed work that translates into surprising, counterintuitive insights about human behavior.',
  NULL, NULL,
  'pending', 90, true
),

-- ── PARENTING ─────────────────────────────────────────────────────────────

(
  'good-inside',
  'Good Inside',
  'Dr. Becky Kennedy',
  'Dr. Becky Kennedy (the "millennial parenting whisperer" per TIME Magazine) helps parents build connection-based relationships with their kids. One of the fastest-growing parenting podcasts. Highly guest-friendly with an engaged community of parents.',
  'Parenting',
  ARRAY['Parenting','Personal Development','Education'],
  'https://www.goodinside.com/podcast',
  NULL,
  350, '2025-06-01', 'active',
  true, 'Child psychologists, family therapists, parenting authors, pediatricians',
  'Guest expertise must directly serve parents of young children. Clinical or research background in child development strongly preferred. Dr. Becky''s audience trusts science-based parenting approaches.',
  'https://www.goodinside.com/contact',
  NULL,
  'partial', 86, true
),

(
  'big-life-kids',
  'Big Life Journal Podcast',
  'Andrea Driessen & Stephanie Harrison',
  'Interviews with psychologists, educators, and experts on raising resilient, growth-minded children. Strong fit for parenting authors, school counselors, and child development researchers. Active guest booking process.',
  'Parenting',
  ARRAY['Parenting','Education','Personal Development'],
  'https://biglifejournal.com/podcast',
  NULL,
  280, '2025-06-01', 'active',
  true, 'Child psychologists, educators, parenting authors, school counselors',
  'Must have expertise that directly helps parents raise resilient, confident children. Growth mindset framework is central to the show.',
  'https://biglifejournal.com/contact',
  NULL,
  'partial', 74, true
)

ON CONFLICT (slug) DO NOTHING;
