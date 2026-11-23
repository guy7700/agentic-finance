# Agentic Finance Hong Kong: landing page structure

Source: `Agentic_Finance_HK_Template.html` (draft). Copy is adapted from the Singapore and Abu Dhabi pages.
Anything marked **TBC** is unconfirmed in the draft and must be filled before launch.

## 1. Page overview

| Field | Value |
|---|---|
| Event | Agentic Finance Hong Kong |
| When | **TBC** day, February 2027, **TBC** time (HKT) |
| Where | **TBC** venue, Hong Kong |
| Context | Held during Consensus Hong Kong week (1–3 Feb 2027, Hong Kong Convention & Exhibition Centre) |
| Producer | More & More, independent of Consensus |
| Format | Invitation-only, no tickets, every request reviewed |
| Primary CTAs | Apply to attend (`#join`), Partner with us (`#tiers`) |
| Secondary CTAs | Nominate a speaker, Verify an invitation, Request the partnership deck, Book a partnership call |
| One-page layout | 16 sections plus header and footer, in the order below |

### Section order

| # | ID | Section | Template source |
|---|---|---|---|
| 00 | `header` | Header / nav | SG, AD |
| 01 | `hero` | Hero | SG, AD |
| 02 | `logo-strip` | Partner logo strip | SG |
| 03 | `concept` | The Concept | SG |
| 04 | `join` | Join the Summit | SG |
| 05 | `partners` | Partners & sponsors grid | SG, AD |
| 06 | `speakers` | Speakers | SG, AD |
| 07 | `categories` | Category ownership | AD |
| 08 | `why-hk` | Why Hong Kong | AD |
| 09 | `consensus` | Consensus co-location | SG |
| 10 | `opportunity` | The Opportunity to Lead | AD |
| 11 | `how-we-help` | How we help (7 deliverables) | AD |
| 12 | `tiers` | Partnership tiers | SG |
| 13 | `use-cases` | Use cases (eToro case study) | AD |
| 14 | `calendar` | 2027 series calendar | AD |
| 15 | `faq` | FAQ | SG, AD |
| 16 | `closing` | Closing CTA | SG, AD |
| 17 | `footer` | Footer | SG, AD |

SG = Singapore page, AD = Abu Dhabi page.

## 2. Global rules

- **Background rhythm:** sections alternate between base and a slightly lighter surface. Hero and closing use a gradient background.
- **Section header pattern:** eyebrow (uppercase, small), H2, optional lead paragraph (max ~720px). Centred or left-aligned per section, as listed below.
- **Grid:** max content width 1200px, 24px side padding. Grids collapse 5/6 columns to 2, then to 1 at 560px.
- **Countdown:** the same component appears in the hero and in Join the Summit. It counts down to the event start (placeholder 2 Feb 2027, 14:00 HKT, **TBC**) and shows days, hours, minutes and seconds.
- **Placeholders:** the draft highlights unconfirmed values in amber. In production these must not ship; build them as required data fields so the build fails or warns if empty.
- **Remove before launch:** the draft banner, the template map, the per-section labels and the "Toggle section labels" button are template annotations only.
- **Images:** the draft hot-links Consensus images from CloudFront for preview. In production, use self-hosted copies with permission.

## 3. Design tokens (from the draft)

| Token | Value |
|---|---|
| Background | `#0b0d12`, alt surface `#11141b`, card `#161a23`, border `#262b37` |
| Text / muted | `#e9ecf2` / `#9aa3b2` |
| Accent / accent 2 | `#7c5cff` / `#22d3ee` |
| Success (verified marks) | `#22c55e` |
| Radius / max width | 16px / 1200px |
| Type | Inter, system fallback. H1 clamp 40–76px, H2 clamp 30–48px, H3 20px, body 16px/1.6 |
| Buttons | Pill. Primary is filled accent; ghost is outlined |

## 4. Sections

### 00 Header / nav
- **Layout:** sticky bar, 72px high, blurred dark background.
- **Left:** logo (`agentic-logo-gold.svg`).
- **Menu:** The Concept (`#concept`), Speakers (`#speakers`), Partnerships (`#opportunity`), Consensus (`#consensus`), FAQ (`#faq`), Invitation (link TBC).
- **Right:** ghost button "Partner with us" (`#tiers`), primary button "Apply to attend" (`#join`).
- **Mobile:** menu hidden below 1040px (needs a mobile menu, which the draft does not design).

### 01 Hero
- **Layout:** full-height, left-aligned, background image `cities/hong-kong.webp` under a left-to-right dark gradient.
- **Eyebrow:** "Closed-door · By invitation · [000] seats"
- **H1:** "Agentic Finance Hong Kong"
- **Subhead (H3):** "Where Finance's Decision-Makers Meet."
- **Lead:** "An invitation-only gathering of [000] hand-selected leaders shaping the future of finance, digital assets, and prediction markets."
- **Meta row:** Date ([DD] February 2027), Place ([Venue], Hong Kong), During (Consensus Hong Kong Week).
- **Countdown:** days, hours, min, sec.
- **CTAs:** "Apply to attend" (primary, `#join`), "Partner with us" (ghost, `#tiers`).
- **Footnote:** "Received a personal invitation? Verify it here →" (link TBC).

### 02 Partner logo strip
- **Layout:** one row of 7 greyscale logos, centred caption "Partners and sponsors".
- **Logos:** eToro, Limitless, Coinbase, Pantera Capital, Fireblocks, Alpaca, KPMG.
- **Behaviour:** logos use a bordered tile, greyscale and reduced opacity.

### 03 The Concept
- **Layout:** two-column split (text, image), then a 5-card row, then a 4-stat row.
- **Eyebrow / H2:** "The Concept" / "Invitation only, and deliberately accurate."
- **Pill:** "[DD] February 2027 · [00:00–00:00]"
- **Lead 1:** "One day in Hong Kong, during Consensus Hong Kong week."
- **Lead 2:** "The people who set agent strategy at banks, exchanges, payment networks and funds rarely get to compare notes in private. So the guest list is the product: [000] invitations, curated for seniority and relevance, with real time built in for the meetings that move deals forward."
- **Image:** `singapore/networking-floor.webp` (alt: delegates in conversation on the networking floor in Singapore).
- **Feature cards (5):**
  1. Structured Networking: "Introductions built around who you need to meet."
  2. Two Stages · [4] Hours: "Keynotes and panels across both stages."
  3. Partner Pavilion: "Stands and booths on the exhibition floor."
  4. Meeting Rooms: "Private rooms, meetings pre-scheduled."
  5. Bites & Beverages: "Food and drinks all afternoon and evening."
- **Stats (4, all TBC):** hand-picked attendees, events produced, speakers, partners.

### 04 Join the Summit
- **Layout:** centred, single column.
- **Eyebrow / H2:** "Registration" / "Join the Summit"
- **Lead:** "[000] seats at the agentic-finance room of Consensus Hong Kong Week, [DD] February 2027 in Hong Kong. Every request is read by the programme team."
- **Components:** countdown, primary button "Join the Summit →" (opens the application form).
- **Footnote:** "Few seats remain · Every request is reviewed"

### 05 Partners & sponsors grid
- **Layout:** header row (text left, link right), then a 6-column logo grid, disclaimer, CTA.
- **Eyebrow / H2:** "Who's in the room" / "Partners at Our Conferences"
- **Lead:** "C-level executives, senior decision-makers, institutional leaders, investors, regulators and founders shaping the future of financial markets."
- **Link:** "See use cases →" (`#use-cases`).
- **Logos (24):** eToro, AWS, Aave, Chainlink, Fireblocks, Pantera Capital, Alpaca, Coinbase, KPMG, Standard Chartered, Crypto.com, Nethermind, Zengo, Limitless, Alchemy, TRM Labs, Liquid, RedStone, SecondLane, Gate.io, World, PSG Labs, Animoca Brands, Bank Frick.
- **Disclaimer (keep):** "*Disclaimer: Companies shown are in active conversations with Agentic Finance about attendance and partnership. Logos are displayed for reference and remain subject to formal confirmation."
- **CTA:** "Become a partner" (`#tiers`).

### 06 Speakers
- **Layout:** header row with carousel arrows, then a 4-column grid of 8 speaker cards. Each card has a square photo, name, and "role · company".
- **Eyebrow / H2:** "Speakers" / "Speakers at Our Conferences"
- **Lead:** "The Global Agentic Finance Power List is live on our stage. Meet the leaders shaping what comes next."
- **Speakers:**

| Name | Role | Company |
|---|---|---|
| Yoni Assia | CEO and Co-Founder | eToro |
| Stani Kulechov | Founder and CEO | Aave Labs |
| Scott Lawin | President | Pantera Capital Management |
| Johann Eid | Chief Business Officer | Chainlink Labs |
| Stephen Humenik | Legal and Global Head of Clearing | Crypto.com |
| Giovanni Cunti | CEO Europe | Gate.io |
| Reza Bundy | Founder, Chairman and CEO | Atlas Capital Team |
| CJ Hetherington | Co-Founder and CEO | Limitless Labs |

- **Footer:** "And many more"; buttons "See all speakers" (primary), "Nominate a speaker" (ghost).
- **Photos:** `speakers/<slug>.webp`, cropped to the top of the frame.
- **Open point:** the arrows imply a carousel, but the draft shows a static grid. Decide which.

### 07 Category ownership
- **Layout:** centred header, rotating-question banner, 4-column grid of 12 cards, CTA.
- **Eyebrow / H2:** "Category Ownership" / "Where Does Your Company Fit?"
- **Lead:** "Twelve conversations, each with room for one company to lead it. Choose a category to see who it is for and who held it in Singapore."
- **Rotator:** cycles every 3.5 seconds through:
  1. "Who controls the agent?"
  2. "What happens when agents trade with other agents?"
  3. "Can an AI manage institutional capital?"
  4. "What becomes the wallet when the customer is software?"
  5. "Who is liable when an autonomous transaction goes wrong?"
  6. "What infrastructure will billions of financial agents require?"
- **Categories (number, title, audience):**

| # | Category | Who it is for |
|---|---|---|
| 01 | Agentic Trading | Brokers, exchanges, trading infrastructure, execution, APIs, market makers |
| 02 | Agentic Payments | Payments, stablecoins, payment networks, PSPs, settlement infrastructure |
| 03 | Agentic Commerce | AI commerce, checkout, merchant infrastructure, autonomous purchasing |
| 04 | Wallets & Identity | Wallets, embedded wallets, authentication, identity and permissions |
| 05 | Security | Transaction security, fraud, wallet security, agent permissions |
| 06 | Compliance | AML, KYC, KYT, transaction monitoring, AI governance |
| 07 | Capital & Asset Management | Funds, asset managers, allocators, wealth management |
| 08 | Prediction Markets | Exchanges, infrastructure, data, distribution, liquidity |
| 09 | Data & Oracles | Market data, financial data, oracle infrastructure, analytics |
| 10 | AI Infrastructure | Models, compute, GPUs, cloud, AI infrastructure |
| 11 | Tokenization & Digital Assets | RWA, custody, settlement and institutional digital assets |
| 12 | Banking Infrastructure | Banks, banking technology, settlement, treasury and financial rails |

- **CTA:** "Which category should your company own?" (`#tiers`).
- **Content gap:** the lead promises "who held it in Singapore", but the cards do not show that. Add a holder per category or reword the lead.

### 08 Why Hong Kong
- **Layout:** left-aligned header, 4 event cards, CTA.
- **Eyebrow / H2:** "Why Hong Kong" / "Early February, Global Finance Is in Hong Kong."
- **Lead:** "10,000 people from 100+ countries come to Hong Kong for Consensus. Fewer than 1% of them, [000] hand-selected leaders, meet at the Agentic Finance Summit."
- **Event cards (image, date pill, title, venue/blurb, stat, link):**

| Card | Date | Blurb | Stat | Status |
|---|---|---|---|---|
| Consensus Hong Kong | 1–3 Feb | Hong Kong Convention & Exhibition Centre | 10K attendees from 100+ countries | Complete; official site link |
| Institutional Summit Hong Kong | TBC | Part of Consensus Hong Kong | TBC | Placeholder text, no image, no link |
| Deal Flow+ | 2–3 Feb | Pre-scheduled 1:1 meetings at Consensus | 10,000+ 1:1 meetings | No image, no link |
| PitchFest | TBC | Part of Consensus Hong Kong | TBC | Placeholder text, no image, no link |

- **CTA:** "Apply to attend" (`#join`).

### 09 Consensus co-location
- **Layout:** two-column split. Left is text and stats; right is two stacked images.
- **Logo tile:** Consensus Hong Kong 2027 logo.
- **H2:** "10,000 attend Consensus Hong Kong. The most relevant 1% meet at the Agentic Finance Summit."
- **H3:** "A Consensus Hong Kong week event."
- **Lead:** "Consensus Hong Kong runs 1–3 February 2027 at the Hong Kong Convention & Exhibition Centre. The whole industry lands in the city for that week, which is exactly why we hold our room on [DD] February 2027, minutes away at [Venue]."
- **Stats (2×2):** 10K Attendees, 100+ Countries, $87T Assets managed at Consensus 2026, 10,000+ Pre-scheduled 1:1 meetings.
- **Button:** "Visit consensus-hongkong.coindesk.com ↗"
- **Images:** Consensus HK 2026 collage; attending-companies strip on a white panel.
- **Check:** "minutes away" depends on the venue, which is TBC. The "most relevant 1%" claim depends on the seat count.

### 10 The Opportunity to Lead
- **Layout:** centred header, 3-column grid of 6 cards, CTA.
- **Eyebrow / H2:** "Your Opportunity" / "The Opportunity to Lead."
- **Lead:** "Put your company in front of [000] hand-selected decision-makers, on the subject it wants to lead."
- **Cards:**
  1. Own a Category: "Become the company associated with a major part of the Agentic Finance ecosystem."
  2. Lead the Conversation: "Keynotes, panels, workshops, demos and curated discussions."
  3. Meet the People Who Matter: "Banks, asset managers, exchanges, funds, fintechs, regulators, payment companies, AI companies and infrastructure providers."
  4. Build Your Hong Kong Presence: "Use your time in Hong Kong to accelerate regional relationships and [Asian] market access." (wording TBC)
  5. Put Your Product in the Room: "Booths, branded areas, live demonstrations, activations and experiences."
  6. Extend the Impact: "PR, interviews, social content, video, photography and post-event distribution."
- **CTA:** "Find your category" (`#categories`).

### 11 How we help
- **Layout:** two-column split. Left column is sticky (eyebrow + H2). Right column is a numbered list of 7 items (auto-numbered 01–07). Below, a 7-photo strip.
- **Eyebrow / H2:** "How We Help You Achieve Your Goals" / "What Can Your Partnership Look Like?"
- **Items (title, description, green "Delivered" proof line):**

| # | Title | Description | Proof ("✓ Delivered: …") |
|---|---|---|---|
| 01 | Stage | Keynote, panel, fireside chat, moderation, workshop | Yoni Assia's keynote in Singapore, and panels at The Odds in Paris |
| 02 | Access | Curated meetings, VIP introductions, private gatherings, executive networking | curated introductions and structured networking at every summit we run |
| 03 | Space | Booth, lounge, meeting area, activation, demo station | eToro's branded area in Singapore, and branded activations at The Odds in Paris |
| 04 | Brand | Stage branding, screens, roll-ups, venue presence, website, agenda | "Agentic Finance by eToro" in Singapore, and eToro x Zengo stage branding at The Odds in Paris |
| 05 | Content | Interviews, podcasts, photography, video clips, social distribution | photography, video and interviews at every event we produce |
| 06 | PR | Media access, announcements, speaker positioning, event communications | CNBC on stage in Singapore, and media on site at our events |
| 07 | Experience | Create something people remember, from simulations and demonstrations to interactive financial experiences | eToro's F1 simulator in Singapore, and branded activations at The Odds in Paris |

- **Photo strip (7, all Singapore):** agentic-banking-panel, networking-floor, etoro-branded-area, sponsor-wall, interview-capture, media-on-site, f1-simulator.
- **Accuracy:** the proof lines are claims about past events and must stay verifiable.

### 12 Partnership tiers
- **Layout:** centred header, 3 equal cards (middle highlighted), two buttons below.
- **Eyebrow / H2:** "Partner With Us" / "Three ways to reach the room."
- **Lead:** "Institutional access, AI leadership, global visibility, thought leadership, and qualified leads. Full tier breakdown and pricing are in the partnership deck, sent on request."
- **Tiers:**

| Tier | Pill | Headline | Body | Button |
|---|---|---|---|---|
| Ecosystem | Ecosystem | Get in front of the room. | Brand visibility across the event, from the website to the stage backwall, without setting foot behind a booth. | Ecosystem Partner (ghost) |
| Gold (highlighted) | Most popular · Gold | Get on stage. | Panel seat, branded booth, and direct access to the room, for partners who want to be seen and heard, not just listed. | Gold Partner (primary) |
| Title | Title | Get the room. | A branded meeting space and curated 1-on-1 introductions with the attendees who matter most to your pipeline, plus top billing across the event. | Title Partner (ghost) |

- **Footer buttons:** "Request the Partnership Deck", "Book a partnership call" (both ghost).
- **Note:** no prices on the page, by design.

### 13 Use cases
- **Layout:** left-aligned header, 4-logo row, then one large card split in two (text left, 2×2 captioned photos right).
- **Eyebrow / H2:** "Use Cases" / "What partners received in Singapore"
- **Logos:** eToro, Fireblocks, MME, Limitless.
- **Card pill:** "Title Partner · "Agentic Finance by eToro""
- **Lead:** "Title positioning across the whole summit, the day's headline keynote from its CEO, a major discussion hosted by its Chief Blockchain Officer, and a physical presence on the floor."
- **Mini speakers:**
  - Yoni Assia, Co-Founder & CEO, Keynote
  - Omri Ross, Chief Blockchain Officer, Agentic Wallets
  - Ouriel Ohayon, Managing Director, Zengo (part of eToro), The Fans Were Already Trading
- **"What eToro received" (15 chips):** Title Partner positioning; "Agentic Finance by eToro"; Yoni Assia keynote; Omri Ross hosting a major discussion; Ouriel Ohayon of Zengo on The Odds stage; F1 simulator activation; Dedicated branded area; Main-stage branding; Roll-ups and signage; Digital promotion; Social media; PR; Photography; Video; Executive networking.
- **CTA block:** "Want this list with your name on it?" with "Partner with us" (`#tiers`).
- **Captioned photos:** eToro team at its branded area; Ouriel Ohayon on The Odds stage; a guest on eToro's F1 simulator; guests meeting beside eToro's stand. All Singapore.
- **Only one case study:** the draft shows eToro only, though four logos sit above it. Either add the others or cut to eToro.

### 14 2027 calendar
- **Layout:** left-aligned header, 5 portrait cards (city photo, number, city, anchor event, month, link). The first card (Hong Kong) is highlighted.
- **Eyebrow / H2 / lead:** "2027 Calendar" / "Agentic Finance Summit 2027 Calendar" / "Five cities · One global series"
- **Cards, in the order the draft shows them:**

| Draft # | City | Anchor event | Month |
|---|---|---|---|
| 01 | Hong Kong | Consensus Hong Kong | February 2027 |
| 02 | Rio de Janeiro | Blockchain.RIO | August 2027 |
| 03 | Paris | Signal Week Paris | July 2027 |
| 04 | Dubai | TOKEN2049 Dubai | April 2027 |
| 05 | Singapore | Sibos | September 2027 |

- **Each card link:** "Partner with us ↗" (`#tiers`).
- **Order:** the draft numbering is not chronological (Aug, Jul, Apr, Sep). Chronological order would be Hong Kong, Dubai, Paris, Rio, Singapore. Confirm the intended order, and check the dates against the main site (`src/config/events-2027.ts`) before shipping.

### 15 FAQ
- **Layout:** narrow column (900px), accordion, first item open.
- **Eyebrow / H2:** "FAQ" / "Common Questions"
- **Items:**
  1. **Who is it for?** Senior decision-makers: banks and financial institutions, sovereign, family-office and institutional capital, regulators, exchanges and market infrastructure, and the companies building agentic AI for finance.
  2. **Can anyone register?** No. Agentic Finance Hong Kong is invitation-only and there are no tickets. Every guest is selected; you can request an invitation from this page, and each request is reviewed by the team.
  3. **I have received a personal invitation. What next?** Verify it on the invitation page with your code and the email address it was sent to, then complete your registration. Invitations are personal and cannot be transferred.
  4. **Where and when?** The Agentic Finance Summit is on [Day DD] February 2027, [00:00–00:00] HKT, at [Venue], Hong Kong, during Consensus Hong Kong week.
  5. **Is this connected to Consensus Hong Kong?** Agentic Finance Hong Kong is held during Consensus Hong Kong week (1–3 February 2027), produced independently by More & More.
  6. **Can I nominate a speaker?** Yes. Use any "Nominate a speaker" button on this page, or on the Speakers page, and tell us who should be on stage and why.
  7. **Can my company become a partner?** Yes. Ecosystem, Gold, and Title partnership packages are available, each with different levels of exposure, on-site presence, and access to attendees. Contact us to discuss.
  8. **What does owning a category mean?** Each part of the agentic finance ecosystem (trading, payments, commerce, wallets, compliance, capital and more) is a conversation we lead on stage. A category partner becomes the company associated with one of them: its session, its branding and the introductions around it.
  9. **What did partners receive in Singapore?** Title positioning, keynotes and panel seats, branded areas, main-stage branding, activations such as an F1 simulator, PR, photography, video and executive networking. The case studies on this page show it partner by partner.
- **SEO:** emit FAQPage structured data for these nine entries.
- **Check:** item 9 says "case studies" (plural) but section 13 has one.

### 16 Closing CTA
- **Layout:** centred, gradient background.
- **Eyebrow:** "Agentic Finance Hong Kong · [Day, DD] February 2027"
- **H2:** "The People in the Room Are the Point."
- **Lead:** "Every guest is selected. Every invitation is personal."
- **CTAs:** "Apply to attend" (primary), "Partner with us" (ghost), "Nominate a speaker" (ghost).
- **Footnotes:** "Received a personal invitation? Verify it here." and "[000] seats only · Every request is reviewed".

### 17 Footer
- **Layout:** 3 columns (brand, Conference, Connect), then a legal strip.
- **Brand column:** logo; "Agentic Finance Hong Kong. An invitation-only gathering of the leaders shaping finance, digital assets and prediction markets."; "[DD] February 2027 · [Venue], Hong Kong"; social icons (TG, X, IG, in).
- **Conference links:** The Concept, Speakers, Your Opportunity, Case Studies, Partnership Tiers, Apply to attend, Verify an Invitation.
- **Connect links:** Nominate a Speaker, The Odds - Telegram, The Odds - X, More & More - LinkedIn.
- **Legal strip:** "An independent, invitation-only gathering produced by More & More in Hong Kong, February 2027." and "© 2027 More & More".
- **Social URLs:** none in the draft; they need adding.

## 5. Reusable components

| Component | Used in |
|---|---|
| Section header (eyebrow, H2, lead, optional right-hand link) | 03–16 |
| Countdown | 01, 04 |
| Logo tile and logo grid (7, 6 or 4 columns) | 02, 05, 09, 13 |
| Person card (photo, name, role · company) | 06 |
| Mini speaker (round photo, name, role) | 13 |
| Info card (H3 + paragraph) | 03, 07, 10, 12 |
| Event card (image, pill, title, blurb, stat, link) | 08 |
| Stat (large number, label) | 03, 09 |
| Numbered list with verified line | 11 |
| Photo strip / captioned photo | 11, 13 |
| Accordion | 15 |
| Pill | 03, 08, 12, 13 |
| Button (primary / ghost) | everywhere |

## 6. Data the page needs

Keep these as structured data (the main site already keeps content in `src/data` and `src/config`) so copy edits do not touch components.

- **Event:** date, start/end time, venue, seat count, timezone.
- **Stats:** attendees, events produced, speakers, partners.
- **Logos:** name, file, alt, which sections show it.
- **Speakers:** name, role, company, photo slug.
- **Categories:** number, title, audience, optional Singapore holder.
- **Consensus facts:** dates, venue, attendee count, countries, assets managed ($87T, Consensus 2026), 1:1 meeting count.
- **Related events:** title, dates, blurb, stat, image, link.
- **Tiers:** name, headline, body, button.
- **Calendar:** city, anchor event, month, image.
- **FAQ:** question, answer.
- **Links:** application form, invitation verification, speaker nomination, partnership deck, call booking, social profiles.

## 7. To confirm before build

| Item | Where | Notes |
|---|---|---|
| Event date, time, venue | 01, 03, 04, 09, 15, 16, 17 | Drives the countdown and the "minutes away" claim |
| Seat count | 01, 03, 04, 08, 10, 16 | Drives the "1%" claim |
| Stats (4) | 03 | Hand-picked attendees, events produced, speakers, partners |
| Institutional Summit HK and PitchFest | 08 | Dates, blurb, stat, image, link |
| Deal Flow+ image and link | 08 | |
| "[Asian]" wording | 10 | |
| Category "who held it in Singapore" | 07 | Lead promises it, cards omit it |
| Calendar order and dates | 14 | Not chronological; verify against the main site |
| Speakers carousel vs grid | 06 | |
| Case studies: one or several | 13, 15 | |
| Invitation link, application form, deck and call links | 00, 01, 04, 06, 12, 16 | Still `#` in the draft |
| Social URLs | 17 | |
| Mobile navigation | 00 | Not designed in the draft |
| Consensus image rights and self-hosting | 01, 08, 09 | Currently hot-linked |
| Logo permissions | 02, 05 | Disclaimer says "in active conversations" |

## 8. Notes for the build

- The repo's `AGENTS.md` warns that this Next.js version has breaking changes. Read the relevant guide in `node_modules/next/dist/docs/` before writing routes or components.
- The site already has a `/2027` route, `/partners`, `/speakers`, `/invitation` and `/about/faq`. Check which of the page's sections should reuse existing components and data before adding new ones.
- Anchors (`#join`, `#tiers`, `#categories`, `#use-cases`) should become real routes where the main site already has them (for example the speaker nomination page and the invitation page).
