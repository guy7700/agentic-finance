/**
 * Shared content model for the Agentic Finance global site.
 *
 * Every edition, speaker, session, partner and media item is described here as
 * structured data. Adding a new city or year means adding records, not pages.
 */

export type EditionStatus = 'upcoming' | 'completed' | 'planned';

export type ImageAsset = {
  src: string;
  alt: string;
  /** Optional CSS object-position, e.g. "50% 30%". */
  position?: string;
  /** Verified caption shown in galleries and lightboxes. */
  caption?: string;
  width?: number;
  height?: number;
};

export type Metric = { value: string; label: string };

export type EditionExperience = {
  id: string;
  name: string;
  /** Date line exactly as published. Never inferred. */
  when: string;
  summary: string;
  points: string[];
  href?: string;
  cta?: string;
};

export type Edition = {
  slug: string;
  name: string;
  shortName: string;
  city: string;
  country: string;
  year: number;
  status: EditionStatus;
  /** Human date line. Only confirmed details are allowed here. */
  dateLabel: string;
  /** ISO date, only when publicly confirmed. Used for structured data. */
  startDate?: string;
  endDate?: string;
  venue?: { name: string; address?: string; note?: string };
  /** Context such as "TOKEN2049 Week". */
  context?: string;
  tagline: string;
  summary: string;
  positioning?: string;
  image: ImageAsset;
  heroVideo?: { src: string; poster: string };
  metrics?: Metric[];
  facts?: Metric[];
  experiences?: EditionExperience[];
  /** Whether a speaker lineup has been announced for this edition. */
  speakersAnnounced?: boolean;
  hasAgenda?: boolean;
  hasGala?: boolean;
  /** Primary conversion for this edition. */
  invitationUrl?: string;
  /** Partner positions available, when published. */
  partnerPositions?: number;
  guestCount?: number;
};

export type SpeakerLinks = {
  x?: string;
  linkedin?: string;
  website?: string;
  instagram?: string;
};

export type Speaker = {
  slug: string;
  name: string;
  title: string;
  organization: string;
  photo: string;
  photoAlt: string;
  logo?: string;
  orgNote?: string;
  links: SpeakerLinks;
  bio?: string;
  expertise: string[];
  /** Agentic Finance editions this speaker appeared at. */
  editions: string[];
  /** Other More & More stages, for speakers not tied to a listed edition. */
  conferences?: string[];
  /** False when no profile page exists in the source material. */
  hasProfile?: boolean;
};

export type SessionStage = 'af' | 'odds';

export type Session = {
  id: string;
  edition: string;
  stage: SessionStage;
  start: string;
  end: string;
  format: string;
  title: string;
  summary: string;
  note?: string;
  linkTo?: string;
  moderator?: string;
  topics: string[];
  speakers: string[];
};

export type Topic = {
  slug: string;
  number: string;
  name: string;
  /** Partnership category this topic maps to. */
  category: string;
  summary: string;
  questions: string[];
};

export type StrategicQuestion = {
  number: string;
  question: string;
  stakes: string;
  whoDecides: string;
  topics: string[];
  /** Singapore session that addressed this question, when one did. */
  session?: string;
};

export type PartnershipCategory = {
  id: string;
  name: string;
  covers: string;
  companies: string[];
  conversations: string[];
  /** Verified Singapore 2026 example, as published on the Abu Dhabi site. */
  inSingapore: string;
  sessions: string[];
};

export type Deliverable = { label: string; photo?: ImageAsset };

export type UseCase = {
  slug: string;
  partner: string;
  logo: string;
  lockup?: string;
  edition: string;
  positioning: string;
  summary: string;
  categories: string[];
  people: { speaker: string; role: string }[];
  sessions: string[];
  deliverables: Deliverable[];
  photos: ImageAsset[];
  url: string;
};

export type OrgRelationship = 'title-partner' | 'partner' | 'on-stage' | 'media' | 'public-sector';

export type Organization = {
  id: string;
  name: string;
  logo?: string;
  url?: string;
  /** Logo needs a light surface to remain legible. */
  invertLogo?: boolean;
};

export type EditionOrganization = {
  org: string;
  edition: string;
  relationship: OrgRelationship;
  note?: string;
};

export type Video = {
  id: string;
  title: string;
  description: string;
  edition: string;
  kind: 'recap' | 'highlights' | 'aftermovie' | 'session';
  src: string;
  poster: string;
  duration: string;
  hasAudio: boolean;
  speakers?: string[];
  sessions?: string[];
  /** Hosted on More & More's own site rather than bundled with this one. */
  external?: boolean;
};

export type GalleryImage = ImageAsset & {
  id: string;
  edition: string;
  tags: string[];
  width: number;
  height: number;
};

export type FaqItem = { q: string; a: string; links?: { label: string; href: string }[] };

export type FaqGroup = { id: string; title: string; items: FaqItem[] };
