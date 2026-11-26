/**
 * The Agentic Finance Network (/network/*): page copy and the five application forms.
 *
 * Copy: Tal's "Agentic Finance Network: Website Section Copy" (25 Nov 2026). The VC page follows her
 * HTML prototype (network-vcs.html), which is the functional reference. Tal's review (26 Nov 2026): joining is
 * free for all five groups, the form comes first and asks only for name, email and company, and the paid
 * tiers (Venture Partner, partner seats) are not shown in the joining journey. Unconfirmed facts (the live
 * startup count, government members) are left out rather than shown as placeholders.
 *
 * Forms post to the Supabase edge function network-apply (supabase/functions/network-apply), which checks the
 * same fields and options on the server. Change a field here and there together.
 */

import type { NetworkGroup } from './types';

export type Audience = NetworkGroup;

type Option = { value: string; label: string };
export type NetworkField =
  | { key: string; label: string; kind: 'text' | 'email' | 'url'; required?: boolean; placeholder?: string; max?: number; hint?: string }
  | { key: string; label: string; kind: 'textarea'; required?: boolean; max?: number }
  | { key: string; label: string; kind: 'select'; required?: boolean; options: Option[] }
  | { key: string; label: string; kind: 'multi'; required?: boolean; options: string[] }
  | { key: string; label: string; kind: 'yesno'; required?: boolean }
  | { key: string; label: string; kind: 'flag' };

const opts = (values: string[]): Option[] => values.map((v) => ({ value: v, label: v }));
const CATEGORIES = ['Trading', 'Payments', 'Compliance and security', 'Data and research', 'Wallets and infrastructure', 'Prediction markets', 'Other'];
const CITIES = ['Hong Kong', 'Cannes', 'Dubai', 'Miami', 'Paris', 'Singapore'];
const REGIONS = ['Asia Pacific', 'Middle East', 'Europe', 'North America', 'LatAm', 'Africa'];

/**
 * Joining asks for three things only: name, email and company (Tal's review, 26 Nov 2026: "capture the
 * lead first"). Every other field is optional and sits behind "Tell us more (optional)" on the form.
 */
const person = (org: string, orgPlaceholder: string, rolePlaceholder: string, email = 'jane@company.com', website = true): NetworkField[] => [
  { key: 'name', label: 'Name', kind: 'text', required: true, placeholder: 'Jane Cohen', max: 120 },
  { key: 'email', label: 'Work email', kind: 'email', required: true, placeholder: email, max: 200 },
  { key: 'organisation', label: org, kind: 'text', required: true, placeholder: orgPlaceholder, max: 200 },
  { key: 'role', label: 'Your role', kind: 'text', placeholder: rolePlaceholder, max: 120 },
  ...(website ? [{ key: 'website', label: 'Website', kind: 'url', placeholder: 'company.com' } as NetworkField] : []),
];

/** The fields shown before "Tell us more (optional)". */
export const QUICK_FIELDS = ['name', 'email', 'organisation'];

export type NetworkPage = {
  audience: Audience;
  slug: string;
  /** Card on /network/ */
  card: { title: string; line: string; membership: string };
  eyebrow: string;
  title: string;
  lede: string;
  primaryCta: string;
  secondaryCta?: { label: string; href?: string; action?: 'venture-partner' };
  stats?: { value: string; label: string }[];
  benefitsTitle: string;
  benefitsLede?: string;
  benefits: { title: string; body: string }[];
  whoIsIn: { label: string; names: string }[];
  /** Logo wall: the organisations of this group in partners.ts (all took part in our events), labelled as such. */
  logos: { label: string };
  form: {
    eyebrow: string;
    title: string;
    lede?: string;
    button: string;
    fields: NetworkField[];
    successTitle: string;
    successBody: string;
  };
};

export const networkPages: NetworkPage[] = [
  {
    audience: 'startup',
    slug: 'startups',
    card: { title: 'Startups', line: 'Meet the investors and partners who fund and use what you build.', membership: 'Free to join' },
    eyebrow: 'Agentic Finance Network · Startups',
    title: 'Meet the people who fund and buy what you build.',
    lede: 'For startups building AI agents, payments, trading, compliance, data and infrastructure for finance. Joining is free.',
    primaryCta: 'Join Our Network for Free',
    benefitsTitle: 'What we bring to startups',
    benefits: [
      { title: 'VC introductions', body: 'Direct access to the VCs in the Network, matched by category and stage.' },
      { title: 'Founders and Funders dinners', body: 'Invitations to the private dinners with investors that close each Agentic Finance summit.' },
      { title: 'Free summit passes', body: 'Free passes to Agentic Finance summits for you and your team.' },
      { title: 'Agentic Finance Startup Competition', body: 'Pitch in front of VCs and corporates. The Network vets the startups, and the companies in the Network choose who goes through.' },
      { title: 'Corporate and bank access', body: 'Introductions to the companies, banks and exchanges that buy, partner and pilot.' },
      { title: 'Stage and visibility', body: 'Speaking slots on X Spaces and webinars, a profile in the Network directory, and a place in our news and newsletter.' },
      { title: 'Daily news and weekly newsletter', body: 'One or two articles a day and a weekly newsletter with the best of the market.' },
      { title: 'Event discounts', body: '20% to 50% off other major AI and finance conferences.' },
      { title: 'Community', body: 'Face-to-face and online: summits, side events, X Spaces and webinars with the other founders.' },
    ],
    whoIsIn: [
      { label: 'Startups and builders from our community and past events', names: 'Agoric · Limitless · Vulsight · LibertAI · AEON · Zama · Kalshi · Nethermind · Monarq · Parfin · BoomFi' },
      { label: 'Investors already in the room', names: 'Pantera Capital · OKX Ventures · B Capital · Collider VC · Atlas Capital' },
    ],
    logos: { label: 'Startups and builders at our events' },
    form: {
      eyebrow: 'Free to join',
      title: 'Join the Network as a startup',
      lede: 'Name, email and company. Everything else is optional.',
      button: 'Join for free',
      fields: [
        ...person('Company name', 'Company name', 'Founder, CEO, CTO'),
        { key: 'one_liner', label: 'What you build (one line)', kind: 'text', max: 140, hint: 'Up to 140 characters.' },
        { key: 'category', label: 'Category', kind: 'select', options: opts(CATEGORIES) },
        { key: 'stage', label: 'Stage', kind: 'select', options: opts(['Pre-seed', 'Seed', 'Series A', 'Series B+', 'Revenue-generating']) },
        { key: 'raising', label: 'Currently raising', kind: 'yesno' },
        { key: 'raising_amount', label: 'How much', kind: 'text', max: 60, placeholder: '$2M' },
        { key: 'meet', label: 'Who do you want to meet', kind: 'multi', options: ['VCs', 'Banks', 'Exchanges', 'Payment networks', 'Customers', 'Media'] },
        { key: 'linkedin', label: 'LinkedIn or X', kind: 'url', placeholder: 'linkedin.com/in/...' },
        { key: 'competition', label: 'Apply to the Startup Competition', kind: 'flag' },
      ],
      successTitle: 'Welcome to the Network.',
      successBody: 'We have your details. The team reviews every application and emails you the next steps within 5 working days.',
    },
  },
  {
    audience: 'vc',
    slug: 'vcs',
    card: { title: 'Venture Capital', line: 'Deal flow in agentic finance, before everyone else sees it.', membership: 'Free to join' },
    eyebrow: 'Agentic Finance Network · Venture Capital',
    title: 'Deal flow in agentic finance. Free.',
    lede: 'For the investors backing AI agents, payments, trading and infrastructure for finance: vetted deal flow, Founders and Funders dinners and free summit passes.',
    primaryCta: 'Join Our Network for Free',
    stats: [
      { value: 'Free', label: 'to join' },
      { value: '650+', label: 'attendees at Singapore 2026' },
      { value: '140+', label: 'investor firms registered for our events' },
    ],
    benefitsTitle: 'What we bring to venture capital',
    benefitsLede: 'Find, meet and back the next winners in agentic finance.',
    benefits: [
      { title: 'Deal flow', body: 'Vetted startups from the Network and the Startup Competition, filtered by category and stage.' },
      { title: 'Category conversations', body: 'Direct conversations with founders in the categories you invest in: trading, payments, compliance, data, wallets, prediction markets.' },
      { title: 'Founders and Funders dinners', body: 'Private dinners with founders and fellow investors after each Agentic Finance summit.' },
      { title: 'Free summit passes', body: 'Free passes to Agentic Finance summits for you and your portfolio founders.' },
      { title: 'Portfolio visibility', body: 'Your portfolio companies featured in our news, newsletter and Network directory.' },
      { title: 'Market intelligence', body: 'One or two articles a day, the weekly newsletter, quarterly reports and the AF100 index.' },
      { title: 'X Spaces and webinars', body: 'Speak on our biweekly Spaces and webinars to reach founders and co-investors.' },
      { title: 'Corporate and bank access', body: 'Introductions to the companies and institutions in the Network that partner with and acquire startups.' },
      { title: 'Event discounts', body: '20% to 50% off other major AI and finance conferences around the world.' },
    ],
    whoIsIn: [
      {
        label: 'Investors who have been in our rooms',
        names:
          'Pantera Capital · Coinbase Ventures · Galaxy · Jump Crypto · Fidelity Investments · ADIA · B Capital · Bitwise · OKX Ventures · HashKey Capital · Draper Dragon · Matrixport · QCP · CMCC Global · Sky9 Capital · HTX Ventures · Cypher Capital · Morningstar Ventures · CertiK Ventures · L2 Iterative Ventures · Collider VC · Atlas Capital · Mezen Capital · Polymorphic Capital · 5c(c) Capital',
      },
    ],
    logos: { label: 'Investors at our events' },
    form: {
      eyebrow: 'Free to join',
      title: 'Join the Network as an investor',
      lede: 'Name, email and fund. Check size, stage and focus are optional.',
      button: 'Join for free',
      fields: [
        { key: 'name', label: 'Name', kind: 'text', required: true, placeholder: 'Jane Cohen', max: 120 },
        { key: 'email', label: 'Work email', kind: 'email', required: true, placeholder: 'jane@fund.com', max: 200 },
        { key: 'organisation', label: 'Fund name', kind: 'text', required: true, placeholder: 'Fund name', max: 200 },
        { key: 'role', label: 'Your role', kind: 'text', placeholder: 'Partner, Principal, Investor', max: 120 },
        { key: 'website', label: 'Website', kind: 'url', placeholder: 'fund.com' },
        { key: 'fund_type', label: 'Fund type', kind: 'select', options: opts(['VC', 'Corporate VC', 'Family office', 'Angel syndicate', 'Crypto fund', 'Other']) },
        {
          key: 'check_size', label: 'Check size', kind: 'select',
          options: [
            { value: 'under_250k', label: 'Under $250K' },
            { value: '250k_1m', label: '$250K to $1M' },
            { value: '1m_5m', label: '$1M to $5M' },
            { value: '5m_plus', label: '$5M+' },
          ],
        },
        { key: 'stage_focus', label: 'Stage focus', kind: 'multi', options: ['Pre-seed', 'Seed', 'Series A', 'Series B+'] },
        { key: 'categories', label: 'Categories you invest in', kind: 'multi', options: CATEGORIES },
        { key: 'regions', label: 'Regions', kind: 'multi', options: ['Asia', 'Middle East', 'Europe', 'North America', 'LatAm'] },
        { key: 'linkedin', label: 'LinkedIn', kind: 'url', placeholder: 'linkedin.com/in/...' },
      ],
      successTitle: 'Welcome to the Network.',
      successBody:
        'We have your details. The team reviews every application within 5 working days; once approved, your membership starts with a welcome email and your first startup introductions.',
    },
  },
  {
    audience: 'company',
    slug: 'companies',
    card: { title: 'Companies', line: 'Meet the startups, banks and investors shaping agentic finance.', membership: 'Free to join' },
    eyebrow: 'Agentic Finance Network · Companies',
    title: 'Meet the startups, banks and investors shaping agentic finance.',
    lede: 'For the companies building, buying and partnering in AI for finance. Joining is free.',
    primaryCta: 'Join Our Network for Free',
    benefitsTitle: 'What we bring to companies',
    benefits: [
      { title: 'Startups, deals and news', body: 'A steady flow of new startups, deal opportunities and market news relevant to your business, including events that are not ours.' },
      { title: 'Pre-arranged meetings', body: 'Meetings with decision-makers from banks, funds and startups, set up before each summit.' },
      { title: 'Stage time', body: 'Speaking slots at our summits, plus X Spaces and webinars.' },
      { title: 'Private dinners', body: 'Invitations to the private founders and investors dinners.' },
      { title: 'Free summit passes', body: 'Passes for your team at Agentic Finance summits.' },
      { title: 'Visibility', body: 'Your announcements in our news and the newsletter, and a place in the Network directory.' },
      { title: 'Perks at other events', body: '20% to 50% off other major AI and finance conferences.' },
      { title: 'Daily news and weekly newsletter', body: 'Market news, with your announcements featured.' },
    ],
    whoIsIn: [
      {
        label: 'Companies that have partnered with or spoken at our summits',
        names: 'eToro (Title Partner, Singapore) · Fireblocks · Alpaca · Limitless · Agoric · Vulsight · Atlas Capital · AEON · n.exchange · Sumsub · Kalshi · LibertAI · AWS · Nethermind · Liquid',
      },
    ],
    logos: { label: 'Companies at our events' },
    form: {
      eyebrow: 'Free to join',
      title: 'Join the Network as a company',
      lede: 'Name, email and company. Everything else is optional.',
      button: 'Join for free',
      fields: [
        ...person('Company', 'Company', 'Head of Partnerships, CMO'),
        {
          key: 'category', label: 'Category', kind: 'select',
          options: opts(['Payments', 'Banking', 'Exchange or brokerage', 'Custody and infrastructure', 'Security and compliance', 'Cloud and AI', 'Data', 'Prediction markets', 'Other']),
        },
        { key: 'cities', label: 'Cities of interest', kind: 'multi', options: CITIES },
        { key: 'goals', label: 'Main goal', kind: 'multi', options: ['Meet buyers and partners', 'Meet investors', 'Find startups', 'Brand visibility', 'Recruit'] },
        { key: 'timing', label: 'Timing', kind: 'select', options: opts(['This quarter', 'Next quarter', 'Exploring']) },
        { key: 'notes', label: 'Anything else we should know', kind: 'textarea', max: 2000 },
      ],
      successTitle: 'Welcome to the Network.',
      successBody: 'We have your details. The team will be in touch within 2 working days with your first introductions and the next summit invitation.',
    },
  },
  {
    audience: 'institution',
    slug: 'institutions',
    card: { title: 'Institutions', line: 'Banks, exchanges and payment networks: a seat at the table with the builders.', membership: 'Free to join' },
    eyebrow: 'Agentic Finance Network · Institutions',
    title: 'A seat at the table with the people building what comes next.',
    lede: 'For banks, exchanges, payment networks, asset managers and market infrastructure that want early access to agentic finance. Joining is free.',
    primaryCta: 'Join Our Network for Free',
    benefitsTitle: 'How we support financial institutions',
    benefits: [
      { title: 'Free invitations to our events', body: 'Free passes to every Agentic Finance summit and side event, for you and your team. Long-term partners get a standing invitation for the whole series.' },
      { title: 'Startup access', body: 'Curated introductions to vetted startups in payments, trading, compliance, data and agent infrastructure, matched to your priorities.' },
      { title: 'Peer network', body: 'Closed-door conversations with other banks, exchanges and payment networks, away from the vendor floor.' },
      { title: 'Founders and Funders dinners', body: 'Invitations to private dinners where startups, VCs and institutions meet.' },
      { title: 'Deals and opportunities', body: 'Early notice of new startups, deals, pilots and partnerships in the Network.' },
      { title: 'Market intelligence', body: 'Daily news, the weekly newsletter, quarterly reports and the AF100 index.' },
      { title: 'Stage and thought leadership', body: 'Speaking slots on summit stages, X Spaces and webinars for your leaders.' },
      { title: 'Event perks', body: '20% to 50% off other major AI and finance conferences, and VIP invitations to events beyond ours.' },
    ],
    whoIsIn: [
      { label: 'Institutions and market infrastructure from our summits', names: 'LSEG · eToro · Alpaca · Liquid · Kalshi · n.exchange · Fireblocks · Sumsub · Parfin · Bank Frick' },
    ],
    logos: { label: 'Institutions and market infrastructure at our events' },
    form: {
      eyebrow: 'Free to join',
      title: 'Join the Network as an institution',
      lede: 'Name, email and institution. Everything else is optional.',
      button: 'Join for free',
      fields: [
        ...person('Institution', 'Institution', 'Head of Innovation, Digital Assets', 'jane@bank.com', false),
        {
          key: 'institution_type', label: 'Institution type', kind: 'select',
          options: opts(['Bank', 'Exchange', 'Payment network', 'Asset manager', 'Broker', 'Custodian', 'Market infrastructure', 'Regulator-affiliated', 'Other']),
        },
        { key: 'region', label: 'Region', kind: 'select', options: opts(REGIONS) },
        { key: 'team', label: 'Your team', kind: 'select', options: opts(['Innovation', 'Digital assets', 'Payments', 'Technology', 'Strategy', 'Compliance', 'Other']) },
        { key: 'interests', label: 'Main interest', kind: 'multi', options: ['Meet startups', 'Peer network', 'Pilots and partnerships', 'Speaking', 'Market intelligence'] },
        { key: 'cities', label: 'Cities of interest', kind: 'multi', options: CITIES },
        { key: 'long_term_partnership', label: 'Interested in a long-term partnership', kind: 'yesno' },
      ],
      successTitle: 'Welcome to the Network.',
      successBody: 'We have your details. The team reviews institutional members personally and replies within 3 working days.',
    },
  },
  {
    audience: 'ecosystem',
    slug: 'ecosystem',
    card: { title: 'Ecosystem', line: 'Associations, governments, accelerators and media: grow your reach with ours.', membership: 'Free to join' },
    eyebrow: 'Agentic Finance Network · Ecosystem',
    title: 'Grow your reach with ours.',
    lede: 'For associations, governments, accelerators, labs, alliances and media: your community in front of the Network, and tickets and visibility for your members. Joining is free.',
    primaryCta: 'Join Our Network for Free',
    benefitsTitle: 'How we support ecosystem organisations',
    benefitsLede: 'In return we ask for one thing: your logo and a post or newsletter mention to your community.',
    benefits: [
      { title: 'Logo and visibility', body: 'Your logo on the Network page, on summit pages and in our news and newsletter.' },
      { title: 'Tickets for your members', body: 'Free summit passes to give to your members, delegation or portfolio.' },
      { title: 'Delegations', body: 'Host a delegation at our summits and dinners in any of our cities.' },
      { title: 'Access to the Network', body: 'Introductions to the startups, VCs, companies and banks in the Network.' },
      { title: 'Content and media', body: 'Co-created X Spaces, webinars and articles. Media partners get the daily news feed and priority interviews.' },
      { title: 'Startup pipeline', body: 'Accelerators and labs showcase their cohorts to VCs and corporates, and can enter them in the Startup Competition.' },
      { title: 'Hybrid presence', body: 'Physical presence at summits and a digital presence all year, through the Live section.' },
      { title: 'Event perks', body: '20% to 50% off other major AI and finance conferences for your team.' },
    ],
    whoIsIn: [
      { label: 'Associations', names: 'Blockchain Association Singapore · Singapore FinTech Association · Dubai Tech Tuesdays · Emirates Family Office Association' },
      { label: 'Accelerators, labs and alliances', names: 'Hub71 · Collider · Alliance · Blockchain Center' },
      // Governments and regulators: listed once each confirms (Tal's build notes). Not shown until then.
      { label: 'Media', names: 'CNBC Asia · StrataMedia · Cointelegraph · i24NEWS · Calcalist · Globes · Geektime · Ynet · TheMarker · Blockmedia' },
      { label: 'Event organisers', names: 'Proof of Talk · Abu Dhabi Finance Week · GISEC Global · Blockchain Life' },
    ],
    logos: { label: 'Public sector and media at our events' },
    form: {
      eyebrow: 'Free to join',
      title: 'Join the Network as an ecosystem organisation',
      lede: 'Name, email and organisation. Everything else is optional.',
      button: 'Join for free',
      fields: [
        ...person('Organisation', 'Organisation', 'Director, Head of Community'),
        {
          key: 'org_type', label: 'Organisation type', kind: 'select',
          options: opts(['Association', 'Government or regulator', 'Accelerator or lab', 'Alliance', 'Media', 'Event organiser', 'University', 'Other']),
        },
        { key: 'region', label: 'Region', kind: 'select', options: opts(REGIONS) },
        { key: 'community_size', label: 'Community size', kind: 'select', options: opts(['under 1,000', '1,000 to 10,000', '10,000+']) },
        { key: 'wants', label: 'What you want', kind: 'multi', options: ['Tickets for members', 'Host a delegation', 'Co-create content', 'Showcase startups', 'Media access', 'Other'] },
        { key: 'can_share', label: 'Can you share the Network with your community', kind: 'yesno' },
      ],
      successTitle: 'Welcome to the Network.',
      successBody: 'We have your details, and reply within 3 working days with the next steps.',
    },
  },
];

export const getNetworkPage = (slug: string) => networkPages.find((p) => p.slug === slug);

/** /network/ (Page 1 of Tal's copy). */
export const networkOverview = {
  eyebrow: 'Agentic Finance Network',
  title: 'The Agentic Finance Network',
  lede: 'Startups, VCs, companies, institutions and ecosystem organisations, connected at our events and all year online. Free to join.',
  proof: [
    '650+ attendees and 60+ speakers at Agentic Finance Singapore (Oct 2026)',
    'Up to 400 curated attendees at Agentic Finance Hong Kong (Feb 2027)',
    'Summits and Founders and Funders dinners worldwide in 2027',
  ],
  benefits: [
    { title: 'Connections', body: 'Real face-to-face introductions at our summits, side events and private dinners. Online through X Spaces, webinars and member intros.' },
    { title: 'Daily news', body: 'One or two articles every day: the best of what is happening in agentic finance, AI and fintech.' },
    { title: 'Weekly newsletter', body: 'One email a week with the news, the deals, the events and the people to know.' },
    { title: 'Free summit passes', body: 'Every member gets free passes to Agentic Finance summits. Number of passes depends on the member type.' },
    { title: 'Event perks', body: '20% to 50% off tickets at other major AI and finance conferences around the world.' },
    { title: 'VIP invitations', body: 'Startups and VCs are invited to the Founders and Funders dinners that close each summit.' },
  ],
  whoIsIn:
    'eToro · Alpaca · Fireblocks · LSEG · KPMG Singapore · CNBC Asia · AWS · Nethermind · Liquid · Monarq · Limitless · Agoric · Vulsight · Kalshi · Sumsub · n.exchange · AEON · Atlas Capital · Blockchain Association Singapore',
  steps: [
    'Choose your audience and fill the short form.',
    'We review every application. The Network is curated, so quality stays high.',
    'You get your welcome email, your first intros, and the next summit invite within a week.',
  ],
};

/** VC page: what arrives after joining. The paid Venture Partner tier is kept here but not shown (Tal, 26 Nov 2026). */
export const vcAfterJoin = [
  { title: 'Welcome email', body: 'Your membership confirmed and your listing in the Network directory.' },
  { title: 'First startup introductions', body: 'Vetted founders matched to your categories and stage, in your first week.' },
  { title: 'Dinner invitation', body: 'Your seat at the next Founders and Funders Dinner, after the next Agentic Finance summit.' },
  { title: 'Free summit passes', body: 'Passes for you and your portfolio founders to the next Agentic Finance summit.' },
  { title: 'Daily news and weekly newsletter', body: 'One or two articles a day and a weekly round-up of deals, people and events.' },
  { title: 'Event discount codes', body: '20% to 50% off other major AI and finance conferences.' },
];

export const venturePartner = {
  eyebrow: 'Venture Partner · by request',
  title: 'Want more than membership?',
  body: 'Venture Partner is our paid partnership for funds that want to be seen across the series. We become your event arm: 4 regions, 4 times a year, in AI finance.',
  points: [
    'Your branding across the 2027 summit series',
    'A partner speaker slot, next to the headline speakers',
    'Your own side event in one of our cities',
    'Seat at the host table at the dinners',
    'Featured directory listing and priority deal flow',
    'More summit passes for your team and portfolio',
  ],
  button: 'Request the Venture Partner brief',
  note: 'Pricing is shared with the brief.',
};

/** Startups page: the Startup Competition (Tal's copy). */
export const startupCompetition = {
  title: 'The Startup Competition',
  intro: 'Thousands of startups apply. The Network narrows them down in three steps:',
  steps: [
    { title: 'Apply', body: 'free, one short form.' },
    { title: 'Vetting', body: 'companies and VCs in the Network review each application.' },
    { title: 'Showcase', body: 'the shortlisted startups pitch live at an Agentic Finance summit, in front of the investors and partners who can write the cheque or sign the pilot.' },
  ],
  tracks: 'Competition tracks follow our summit categories: Trading, Portfolio Management, Compliance, Payments and Infrastructure, Data and Research, Prediction Markets.',
};

/** Companies page: the two partner seats (Tal's copy). Pricing sits behind the deck request. */
export const partnerSeats = {
  title: 'Two partner seats',
  columns: ['Founding Partner', 'Strategic Partner'],
  rows: [
    ['Events covered', '4 summits', '4 summits'],
    ['Pre-arranged meetings', 'More', 'Standard'],
    ['Branded meeting room', 'Yes', 'No'],
    ['Stage time', 'Yes', 'Yes, at all 4'],
    ['One event of your choice to go big', 'Yes', 'No'],
    ['Private founders and investors dinners', 'Yes', 'Yes'],
    ['Branding, PR and content', 'Full', 'Standard'],
    ['Seats', 'Limited', 'Limited'],
  ],
  note: 'Pricing is shared in the deck.',
  caseStudies: [
    { label: 'eToro', href: '/partners/etoro' },
    { label: 'Fireblocks', href: '/partners/fireblocks' },
    { label: 'Alpaca', href: '/partners/alpaca' },
    { label: 'Limitless', href: '/partners/limitless' },
  ],
};
