// Checks horizontal overflow on every route at a given width.
const { launch, BASE } = require('./lib');
const routes = process.argv.slice(3);
(async () => {
  const width = Number(process.argv[2] || 390);
  const b = await launch();
  const ctx = await b.newContext({ viewport: { width, height: 844 }, isMobile: width < 768, hasTouch: width < 768 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  for (const r of routes) {
    const res = await p.goto(BASE + r, { waitUntil: 'networkidle' });
    const info = await p.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const offenders = [];
      document.querySelectorAll('body *').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed') return;
        // skip children of overflow-hidden/auto containers
        let a = el.parentElement, clipped = false;
        while (a && a !== document.body) {
          const s = getComputedStyle(a);
          if (['hidden', 'auto', 'scroll', 'clip'].includes(s.overflowX)) { clipped = true; break; }
          a = a.parentElement;
        }
        if (!clipped && rect.right > vw + 1) offenders.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 60)} r=${Math.round(rect.right)}`);
      });
      return { vw, sw: document.documentElement.scrollWidth, offenders: offenders.slice(0, 6) };
    });
    console.log(`${res.status()} ${r} vw=${info.vw} scrollW=${info.sw} ${info.offenders.length ? 'OVERFLOW: ' + info.offenders.join(' | ') : 'ok'}`);
  }
  if (errors.length) console.log('ERRORS:', [...new Set(errors)].slice(0, 10).join('\n'));
  await b.close();
})();
