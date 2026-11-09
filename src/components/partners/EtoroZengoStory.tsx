import { TextLink } from '../ui/Button';
import { Img } from '../ui/Img';

/**
 * The lead use case. What is on file: eToro and Zengo both spoke at the Web2 to
 * Web3 Summit (Abu Dhabi, 2025); The Odds in Paris (April 2026) carried eToro x
 * Zengo stage branding; eToro acquired Zengo in April 2026 (Ouriel Ohayon's
 * speaker bio on the Abu Dhabi site); eToro was Singapore's title partner.
 * Not on file, so not claimed (removed 9 Nov 2026): that they met on our stage,
 * and that the acquisition was announced at The Odds. Add back only once Tal confirms.
 */
export function EtoroZengoStory() {
  const steps = [
    { when: 'Abu Dhabi · 2025', what: 'eToro and Zengo both speak at the Web2 to Web3 Summit.' },
    { when: 'Paris · April 2026', what: 'eToro x Zengo stage branding at The Odds, Paris Blockchain Week. eToro acquires Zengo that month.' },
    { when: 'Singapore · October 2026', what: 'eToro is title partner: “Agentic Finance by eToro”.' },
  ];
  return (
    <article className="grid overflow-hidden rounded-2xl border border-gold/40 bg-ink-raised lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div className="relative min-h-[260px] lg:min-h-full">
        <Img
          src="/images/more-and-more/the-odds-paris-etoro-stage.webp"
          alt="Two speakers on stage at The Odds in Paris, in front of eToro x Zengo branding"
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          position="38% 30%"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <span className="relative h-7 w-24">
            <Img src="/images/logos/etoro.png" alt="eToro" fill sizes="96px" className="object-contain object-left" />
          </span>
          <span className="relative h-7 w-24">
            <Img src="/images/logos/zengo.png" alt="Zengo" fill sizes="96px" className="object-contain object-left" />
          </span>
        </div>
        <h3 className="mt-6 text-2xl font-semibold leading-snug sm:text-[28px]">eToro and Zengo across our events</h3>
        <ol className="mt-6 flex flex-col border-t border-line">
          {steps.map((s) => (
            <li key={s.when} className="grid gap-1 border-b border-line py-3 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-4">
              <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-gold">{s.when}</span>
              <span className="text-[15px] text-paper/90">{s.what}</span>
            </li>
          ))}
        </ol>
        <div className="mt-auto pt-6">
          <TextLink href="/partners/use-cases/etoro">Read the eToro use case</TextLink>
        </div>
      </div>
    </article>
  );
}
