import type { GalleryImage, PressMention, Video } from './types';

/**
 * Photo collections, grouped by event. Captions are the descriptions published
 * alongside each photo on the live sites; nothing here is staged or stock.
 */
export const galleryCollections = [
  { id: 'singapore-2026', label: 'Agentic Finance · Singapore 2026', short: 'Singapore 2026', series: 'agentic-finance' },
  { id: 'the-odds-paris-2026', label: 'The Odds · Paris Blockchain Week 2026', short: 'The Odds · Paris', series: 'more-and-more' },
  { id: 'web2toweb3-abu-dhabi-2025', label: 'Web2 to Web3 Summit · Abu Dhabi 2025', short: 'Web2 to Web3 · Abu Dhabi', series: 'more-and-more' },
] as const;

const SG = 'singapore-2026';
const sg = (id: string, caption: string, tags: string[], position?: string): GalleryImage => ({
  id: `sg-${id}`,
  edition: SG,
  src: `/images/singapore-2026/${id}.webp`,
  alt: caption,
  caption,
  tags,
  position,
  width: id === 'agentic-capital-panel' ? 2000 : 1600,
  height: id === 'agentic-capital-panel' ? 1333 : 1067,
});

export const gallery: GalleryImage[] = [
  sg('opening-keynote', 'Tal Mor of More & More opening the day on the Singapore stage', ['stage'], '62% 35%'),
  sg('agentic-banking-panel', 'The Agentic Banking panel on stage in Singapore, its title on the screen behind', ['stage'], '30% 50%'),
  sg('agentic-capital-panel', 'The five-strong Agentic Capital panel on the Singapore stage', ['stage'], '50% 46%'),
  sg('agentic-payments-panel', 'The Agentic Payments panel on stage in Singapore', ['stage']),
  sg('agentic-trading-panel', 'The Agentic Trading panel on stage in Singapore', ['stage']),
  sg('cj-hetherington-stage', 'CJ Hetherington of Limitless speaking on the Agentic Trading panel in Singapore', ['stage'], '55% 35%'),
  sg('the-odds-welcome', 'The host opening The Odds stage in Singapore', ['stage'], '50% 30%'),
  sg('networking-floor', 'Delegates in conversation on the networking floor in Singapore', ['networking'], '45% 40%'),
  sg('curated-introductions', 'Delegates being introduced on the floor in Singapore', ['networking'], '50% 40%'),
  sg('media-on-site', 'A camera on speakers greeting on the Singapore stage', ['media'], '45% 50%'),
  sg('interview-capture', 'A speaker filmed at the Agentic Finance backdrop in Singapore', ['media'], '40% 40%'),
  sg('agentic-finance-backdrop', 'The Agentic Finance backdrop in Singapore, with eToro, Aave, Chainlink and the other partner marks', ['partners']),
  sg('sponsor-wall', 'Guests at the Agentic Finance partner wall in Singapore', ['partners'], '50% 40%'),
  sg('etoro-team', 'The eToro team at its branded area at Agentic Finance Singapore', ['partners'], '45% 40%'),
  sg('etoro-booth', 'Visitors at eToro’s stand at Agentic Finance Singapore', ['partners'], '40% 45%'),
  sg('etoro-branded-area', 'eToro’s branded table and giveaways at Agentic Finance Singapore', ['partners'], '35% 55%'),
  sg('etoro-f1-simulator', 'A guest racing on eToro’s F1 simulator in Singapore', ['partners'], '45% 55%'),
  sg('f1-simulator', 'eToro’s F1 simulator at Agentic Finance Singapore', ['partners'], '60% 45%'),
  sg('etoro-networking', 'Guests meeting beside eToro’s stand in Singapore', ['networking', 'partners'], '50% 35%'),
  {
    id: 'odds-stage',
    edition: 'the-odds-paris-2026',
    src: '/images/more-and-more/the-odds-stage.webp',
    alt: 'A speaker addressing a standing-room crowd on a More & More stage',
    caption: 'A speaker addressing a standing-room crowd on a More & More stage',
    tags: ['stage'],
    position: '40% 50%',
    width: 1600,
    height: 1066,
  },
  {
    id: 'odds-panel',
    edition: 'the-odds-paris-2026',
    src: '/images/more-and-more/the-odds-panel.webp',
    alt: 'A six-person panel on a branded More & More stage',
    caption: 'A six-person panel on a branded More & More stage',
    tags: ['stage'],
    width: 1600,
    height: 1066,
  },
  {
    id: 'odds-room',
    edition: 'the-odds-paris-2026',
    src: '/images/more-and-more/the-odds-room.webp',
    alt: 'A packed room facing a panel on a More & More stage',
    caption: 'A packed room facing a panel on a More & More stage',
    tags: ['stage'],
    width: 1600,
    height: 1066,
  },
  {
    id: 'odds-etoro-stage',
    edition: 'the-odds-paris-2026',
    src: '/images/more-and-more/the-odds-paris-etoro-stage.webp',
    alt: 'Two speakers in conversation on stage in front of eToro x Zengo branding',
    caption: 'Two speakers in conversation on stage in front of eToro x Zengo branding',
    tags: ['stage', 'partners'],
    position: '38% 30%',
    width: 2000,
    height: 1333,
  },
  {
    id: 'odds-branding',
    edition: 'the-odds-paris-2026',
    src: '/images/more-and-more/the-odds-branding.webp',
    alt: 'Branded event balloons above the exhibition floor',
    caption: 'Branded event balloons above the exhibition floor',
    tags: ['partners'],
    width: 1600,
    height: 1066,
  },
  {
    id: 'odds-activation',
    edition: 'the-odds-paris-2026',
    src: '/images/more-and-more/the-odds-paris-activation.jpg',
    alt: 'A branded activation moving through the exhibition floor',
    caption: 'A branded activation moving through the exhibition floor',
    tags: ['partners'],
    position: '35% 50%',
    width: 1600,
    height: 1066,
  },
  {
    id: 'w2w3-session',
    edition: 'web2toweb3-abu-dhabi-2025',
    src: '/images/more-and-more/web2toweb3-session.webp',
    alt: 'A seated session at the Web2 to Web3 Summit in Abu Dhabi, produced by More & More',
    caption: 'A seated session at the Web2 to Web3 Summit in Abu Dhabi, produced by More & More',
    tags: ['stage'],
    width: 1600,
    height: 1070,
  },
  {
    id: 'w2w3-networking',
    edition: 'web2toweb3-abu-dhabi-2025',
    src: '/images/more-and-more/hub71-networking.jpg',
    alt: 'Delegates networking at a More & More gathering at Hub71 in Abu Dhabi',
    caption: 'Delegates networking at a More & More gathering at Hub71 in Abu Dhabi',
    tags: ['networking'],
    width: 1600,
    height: 1070,
  },
];

export const galleryTags = [
  { id: 'stage', label: 'On stage' },
  { id: 'networking', label: 'Networking' },
  { id: 'partners', label: 'Partner activations' },
  { id: 'media', label: 'Media' },
] as const;

/** Video types, as labelled in the library filters. A "session" is a stage recording. */
/** Labels for videos from events that are not Agentic Finance editions. */
export const otherEventLabels: Record<string, string> = {
  'the-odds-paris-2026': 'The Odds · Paris 2026',
  'web2-to-web3-2025': 'Web2 to Web3 · Abu Dhabi 2025',
};

export const videoKindLabels: Record<Video['kind'], string> = {
  recap: 'Recap',
  highlights: 'Highlights',
  aftermovie: 'Aftermovie',
  session: 'Stage recording',
  keynote: 'Keynote',
  panel: 'Panel discussion',
};

export const videos: Video[] = [
  {
    id: 'singapore-2026-recap',
    title: 'Agentic Finance Singapore 2026: the recap',
    description:
      'Two minutes forty on the first edition: speakers on the backdrop, the panels, eToro’s Yoni Assia, the floor, and what comes next in Abu Dhabi.',
    edition: 'singapore-2026',
    kind: 'recap',
    src: '/video/singapore-2026-recap.mp4',
    poster: '/images/singapore-2026/recap-poster.jpg',
    duration: '2:41',
    hasAudio: true,
    speakers: ['tal-mor', 'yoni-assia'],
  },
  {
    id: 'singapore-2026-highlights',
    title: 'Singapore 2026 in twenty seconds',
    description: 'A silent highlight loop from the day: the main stage, the room, the floor and the partner pavilion.',
    edition: 'singapore-2026',
    kind: 'highlights',
    src: '/video/singapore-2026-summit.mp4',
    poster: '/images/singapore-2026/summit-poster.jpg',
    duration: '0:21',
    hasAudio: false,
  },
  {
    id: 'web2-to-web3-2025',
    title: 'Web2 to Web3 Conference: Official Recap (UAE)',
    description: 'The Web2 to Web3 Summit in Abu Dhabi, 2025. On More & More’s YouTube channel.',
    edition: 'web2-to-web3-2025',
    kind: 'recap',
    src: 'https://www.youtube.com/watch?v=K7Bu0Pml6-8',
    youtubeId: 'K7Bu0Pml6-8',
    poster: '/images/more-and-more/web2toweb3-session.webp',
    duration: '0:56',
    hasAudio: true,
  },
  {
    id: 'the-odds-paris-2026',
    title: 'The Odds: Prediction Markets Live (2026, Paris, The Louvre)',
    description: 'The Odds at Paris Blockchain Week, April 2026. On More & More’s YouTube channel.',
    edition: 'the-odds-paris-2026',
    kind: 'aftermovie',
    src: 'https://www.youtube.com/watch?v=O8voyGJqDLE',
    youtubeId: 'O8voyGJqDLE',
    poster: '/images/more-and-more/the-odds-paris-room.jpg',
    duration: '1:39',
    hasAudio: true,
  },
  {
    id: 'the-odds-singapore-2026-aftermovie',
    title: 'The Odds: Prediction Markets Live, Singapore aftermovie',
    description:
      'The co-located prediction-markets stage that ran alongside Agentic Finance at Suntec City on 8 October 2026. Hosted on the More & More site.',
    edition: 'singapore-2026',
    kind: 'aftermovie',
    src: 'https://mnm.live/theodds/t2049singapore/aftermovie.mp4',
    poster: '/images/singapore-2026/the-odds-welcome.webp',
    duration: '1:26',
    hasAudio: false,
    external: true,
  },
];

/**
 * "Agentic Finance in the Press", newest first. Add only published pieces with
 * their original link, the outlet's own headline and the date as published.
 * More & More's own releases on a paid wire (Chainwire) are kind "release" and
 * show as "Press release", never as coverage; `pickups` lists the other sites
 * that republished each one, every link opened and checked before adding.
 * Partners and media partners on
 * stage (e.g. CNBC in Singapore) are not press coverage.
 */
export const pressMentions: PressMention[] = [
  {
    id: 'chainwire-2026-10-06-agentic-finance-singapore',
    kind: 'release',
    outlet: 'Chainwire',
    headline: 'More & More to Host Agentic Finance Summit With etoro, Pantera Capital + Chainlink, During TOKEN2049 Singapore',
    date: '2026-10-06',
    url: 'https://chainwire.org/2026/10/06/more-more-to-host-agentic-finance-summit-with-etoro-pantera-capital-chainlink-during-token2049-singapore/',
    edition: 'singapore-2026',
    image: { src: '/images/singapore-2026/opening-keynote.webp', alt: 'Tal Mor of More & More opening the day on the Singapore stage', position: '62% 35%' },
    pickups: [
      { outlet: 'TradingView', url: 'https://www.tradingview.com/news/chainwire:db77e20f7094b:0-more-more-to-host-agentic-finance-summit-with-etoro-pantera-capital-chainlink-during-token2049-singapore/', date: '2026-10-06' },
      { outlet: 'TheStreet', url: 'https://www.thestreet.com/crypto/press-releases/more-more-to-host-agentic-finance-summit-with-etoro-pantera-capital-chainlink-during-token2049-singapore', date: '2026-10-06' },
      { outlet: 'Benzinga', url: 'https://www.benzinga.com/content/62182860/more-more-host-agentic-finance-summit-etoro-pantera-capital-chainlink-during-token2049-singapore', date: '2026-10-06' },
      { outlet: 'Unchained', url: 'https://unchainedcrypto.com/press-release/more-more-to-host-agentic-finance-summit-with-etoro-pantera-capital-chainlink-during-token2049-singapore/', date: '2026-10-06' },
      { outlet: 'altFINS', url: 'https://altfins.com/crypto-news/article/more-more-to-host-agentic-finance-summit-with-etoro-pantera-capital-chainlink-during-token2049-singapore', date: '2026-10-06' },
      { outlet: 'BitcoinWorld', headline: 'More & More to Host Agentic Finance Summit With etoro, Pantera Capital and Chainlink, During TOKEN2049 Singapore', url: 'https://bitcoinworld.co.in/more-more-to-host-agentic-finance-summit-with-etoro-pantera-capital-and-chainlink-during-token2049-singapore/', date: '2026-10-05' },
      { outlet: 'CoinStats', headline: 'More & More to Host Agentic Finance Summit With etoro, Pantera Capital and Chainlink, During TOKEN2049 Singapore', url: 'https://coinstats.app/news/0c611587bf0e416c1161e177f091a606e85e31b238ecadf983c0ee3a7a42b3de_More--More-to-Host-Agentic-Finance-Summit-With-etoro-Pantera-Capital-and-Chainlink-During-TOKEN2049-Singapore', date: '2026-10-05' },
      { outlet: 'Crypto Events', url: 'https://cryptoevents.global/more-more-to-host-agentic-finance-summit-with-etoro-pantera-capital-chainlink-during-token2049-singapore/', date: '2026-10-06' },
    ],
  },
  {
    id: 'chainwire-2026-04-27-the-odds-debut',
    kind: 'release',
    outlet: 'Chainwire',
    headline: 'The Odds Conference Marks Strong Debut at Paris Blockchain Week',
    date: '2026-04-27',
    url: 'https://chainwire.org/2026/04/27/the-odds-conference-marks-strong-debut-at-paris-blockchain-week/',
    edition: 'the-odds-paris-2026',
    image: { src: '/images/more-and-more/the-odds-room.webp', alt: 'A packed room facing a panel on a More & More stage' },
    pickups: [
      { outlet: 'TradingView', url: 'https://www.tradingview.com/news/chainwire:bd544989b094b:0-the-odds-conference-marks-strong-debut-at-paris-blockchain-week/', date: '2026-04-27' },
      { outlet: 'Binance Square', headline: 'The Odds Conference Marks Strong Debut At Paris Blockchain Week (27 Apr)', url: 'https://www.binance.com/en/square/post/317004111055538', date: '2026-04-27' },
      { outlet: 'CoinMarketCap', headline: 'The Odds Conference Marks Strong Debut at Paris Blockchain Week (27 Apr)', url: 'https://coinmarketcap.com/community/articles/69ef37295e465c29a10ddf78/', date: '2026-04-27' },
      { outlet: 'Business Insider', url: 'https://markets.businessinsider.com/news/currencies/the-odds-conference-marks-strong-debut-at-paris-blockchain-week-1036065791', date: '2026-04-27' },
      { outlet: 'TheStreet', url: 'https://www.thestreet.com/crypto/press-releases/the-odds-conference-marks-strong-debut-at-paris-blockchain-week', date: '2026-04-27' },
      { outlet: 'Benzinga', url: 'https://www.benzinga.com/pressreleases/26/04/52056185/the-odds-conference-marks-strong-debut-at-paris-blockchain-week', date: '2026-04-27' },
      { outlet: 'Crypto Events', url: 'https://cryptoevents.global/the-odds-conference-marks-strong-debut-at-paris-blockchain-week/', date: '2026-04-27' },
    ],
  },
  {
    id: 'chainwire-2026-04-13-the-odds-launch',
    kind: 'release',
    outlet: 'Chainwire',
    headline: 'The Odds Conference Launches at Paris Blockchain Week',
    date: '2026-04-13',
    url: 'https://chainwire.org/2026/04/13/the-odds-conference-launches-at-paris-blockchain-week/',
    edition: 'the-odds-paris-2026',
    image: { src: '/images/more-and-more/the-odds-panel.webp', alt: 'A six-person panel on a branded More & More stage' },
    pickups: [
      { outlet: 'TradingView', url: 'https://www.tradingview.com/news/chainwire:511b8fcee094b:0-the-odds-conference-launches-at-paris-blockchain-week/', date: '2026-04-13' },
      { outlet: 'Benzinga', url: 'https://www.benzinga.com/pressreleases/26/04/51773457/the-odds-conference-launches-at-paris-blockchain-week', date: '2026-04-13' },
      { outlet: 'The Defiant', url: 'https://thedefiant.io/news/press-releases/the-odds-conference-launches-at-paris-blockchain-week', date: '2026-04-13' },
      { outlet: 'Crypto Events', url: 'https://cryptoevents.global/the-odds-conference-launches-at-paris-blockchain-week/', date: '2026-04-13' },
    ],
  },
  {
    id: 'chainwire-2026-01-05-web2-to-web3-concludes',
    kind: 'release',
    outlet: 'Chainwire',
    headline: 'Web2 to Web3 Conference Successfully Concludes in Abu Dhabi, Showcasing Institutional Railways to Blockchain Adoption Across MENA',
    date: '2026-01-05',
    url: 'https://chainwire.org/2026/01/05/web2-to-web3-conference-successfully-concludes-in-abu-dhabi-showcasing-institutional-railways-to-blockchain-adoption-across-mena/',
    edition: 'web2toweb3-abu-dhabi-2025',
    image: { src: '/images/more-and-more/web2toweb3-session.webp', alt: 'A seated session at the Web2 to Web3 Summit in Abu Dhabi, produced by More & More' },
    pickups: [
      { outlet: 'Benzinga', url: 'https://www.benzinga.com/pressreleases/26/01/49685381/web2-to-web3-conference-successfully-concludes-in-abu-dhabi-showcasing-institutional-railways-to-bl', date: '2026-01-05' },
      { outlet: 'Crypto Events', url: 'https://cryptoevents.global/web2-to-web3-conference-successfully-concludes-in-abu-dhabi-showcasing-institutional-railways-to-blockchain-adoption-across-mena/', date: '2026-01-05' },
    ],
  },
  {
    id: 'chainwire-2025-12-01-web2-to-web3-launch',
    kind: 'release',
    outlet: 'Chainwire',
    headline: 'Web2 to Web3 Conference Launches in Abu Dhabi to Unite Global Finance and Digital Asset Leaders',
    date: '2025-12-01',
    url: 'https://chainwire.org/2025/12/01/web2-to-web3-conference-launches-in-abu-dhabi-to-unite-global-finance-and-digital-asset-leaders/',
    edition: 'web2toweb3-abu-dhabi-2025',
    image: { src: '/images/more-and-more/hub71-networking.jpg', alt: 'Delegates networking at a More & More gathering at Hub71 in Abu Dhabi' },
    pickups: [
      { outlet: 'GuruFocus', url: 'https://www.gurufocus.com/news/3227871/web2-to-web3-conference-launches-in-abu-dhabi-to-unite-global-finance-and-digital-asset-leaders', date: '2025-12-01' },
    ],
  },
];
