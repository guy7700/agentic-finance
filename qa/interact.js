// Interaction QA for the Agentic Finance site. Prints PASS/FAIL per check.
const { launch, desktop, mobile, BASE, OUT } = require('./lib');
const path = require('path');

const results = [];
// Static export uses trailing slashes; compare paths without them.
const norm = (h) => (h ? h.replace(/\/(?=$|\?|#)/, '') : h);
function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
}

async function visible(page, sel) {
  return page.locator(sel).first().isVisible().catch(() => false);
}

(async () => {
  const b = await launch();

  // ---------- Desktop navigation ----------
  {
    const ctx = await desktop(b);
    const p = await ctx.newPage();
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    const nav = p.locator('nav[aria-label="Main"]');
    const triggers = nav.locator(':scope > ul > li > button');
    check('desktop: six top-level triggers', (await triggers.count()) === 6, String(await triggers.count()));
    const labels = await triggers.allInnerTexts();
    check('desktop: order Editions…About', labels.map((l) => l.trim()).join(',') === 'Editions,Program,Speakers,Partners,Media,About', labels.join(','));

    for (let i = 0; i < 6; i++) {
      const t = triggers.nth(i);
      await t.click();
      const panelId = await t.getAttribute('aria-controls');
      const expanded = await t.getAttribute('aria-expanded');
      const panel = p.locator(`[id="${panelId}"]`);
      const links = await panel.locator('ul a').count();
      check(`desktop: ${labels[i].trim()} panel opens with 4 links`, expanded === 'true' && (await panel.isVisible()) && links === 4, `expanded=${expanded} links=${links}`);
      await p.keyboard.press('Escape');
      const closed = !(await panel.isVisible());
      const focused = await p.evaluate((id) => document.activeElement?.getAttribute('aria-controls') === id, panelId);
      check(`desktop: ${labels[i].trim()} Escape closes and returns focus`, closed && focused);
    }

    // outside click
    await triggers.nth(0).click();
    await p.mouse.click(700, 600);
    const p0 = await triggers.nth(0).getAttribute('aria-controls');
    check('desktop: outside click closes panel', !(await p.locator(`[id="${p0}"]`).isVisible()));

    // keyboard arrows
    await triggers.nth(0).focus();
    await p.keyboard.press('ArrowRight');
    const onProgram = await p.evaluate(() => document.activeElement?.textContent?.trim());
    check('desktop: ArrowRight moves to next trigger', onProgram === 'Program', onProgram);
    await p.keyboard.press('ArrowDown');
    await p.waitForTimeout(150);
    const firstLink = await p.evaluate(() => document.activeElement?.getAttribute('href'));
    check('desktop: ArrowDown focuses first panel link', norm(firstLink) === '/program/topics', firstLink);
    await p.keyboard.press('Escape');

    // navigate via panel link closes panel
    await triggers.nth(3).click();
    const partnersPanel = await triggers.nth(3).getAttribute('aria-controls');
    await p.locator(`[id="${partnersPanel}"] a[href^="/partners/book-a-call"]`).first().click();
    await p.waitForURL(/\/partners\/book-a-call\/?$/);
    await p.waitForTimeout(300);
    check('desktop: panel link navigates and panel closes', !(await p.locator(`[id="${partnersPanel}"]`).isVisible()));

    // permanent CTAs
    const inv = p.locator('header > div > div:last-child a', { hasText: 'Request an invitation' });
    const partner = p.locator('header > div > div:last-child a', { hasText: 'Partner with us' });
    check('desktop: CTA hrefs', norm(await inv.getAttribute('href')) === '/invitation' && norm(await partner.getAttribute('href')) === '/partners');
    await inv.click();
    await p.waitForURL(/\/invitation\/?$/);
    check('desktop: Request an invitation CTA works', /\/invitation\/?$/.test(p.url()));
    const luma = await p.locator('main a[href="https://luma.com/25oj08jc"]').count();
    check('invitation page links to Luma application', luma >= 2, String(luma));
    await partner.click();
    await p.waitForURL(/\/partners\/?$/);
    check('desktop: Partner with us CTA works', /\/partners\/?$/.test(p.url()));
    await p.screenshot({ path: path.join(OUT, 'qa-desktop-partners.png') });

    // Mega-panel screenshot
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    await triggers.nth(0).click();
    await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(OUT, 'qa-mega-editions.png') });
    await triggers.nth(0).click();
    await ctx.close();
  }

  // ---------- Mobile drawer ----------
  {
    const ctx = await mobile(b);
    const p = await ctx.newPage();
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    const menuBtn = p.getByRole('button', { name: 'Open menu' });
    check('mobile: menu button visible', await menuBtn.isVisible());
    await menuBtn.click();
    const dialog = p.getByRole('dialog', { name: 'Site menu' });
    check('mobile: drawer opens as dialog', await dialog.isVisible());
    const lock = await p.evaluate(() => document.documentElement.dataset.scrollLock);
    check('mobile: scroll locked while open', lock === 'true');
    const focusedClose = await p.evaluate(() => document.activeElement?.textContent?.includes('Close menu'));
    check('mobile: focus moves to close button', Boolean(focusedClose));
    const sections = dialog.locator('nav button[aria-expanded]');
    check('mobile: six accordion sections', (await sections.count()) === 6);
    await p.screenshot({ path: path.join(OUT, 'qa-mobile-drawer.png') });
    for (let i = 0; i < 6; i++) {
      const s = sections.nth(i);
      if ((await s.getAttribute('aria-expanded')) !== 'true') await s.click();
      const panel = p.locator(`[id="${await s.getAttribute('aria-controls')}"]`);
      const n = await panel.locator('a').count();
      const sign = (await s.innerText()).trim().slice(-1);
      check(`mobile: section ${i + 1} expands with 4 links and − sign`, (await panel.isVisible()) && n === 4 && sign === '−', `links=${n} sign=${sign}`);
    }
    await sections.nth(5).click();
    check('mobile: section collapses with + sign', (await sections.nth(5).innerText()).trim().endsWith('+'));
    const actions = await dialog.locator(':scope > div:last-child a').allInnerTexts();
    check('mobile: action order Partner first, Invitation second', actions[0]?.trim() === 'Partner with us' && actions[1]?.trim() === 'Request an invitation', actions.join(' | '));
    // overflow inside drawer
    const dw = await dialog.evaluate((el) => ({ sw: el.scrollWidth, cw: el.clientWidth }));
    check('mobile: drawer has no horizontal overflow', dw.sw <= dw.cw + 1, JSON.stringify(dw));
    // short screen: nav scrolls, actions pinned
    await p.setViewportSize({ width: 390, height: 560 });
    const navScroll = await dialog.locator('nav').evaluate((el) => ({ sh: el.scrollHeight, ch: el.clientHeight, oy: getComputedStyle(el).overflowY }));
    const actionsVisible = await dialog.locator(':scope > div:last-child a').first().isVisible();
    check('mobile: short screen keeps actions visible and nav scrollable', actionsVisible && navScroll.oy === 'auto', JSON.stringify(navScroll));
    await p.setViewportSize({ width: 390, height: 844 });
    // escape
    await p.keyboard.press('Escape');
    check('mobile: Escape closes drawer', !(await dialog.isVisible().catch(() => false)));
    const unlocked = await p.evaluate(() => document.documentElement.dataset.scrollLock);
    check('mobile: scroll unlocked after close', unlocked === undefined);
    // navigate from drawer
    await menuBtn.click();
    await dialog.locator('nav button', { hasText: 'Speakers' }).click();
    await dialog.locator('a', { hasText: 'All speakers' }).click();
    await p.waitForURL(/\/speakers\/?$/);
    await p.waitForTimeout(300);
    check('mobile: drawer link navigates and drawer closes', /\/speakers\/?$/.test(p.url()) && !(await p.getByRole('dialog').isVisible().catch(() => false)));
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    await p.screenshot({ path: path.join(OUT, 'qa-mobile-home.png'), fullPage: false });
    await ctx.close();
  }

  // ---------- Speaker directory ----------
  {
    const ctx = await desktop(b);
    const p = await ctx.newPage();
    await p.goto(BASE + '/speakers', { waitUntil: 'networkidle' });
    const cards = () => p.locator('main ul li article').count();
    const total = await cards();
    check('directory: renders all speakers', total === 61, String(total));
    await p.getByRole('button', { name: /^Singapore 2026/ }).click();
    check('directory: event filter Singapore 2026', (await cards()) === 54, String(await cards()));
    check('directory: URL reflects filter', p.url().includes('event=Singapore+2026') || p.url().includes('event=Singapore%202026'), p.url());
    await p.getByRole('button', { name: /^Abu Dhabi 2026/ }).click();
    const emptyText = (await p.locator('main').innerText()).toLowerCase();
    check('directory: Abu Dhabi shows honest empty state', (await cards()) === 0 && emptyText.includes('announced one by one'));
    await p.getByRole('button', { name: /^All editions/ }).click();
    await p.getByPlaceholder('Search name, company, expertise').fill('eToro');
    await p.waitForTimeout(150);
    const etoro = await cards();
    check('directory: search eToro', etoro === 2, String(etoro));
    await p.getByPlaceholder('Search name, company, expertise').fill('');
    await p.getByLabel('Organisation').selectOption('Fireblocks');
    check('directory: organisation filter', (await cards()) === 1);
    await p.getByLabel('Organisation').selectOption('');
    await p.getByLabel('City').selectOption('Paris');
    check('directory: city filter Paris', (await cards()) === 2, String(await cards()));
    await p.getByRole('button', { name: 'Clear filters' }).click();
    check('directory: clear filters', (await cards()) === 61);
    // deep link
    await p.goto(BASE + '/speakers?city=Singapore&org=eToro', { waitUntil: 'networkidle' });
    check('directory: deep link applies filters', (await cards()) === 2, String(await cards()));
    // profile
    await p.goto(BASE + '/speakers', { waitUntil: 'networkidle' });
    await p.locator('main article a').first().click();
    await p.waitForURL(/\/speakers\/yoni-assia\/?$/);
    const prof = await p.locator('main').innerText();
    check('profile: bio and session render', prof.includes('co-founded eToro in 2007') && prof.includes('When the Broker Becomes an Agent'));
    await ctx.close();
  }

  // ---------- Category explorer, topics, global series ----------
  {
    const ctx = await desktop(b);
    const p = await ctx.newPage();
    await p.goto(BASE + '/partners/categories', { waitUntil: 'networkidle' });
    const tabs = p.getByRole('tab');
    check('categories: 12 category tabs', (await tabs.count()) === 12);
    await tabs.nth(6).click();
    const panelTitle = await p.getByRole('tabpanel').locator('h3').innerText();
    check('categories: selecting changes panel', panelTitle.toLowerCase().includes('capital'), panelTitle);
    check('categories: URL updated', p.url().includes('category=capital-asset-management'), p.url());
    await tabs.nth(6).focus();
    await p.keyboard.press('ArrowRight');
    const t2 = await p.getByRole('tabpanel').locator('h3').innerText();
    check('categories: arrow keys move selection', t2.toLowerCase().includes('prediction'), t2);
    const enquire = p.getByRole('tabpanel').locator('a', { hasText: 'Enquire about' });
    check('categories: enquiry CTA links with category', norm(await enquire.getAttribute('href')) === '/partners/book-a-call?category=prediction-markets');
    await enquire.click();
    await p.waitForURL(/\/partners\/book-a-call\/?\?category=prediction-markets$/);
    await p.waitForTimeout(400);
    const pre = await p.getByLabel(/Category you want to lead/).inputValue();
    check('book-a-call: category prefilled from query', pre === 'Prediction Markets', pre);
    const showEmbed = p.getByRole('button', { name: 'Choose a time here' });
    await showEmbed.click();
    const iframe = await p.locator('iframe[title*="appointment booking"]').getAttribute('src');
    check('book-a-call: booking embed loads Google appointment schedule', Boolean(iframe?.includes('calendar.google.com/calendar/appointments')));

    await p.goto(BASE + '/program/topics', { waitUntil: 'networkidle' });
    const ttabs = p.getByRole('tab');
    check('topics: 15 topics', (await ttabs.count()) === 15);
    await ttabs.nth(9).click();
    const tp = await p.getByRole('tabpanel').innerText();
    check('topics: selecting shows detail', tp.toLowerCase().includes('ai regulation & governance'));

    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    const series = p.getByRole('tablist', { name: 'Agentic Finance editions' }).getByRole('tab');
    check('home: global series lists 7 editions', (await series.count()) === 7);
    await series.nth(1).click();
    const sp = (await p.locator('[role="tabpanel"]').first().innerText());
    check('home: selecting Singapore shows archive actions', sp.includes('Open the archive') && sp.includes('650+'));
    await series.nth(1).focus();
    await p.keyboard.press('ArrowDown');
    const sp2 = await p.locator('[role="tabpanel"]').first().innerText();
    check('home: arrow key moves to Hong Kong (planned)', sp2.includes('Hong Kong') && sp2.includes('Register interest'));
    await ctx.close();
  }

  // ---------- Gallery, FAQ, video, agenda ----------
  {
    const ctx = await desktop(b);
    const p = await ctx.newPage();
    await p.goto(BASE + '/media/gallery', { waitUntil: 'networkidle' });
    const items = () => p.locator('main ul.columns-1 > li').count();
    const all = await items();
    check('gallery: renders photos', all === 27, String(all));
    await p.getByRole('button', { name: /^Singapore 2026/ }).click();
    check('gallery: edition filter', (await items()) === 19, String(await items()));
    await p.getByRole('button', { name: 'Partner activations' }).click();
    const partnerPhotos = await items();
    check('gallery: moment filter', partnerPhotos > 0 && partnerPhotos < 19, String(partnerPhotos));
    await p.getByRole('button', { name: /^All events/ }).click();
    await p.getByRole('button', { name: 'All moments' }).click();
    await p.locator('main ul.columns-1 > li button').first().click();
    const dlg = p.locator('dialog[open]');
    check('gallery: lightbox opens', await dlg.isVisible());
    const c1 = await dlg.locator('p').first().innerText();
    await p.keyboard.press('ArrowRight');
    const c2 = await dlg.locator('p').first().innerText();
    check('gallery: arrow key advances photo', c1 !== c2, `${c1} -> ${c2}`);
    await p.screenshot({ path: path.join(OUT, 'qa-lightbox.png') });
    await p.keyboard.press('Escape');
    await p.waitForTimeout(150);
    check('gallery: Escape closes lightbox', !(await p.locator('dialog[open]').count()));

    await p.goto(BASE + '/about/faq', { waitUntil: 'networkidle' });
    const q = p.locator('main button[aria-expanded]').first();
    await q.click();
    const region = p.locator(`[id="${await q.getAttribute('aria-controls')}"]`);
    check('faq: question expands', (await q.getAttribute('aria-expanded')) === 'true' && (await region.isVisible()));
    await q.click();
    check('faq: question collapses', (await q.getAttribute('aria-expanded')) === 'false');

    await p.goto(BASE + '/media/video', { waitUntil: 'networkidle' });
    await p.getByRole('button', { name: /Play video/ }).first().click();
    const vsrc = await p.locator('video[controls]').getAttribute('src');
    check('video: click-to-play loads the recap file', vsrc === '/video/singapore-2026-recap.mp4', vsrc);
    const head = await p.request.get(BASE + '/video/singapore-2026-recap.mp4', { headers: { Range: 'bytes=0-100' } });
    check('video: file is served', [200, 206].includes(head.status()), String(head.status()));

    await p.goto(BASE + '/editions/singapore-2026/agenda', { waitUntil: 'networkidle' });
    const sessions = () => p.locator('main ol > li[id]').count();
    const allS = await sessions();
    check('agenda: all 23 entries', allS === 23, String(allS));
    await p.getByRole('button', { name: 'The Odds', exact: true }).click();
    check('agenda: stage filter', (await sessions()) === 9, String(await sessions()));
    await p.getByRole('button', { name: 'Both stages' }).click();
    await p.getByRole('button', { name: 'Keynote', exact: true }).click();
    check('agenda: format filter keynotes', (await sessions()) === 3, String(await sessions()));
    const p2 = await ctx.newPage();
    await p2.goto(BASE + '/editions/singapore-2026/agenda#af-1530', { waitUntil: 'networkidle' });
    const anchor = await p2.locator('#af-1530').isVisible();
    check('agenda: legacy anchor #af-1530 exists', anchor);
    await ctx.close();
  }

  // ---------- Forms ----------
  {
    const ctx = await desktop(b);
    const p = await ctx.newPage();
    // Nomination: validation then success
    await p.goto(BASE + '/speakers/nominate', { waitUntil: 'networkidle' });
    await p.getByRole('button', { name: 'Submit nomination' }).click();
    await p.waitForTimeout(250);
    const alert = await p.locator('form [role="alert"]').innerText().catch(() => '');
    const invalid = await p.locator('[aria-invalid="true"]').count();
    const focusedInvalid = await p.evaluate(() => document.activeElement?.getAttribute('aria-invalid'));
    check('nominate: empty submit shows errors and focuses first invalid', invalid >= 6 && alert.includes('highlighted') && focusedInvalid === 'true', `invalid=${invalid}`);
    await p.getByLabel('Your name').fill('QA Nominator');
    await p.getByLabel('Your email').fill('qa.nominator@example.com');
    await p.getByLabel('Your company').fill('QA Capital');
    await p.getByLabel('Speaker name').fill('Jane Example');
    await p.getByLabel('Role or title').fill('Chief Risk Officer');
    await p.getByLabel('Company or institution').fill('Example Bank');
    await p.getByLabel('Proposed topic').fill('Agent liability');
    await p.waitForTimeout(2600);
    await p.getByRole('button', { name: 'Submit nomination' }).click();
    await p.getByRole('status').first().waitFor({ timeout: 8000 });
    const ok = await p.getByRole('status').first().innerText();
    check('nominate: success state after delivery', ok.toLowerCase().includes('thank you, qa') && ok.includes('Jane Example'), ok.slice(0, 80));

    // Partnership
    await p.goto(BASE + '/partners/book-a-call', { waitUntil: 'networkidle' });
    console.log('  .. partnership form');
    await p.getByLabel('Your name').fill('QA Partner');
    await p.getByLabel('Work email').fill('qa.partner@example.com');
    await p.getByRole('textbox', { name: 'Company', exact: true }).fill('QA Payments');
    await p.getByLabel(/Category you want to lead/).selectOption('Agentic Payments');
    await p.locator('label', { hasText: 'Speak on stage' }).click();
    await p.waitForTimeout(2600);
    await p.getByRole('button', { name: 'Send partnership enquiry' }).click();
    const consentErr = await p.getByText('Please tick this box to continue.').isVisible().catch(() => false);
    check('partnership: consent required', consentErr);
    await p.getByLabel(/I agree to be contacted/).check();
    await p.getByRole('button', { name: 'Send partnership enquiry' }).click();
    await p.getByRole('status').first().waitFor({ timeout: 8000 });
    const ok2 = await p.getByRole('status').first().innerText();
    check('partnership: success state with booking fallback', ok2.includes('Agentic Payments') && ok2.includes('Book a 20-minute'), ok2.slice(0, 90));

    // Contact with prefill
    await p.goto(BASE + '/about/contact?topic=attendance&edition=paris-2027', { waitUntil: 'networkidle' });
    await p.waitForTimeout(300);
    const t = await p.getByLabel(/What is it about/).inputValue();
    const ed = await p.getByLabel('Edition').inputValue();
    const msg = await p.getByLabel('Message').inputValue();
    check('contact: prefill from query', t === 'attendance' && ed === 'Paris 2027' && msg.includes('Paris 2027'), `${t} ${ed}`);
    await p.getByLabel('Your name').fill('QA Contact');
    await p.getByLabel('Email').fill('qa.contact@example.com');
    await p.waitForTimeout(2600);
    await p.getByRole('button', { name: 'Send message' }).click();
    await p.getByRole('status').first().waitFor({ timeout: 8000 });
    check('contact: success state', (await p.getByRole('status').first().innerText()).toLowerCase().includes('message received'));
    await ctx.close();
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  await b.close();
  process.exit(failed.length ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(2);
});
