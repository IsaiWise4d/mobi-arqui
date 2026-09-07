import { mkdirSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = 'http://127.0.0.1:4321/';
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

await browser.close();
console.log('captures done');
