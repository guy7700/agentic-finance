import { conferenceLabels, getEdition } from '@/data/editions';
import { networkPages } from '@/data/network';
import { editionOrganizations, organizations, otherUseCases, teamsAttending, useCases } from '@/data/partners';
import type { NetworkGroup } from '@/data/types';

/**
 * The /partners/ company list (Tal's site structure): every company we have worked
 * with, built from the one list in src/data/partners.ts. Tags come from the data:
 * Partner from the event records, Attended when a company is on an event's record,
 * Network member and Network group from the company itself ([TBC] until set).
 * Companies that only sent a team are left out of the grid and named per event.
 */

export type CompanyEntry = {
  id: string;
  name: string;
  logo?: string;
  url?: string;
  group?: NetworkGroup;
  networkMember?: boolean;
  partner: boolean;
  attended: boolean;
  /** Events the company took part in (not counting teams that only attended). */
  events: string[];
  /** Case study page, when there is one. */
  caseStudy?: string;
};

export type DirectoryEvent = { id: string; label: string; teams: string[] };
export type DirectoryGroup = { value: NetworkGroup; label: string; href: string };

const rank = (id: string) => {
  const rel = editionOrganizations.filter((r) => r.org === id).map((r) => r.relationship);
  return rel.includes('title-partner') ? 0 : rel.includes('partner') ? 1 : 2;
};

export function companyDirectory(): { companies: CompanyEntry[]; events: DirectoryEvent[]; groups: DirectoryGroup[] } {
  const cases = [...useCases, ...otherUseCases];
  const companies = organizations
    .map((o): CompanyEntry | null => {
      const records = editionOrganizations.filter((r) => r.org === o.id);
      const shown = records.filter((r) => r.relationship !== 'attended');
      // A company that only sent a team is named under the grid, not shown in it.
      if (records.length && !shown.length && o.networkMember !== true) return null;
      const study = cases.find((u) => u.logo === o.logo);
      return {
        id: o.id,
        name: o.name,
        logo: o.logo,
        url: o.url,
        group: o.group,
        networkMember: o.networkMember,
        partner: shown.some((r) => r.relationship === 'title-partner' || r.relationship === 'partner'),
        attended: records.length > 0,
        events: [...new Set(shown.map((r) => r.edition))],
        caseStudy: study ? `/partners/${study.slug}` : undefined,
      };
    })
    .filter((c) => c !== null)
    .sort((a, b) => rank(a.id) - rank(b.id) || a.name.localeCompare(b.name));

  const events = [...new Set(editionOrganizations.map((r) => r.edition))].map((id) => ({
    id,
    label: getEdition(id)?.shortName ?? conferenceLabels[id]?.label ?? id,
    teams: teamsAttending(id).map((o) => o.name),
  }));

  const groups = networkPages.map((p) => ({ value: p.audience, label: p.card.title, href: `/network/${p.slug}` }));

  return { companies, events, groups };
}
