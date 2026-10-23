import type { FaqGroup, Metric } from './types';

/** More & More track record, as published on mnm.live and the Abu Dhabi site. */
export const producerMetrics: Metric[] = [
  { value: '100+', label: 'Events organised' },
  { value: '250+', label: 'Deals and introductions' },
  { value: '$50M+', label: 'Sponsorship value facilitated' },
  { value: '5+', label: 'Continents' },
];

export const producerServices = [
  {
    name: 'Events organisation',
    body: 'Curated side events, private dinners, roundtables and invite-only summits, designed to put the right decision-makers in the same room.',
  },
  {
    name: 'VIP delegations',
    body: 'Professionally led delegations to the world’s most significant conferences, with access, briefings and structured introductions.',
  },
  {
    name: 'Deal facilitation',
    body: 'Warm connections between investors, founders and strategic partners, with hands-on support from first meeting to signed terms.',
  },
  {
    name: 'Networking as a service',
    body: 'Long-term community building and targeted introductions: an always-on relationship engine for growth and institutional reach.',
  },
];

export const producerTimeline = [
  { when: 'Abu Dhabi · 2025', what: 'Web2 to Web3 Summit', note: 'Co-produced with Hub71' },
  { when: 'Paris · April 2026', what: 'The Odds · Paris Blockchain Week', note: 'Connect Lounge, the Louvre' },
  { when: 'Singapore · October 2026', what: 'Agentic Finance Summit · TOKEN2049 Week', note: 'With The Odds, co-located' },
  { when: 'Next · Abu Dhabi · December 2026', what: 'Agentic Finance Abu Dhabi', note: 'Summit and VIP Gala', next: true },
];

export type SeriesBrand = {
  id: string;
  name: string;
  focus: string;
  summary: string;
  relationship: string;
  facts: string[];
  image: { src: string; alt: string };
  href?: string;
  linkLabel?: string;
};

/** The More & More event ecosystem. Related brands, not interchangeable ones. */
export const seriesBrands: SeriesBrand[] = [
  {
    id: 'agentic-finance',
    name: 'Agentic Finance',
    focus: 'AI agents in institutional finance',
    summary:
      'An invitation-only summit series for the institutions, capital allocators, regulators and builders deciding how AI agents enter trading, payments, custody and capital management.',
    relationship: 'The flagship series. Singapore 2026 was the first edition; Abu Dhabi follows in December 2026, then five cities in 2027.',
    facts: ['Singapore · 8 October 2026 · 650+ attendees', 'Abu Dhabi · December 2026 · 500 curated guests', '2027 · Hong Kong, Rio de Janeiro, Paris, Dubai, Singapore'],
    image: { src: '/images/singapore-2026/agentic-capital-panel.webp', alt: 'The five-strong Agentic Capital panel on the Singapore stage' },
    href: '/editions',
    linkLabel: 'See every edition',
  },
  {
    id: 'the-odds',
    name: 'The Odds: Prediction Markets Live',
    focus: 'Prediction markets',
    summary:
      'A curated summit for the operators, exchanges, market makers, regulators and capital shaping prediction markets. A separate audience, with a separate programme.',
    relationship:
      'A sister brand. In Singapore it ran as a co-located second stage alongside Agentic Finance, on the same day at the same venue.',
    facts: ['Paris · Paris Blockchain Week 2026 · 200+ vetted attendees', 'Singapore · TOKEN2049 Week 2026 · co-located stage'],
    image: { src: '/images/more-and-more/the-odds-paris-room.jpg', alt: 'A full room at The Odds: Prediction Markets Summit, Paris Blockchain Week' },
    href: 'https://mnm.live/theodds/t2049singapore',
    linkLabel: 'Visit The Odds',
  },
  {
    id: 'web2-to-web3',
    name: 'Web2 to Web3 Summit',
    focus: 'Institutional onboarding to Web3',
    summary:
      'A curated institutional programme in Abu Dhabi, produced with Hub71, where banks, payment leaders, regulators and VCs met the founders building the onboarding layer for institutional capital.',
    relationship:
      'The proof that More & More can convene Abu Dhabi. Agentic Finance Abu Dhabi is built by the same team, with the same relationships, on the same island.',
    facts: ['Abu Dhabi · 2025', '150 senior professionals', 'Speakers from Fireblocks, eToro, CertiK, Zengo, Nominis and CryptoLaw Partners'],
    image: { src: '/images/more-and-more/web2toweb3-session.webp', alt: 'A seated session at the Web2 to Web3 Summit in Abu Dhabi, produced by More & More' },
    href: 'https://mnm.live/case-studies#web2-to-web3',
    linkLabel: 'Read the case study',
  },
];

export const faqGroups: FaqGroup[] = [
  {
    id: 'invitations',
    title: 'Invitations and registration',
    items: [
      {
        q: 'Who is Agentic Finance for?',
        a: 'Senior decision-makers: banks and financial institutions, sovereign, family-office and institutional capital, regulators, exchanges and market infrastructure, and the companies building agentic AI for finance.',
      },
      {
        q: 'Can anyone register?',
        a: 'No. Agentic Finance is invitation-only and there are no tickets. Every guest is selected. You can request an invitation, and each request is reviewed by the team. Submitting a request does not guarantee admission.',
        links: [{ label: 'How selection works', href: '/program/who-gets-in' }],
      },
      {
        q: 'How do I request an invitation to Abu Dhabi?',
        a: 'Use any “Request an invitation” button. It takes you to the Abu Dhabi application on Luma, where the team reviews your seniority, institution and fit. You will hear back by email.',
        links: [{ label: 'Request an invitation', href: '/invitation' }],
      },
      {
        q: 'I have received a personal invitation. What next?',
        a: 'Verify it on the invitation page with your code and the email address it was sent to, then complete your registration. Invitations are personal and cannot be transferred.',
        links: [{ label: 'Verify an invitation', href: 'https://mnm.live/agentic-finance-abu-dhabi/invitation' }],
      },
      {
        q: 'Can I bring a colleague?',
        a: 'Invitations cannot be transferred or shared. If a colleague should be in the room, ask them to request an invitation of their own.',
      },
    ],
  },
  {
    id: 'editions',
    title: 'Editions and locations',
    items: [
      {
        q: 'Where and when is the next edition?',
        a: 'Abu Dhabi, December 2026. The summit’s date and venue are shared with invited guests as they are confirmed. The VIP Gala is a separate evening on Tuesday 8 December 2026, by invitation only.',
      },
      {
        q: 'What is the difference between the Summit and the VIP Gala?',
        a: 'The Summit is the main gathering of 500 hand-selected guests. The VIP Gala is a separate evening for approximately 200 invited senior leaders and strategic partners, with its own guest list. An invitation to one does not include the other.',
        links: [{ label: 'About the Gala', href: '/editions/abu-dhabi-2026/gala' }],
      },
      {
        q: 'How do editions differ from one another?',
        a: 'Each edition is its own curated room, with a programme and guest list built for its city. The questions stay constant; the institutions, regulators and capital around them change. Singapore 2026 ran during TOKEN2049 week; Abu Dhabi is an independent gathering.',
      },
      {
        q: 'Which cities are planned for 2027?',
        a: 'Hong Kong, Rio de Janeiro, Paris, Dubai and Singapore. Dates and venues will be announced city by city. You can register your interest now.',
        links: [{ label: 'The 2027 series', href: '/editions/2027' }],
      },
      {
        q: 'Was Singapore connected to TOKEN2049?',
        a: 'Agentic Finance Singapore was an official side event of TOKEN2049 Singapore, produced independently by More & More at Suntec City during TOKEN2049 week, with The Odds: Prediction Markets Live co-located on a second stage.',
      },
    ],
  },
  {
    id: 'speakers',
    title: 'Speakers',
    items: [
      {
        q: 'Can I nominate a speaker?',
        a: 'Yes, including yourself. Tell us who should be on stage and why. Every nomination is read; a nomination is not a confirmation, and the stage is curated.',
        links: [{ label: 'Nominate a speaker', href: '/speakers/nominate' }],
      },
      {
        q: 'Who is speaking in Abu Dhabi?',
        a: 'The Abu Dhabi programme is announced speaker by speaker, as each one confirms. Speakers from past editions are shown separately and are not confirmed for Abu Dhabi unless announced.',
        links: [{ label: 'Abu Dhabi speakers', href: '/editions/abu-dhabi-2026/speakers' }],
      },
    ],
  },
  {
    id: 'partnerships',
    title: 'Partnerships',
    items: [
      {
        q: 'Can my company become a partner?',
        a: 'Yes. Abu Dhabi has no more than eight strategic partner positions, each built around a seat on stage, introductions arranged before the event and the VIP Gala. Start with the partnership form or book a call.',
        links: [{ label: 'Book a partnership call', href: '/partners/book-a-call' }],
      },
      {
        q: 'What does owning a category mean?',
        a: 'Each part of the agentic finance ecosystem, from trading and payments to wallets, compliance and capital, is a conversation we lead on stage. A category partner becomes the company associated with one of them: its session, its branding and the introductions around it. There are twelve categories but no more than eight positions, so not every category will have a partner.',
        links: [{ label: 'Partnership categories', href: '/partners/categories' }],
      },
      {
        q: 'What did partners receive in Singapore?',
        a: 'Title positioning, keynotes and panel seats, branded areas, main-stage branding, activations such as an F1 simulator, PR, photography, video and executive networking. The use cases show it partner by partner.',
        links: [{ label: 'Use cases', href: '/partners/use-cases' }],
      },
      {
        q: 'Is there a price list?',
        a: 'No. Every partnership is shaped around the category and the introductions a company wants, so the conversation starts with a short call rather than a rate card.',
      },
    ],
  },
  {
    id: 'media',
    title: 'Media',
    items: [
      {
        q: 'How do I make a media enquiry?',
        a: 'Use the contact form and choose “Press and media”, or email the team directly. Logo files are available on the press page.',
        links: [{ label: 'Press and brand kit', href: '/media/press' }],
      },
    ],
  },
];
