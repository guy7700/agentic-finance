import Link from 'next/link';
import type { StrategicQuestion } from '@/data/types';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';

type QuestionView = StrategicQuestion & { sessionTitle?: string };

/**
 * The six questions as decisions, not FAQ entries. On pointer devices the
 * hovered or focused question stays lit while the others recede.
 */
export function QuestionsEditorial({ questions, variant = 'full' }: { questions: QuestionView[]; variant?: 'full' | 'compact' }) {
  return (
    <ol className="group/list border-t border-line">
      {questions.map((q) => (
        <li
          key={q.number}
          className={cn(
            'group/q relative grid gap-4 border-b border-line py-8 transition-opacity duration-500 sm:py-10',
            'lg:grid-cols-[120px_minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10',
            'lg:group-hover/list:opacity-35 lg:hover:!opacity-100 lg:group-focus-within/list:opacity-35 lg:focus-within:!opacity-100',
          )}
          tabIndex={variant === 'compact' ? 0 : undefined}
        >
          <span className="font-mono text-sm text-gold">Q{q.number}</span>
          <h3
            className={cn(
              'display-tight transition-colors duration-300 lg:group-hover/q:text-gold',
              variant === 'full' ? 'text-[clamp(1.75rem,1.2rem+2.2vw,3.25rem)]' : 'text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)]',
            )}
          >
            {q.question}
          </h3>
          <div className="flex flex-col gap-4 lg:pt-2">
            <p className="text-[15.5px] leading-relaxed text-muted">{q.stakes}</p>
            {variant === 'full' ? (
              <dl className="flex flex-col gap-3 border-t border-line pt-4 text-sm">
                <div className="flex gap-3">
                  <dt className="mono-label w-24 shrink-0 pt-0.5">Decided by</dt>
                  <dd className="text-paper/85">{q.whoDecides}</dd>
                </div>
                {q.sessionTitle ? (
                  <div className="flex gap-3">
                    <dt className="mono-label w-24 shrink-0 pt-0.5">In Singapore</dt>
                    <dd>
                      <Link
                        href={`/editions/singapore-2026/agenda#${q.session}`}
                        className="inline-flex items-start gap-1.5 text-paper/85 hover:text-gold"
                      >
                        {q.sessionTitle}
                        <Icon name="arrow-right" size={14} className="mt-1 shrink-0" />
                      </Link>
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
