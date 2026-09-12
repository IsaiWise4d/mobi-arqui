import { mkdirSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4321/';
const OUT = '.impeccable/review';
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--disable-gpu', '--hide-scrollbars', '--force-color-profile=srgb'],
});

async function run({ width, height, mobile, reduced = false, names }) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
  if (reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2600));
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    const total = document.body.scrollHeight;
    const step = Math.round(window.innerHeight * 0.5);
    for (let y = 0; y <= total + step; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 140));
    }
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = '';
  });
  await page.evaluate(() => {
    document.querySelectorAll('.reveal, .chain').forEach((el) => el.classList.add('in'));
  });
  await new Promise((r) => setTimeout(r, 1600));
  await page.screenshot({ path: `${OUT}/${names.first}` });
  await page.screenshot({ path: `${OUT}/${names.full}`, fullPage: true });
  await page.evaluate(() => {
    const hero = document.getElementById('inicio');
    window.scrollTo(0, hero.offsetTop + (hero.offsetHeight - window.innerHeight) * 0.55);
  });
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: `${OUT}/${names.mid}` });
  await page.close();
  console.log(`done: ${width}px`);
}

await run({ width: 1440, height: 900, mobile: false, names: { first: 'desktop-first.png', full: 'desktop.png', mid: 'desktop-mid.png' } });
await run({ width: 390, height: 844, mobile: true, names: { first: 'mobile-first.png', full: 'mobile.png', mid: 'mobile-mid.png' } });
await run({ width: 390, height: 844, mobile: true, reduced: true, names: { first: 'reduced.png', full: 'reduced-full.png', mid: 'reduced-mid.png' } });

// Section-wise viewport captures for precise inspection.
const SECTIONS = ['servicios', 'metodo', 'proyectos', 'faq', 'nosotros', 'cotizador', 'contacto'];
async function sectionShots({ width, height, mobile, prefix }) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
  await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  for (const id of SECTIONS) {
    await page.evaluate((secId) => {
      const el = document.getElementById(secId);
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 90);
    }, id);
    await new Promise((r) => setTimeout(r, 1300));
    await page.screenshot({ path: `${OUT}/${prefix}-${id}.png` });
  }
  // Wizard interaction states: advance two steps.
  await page.evaluate(() => window.scrollTo(0, document.getElementById('cotizador').getBoundingClientRect().top + window.scrollY - 60));
  await new Promise((r) => setTimeout(r, 800));
  const chips = await page.$$('.wz-step.is-current .wz-chip input');
  if (chips.length) {
    await chips[0].click();
    await new Promise((r) => setTimeout(r, 700));
    await page.screenshot({ path: `${OUT}/${prefix}-wizard-step2.png` });
  }
  // FAQ open state.
  await page.evaluate(() => window.scrollTo(0, document.getElementById('faq').getBoundingClientRect().top + window.scrollY - 60));
  const summary = await page.$('.faq-item summary');
  if (summary) {
    await summary.click();
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: `${OUT}/${prefix}-faq-open.png` });
  }
  await page.close();
  console.log(`sections done: ${prefix}`);
}
await sectionShots({ width: 1440, height: 900, mobile: false, prefix: 'sec-desktop' });
await sectionShots({ width: 390, height: 844, mobile: true, prefix: 'sec-mobile' });

await browser.close();
console.log('captures done');
