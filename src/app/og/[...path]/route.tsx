import { getOgCard, ogCards, ogImageSegments, pathFromOgSegments } from '@/lib/og/cards';
import { renderOgCard } from '@/lib/og/render';

// Each page's share card, written at build time as /og/<page path>.jpg (see src/lib/og/cards.ts).
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return [...ogCards().keys()].map((p) => ({ path: ogImageSegments(p) }));
}

export async function GET(_request: Request, { params }: RouteContext<'/og/[...path]'>) {
  const { path } = await params;
  const card = getOgCard(pathFromOgSegments(path));
  if (!card) return new Response('Not found', { status: 404 });
  const jpeg = await renderOgCard(card);
  return new Response(new Uint8Array(jpeg), { headers: { 'Content-Type': 'image/jpeg' } });
}
