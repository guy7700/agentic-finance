/**
 * The Index (Tal's review, 26 Nov 2026): three initiatives, the Agentic Finance 100, the Industry
 * Map and Quarterly Reports. Lists stay empty until there is verified content: no consortium member
 * is shown without a signed agreement (JPMorgan and Standard Chartered are invitations Tal intends,
 * not members), no ranking is shown before it is published, and no third-party map is shown as ours.
 */
export const af100 = {
  /** Confirmed institutional consortium members only: { name, logo }. */
  consortium: [] as { name: string; logo?: string }[],
  /** Published results, 1 to 100, once the consortium has ranked them. */
  results: [] as { rank: number; company: string; logo?: string; area: string }[],
  method: [
    { title: 'Map the landscape', body: 'Every company building agentic finance, from agent infrastructure and wallets to payments, trading and compliance.' },
    { title: 'Long-list the candidates', body: 'Companies are put forward from the industry map, our events and nominations, across the twelve areas of agentic finance.' },
    { title: 'Ranked by institutions', body: 'A consortium of financial institutions, the buyers and partners of these companies, ranks the candidates. The companies being ranked have no vote.' },
    { title: 'Published and repeated', body: 'The top 100 is published with its method, and updated as the industry moves.' },
  ],
};

/** Reference maps by others, shown with attribution and a link, only where we may reproduce them. */
export const referenceMaps: { title: string; by: string; url: string; note?: string }[] = [];

/** Quarterly reports, once published: { title, quarter, href, summary }. */
export const quarterlyReports: { title: string; quarter: string; href: string; summary: string }[] = [];

export const indexInitiatives = [
  {
    href: '/af100/list',
    title: 'Agentic Finance 100',
    body: 'The top 100 companies in agentic finance, ranked by a consortium of financial institutions rather than by the companies themselves.',
    icon: 'chart' as const,
  },
  {
    href: '/af100/map',
    title: 'Industry Map',
    body: 'The agentic finance landscape: who builds what, across twelve areas. In 2027 we build our own map with our consortium.',
    icon: 'globe' as const,
  },
  {
    href: '/af100/reports',
    title: 'Quarterly Reports',
    body: 'Every quarter, the state of agentic finance: what went live, what was funded, and what the institutions are deciding.',
    icon: 'database' as const,
  },
];
