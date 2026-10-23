// Crawl every route: verify internal links resolve and every image actually loads.
const { launch, desktop, BASE } = require('./lib');
const fs = require('fs');
const routes = fs.readFileSync(__dirname + '/routes.txt', 'utf8').split('\n').filter(Boolean).filter((r) => r !== '/does-not-exist');
(async () => {
  const b = await launch(); const ctx = await desktop(b, 1440, 900); const p = await ctx.newPage();
  const links = new Map(); const external = new Set(); const badImages = [];
  for (const r of routes) {
    await p.goto(BASE + r, { waitUntil: 'networkidle' });
    // scroll to trigger lazy images
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((res) => setTimeout(res, 120)); } });
    await p.waitForLoadState('networkidle'); await p.waitForTimeout(1500);
    const data = await p.evaluate(() => ({
      links: Array.from(document.querySelectorAll('a[href]')).map((a) => a.getAttribute('href')),
      imgs: Array.from(document.querySelectorAll('img')).filter((i) => i.offsetParent !== null || i.closest('[hidden]') === null).map((i) => ({ src: i.currentSrc || i.src, ok: i.complete && i.naturalWidth > 0, alt: i.getAttribute('alt'), loading: i.loading })),
    }));
    for (const h of data.links) {
      if (!h) continue;
      if (h.startsWith('/')) { const k = h.split('#')[0]; if (!links.has(k)) links.set(k, r); }
      else if (/^https?:/.test(h)) external.add(h);
    }
    for (const i of data.imgs) if (!i.ok) badImages.push(`${r}: ${i.src} (loading=${i.loading})`);
  }
  const bad = [];
  for (const [href, from] of links) {
    const res = await p.request.get(BASE + href, { maxRedirects: 5 });
    if (res.status() >= 400) bad.push(`${res.status()} ${href} (linked from ${from})`);
  }
  console.log(`internal links checked: ${links.size}`);
  console.log(bad.length ? 'BROKEN LINKS:\n' + bad.join('\n') : 'no broken internal links');
  console.log(badImages.length ? 'IMAGES NOT LOADED:\n' + [...new Set(badImages)].join('\n') : 'all images loaded');
  fs.writeFileSync(require('path').join(require('./lib').OUT, 'external-links.txt'), [...external].sort().join('\n'));
  console.log(`external links: ${external.size} (saved)`);
  await b.close();
})();
