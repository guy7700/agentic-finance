import type { StrategicQuestion, Topic } from './types';

/**
 * The 15 programme areas published on the Abu Dhabi site, in published order,
 * each mapped to the partnership category it belongs to.
 */
export const topics: Topic[] = [
  {
    slug: 'agentic-trading',
    number: '01',
    name: 'Agentic Trading',
    category: 'agentic-trading',
    summary:
      'Software that reads markets, decides and executes. The question is no longer whether agents trade, but on whose behalf, under which limits and against whom.',
    questions: [
      'How do brokers and venues tell an agent’s order from a customer’s?',
      'Who sets risk limits for an agent, and who monitors them in real time?',
      'What happens to market structure when bots are the counterparty?',
    ],
  },
  {
    slug: 'agentic-payments',
    number: '02',
    name: 'Agentic Payments',
    category: 'agentic-payments',
    summary:
      'Agents that pay, get paid and settle without a human approving each transaction. The rails, permissions and dispute processes were not built for this.',
    questions: [
      'Which rails do agents actually use: cards, bank transfers or stablecoins?',
      'How is spending authority delegated and capped?',
      'Who absorbs a disputed payment an agent made?',
    ],
  },
  {
    slug: 'agentic-commerce',
    number: '03',
    name: 'Agentic Commerce',
    category: 'agentic-commerce',
    summary:
      'An agent that searches, negotiates and buys for its owner changes checkout, merchant acquisition and loyalty for every retailer and marketplace.',
    questions: [
      'What does a checkout look like when the buyer is software?',
      'How do merchants verify an agent is acting with genuine authority?',
      'Who owns the customer relationship once an agent sits in the middle?',
    ],
  },
  {
    slug: 'ai-agents-managing-capital',
    number: '04',
    name: 'AI Agents Managing Capital',
    category: 'capital-asset-management',
    summary:
      'Allocators handing parts of the investment process to agents: research, rebalancing, execution, and eventually the decision itself.',
    questions: [
      'Which mandates can be delegated to an agent today, and which never should be?',
      'How do fiduciary duty and suitability apply to an autonomous allocator?',
      'What oversight do LPs and boards expect before capital moves?',
    ],
  },
  {
    slug: 'prediction-markets',
    number: '05',
    name: 'Prediction Markets',
    category: 'prediction-markets',
    summary:
      'Markets that price outcomes, increasingly traded by agents and increasingly watched by regulators. Liquidity, resolution and legal status are all in motion.',
    questions: [
      'Where does real liquidity come from, and who provides it?',
      'Who decides what is true when a market resolves?',
      'How are regulators classifying event contracts across jurisdictions?',
    ],
  },
  {
    slug: 'institutional-digital-assets',
    number: '06',
    name: 'Institutional Digital Assets',
    category: 'tokenization-digital-assets',
    summary:
      'Banks, custodians and asset managers moving from pilots to production in digital assets, now with agents in the operating model.',
    questions: [
      'What custody and control standards will institutions accept for agent-held assets?',
      'How do digital-asset desks integrate agents into existing risk frameworks?',
      'Which use cases have moved past the pilot stage?',
    ],
  },
  {
    slug: 'wallets-for-autonomous-agents',
    number: '07',
    name: 'Wallets for Autonomous Agents',
    category: 'wallets-identity',
    summary:
      'When the account holder is software, the wallet becomes policy: keys, spending rules, recovery and audit trails designed for a non-human owner.',
    questions: [
      'Who holds the keys when the customer is an agent?',
      'How are spending policies enforced at the wallet layer?',
      'What does recovery look like when an agent is compromised?',
    ],
  },
  {
    slug: 'identity-permissions-authentication',
    number: '08',
    name: 'Identity, Permissions & Authentication',
    category: 'wallets-identity',
    summary:
      'Every agent action needs an answer to three questions: who is this, who sent it, and what is it allowed to do.',
    questions: [
      'How does an institution know which human or entity stands behind an agent?',
      'How are permissions scoped, delegated and revoked?',
      'What standards are emerging for agent identity across platforms?',
    ],
  },
  {
    slug: 'security-for-agentic-finance',
    number: '09',
    name: 'Security for Agentic Finance',
    category: 'security',
    summary:
      'Agents sign transactions on their own, at speed. Fraud, prompt manipulation and compromised permissions become balance-sheet risks.',
    questions: [
      'How do you secure a transaction no human reviewed?',
      'What new attack surfaces do agents open in financial systems?',
      'Where should circuit breakers sit, and who can pull them?',
    ],
  },
  {
    slug: 'ai-regulation-governance',
    number: '10',
    name: 'AI Regulation & Governance',
    category: 'compliance',
    summary:
      'Supervisors are writing the rules for autonomous systems while firms deploy them. Governance frameworks decide what can launch, and where.',
    questions: [
      'How are regulators approaching autonomous decision-making in finance?',
      'What governance does a board need before approving an agent in production?',
      'How do firms operate across diverging regional rulebooks?',
    ],
  },
  {
    slug: 'compliance-in-autonomous-finance',
    number: '11',
    name: 'Compliance in Autonomous Finance',
    category: 'compliance',
    summary:
      'AML, KYC and transaction monitoring for flows that agents initiate. Compliance has to work at machine speed without losing accountability.',
    questions: [
      'How does KYC extend to agents acting for verified customers?',
      'Can transaction monitoring keep pace with autonomous flows?',
      'Who is accountable when an agent breaches a compliance rule?',
    ],
  },
  {
    slug: 'stablecoins-programmable-money',
    number: '12',
    name: 'Stablecoins & Programmable Money',
    category: 'agentic-payments',
    summary:
      'Money that software can hold, program and settle in. Stablecoins and tokenised deposits are becoming the native currency of agents.',
    questions: [
      'What kind of money will autonomous agents hold and settle in?',
      'How do banks respond to programmable money outside the banking system?',
      'What reserve, redemption and oversight standards will institutions accept?',
    ],
  },
  {
    slug: 'data-oracles-financial-intelligence',
    number: '13',
    name: 'Data, Oracles & Financial Intelligence',
    category: 'data-oracles',
    summary:
      'An agent is only as good as the data it trusts before it acts. Market data, oracles and verification are now part of the risk stack.',
    questions: [
      'Which data sources can an agent rely on before moving capital?',
      'How are oracle failures and manipulated inputs contained?',
      'Who is liable for a decision made on bad data?',
    ],
  },
  {
    slug: 'gpus-cloud-ai-infrastructure',
    number: '14',
    name: 'GPUs, Cloud & AI Infrastructure for Finance',
    category: 'ai-infrastructure',
    summary:
      'What an autonomous financial agent actually runs on in production: compute, models, latency and the controls regulated firms require.',
    questions: [
      'What infrastructure does a regulated firm need to run agents in production?',
      'How do latency, cost and model choice shape what agents can do?',
      'Where do data residency and model governance requirements bite?',
    ],
  },
  {
    slug: 'tokenization-onchain-capital-markets',
    number: '15',
    name: 'Tokenization & Onchain Capital Markets',
    category: 'tokenization-digital-assets',
    summary:
      'Real-world assets, funds and securities moving onchain, where agents can trade, settle and rebalance them around the clock.',
    questions: [
      'Which asset classes are moving onchain first, and why?',
      'How do settlement and liquidity change when markets never close?',
      'What role will agents play in tokenised fund operations?',
    ],
  },
];

/** The six strategic questions published on the Abu Dhabi site. */
export const strategicQuestions: StrategicQuestion[] = [
  {
    number: '01',
    question: 'Who controls the agent?',
    stakes:
      'Control decides liability, supervision and trust. An agent acting for a customer, a firm and a platform at once answers to all three, or to none.',
    whoDecides: 'Boards, risk officers, regulators',
    topics: ['identity-permissions-authentication', 'ai-regulation-governance', 'security-for-agentic-finance'],
    session: 'af-1900',
  },
  {
    number: '02',
    question: 'What happens when agents trade with other agents?',
    stakes:
      'Price discovery, liquidity and market stability were designed around human participants. Machine-to-machine markets test every one of those assumptions.',
    whoDecides: 'Exchanges, brokers, market makers',
    topics: ['agentic-trading', 'prediction-markets'],
    session: 'af-1700',
  },
  {
    number: '03',
    question: 'Can an AI manage institutional capital?',
    stakes:
      'The answer determines how mandates are written, how fiduciary duty is discharged and how much of the investment process can be delegated.',
    whoDecides: 'Allocators, asset managers, LPs',
    topics: ['ai-agents-managing-capital', 'institutional-digital-assets'],
    session: 'af-1830',
  },
  {
    number: '04',
    question: 'What becomes the wallet when the customer is software?',
    stakes:
      'Custody, key management and spending policy move from a user interface to infrastructure. Whoever defines the agent wallet defines the account.',
    whoDecides: 'Custodians, wallet providers, banks',
    topics: ['wallets-for-autonomous-agents', 'identity-permissions-authentication'],
    session: 'af-1530',
  },
  {
    number: '05',
    question: 'Who is liable when an autonomous transaction goes wrong?',
    stakes:
      'Without a clear answer, institutions cannot deploy, insurers cannot price and customers cannot trust. Liability is the gate to scale.',
    whoDecides: 'Counsel, regulators, insurers',
    topics: ['compliance-in-autonomous-finance', 'ai-regulation-governance'],
    session: 'af-1900',
  },
  {
    number: '06',
    question: 'What infrastructure will billions of financial agents require?',
    stakes:
      'Payments, identity, data and compute built for people will not carry billions of agents. The infrastructure choices made now become tomorrow’s market structure.',
    whoDecides: 'Infrastructure providers, payment networks, cloud',
    topics: ['gpus-cloud-ai-infrastructure', 'stablecoins-programmable-money', 'data-oracles-financial-intelligence'],
    session: 'af-1500',
  },
];

export type Format = {
  id: string;
  name: string;
  summary: string;
  detail: string;
  image: { src: string; alt: string; position?: string };
};

/** Formats as published on the Abu Dhabi site, illustrated with Singapore photography. */
export const formats: Format[] = [
  {
    id: 'keynotes',
    name: 'Keynotes and fireside conversations',
    summary: 'A few voices, given the time to say something worth hearing.',
    detail:
      'In Singapore, eToro’s Co-Founder and CEO Yoni Assia gave the day’s headline keynote, “When the Broker Becomes an Agent”, and the parallel stage paused so both rooms could attend.',
    image: {
      src: '/images/singapore-2026/opening-keynote.webp',
      alt: 'Tal Mor of More & More opening the day on the Singapore stage',
      position: '62% 35%',
    },
  },
  {
    id: 'discussions',
    name: 'Senior institutional discussions',
    summary: 'Founders and institutions on the decisions in front of them.',
    detail:
      'Panels are built around one decision each: banking, wallets, payments, trading, capital and the limits on autonomous agents. Standard Chartered, KPMG, Pantera Capital, Aave Labs and Chainlink Labs took the stage in Singapore.',
    image: {
      src: '/images/singapore-2026/agentic-banking-panel.webp',
      alt: 'The Agentic Banking panel on stage in Singapore, its title on the screen behind',
      position: '30% 50%',
    },
  },
  {
    id: 'introductions',
    name: 'Curated introductions',
    summary: 'Arranged in advance, around who you need to meet.',
    detail:
      'Guests tell us who they need to meet. The team arranges those introductions before the event, and structured networking blocks in the programme leave time for them.',
    image: {
      src: '/images/singapore-2026/curated-introductions.webp',
      alt: 'Delegates being introduced on the floor in Singapore',
      position: '50% 40%',
    },
  },
  {
    id: 'meetings',
    name: 'Private meetings',
    summary: 'Rooms set aside for conversations that should not happen on a floor.',
    detail:
      'Meeting rooms are reserved on site and scheduled in advance for partners and guests, for the conversations that move a deal forward.',
    image: {
      src: '/images/singapore-2026/media-on-site.webp',
      alt: 'A camera on speakers greeting on the Singapore stage',
      position: '45% 50%',
    },
  },
  {
    id: 'networking',
    name: 'Executive networking',
    summary: 'A room where everyone was chosen.',
    detail:
      'Every guest is selected, so every conversation on the floor is a relevant one. In Abu Dhabi, the VIP Gala extends this into a seated evening for approximately 200 invited leaders.',
    image: {
      src: '/images/singapore-2026/networking-floor.webp',
      alt: 'Delegates in conversation on the networking floor in Singapore',
      position: '45% 40%',
    },
  },
];

/** Audience published for Abu Dhabi, used in "Who is in the room". */
export const audience = [
  { label: 'Banks and financial institutions', detail: 'Retail, private and investment banks, and the teams deploying AI in them.' },
  { label: 'Sovereign, family-office and institutional capital', detail: 'Sovereign funds, family offices, asset managers and allocators.' },
  { label: 'Regulators and public sector', detail: 'Supervisors, policy teams, trade missions and government bodies.' },
  { label: 'Exchanges and market infrastructure', detail: 'Venues, brokers, custodians, payment networks and settlement.' },
  { label: 'Companies building agentic finance', detail: 'AI, wallet, data, security and infrastructure companies.' },
];
