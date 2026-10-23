import Link from 'next/link';
import { cn } from '@/lib/cn';
import { Img } from '../ui/Img';

export type SpeakerCardData = {
  slug: string;
  name: string;
  title: string;
  organization: string;
  photo: string;
  photoAlt: string;
  tags: string[];
  tagline?: string;
  hasProfile: boolean;
};

/** Portrait card used in every speaker grid, rail and directory. */
export function SpeakerCard({ speaker, className, priority, sizes }: { speaker: SpeakerCardData; className?: string; priority?: boolean; sizes?: string }) {
  const body = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-line bg-ink-raised transition-colors duration-500 group-hover:border-gold/70">
        <Img
          src={speaker.photo}
          alt={speaker.photoAlt}
          fill
          preload={priority}
          sizes={sizes ?? '(min-width: 1280px) 18vw, (min-width: 768px) 28vw, 46vw'}
          position="50% 18%"
          className="object-cover grayscale-[0.55] transition-[transform,filter] duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03] group-hover:grayscale-0"
        />
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 to-transparent" />
        {speaker.tags.length ? (
          <span className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
            {speaker.tags.map((t) => (
              <span key={t} className="rounded-full border border-paper/20 bg-ink/70 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-paper/90 backdrop-blur-sm">
                {t}
              </span>
            ))}
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex flex-col gap-1">
        <h3 className="text-[17px] font-bold leading-tight transition-colors group-hover:text-gold">{speaker.name}</h3>
        <p className="text-[13.5px] leading-snug text-muted">{speaker.title}</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-gold">{speaker.organization}</p>
        {speaker.tagline ? <p className="mt-1 text-[12.5px] leading-snug text-subtle">{speaker.tagline}</p> : null}
      </div>
    </>
  );

  if (!speaker.hasProfile) {
    return <article className={cn('group', className)}>{body}</article>;
  }
  return (
    <article className={cn('group relative', className)}>
      <Link href={`/speakers/${speaker.slug}`} className="block rounded-xl focus-visible:outline-offset-4">
        {body}
        <span className="sr-only">Read {speaker.name}’s profile</span>
      </Link>
    </article>
  );
}
