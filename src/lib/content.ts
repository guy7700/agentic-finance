import { conferenceLabels, editions, getEdition } from '@/data/editions';
import { singaporeSessions } from '@/data/sessions';
import { speakers } from '@/data/speakers';
import type { Session, Speaker } from '@/data/types';

/** All sessions across every edition. New editions append their agenda here. */
export const sessions: Session[] = [...singaporeSessions];

export const stageLabels: Record<Session['stage'], { name: string; detail: string }> = {
  af: { name: 'Agentic Finance', detail: 'Main stage' },
  odds: { name: 'The Odds', detail: 'Prediction markets stage' },
};

export function getSpeaker(slug: string): Speaker | undefined {
  return speakers.find((s) => s.slug === slug);
}

export function getSession(id: string): Session | undefined {
  return sessions.find((s) => s.id === id);
}

export function speakersForEdition(edition: string): Speaker[] {
  return speakers.filter((s) => s.editions.includes(edition));
}

/** Speakers with a published profile page. */
export function profiledSpeakers(): Speaker[] {
  return speakers.filter((s) => s.hasProfile !== false && Boolean(s.bio));
}

export function sessionsForSpeaker(slug: string): Session[] {
  return sessions.filter((s) => s.speakers.includes(slug));
}

export function sessionsForEdition(edition: string): Session[] {
  return sessions.filter((s) => s.edition === edition);
}

/** Content sessions, excluding doors, breaks and networking blocks. */
export function isContentSession(s: Session): boolean {
  return s.speakers.length > 0;
}

/**
 * Programme sessions: keynotes, panels and one-on-ones. Excludes opening and
 * closing remarks, which is how the published "17 sessions" figure is counted.
 */
export function isProgrammeSession(s: Session): boolean {
  return isContentSession(s) && !['Opening remarks', 'Close'].includes(s.format);
}

/** Ordered list of appearance labels for a speaker, e.g. ["Singapore 2026"]. */
export function speakerAppearances(s: Speaker): { label: string; city?: string; href?: string }[] {
  const fromEditions = s.editions.map((slug) => {
    const e = getEdition(slug);
    return { label: e?.shortName ?? slug, city: e?.city, href: e ? `/editions/${e.slug}` : undefined };
  });
  const fromConferences = (s.conferences ?? []).map((c) => ({ label: conferenceLabels[c]?.label ?? c, city: conferenceLabels[c]?.city }));
  return [...fromEditions, ...fromConferences];
}

/** First content session for a speaker, used as a card tagline. */
export function primarySessionLabel(s: Speaker): string | undefined {
  const own = sessionsForSpeaker(s.slug).filter(isContentSession);
  const first = own.find((x) => x.format.toLowerCase().includes('keynote')) ?? own[0];
  if (!first) return undefined;
  const short = first.title.split(':')[0];
  return `${first.format} · ${short}`;
}

export function formatTimeRange(s: Session): string {
  return `${s.start}–${s.end}`;
}

export { editions, speakers };
