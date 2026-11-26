import type { EditionOrganization, ImageAsset, Organization, PartnershipCategory, UseCase } from './types';

/**
 * Twelve thematic categories. These are conversations a partner can lead, not
 * twelve available slots: Abu Dhabi offers no more than eight positions overall.
 * "inSingapore" is reproduced from the Abu Dhabi site's category explorer.
 */
export const categories: PartnershipCategory[] = [
  {
    id: 'agentic-trading',
    name: 'Agentic Trading',
    covers: 'Brokers, exchanges, trading infrastructure, execution, APIs, market makers.',
    companies: ['Retail and institutional brokers', 'Exchanges and trading venues', 'Execution and brokerage APIs', 'Market makers'],
    conversations: [
      'Agents as counterparties and what it does to market structure',
      'Risk limits and supervision for autonomous execution',
      'Retail investing when the broker itself becomes an agent',
    ],
    inSingapore: 'eToro’s keynote, and Alpaca, Liquid, Theoriq and Limitless on the autonomous-trader panel.',
    sessions: ['af-1600', 'af-1700'],
  },
  {
    id: 'agentic-payments',
    name: 'Agentic Payments',
    covers: 'Payments, stablecoins, payment networks, PSPs, settlement infrastructure.',
    companies: ['Card and payment networks', 'PSPs and acquirers', 'Stablecoin issuers', 'Settlement infrastructure'],
    conversations: [
      'The payment stack for autonomous spending',
      'Delegated spending authority and dispute handling',
      'Stablecoins and programmable money as agent-native currency',
    ],
    inSingapore: 'Base, Fireblocks, Alchemy and AEON on how agents move money, with CNBC on stage.',
    sessions: ['af-1630', 'af-1815'],
  },
  {
    id: 'agentic-commerce',
    name: 'Agentic Commerce',
    covers: 'AI commerce, checkout, merchant infrastructure, autonomous purchasing.',
    companies: ['Checkout and commerce platforms', 'Merchant acquirers', 'Marketplaces', 'AI shopping agents'],
    conversations: [
      'Checkout when the buyer is software',
      'Verifying agent authority at the point of sale',
      'Who owns the customer when an agent sits in the middle',
    ],
    inSingapore: 'Cryptonite, RUM Group, AWS and Lava Network on an agent that searches, negotiates and pays.',
    sessions: ['af-1500'],
  },
  {
    id: 'wallets-identity',
    name: 'Wallets & Identity',
    covers: 'Wallets, embedded wallets, authentication, identity and permissions.',
    companies: ['Wallet providers', 'Embedded-wallet infrastructure', 'Identity and authentication', 'Custody'],
    conversations: [
      'Who holds the keys when the customer is an agent',
      'Scoping, delegating and revoking agent permissions',
      'Identity standards for agents across platforms',
    ],
    inSingapore: 'Aave Labs, eToro, Chainlink Labs and Blockaid on who holds the keys when the customer is an agent.',
    sessions: ['af-1530'],
  },
  {
    id: 'security',
    name: 'Security',
    covers: 'Transaction security, fraud, wallet security, agent permissions.',
    companies: ['Transaction security', 'Fraud prevention', 'Wallet and key security', 'Security research'],
    conversations: [
      'Securing transactions no human reviewed',
      'New attack surfaces agents open in financial systems',
      'Circuit breakers and who can pull them',
    ],
    inSingapore: 'Blockaid and Fireblocks on securing transactions an agent signs on its own.',
    sessions: ['af-1530', 'af-1630'],
  },
  {
    id: 'compliance',
    name: 'Compliance',
    covers: 'AML, KYC, KYT, transaction monitoring, AI governance.',
    companies: ['AML and KYT providers', 'Blockchain intelligence', 'Law firms', 'RegTech'],
    conversations: [
      'Who sets the limits for an autonomous agent',
      'KYC and monitoring for agent-initiated flows',
      'Governance boards need before approving agents',
    ],
    inSingapore: 'TRM Labs, Gornitzky, HFW and KewMann on who sets the limits for an autonomous agent.',
    sessions: ['af-1900'],
  },
  {
    id: 'capital-asset-management',
    name: 'Capital & Asset Management',
    covers: 'Funds, asset managers, allocators, wealth management.',
    companies: ['Asset managers', 'Hedge and crypto funds', 'Allocators and family offices', 'Wealth platforms'],
    conversations: [
      'Giving agents the power to decide',
      'Mandates, oversight and fiduciary duty for autonomous allocators',
      'Where institutional capital goes first',
    ],
    inSingapore:
      'Pantera Capital, Monarq, SecondLane, Atlas Capital Team and ACX Compliance on giving agents the power to decide.',
    sessions: ['af-1830'],
  },
  {
    id: 'prediction-markets',
    name: 'Prediction Markets',
    covers: 'Exchanges, infrastructure, data, distribution, liquidity.',
    companies: ['Prediction-market venues', 'Market makers', 'Resolution and oracle teams', 'Distribution partners'],
    conversations: [
      'Where prediction-market liquidity comes from',
      'Resolution: who says it is true',
      'What regulators are actually looking at',
    ],
    inSingapore: 'A full second stage, The Odds, with Limitless, Zengo, Paris Saint-Germain, RedStone and Kleros.',
    sessions: ['odds-1440', 'odds-1500', 'odds-1530', 'odds-1630', 'odds-1700'],
  },
  {
    id: 'data-oracles',
    name: 'Data & Oracles',
    covers: 'Market data, financial data, oracle infrastructure, analytics.',
    companies: ['Market-data providers', 'Oracle networks', 'Analytics', 'Data verification'],
    conversations: [
      'The data an agent has to trust before it acts',
      'Containing oracle failure and manipulated inputs',
      'Liability for decisions made on bad data',
    ],
    inSingapore: 'Chainlink Labs, RedStone, Truflation and Kleros on the data an agent has to trust before it acts.',
    sessions: ['af-1530', 'odds-1630', 'odds-1700'],
  },
  {
    id: 'ai-infrastructure',
    name: 'AI Infrastructure',
    covers: 'Models, compute, GPUs, cloud, AI infrastructure.',
    companies: ['Cloud providers', 'Model developers', 'GPU and compute', 'Agent frameworks'],
    conversations: [
      'What an autonomous financial agent runs on in production',
      'Latency, cost and model choice for regulated firms',
      'Data residency and model governance',
    ],
    inSingapore: 'AWS on what an autonomous financial agent actually runs on in production.',
    sessions: [],
  },
  {
    id: 'tokenization-digital-assets',
    name: 'Tokenization & Digital Assets',
    covers: 'RWA, custody, settlement and institutional digital assets.',
    companies: ['Tokenisation platforms', 'Custodians', 'Settlement networks', 'Institutional digital-asset desks'],
    conversations: [
      'Tokenised markets and the liquidity behind them',
      'Settlement when markets never close',
      'Agents in tokenised fund operations',
    ],
    inSingapore: 'Nethermind, Zenith and Bank Frick on tokenised markets and the liquidity behind them.',
    sessions: ['af-1430', 'odds-1630'],
  },
  {
    id: 'banking-infrastructure',
    name: 'Banking Infrastructure',
    covers: 'Banks, banking technology, settlement, treasury and financial rails.',
    companies: ['Banks', 'Core-banking technology', 'Treasury and settlement', 'Advisory firms'],
    conversations: [
      'What changes when a bank lets an agent act for a customer',
      'Sign-off, supervision and who carries the risk',
      'Bank rails for agent-initiated payments',
    ],
    inSingapore: 'KPMG, Nethermind, Agoric and the FCA’s attaché on what changes when a bank lets an agent act.',
    sessions: ['af-1430'],
  },
];

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}

/** What a strategic partner position includes, as published for Abu Dhabi. */
export const partnerBenefits = [
  { title: 'Leadership visibility', body: 'A seat on the stage that matters to your category, not a logo in a crowd.' },
  { title: 'Curated introductions', body: 'Meetings arranged before you land, with the decision-makers you name.' },
  { title: 'Private networking', body: 'The VIP Gala: an evening with speakers, partners and senior guests.' },
  { title: 'Brand positioning', body: 'Your name tied to one part of agentic finance, in front of the people deciding it.' },
];

const sg = (name: string, alt: string, position?: string): ImageAsset => ({
  src: `/images/singapore-2026/${name}.webp`,
  alt,
  position,
});

export const useCases: UseCase[] = [
  {
    slug: 'etoro',
    partner: 'eToro',
    logo: '/images/partners/etoro.png',
    lockup: '/brand/agentic-finance-by-etoro.svg',
    edition: 'singapore-2026',
    positioning: 'Title Partner · “Agentic Finance by eToro”',
    summary:
      'Title positioning across the whole summit, the day’s headline keynote from its CEO, a major discussion hosted by its Chief Blockchain Officer, and a physical presence on the floor.',
    categories: ['agentic-trading', 'wallets-identity'],
    people: [
      { speaker: 'yoni-assia', role: 'Co-Founder & CEO · Keynote' },
      { speaker: 'omri-ross', role: 'Chief Blockchain Officer · Agentic Wallets' },
    ],
    sessions: ['af-1600', 'af-1530'],
    deliverables: [
      { label: 'Title Partner positioning', photo: sg('etoro-team', 'The eToro team at its branded area at Agentic Finance Singapore', '45% 40%') },
      { label: '“Agentic Finance by eToro”' },
      { label: 'Yoni Assia keynote' },
      { label: 'Omri Ross hosting a major discussion' },
      { label: 'F1 simulator activation', photo: sg('etoro-f1-simulator', 'A guest racing on eToro’s F1 simulator in Singapore', '45% 55%') },
      { label: 'Dedicated branded area', photo: sg('etoro-branded-area', 'eToro’s branded table and giveaways at Agentic Finance Singapore', '35% 55%') },
      { label: 'Main-stage branding' },
      { label: 'Roll-ups and signage' },
      { label: 'Digital promotion' },
      { label: 'Social media' },
      { label: 'PR' },
      { label: 'Photography' },
      { label: 'Video' },
      { label: 'Executive networking', photo: sg('etoro-networking', 'Guests meeting beside eToro’s stand in Singapore', '50% 35%') },
    ],
    photos: [
      sg('etoro-team', 'The eToro team at its branded area at Agentic Finance Singapore', '45% 40%'),
      sg('etoro-f1-simulator', 'A guest racing on eToro’s F1 simulator in Singapore', '45% 55%'),
      sg('etoro-booth', 'Visitors at eToro’s stand at Agentic Finance Singapore', '40% 45%'),
      sg('etoro-branded-area', 'eToro’s branded table and giveaways at Agentic Finance Singapore', '35% 55%'),
      sg('f1-simulator', 'eToro’s F1 simulator at Agentic Finance Singapore', '60% 45%'),
      sg('etoro-networking', 'Guests meeting beside eToro’s stand in Singapore', '50% 35%'),
    ],
    url: 'https://www.etoro.com',
  },
  {
    slug: 'fireblocks',
    partner: 'Fireblocks',
    logo: '/images/partners/fireblocks.png',
    edition: 'singapore-2026',
    positioning: 'Stage, branding and presence in Agentic Payments',
    summary:
      'A seat on the payments panel next to Base, Alchemy and AEON, with brand presence and content across the day and the networking around it.',
    categories: ['agentic-payments', 'security'],
    people: [{ speaker: 'itai-turbahn', role: 'VP Embedded Wallets · Agentic Payments' }],
    sessions: ['af-1630'],
    deliverables: [
      { label: 'Stage participation', photo: sg('agentic-payments-panel', 'The Agentic Payments panel on stage in Singapore') },
      { label: 'Event branding' },
      { label: 'Content' },
      { label: 'Executive networking' },
      { label: 'Event presence' },
    ],
    photos: [
      sg('agentic-payments-panel', 'The Agentic Payments panel on stage in Singapore'),
      {
        src: '/images/more-and-more/fireblocks-ran-goldi-panel.webp',
        alt: 'Ran Goldi, SVP Payments & Network at Fireblocks, seated on the panel at the Web2 to Web3 Summit, Abu Dhabi 2025',
        edition: 'web2toweb3-abu-dhabi-2025',
        width: 1600,
        height: 900,
      },
      // fireblocks-ran-goldi-close.webp was removed: it shows Oleg Belousov under Ran's name (Tal flagged it, 26 Oct 2026).
    ],
    url: 'https://www.fireblocks.com',
  },
  {
    slug: 'alpaca',
    partner: 'Alpaca',
    logo: '/images/partners/alpaca.svg',
    edition: 'singapore-2026',
    positioning: 'Executive stage participation in Agentic Trading',
    summary:
      'Its Co-Founder and CEO on the autonomous-trader panel, brand exposure across the summit and institutional positioning.',
    categories: ['agentic-trading'],
    people: [{ speaker: 'yoshi-yokokawa', role: 'Co-Founder & CEO · Agentic Trading' }],
    sessions: ['af-1700'],
    deliverables: [
      { label: 'Executive stage participation', photo: sg('agentic-trading-panel', 'The Agentic Trading panel on stage in Singapore') },
      { label: 'Brand exposure' },
      { label: 'Institutional positioning' },
    ],
    photos: [
      sg('agentic-trading-panel', 'The Agentic Trading panel on stage in Singapore'),
      sg('sponsor-wall', 'Guests at the Agentic Finance partner wall in Singapore', '50% 40%'),
    ],
    url: 'https://alpaca.markets',
  },
  {
    slug: 'limitless',
    partner: 'Limitless',
    logo: '/images/logos/limitless.png',
    edition: 'singapore-2026',
    positioning: 'Prediction Markets positioning',
    summary:
      'Its CEO across both stages, the autonomous-trader panel and The Odds, in front of the prediction-markets audience.',
    categories: ['prediction-markets', 'agentic-trading'],
    people: [{ speaker: 'cj-hetherington', role: 'CEO · Agentic Trading & The Odds' }],
    sessions: ['af-1700', 'odds-1440', 'odds-1500'],
    deliverables: [
      { label: 'Prediction Markets positioning' },
      { label: 'Stage presence', photo: sg('cj-hetherington-stage', 'CJ Hetherington of Limitless speaking on the Agentic Trading panel in Singapore', '55% 35%') },
      { label: 'Relevant audience access' },
    ],
    photos: [
      sg('cj-hetherington-stage', 'CJ Hetherington of Limitless speaking on the Agentic Trading panel in Singapore', '55% 35%'),
      sg('the-odds-welcome', 'The host opening The Odds stage in Singapore', '50% 30%'),
    ],
    url: 'https://limitless.exchange',
  },
];

/**
 * Use cases from other More & More stages. As on mnm.live/agentic-finance-abu-dhabi;
 * the MME photos were supplied by the user on 8 November 2026.
 */
export const otherUseCases: UseCase[] = [
  {
    slug: 'mme-legal',
    partner: 'MME Legal',
    logo: '/images/partners/mme.webp',
    edition: 'the-odds-paris-2026',
    event: { name: 'The Odds at Paris Blockchain Week', label: 'The Odds · Paris 2026' },
    positioning: 'Legal, tax and compliance partner',
    summary: 'MME Legal, Tax and Compliance on stage at The Odds in Paris.',
    categories: [],
    people: [],
    sessions: [],
    deliverables: [
      {
        label: 'Stage participation',
        photo: {
          src: '/images/more-and-more/the-odds-mme-panel.webp',
          alt: 'The “Can you regulate the future?” panel at The Odds, with the MME logo on the screen behind the speakers',
        },
      },
    ],
    photos: [
      {
        src: '/images/more-and-more/the-odds-mme-panel.webp',
        alt: 'The “Can you regulate the future?” panel at The Odds, with the MME logo on the screen behind the speakers',
        width: 1649,
        height: 1080,
      },
      {
        src: '/images/more-and-more/the-odds-mme-stage.webp',
        alt: 'Guests on The Odds stage, with the MME Legal, Tax and Compliance logo on the screen behind them',
        position: '50% 30%',
        width: 1600,
        height: 1066,
      },
      {
        src: '/images/more-and-more/the-odds-mme-speaker.webp',
        alt: 'A panellist speaking into a microphone during the panel at The Odds',
        position: '70% 40%',
        width: 1612,
        height: 1090,
      },
      {
        src: '/images/more-and-more/the-odds-mme-portrait.webp',
        alt: 'A guest in a navy jacket at The Odds',
        position: '50% 30%',
        width: 510,
        height: 574,
      },
    ],
    url: 'https://www.mme.ch',
  },
];

export function getUseCase(slug: string) {
  return [...useCases, ...otherUseCases].find((u) => u.slug === slug);
}

/**
 * `about` text comes only from published sources on file (the speakers' published bios), quoted in substance.
 *
 * Logo registry. Logos are white-on-transparent files migrated from the live sites. `group` is the
 * kind of organisation (startup, VC, company, institution, ecosystem), set on 26 Nov 2026 for the
 * /partners/ filter and the Network pages; it says what the organisation is, not that it is a
 * Network member. `networkMember` stays unset until membership is confirmed.
 */
export const organizations: Organization[] = [
  { id: 'etoro', name: 'eToro', logo: '/images/partners/etoro.png', url: 'https://www.etoro.com', group: 'company', about: 'A publicly listed multi-asset investment platform serving retail and institutional investors across equities, commodities and crypto, with tokenised assets and self-custody through Zengo.' },
  { id: 'fireblocks', name: 'Fireblocks', logo: '/images/partners/fireblocks.png', url: 'https://www.fireblocks.com', group: 'company' },
  { id: 'alpaca', name: 'Alpaca', logo: '/images/partners/alpaca.svg', url: 'https://alpaca.markets', group: 'company' },
  { id: 'limitless', name: 'Limitless', logo: '/images/logos/limitless.png', url: 'https://limitless.exchange', group: 'startup' },
  { id: 'standard-chartered', name: 'Standard Chartered', logo: '/images/logos/standard-chartered.png', url: 'https://www.sc.com', group: 'institution' },
  { id: 'kpmg', name: 'KPMG', logo: '/images/logos/kpmg-global.png', url: 'https://kpmg.com/sg/en/home.html', group: 'company' },
  { id: 'pantera', name: 'Pantera Capital', logo: '/images/logos/pantera.png', url: 'https://panteracapital.com', group: 'vc' },
  { id: 'aave', name: 'Aave Labs', logo: '/images/logos/aave.svg', url: 'https://aave.com', group: 'company' },
  { id: 'chainlink', name: 'Chainlink Labs', logo: '/images/logos/chainlink.svg', url: 'https://chain.link', group: 'company' },
  { id: 'base', name: 'Base', logo: '/images/logos/base.png', url: 'https://base.org', group: 'company', about: 'The blockchain for global finance, built to drive adoption and support builders around the world.' },
  { id: 'alchemy', name: 'Alchemy', logo: '/images/logos/alchemy.svg', url: 'https://www.alchemy.com', group: 'company' },
  { id: 'cnbc', name: 'CNBC', logo: '/images/logos/cnbc.png', url: 'https://www.cnbc.com', group: 'ecosystem' },
  { id: 'crypto-com', name: 'Crypto.com', logo: '/images/logos/crypto-com.png', url: 'https://crypto.com', group: 'company' },
  { id: 'animoca', name: 'Animoca Brands', logo: '/images/logos/animoca-minds.svg', group: 'company' },
  { id: 'nethermind', name: 'Nethermind', logo: '/images/logos/nethermind.svg', url: 'https://www.nethermind.io', group: 'company' },
  { id: 'trm-labs', name: 'TRM Labs', logo: '/images/logos/trm-labs.png', url: 'https://www.trmlabs.com', group: 'company' },
  { id: 'fca', name: 'FCA / British High Commission Singapore', logo: '/images/logos/fca.png', group: 'ecosystem' },
  { id: 'bank-frick', name: 'Bank Frick', logo: '/images/logos/bank-frick.png', group: 'institution' },
  { id: 'world', name: 'World Foundation', logo: '/images/logos/world.svg', url: 'https://world.org', group: 'company' },
  { id: 'hfw', name: 'HFW', logo: '/images/logos/hfw.png', group: 'company' },
  { id: 'zengo', name: 'Zengo', logo: '/images/logos/zengo.png', url: 'https://zengo.com', group: 'company', about: 'The self-custodial wallet built on multi-party computation rather than seed phrases. Part of eToro since April 2026.' },
  { id: 'blockaid', name: 'Blockaid', logo: '/images/logos/blockaid.svg', url: 'https://www.blockaid.io', group: 'startup' },
  { id: 'redstone', name: 'RedStone', logo: '/images/logos/redstone.png', group: 'startup' },
  { id: 'liquid', name: 'Liquid', logo: '/images/logos/liquid.png', url: 'https://www.liquid.trade', group: 'startup' },
  { id: 'theoriq', name: 'Theoriq', logo: '/images/logos/theoriq.png', group: 'startup' },
  { id: 'aeon', name: 'AEON', logo: '/images/logos/aeon.png', url: 'https://aeon.xyz', group: 'startup' },
  { id: 'atlas', name: 'Atlas Capital Team', logo: '/images/logos/usaf.png', url: 'https://www.atlascap.io', group: 'vc' },
  { id: 'acx', name: 'ACX Compliance', logo: '/images/logos/acx-compliance.png', url: 'https://www.acxcompliance.com', group: 'company' },
  { id: 'secondlane', name: 'SecondLane', logo: '/images/logos/secondlane.svg', group: 'startup' },
  { id: 'rum', name: 'RUM Group', logo: '/images/logos/rum.png', url: 'https://www.rum.group', group: 'company' },
  { id: 'libertai', name: 'LibertAI', logo: '/images/logos/libertai.svg', url: 'https://libertai.io', group: 'startup' },
  { id: 'lava', name: 'Lava Network', logo: '/images/logos/lava.svg', group: 'startup' },
  { id: 'vulsight', name: 'VulSight', logo: '/images/logos/vulsight.png', url: 'https://www.vulsight.com', group: 'startup' },
  { id: 'gornitzky', name: 'Gornitzky & Co.', logo: '/images/logos/gornitzky.png', group: 'company' },
  { id: 'kewmann', name: 'KewMann', logo: '/images/logos/kewmann.png', group: 'company' },
  { id: 'kleros', name: 'Kleros', logo: '/images/logos/kleros.svg', url: 'https://kleros.io', group: 'startup' },
  { id: 'truflation', name: 'Truflation', logo: '/images/logos/truflation.svg', group: 'startup' },
  { id: 'avail', name: 'Avail', logo: '/images/logos/avail.svg', group: 'startup' },
  { id: 'zenith', name: 'Zenith', logo: '/images/logos/zenith.png', group: 'startup' },
  { id: 'bitcoin-japan', name: 'Bitcoin Japan', logo: '/images/logos/bitcoin-japan.png', group: 'company' },
  { id: 'dlt-law', name: 'DLT Law', logo: '/images/logos/dlt-law.png', url: 'https://dltlaw.io', group: 'company' },
  { id: 'xchainge', name: 'Xchainge', logo: '/images/logos/xchainge.svg', url: 'https://xchainge.io', group: 'startup' },
  { id: 'kash', name: 'Kash', logo: '/images/logos/kash.svg', url: 'https://www.kash.bot', group: 'startup' },
  { id: 'stratamedia', name: 'StrataMedia', logo: '/images/logos/stratamedia.png', group: 'ecosystem' },
  { id: 'tradeil', name: 'Israel Trade Mission Singapore', logo: '/images/logos/tradeil.png', group: 'ecosystem' },
  { id: 'mme', name: 'MME Legal | Tax | Compliance', logo: '/images/partners/mme.webp', group: 'company' },
  // Agoric: Singapore (Dean Tribble, Agentic Capital panel). n.exchange and Sumsub: The Odds.
  // Kalshi and AWS: ecosystem partners in Singapore. Logos supplied by the user (26 Nov 2026).
  // On stage at Web2 to Web3 Abu Dhabi 2025 (speakers' companies; logos from the user's sourced pack, 26 Nov 2026).
  { id: 'nominis', name: 'Nominis', logo: '/images/logos/nominis.png', url: 'https://www.nominis.io', group: 'startup' },
  { id: 'addressable', name: 'Addressable', logo: '/images/logos/addressable.png', url: 'https://www.addressable.io', group: 'startup' },
  { id: 'certik', name: 'CertiK', logo: '/images/logos/certik.png', url: 'https://www.certik.com', group: 'company' },
  { id: 'mom3ntum', name: 'Mom3ntum', logo: '/images/logos/mom3ntum.png', url: 'https://mom3ntum.io', group: 'startup' },
  { id: 'signal-week', name: 'Signal Week', logo: '/images/logos/signal-week.png', url: 'https://www.signalweek.com', group: 'ecosystem' },
  { id: 'israel-trade-mission-uae', name: 'Israel Economic and Trade Mission to the UAE', logo: '/images/logos/israel-trade-mission-uae.png', group: 'ecosystem' },
  { id: 'agoric', name: 'Agoric', logo: '/images/logos/agoric.png', group: 'startup', about: 'The team behind Ymax, for the safe deployment of capital by autonomous agents within a client’s mandate.' },
  { id: 'n-exchange', name: 'n.exchange', logo: '/images/logos/n-exchange.png', group: 'company' },
  { id: 'sumsub', name: 'Sumsub', logo: '/images/logos/sumsub.png', group: 'company' },
  { id: 'kalshi', name: 'Kalshi', logo: '/images/logos/kalshi.png', group: 'company' },
  { id: 'aws', name: 'AWS', logo: '/images/logos/aws.png', group: 'company' },
];

export function getOrganization(id: string) {
  return organizations.find((o) => o.id === id);
}

/**
 * Relationship of each organisation to an event: the one company list behind /partners/
 * and each event's partners page. Singapore partners: the four companies with published case
 * studies, and Kalshi and AWS as ecosystem partners (user, 26 Nov 2026). Everyone else was
 * represented on stage by a speaker,
 * which does not imply sponsorship. A company that only sent a team is "attended": it is
 * named in the "Teams attending from" line, never on a wall. None recorded yet.
 */
export const editionOrganizations: EditionOrganization[] = [
  { org: 'etoro', edition: 'singapore-2026', relationship: 'title-partner', note: 'Title Partner · “Agentic Finance by eToro”' },
  { org: 'fireblocks', edition: 'singapore-2026', relationship: 'partner', note: 'Agentic Payments' },
  { org: 'alpaca', edition: 'singapore-2026', relationship: 'partner', note: 'Agentic Trading' },
  { org: 'limitless', edition: 'singapore-2026', relationship: 'partner', note: 'Prediction Markets' },
  { org: 'kalshi', edition: 'singapore-2026', relationship: 'partner', note: 'Ecosystem partner' },
  { org: 'aws', edition: 'singapore-2026', relationship: 'partner', note: 'Ecosystem partner' },
  ...[
    'standard-chartered', 'kpmg', 'pantera', 'aave', 'chainlink', 'base', 'alchemy', 'animoca', 'nethermind', 'trm-labs',
    'bank-frick', 'world', 'hfw', 'zengo', 'blockaid', 'redstone', 'liquid', 'theoriq', 'aeon', 'atlas', 'acx', 'secondlane',
    'rum', 'libertai', 'lava', 'vulsight', 'gornitzky', 'kewmann', 'kleros', 'truflation', 'avail', 'zenith', 'bitcoin-japan',
    'dlt-law', 'xchainge', 'kash', 'stratamedia',
  ].map((org) => ({ org, edition: 'singapore-2026', relationship: 'on-stage' as const })),
  { org: 'cnbc', edition: 'singapore-2026', relationship: 'media' },
  { org: 'fca', edition: 'singapore-2026', relationship: 'public-sector' },
  { org: 'tradeil', edition: 'singapore-2026', relationship: 'public-sector' },
  // The Odds at Paris Blockchain Week: MME Legal's case study (/partners/mme-legal).
  { org: 'mme', edition: 'the-odds-paris-2026', relationship: 'partner', note: 'Legal, tax and compliance partner' },
  // Web2 to Web3 Abu Dhabi 2025: companies on stage.
  ...['fireblocks', 'etoro', 'zengo', 'n-exchange', 'nominis', 'addressable', 'certik', 'mom3ntum', 'signal-week', 'israel-trade-mission-uae'].map((org) => ({
    org,
    edition: 'web2toweb3-abu-dhabi-2025',
    relationship: 'on-stage' as const,
  })),
  // Agoric spoke in Singapore (Dean Tribble, Agentic Capital panel; user, 26 Nov 2026).
  { org: 'agoric', edition: 'singapore-2026', relationship: 'on-stage' },
  // On stage at The Odds (user, 26 Nov 2026).
  ...['n-exchange', 'sumsub'].map((org) => ({ org, edition: 'the-odds-paris-2026', relationship: 'on-stage' as const })),
];

/** Every organisation on an event's wall (all but teams that only attended), in record order. */
export function wallFor(event: string): Organization[] {
  return editionOrganizations
    .filter((r) => r.edition === event && r.relationship !== 'attended')
    .map((r) => getOrganization(r.org))
    .filter((o) => o !== undefined);
}

/** Companies that only sent a team to an event, for the "Teams attending from" line. */
export function teamsAttending(event: string): Organization[] {
  return editionOrganizations
    .filter((r) => r.edition === event && r.relationship === 'attended')
    .map((r) => getOrganization(r.org))
    .filter((o) => o !== undefined);
}

/** A curated set of on-stage organisations for compact homepage logo rows. */
export const featuredOnStage = [
  'standard-chartered', 'kpmg', 'pantera', 'aave', 'chainlink', 'base', 'alchemy', 'trm-labs', 'nethermind', 'crypto-com', 'animoca', 'blockaid',
];

/**
 * "Achievements of our partners" on /partners (Tal's review, 26 Nov 2026). eToro and Zengo: Yoni
 * Assia's own words in our press release of 27 April 2026 (first conversations at our Abu Dhabi event,
 * acquisition announced live at The Odds). Atlas launching the Technodollar with us and The Odds as
 * the world's first prediction markets conference: confirmed by the user, 26 Nov 2026. The
 * 50,000-listener X Space belongs on The Odds' site (Tal), so it is not here.
 */
export const partnerAchievements: {
  id: string;
  when: string;
  title: string;
  body: string;
  orgs: string[];
  href: string;
  image: ImageAsset;
}[] = [
  {
    id: 'etoro-zengo',
    when: 'Abu Dhabi 2025 → Paris 2026',
    title: 'eToro acquires Zengo',
    body: 'Their first conversations began at our Web2 to Web3 conference in Abu Dhabi. Four months later, Yoni Assia announced the acquisition live on our stage at The Odds in Paris.',
    orgs: ['etoro', 'zengo'],
    href: '/partners/etoro',
    image: { src: '/images/more-and-more/the-odds-paris-etoro-stage.webp', alt: 'Two speakers on stage at The Odds in Paris, in front of eToro x Zengo branding', position: '38% 30%' },
  },
  {
    id: 'etoro-title',
    when: 'Singapore · October 2026',
    title: 'eToro becomes title partner',
    body: '“Agentic Finance by eToro”: title positioning across the summit, the headline keynote from CEO Yoni Assia, and an F1 simulator on the floor.',
    orgs: ['etoro'],
    href: '/partners/etoro',
    image: { src: '/images/singapore-2026/etoro-f1-simulator.webp', alt: 'A guest racing on eToro’s F1 simulator in Singapore', position: '45% 55%' },
  },
  {
    id: 'atlas-technodollar',
    when: 'Singapore · October 2026',
    title: 'Atlas Capital launches the Technodollar',
    body: 'Founder and CEO Reza Bundy launched the Technodollar, a programmable reserve asset designed for AI agents, in a keynote on our Singapore stage.',
    orgs: ['atlas'],
    href: '/partners/atlas',
    image: { src: '/images/speakers/reza-bundy.webp', alt: 'Reza Bundy, Founder, Chairman and CEO of Atlas Capital Team', position: '50% 25%' },
  },
  {
    id: 'the-odds',
    when: 'Paris · April 2026',
    title: 'The world’s first prediction markets conference',
    body: 'The Odds: Prediction Markets Live brought operators, exchanges and regulators together at the Louvre during Paris Blockchain Week, with MME Legal as legal, tax and compliance partner.',
    orgs: ['mme', 'n-exchange', 'sumsub'],
    href: '/events/2026/the-odds-paris',
    image: { src: '/images/more-and-more/the-odds-paris-room.jpg', alt: 'A full room at The Odds, Paris Blockchain Week' },
  },
];
