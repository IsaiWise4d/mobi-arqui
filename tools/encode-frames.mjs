// Re-codifica la secuencia del hero a tamaños servibles.
//
//   node tools/encode-frames.mjs
//
// Fuentes (4K / 1620×2160): FRAMES_SRC y FRAMES_WEBP_SRC. Los originales ya no
// viven en public/; se recuperan del historial de git (commit 576409d):
//   git archive 576409d public/frames public/frames-webp | tar -x -C .frames-src
//   FRAMES_SRC=.frames-src/public/frames FRAMES_WEBP_SRC=.frames-src/public/frames-webp node tools/encode-frames.mjs
//
// Salida:
//   public/seq/desktop/f-001..300.webp  1920×1080  (desktop, > 700px)
//   public/seq/mobile/f-001..150.webp   720×960    (móvil, muestreo de los 300)
//   public/seq/stills/f-NNN.webp        1200px     (fotos de las tarjetas de servicio)
//   public/og.jpg                       1200×630   (Open Graph, frame 300)
//
// WebP y no AVIF: AVIF decodifica bastante más lento y el scrub decodifica
// frames continuamente.
import { mkdirSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const TOTAL = 300;
const MOBILE = 150;
const STILLS = [174, 211, 238, 278];
const SRC = process.env.FRAMES_SRC ?? 'public/frames';
const SRC_WEBP = process.env.FRAMES_WEBP_SRC ?? 'public/frames-webp';
const OUT = 'public/seq';
const pad = (n) => String(n).padStart(3, '0');
// Mismo muestreo que usaba el hero: índice móvil (0-based) → frame fuente (0-based).
const sourceFrame = (n) => Math.round((n * (TOTAL - 1)) / (MOBILE - 1));

for (const dir of ['desktop', 'mobile', 'stills']) mkdirSync(join(OUT, dir), { recursive: true });

async function pool(items, size, fn) {
  let next = 0;
  const workers = Array.from({ length: size }, async () => {
    while (next < items.length) await fn(items[next++]);
  });
  await Promise.all(workers);
}

const range = (n) => Array.from({ length: n }, (_, i) => i);

await pool(range(TOTAL), 6, (i) =>
  sharp(join(SRC, `ezgif-frame-${pad(i + 1)}.jpg`))
    .resize(1920, 1080, { fit: 'cover' })
    .webp({ quality: 72, effort: 5, smartSubsample: true })
    .toFile(join(OUT, 'desktop', `f-${pad(i + 1)}.webp`))
);

await pool(range(MOBILE), 6, (i) =>
  sharp(join(SRC_WEBP, `ezgif-frame-${pad(sourceFrame(i) + 1)}.webp`))
    .resize(720, 960, { fit: 'cover' })
    .webp({ quality: 70, effort: 5, smartSubsample: true })
    .toFile(join(OUT, 'mobile', `f-${pad(i + 1)}.webp`))
);

await pool(STILLS, 4, (n) =>
  sharp(join(SRC, `ezgif-frame-${pad(n)}.jpg`))
    .resize({ width: 1200 })
    .webp({ quality: 78, effort: 5 })
    .toFile(join(OUT, 'stills', `f-${pad(n)}.webp`))
);

await sharp(join(SRC, `ezgif-frame-${pad(TOTAL)}.jpg`))
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/og.jpg');

const size = (dir) => readdirSync(dir).reduce((s, f) => s + statSync(join(dir, f)).size, 0);
const mb = (b) => `${(b / 1048576).toFixed(1)} MB`;
for (const dir of ['desktop', 'mobile', 'stills']) {
  const path = join(OUT, dir);
  const files = readdirSync(path).length;
  console.log(`${dir.padEnd(8)} ${String(files).padStart(3)} archivos  ${mb(size(path))}`);
}
console.log(`og.jpg   ${mb(statSync('public/og.jpg').size)}`);
