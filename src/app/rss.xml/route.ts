import { site } from '@/config/site';
import { getPosts, postTime } from '@/lib/daily';
import { absoluteUrl } from '@/lib/paths';

// A static export needs this to write /rss.xml at build time.
export const dynamic = 'force-static';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function GET() {
  const posts = getPosts();
  const items = posts
    .map((p) => {
      const url = absoluteUrl(`/blog/${p.slug}`);
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(postTime(p)).toUTCString()}</pubDate>
      <description>${esc(`${p.summary} Why it matters: ${p.whyItMatters} Source: ${p.sourceName}, ${p.sourceUrl}`)}</description>
${p.tags.map((t) => `      <category>${esc(t)}</category>`).join('\n')}
    </item>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)}: today in agentic finance</title>
    <link>${absoluteUrl('/blog')}</link>
    <atom:link href="${absoluteUrl('/rss.xml')}" rel="self" type="application/rss+xml" />
    <description>One story a day on AI agents in finance, with our summary and a link to the source.</description>
    <language>en-gb</language>
${posts.length ? `    <lastBuildDate>${new Date(postTime(posts[0])).toUTCString()}</lastBuildDate>\n` : ''}${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
