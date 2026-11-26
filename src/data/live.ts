/**
 * Live programming (Tal's review, 26 Nov 2026). The two January 2027 X Spaces are provisional
 * dates picked for the site only: they are not scheduled or published on X. Past episodes and
 * webinars are listed only once they have happened; none are invented.
 */
export type LiveItem = {
  id: string;
  title: string;
  /** "Thursday 14 January 2027" */
  date: string;
  day: string;
  month: string;
  time: string;
  summary: string;
  status: 'upcoming' | 'past';
  provisional?: boolean;
  /** Recording or listing, once it exists. */
  href?: string;
};

export const liveSchedule: { spaces: LiveItem[]; webinars: LiveItem[] } = {
  spaces: [
    {
      id: 'spaces-2027-01-14',
      title: 'Agentic finance in 2027: what changes this year',
      date: 'Thursday 14 January 2027',
      day: '14',
      month: 'Jan',
      time: '15:00 UTC · on X',
      summary: 'The year ahead for AI agents in payments, trading and banking: where they are live, where regulators stand, and what institutions are testing.',
      status: 'upcoming',
      provisional: true,
    },
    {
      id: 'spaces-2027-01-28',
      title: 'Road to Hong Kong: agents, liability and the banks',
      date: 'Thursday 28 January 2027',
      day: '28',
      month: 'Jan',
      time: '15:00 UTC · on X',
      summary: 'Who is accountable when an agent moves money? A conversation ahead of Agentic Finance Hong Kong and Consensus Hong Kong.',
      status: 'upcoming',
      provisional: true,
    },
  ],
  webinars: [],
};

/** Where to follow the live programme. */
export const liveChannels = {
  x: 'https://x.com/moreandmorebd',
};
