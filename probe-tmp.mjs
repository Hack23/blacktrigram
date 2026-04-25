import { chromium } from 'playwright';

const VIEWPORTS = [
  { name: 'mobile-portrait', w: 390, h: 844, mobile: true },
  { name: 'tablet', w: 1024, h: 768, mobile: false },
  { name: 'laptop', w: 1280, h: 800, mobile: false },
  { name: 'desktop-fhd', w: 1920, h: 1080, mobile: false },
  { name: 'desktop-2k', w: 2560, h: 1440, mobile: false },
];

async function gotoScreen(page, key) {
  await page.goto('http://localhost:5173');
  await page.locator('button:has-text("시작")').first().click().catch(()=>{});
  await page.waitForTimeout(2500);
  await page.locator('button:has-text("시작")').first().click().catch(()=>{});
  await page.waitForTimeout(3500);
  await page.keyboard.press(key);
  const sel = key === 'T' ? '[data-testid="training-screen-3d"]' : '[data-testid="combat-screen"]';
  await page.waitForSelector(sel, { timeout: 20000 });
  await page.waitForTimeout(5000);
}

function overlap(a,b){if(!a||!b)return false;return !(a.right<=b.x||b.right<=a.x||a.bottom<=b.y||b.bottom<=a.y);}

async function snapshot(page) {
  return await page.evaluate(() => {
    const ids = [
      'training-screen-3d','training-top-hud','training-left-hud','training-right-hud','training-bottom-hud','training-bottom-hud-volume-section','training-bottom-hud-technique-section','technique-bar','training-controls-html','anatomy-controls-html','vital-point-hint',
      'combat-screen','combat-top-hud','combat-left-hud','combat-right-hud','combat-bottom-hud','combat-bottom-hud-volume-section','combat-bottom-hud-technique-section','combat-bottom-hud-messages',
    ];
    const out = {};
    for (const id of ids) {
      const el = document.querySelector(`[data-testid="${id}"]`);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      out[id] = { x: r.x, y: r.y, w: r.width, h: r.height, right: r.right, bottom: r.bottom, hidden: cs.display === 'none' || cs.visibility === 'hidden' };
    }
    const cards = [...document.querySelectorAll('[data-testid^="technique-card-"]')].map((e) => {
      const r = e.getBoundingClientRect();
      return { id: e.getAttribute('data-testid'), x: r.x, right: r.right, w: r.width, y: r.y, bottom: r.bottom };
    });
    const canvases = [...document.querySelectorAll('canvas')].map((c) => {
      const r = c.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    });
    return { rects: out, cards, canvases };
  });
}

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox','--disable-dev-shm-usage'] });
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    userAgent: vp.mobile ? 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36' : undefined,
    deviceScaleFactor: vp.mobile ? 3 : 1,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  });
  const page = await ctx.newPage();
  for (const sc of ['T','V']) {
    try {
      await gotoScreen(page, sc);
      const data = await snapshot(page);
      const r = data.rects;
      const checks = [];
      const prefix = sc === 'T' ? 'training' : 'combat';
      const top = r[`${prefix}-top-hud`];
      const left = r[`${prefix}-left-hud`];
      const right = r[`${prefix}-right-hud`];
      const bottom = r[`${prefix}-bottom-hud`];
      const volume = r[`${prefix}-bottom-hud-volume-section`];
      const techSection = r[`${prefix}-bottom-hud-technique-section`];
      if (top && left && overlap(top,left)) checks.push('top<->left overlap');
      if (top && right && overlap(top,right)) checks.push('top<->right overlap');
      if (volume && data.cards.length) {
        const ov = data.cards.some((c) => c.right > volume.x && c.x < volume.right && c.bottom > volume.y && c.y < volume.bottom);
        if (ov) checks.push('technique cards overlap volume');
        const off = data.cards.some((c) => c.right > vp.w - 4 || c.x < 4);
        if (off) checks.push('technique cards offscreen');
      }
      const ctrl = r['training-controls-html'];
      if (ctrl && top && ctrl.bottom > top.bottom + 2) checks.push(`training-controls clips top`);
      const anatomy = r['anatomy-controls-html'];
      if (anatomy && left && (anatomy.right > left.right + 2 || anatomy.x < left.x - 2)) checks.push('anatomy outside left panel');
      const main = data.canvases[0];
      if (main && main.w * main.h < vp.w * vp.h * 0.4) checks.push(`tiny canvas ${main.w}x${main.h}`);
      console.log(`[${vp.name} ${sc}] ${checks.length?JSON.stringify(checks):'OK'}`);
      console.log('  rects:', JSON.stringify({top,left,right,bottom,volume,techSection,ctrl,anatomy,lastCard: data.cards.at(-1), firstCard: data.cards[0], canvas: main}));
    } catch (e) {
      console.log(`[${vp.name} ${sc}] FAILED: ${e.message}`);
    }
  }
  await ctx.close();
}
await browser.close();
