/**
 * The 2027 event menu. One list feeds both the "Where will you be in 2027?"
 * questionnaire (/2027) and the calendar in the home page's "Upcoming events".
 * Add, remove or edit an event here and both update; no page code changes.
 *
 * Dates as agreed by Guy and Tal on 8 November 2026. Use `start`/`end` only for
 * exact days; anything else (a month, "early Dec", "TBC") leaves them out and
 * the event goes to the "Dates to be confirmed" strip, ordered by `month`.
 *
 * Images: city photography only, never an event's logo or branding. Landscape
 * 16:9, at least 1600px wide, stored under public/assets/events/<city-slug>.jpg.
 * An event without `image` shows a placeholder tile with its city name.
 */

export type EventRegion = 'Europe' | 'Middle East' | 'Asia' | 'Americas';

export const eventCategories = [
  'Crypto and web3',
  'Fintech and payments',
  'Derivatives, gaming and tech',
  'General tech and AI',
  'Global economy',
] as const;
export type EventCategory = (typeof eventCategories)[number];

export type Event2027 = {
  /** Used in links: /2027?event=<id>. Keep stable once shared. */
  id: string;
  name: string;
  city: string;
  region: EventRegion;
  category: EventCategory;
  /** As shown to visitors, e.g. "18-22 Jan" or "Mid Nov (TBC)". No en dashes. */
  dateLabel: string;
  /** Exact first and last day, YYYY-MM-DD. Leave out when the days are not confirmed. */
  start?: string;
  end?: string;
  /** Best known month (1-12) for ordering an event without exact days. */
  month?: number;
  image?: { src: string; alt: string };
};

export const EVENTS_YEAR = 2027;

const city = {
  dubai: { src: '/assets/events/dubai.jpg', alt: 'Downtown Dubai at dusk, the Burj Khalifa rising above the skyline' },
  hongKong: { src: '/assets/events/hong-kong.jpg', alt: 'Victoria Harbour at night, a red-sailed junk in front of the Hong Kong skyline' },
  singapore: { src: '/assets/events/singapore.jpg', alt: 'Marina Bay at night, Gardens by the Bay and Marina Bay Sands across the water' },
  abuDhabi: { src: '/assets/events/abu-dhabi.jpg', alt: 'Al Maryah Island, Abu Dhabi: the financial district towers on the waterfront' },
  paris: { src: '/assets/events/paris.jpg', alt: 'The Louvre pyramid in Paris, lit at night' },
  miami: { src: '/assets/events/miami.jpg', alt: 'The Miami waterfront skyline at sunset' },
  newYork: { src: '/assets/events/new-york.jpg', alt: 'The Manhattan skyline and the Brooklyn Bridge' },
  cannes: { src: '/assets/events/cannes.jpg', alt: 'Yachts in the harbour at Cannes, with the Mediterranean coast behind' },
  nashville: { src: '/assets/events/nashville.jpg', alt: 'Glass towers in downtown Nashville' },
  uae: { src: '/assets/events/uae.jpg', alt: 'The Dubai skyline at night, with the Burj Khalifa' },
  seoul: { src: '/assets/events/seoul.jpg', alt: 'N Seoul Tower above the lit Seoul skyline at night' },
  bangkok: { src: '/assets/events/bangkok.jpg', alt: 'The Bangkok riverfront skyline reflected in the water at night' },
  amsterdam: { src: '/assets/events/amsterdam.jpg', alt: 'An Amsterdam canal lined with trees, bicycles and Dutch houses' },
  riyadh: { src: '/assets/events/riyadh.jpg', alt: 'Kingdom Centre tower in Riyadh against an amber sky' },
  lasVegas: { src: '/assets/events/las-vegas.jpg', alt: 'Light trails along the Las Vegas Strip at night' },
  barcelona: { src: '/assets/events/barcelona.jpg', alt: 'The Sagrada Familia rising above Barcelona at sunset' },
  rome: { src: '/assets/events/rome.jpg', alt: 'The Colosseum in Rome in warm evening light' },
  washingtonDc: { src: '/assets/events/washington-dc.jpg', alt: 'The United States Capitol in Washington DC' },
  sanFrancisco: { src: '/assets/events/san-francisco.jpg', alt: 'The Golden Gate Bridge in San Francisco, lit at night' },
  lisbon: { src: '/assets/events/lisbon.jpg', alt: 'Terracotta rooftops and São Jorge Castle in Lisbon' },
  davos: { src: '/assets/events/davos.jpg', alt: 'Snowy mountains and a frozen lake at Davos' },
};

export const events2027: Event2027[] = [
  // Crypto and web3
  { id: 'consensus-hk', name: 'Consensus Hong Kong', city: 'Hong Kong', region: 'Asia', category: 'Crypto and web3', dateLabel: '1-3 Feb', start: '2027-02-01', end: '2027-02-03', image: city.hongKong },
  { id: 'token2049-dubai', name: 'TOKEN2049 Dubai', city: 'Dubai', region: 'Middle East', category: 'Crypto and web3', dateLabel: '21-22 Apr', start: '2027-04-21', end: '2027-04-22', image: city.dubai },
  { id: 'consensus-miami', name: 'Consensus Miami', city: 'Miami', region: 'Americas', category: 'Crypto and web3', dateLabel: '4-6 May', start: '2027-05-04', end: '2027-05-06', image: city.miami },
  { id: 'token2049-ny', name: 'TOKEN2049 New York (first edition)', city: 'New York', region: 'Americas', category: 'Crypto and web3', dateLabel: '16-17 Jun', start: '2027-06-16', end: '2027-06-17', image: city.newYork },
  { id: 'ethcc', name: 'EthCC', city: 'Cannes', region: 'Europe', category: 'Crypto and web3', dateLabel: 'Jun or Jul (TBC)', month: 6, image: city.cannes },
  { id: 'signal-week', name: 'Signal Week (formerly Paris Blockchain Week)', city: 'Paris', region: 'Europe', category: 'Crypto and web3', dateLabel: '6-7 Jul', start: '2027-07-06', end: '2027-07-07', image: city.paris },
  { id: 'bitcoin-2027', name: 'Bitcoin 2027', city: 'Nashville', region: 'Americas', category: 'Crypto and web3', dateLabel: '15-17 Jul', start: '2027-07-15', end: '2027-07-17', image: city.nashville },
  { id: 'token2049-sg', name: 'TOKEN2049 Singapore', city: 'Singapore', region: 'Asia', category: 'Crypto and web3', dateLabel: '6-7 Oct', start: '2027-10-06', end: '2027-10-07', image: city.singapore },
  { id: 'hk-fintech-week', name: 'Hong Kong FinTech Week', city: 'Hong Kong', region: 'Asia', category: 'Crypto and web3', dateLabel: 'First week of Nov (TBC)', month: 11, image: city.hongKong },
  { id: 'aibc-sigma-uae', name: 'AIBC Eurasia / SiGMA', city: 'UAE', region: 'Middle East', category: 'Crypto and web3', dateLabel: '1-4 Dec', start: '2027-12-01', end: '2027-12-04', image: city.uae },
  { id: 'bitcoinmena-adfw', name: 'Abu Dhabi Finance Week + Bitcoin MENA', city: 'Abu Dhabi', region: 'Middle East', category: 'Crypto and web3', dateLabel: 'Early Dec (TBC)', month: 12, image: city.abuDhabi },
  { id: 'korea-blockchain-week', name: 'Korea Blockchain Week', city: 'Seoul', region: 'Asia', category: 'Crypto and web3', dateLabel: 'Date TBC', image: city.seoul },

  // Fintech and payments
  { id: 'money2020-asia', name: 'Money20/20 Asia', city: 'Bangkok', region: 'Asia', category: 'Fintech and payments', dateLabel: '27-29 Apr', start: '2027-04-27', end: '2027-04-29', image: city.bangkok },
  { id: 'money2020-europe', name: 'Money20/20 Europe', city: 'Amsterdam', region: 'Europe', category: 'Fintech and payments', dateLabel: '8-10 Jun', start: '2027-06-08', end: '2027-06-10', image: city.amsterdam },
  { id: 'money2020-me', name: 'Money20/20 Middle East', city: 'Riyadh', region: 'Middle East', category: 'Fintech and payments', dateLabel: '14-16 Sep', start: '2027-09-14', end: '2027-09-16', image: city.riyadh },
  { id: 'sibos-sg', name: 'Sibos', city: 'Singapore', region: 'Asia', category: 'Fintech and payments', dateLabel: '20-23 Sep', start: '2027-09-20', end: '2027-09-23', image: city.singapore },
  { id: 'money2020-usa', name: 'Money20/20 USA', city: 'Las Vegas', region: 'Americas', category: 'Fintech and payments', dateLabel: '19-21 Oct', start: '2027-10-19', end: '2027-10-21', image: city.lasVegas },
  { id: 'sff', name: 'Singapore FinTech Festival', city: 'Singapore', region: 'Asia', category: 'Fintech and payments', dateLabel: 'Mid Nov (TBC)', month: 11, image: city.singapore },

  // Derivatives, gaming and tech
  { id: 'ice-barcelona', name: 'ICE Barcelona', city: 'Barcelona', region: 'Europe', category: 'Derivatives, gaming and tech', dateLabel: '18-20 Jan', start: '2027-01-18', end: '2027-01-20', image: city.barcelona },
  { id: 'sigma-world-rome', name: 'SiGMA World', city: 'Rome', region: 'Europe', category: 'Derivatives, gaming and tech', dateLabel: '2-7 May', start: '2027-05-02', end: '2027-05-07', image: city.rome },
  { id: 'fia-lc', name: 'FIA L&C Conference', city: 'Washington DC', region: 'Americas', category: 'Derivatives, gaming and tech', dateLabel: '10-12 May', start: '2027-05-10', end: '2027-05-12', image: city.washingtonDc },
  { id: 'g2e', name: 'G2E Las Vegas', city: 'Las Vegas', region: 'Americas', category: 'Derivatives, gaming and tech', dateLabel: '27-30 Sep', start: '2027-09-27', end: '2027-09-30', image: city.lasVegas },

  // General tech and AI
  { id: 'vivatech', name: 'VivaTech', city: 'Paris', region: 'Europe', category: 'General tech and AI', dateLabel: 'Jun (TBC)', month: 6, image: city.paris },
  { id: 'databricks-ai-summit', name: 'Databricks Data + AI Summit', city: 'San Francisco', region: 'Americas', category: 'General tech and AI', dateLabel: '21-24 Jun', start: '2027-06-21', end: '2027-06-24', image: city.sanFrancisco },
  { id: 'gitex-global', name: 'GITEX Global', city: 'Dubai', region: 'Middle East', category: 'General tech and AI', dateLabel: 'Oct (TBC)', month: 10, image: city.dubai },
  { id: 'web-summit', name: 'Web Summit', city: 'Lisbon', region: 'Europe', category: 'General tech and AI', dateLabel: 'Second week of Nov (TBC)', month: 11, image: city.lisbon },

  // Global economy
  { id: 'davos-wef', name: 'WEF Annual Meeting', city: 'Davos', region: 'Europe', category: 'Global economy', dateLabel: '18-22 Jan', start: '2027-01-18', end: '2027-01-22', image: city.davos },
];

/** "date, event, city", as each option is shown. */
export const eventOptionLabel = (e: Event2027) => `${e.dateLabel}, ${e.name}, ${e.city}`;

export const getEvent2027 = (id: string) => events2027.find((e) => e.id === id);

/** Cities and regions offered as quick picks, derived from the events above. */
export const eventCities = [...new Set(events2027.map((e) => e.city))].sort((a, b) => a.localeCompare(b));
export const eventRegions: EventRegion[] = ['Europe', 'Middle East', 'Asia', 'Americas'];

/** Tal's 16 BFSI segments for "Who do you want to meet?". */
export const audienceSegments = [
  'Banks',
  'Investment banks',
  'Insurance',
  'Wealth',
  'Asset managers',
  'Payments',
  'Cards',
  'Remittance',
  'Fintechs',
  'Trading firms',
  'Exchanges',
  'Custody',
  'Lending',
  'Regulators',
  'Corporate treasury',
  'Digital assets',
] as const;

export const companyTypes = ['Bank', 'Fintech', 'Crypto exchange', 'Custody or infrastructure', 'Payments', 'VC or investor', 'Media', 'Other'] as const;
export const seniorityLevels = ['C-level or Founder', 'Head or VP', 'Director or Manager', 'Other'] as const;
export const channels = ['email', 'dm', 'whatsapp', 'luma', 'social'] as const;

/** Campaign settings the team may edit. */
export const questionnaire2027 = {
  /** Tal's 30-minute booking page. */
  bookingUrl: 'https://calendar.app.google/S5s1qzpFsr4m2ZMC8',
  privacyUrl: 'https://mnm.live/privacy',
  /** Editable reward line shown on the page. */
  reward: 'Everyone who answers gets first pick of their category.',
};
