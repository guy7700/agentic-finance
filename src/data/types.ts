/**
 * Shared content model for the Agentic Finance global site.
 *
 * Every edition, speaker, session, partner and media item is described here as
 * structured data. Adding a new city or year means adding records, not pages.
 */

/** 'cancelled' (Abu Dhabi 2026): kept as a record, never listed, its pages forward elsewhere. */
export type EditionStatus = 'upcoming' | 'completed' | 'planned' | 'cancelled';

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
  /**
   * Where the event lives, for good (Tal's site structure, 23 Nov 2026): "/events/<year>/<city>".
   * A 2027 city points at its /events/2027 page; one without its own page points at its
   * section of /events/2027.
   */
  path: string;
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
  /** A hand-written recap page at <path>/recap (Singapore 2026). */
  hasRecapPage?: boolean;
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

/** A use-case photo. `edition` is a gallery collection id, for a photo from another event than the use case's own. */
export type UseCasePhoto = ImageAsset & { edition?: string };

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
  photos: UseCasePhoto[];
  url: string;
  /** For a use case outside the Agentic Finance editions (e.g. The Odds). */
  event?: { name: string; label: string };
};

/**
 * How an organisation took part in an event. "attended" means the company only sent
 * a team: it is named in a "Teams attending from" line, never shown on a logo wall.
 */
export type OrgRelationship = 'title-partner' | 'partner' | 'on-stage' | 'media' | 'public-sector' | 'attended';

/** The five Agentic Finance Network groups (/network/<group>). */
export type NetworkGroup = 'startup' | 'vc' | 'company' | 'institution' | 'ecosystem';

export type Organization = {
  id: string;
  name: string;
  logo?: string;
  url?: string;
  /** Logo needs a light surface to remain legible. */
  invertLogo?: boolean;
  /** Kind of organisation, for the /partners/ filter and the Network pages. Not a membership claim. */
  group?: NetworkGroup;
  /** Confirmed member of the Agentic Finance Network: shows "Agentic Finance Network Member". Unset until confirmed. */
  networkMember?: boolean;
  /** Company page introduction, only from verified sources: what it does, its products, who it serves, who it wants to meet. */
  about?: string;
  offers?: string[];
  audiences?: string[];
  lookingFor?: string[];
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
  /** "session" is a stage recording; keynotes and panels can be tagged on their own. */
  kind: 'recap' | 'highlights' | 'aftermovie' | 'session' | 'keynote' | 'panel';
  src: string;
  poster: string;
  duration: string;
  /**
   * When the film was first published, for Google's video results (required there). YouTube films:
   * their YouTube publish date. Films hosted here or on mnm.live: the day they went up on this site.
   */
  uploadDate: string;
  hasAudio: boolean;
  speakers?: string[];
  sessions?: string[];
  /** Hosted on More & More's own site rather than bundled with this one. */
  external?: boolean;
  /**
   * YouTube video ID, for films published on YouTube. The library then embeds
   * the YouTube player (after a click) instead of playing `src`; set `src` to
   * the YouTube watch URL and `external` to true.
   */
  youtubeId?: string;
};

/**
 * Coverage of Agentic Finance by a third-party outlet. Only real, published
 * pieces with a working link; an outlet logo only with the outlet's permission.
 */
export type PressMention = {
  id: string;
  /** "mention" for an article that covers us; "recap" for an outlet's write-up of an edition; "release" for our own press release on a paid wire (e.g. Chainwire). */
  kind: 'mention' | 'recap' | 'release';
  outlet: string;
  /** Outlet logo under /images/press/, only when we may use it. */
  logo?: string;
  /** The outlet's own headline, as published. */
  headline: string;
  /** Publication date, YYYY-MM-DD, as published. */
  date: string;
  /** The original article. */
  url: string;
  /** Edition the piece covers, when it covers one: a gallery collection id (e.g. "the-odds-paris-2026"). */
  edition?: string;
  /** A photo from that event, from our own gallery. */
  image?: ImageAsset;
  /** One or two sentences on what the release says, using only facts stated in it. Shown on every outlet's tile. */
  summary?: string;
  /**
   * For a release: the sites that republished it, each opened and checked. Date YYYY-MM-DD as
   * published there; `headline` only when that site's headline differs from ours.
   */
  pickups?: { outlet: string; url: string; date: string; headline?: string }[];
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
