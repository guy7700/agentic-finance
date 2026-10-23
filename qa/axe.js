const { launch, desktop, mobile, BASE } = require('./lib');
const fs = require('fs');
const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const routes = fs.readFileSync(__dirname + '/routes.txt', 'utf8').split('\n').filter(Boolean);
(async () => {
  const b = await launch();
  const ctx = await (process.argv[2] === 'mobile' ? mobile(b) : desktop(b));
  const p = await ctx.newPage();
  const summary = new Map();
  for (const r of routes) {
    await p.goto(BASE + r, { waitUntil: 'networkidle' });
    await p.addScriptTag({ content: axeSrc });
    const res = await p.evaluate(async () => {
      // exclude Next.js dev overlay
      const r = await window.axe.run({ exclude: [['nextjs-portal']] }, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] });
      return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 3).map((n) => n.target.join(' ') + ' :: ' + (n.failureSummary || '').split('\n')[1]) , count: v.nodes.length }));
    });
    for (const v of res) {
      const k = `${v.impact} ${v.id}: ${v.help}`;
      if (!summary.has(k)) summary.set(k, []);
      summary.get(k).push(`${r} (${v.count}) e.g. ${v.nodes[0]}`);
    }
  }
  for (const [k, v] of summary) { console.log('\n' + k); v.forEach((x) => console.log('   ' + x)); }
  if (!summary.size) console.log('No axe violations');
  await b.close();
})();
