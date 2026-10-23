import type { SpeakerCardData } from '@/components/speakers/SpeakerCard';
import type { Speaker } from '@/data/types';
import { primarySessionLabel, speakerAppearances } from './content';
import { speakerThumb } from './paths';

/** Serialisable, bio-free card data for client components and grids. */
export function toSpeakerCard(s: Speaker, opts: { withTagline?: boolean } = {}): SpeakerCardData {
  return {
    slug: s.slug,
    name: s.name,
    title: s.title,
    organization: s.organization,
    photo: speakerThumb(s.photo),
    photoAlt: s.photoAlt,
    tags: speakerAppearances(s).map((a) => a.label),
    tagline: opts.withTagline ? primarySessionLabel(s) : undefined,
    hasProfile: s.hasProfile !== false && Boolean(s.bio),
  };
}

export type DirectoryEntry = SpeakerCardData & {
  events: string[];
  cities: string[];
  search: string;
};

export function toDirectoryEntry(s: Speaker): DirectoryEntry {
  const appearances = speakerAppearances(s);
  const card = toSpeakerCard(s, { withTagline: true });
  return {
    ...card,
    events: appearances.map((a) => a.label),
    cities: appearances.map((a) => a.city).filter((c): c is string => Boolean(c)),
    search: [s.name, s.title, s.organization, ...s.expertise].join(' ').toLowerCase(),
  };
}
