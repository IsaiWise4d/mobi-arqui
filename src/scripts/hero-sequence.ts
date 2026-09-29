// Scroll-scrubbed visual sequence.
// Skill: scroll-scrubbed-visual-sequence — one normalized progress value
// drives the canvas renderer and every overlay layer (intro/HUD/bridge).
//
// Loading is two-tier so the scrub never waits on a decode:
//   1. Compressed blobs: fetched coarse-to-fine (every 8th, 4th, 2nd, then the
//      rest), nearest to the playhead first. All of them fit in memory
//      (~21 MB desktop, ~3 MB mobile).
//   2. Decoded ImageBitmaps: a small cache around the playhead, biased toward
//      the scroll direction. createImageBitmap() decodes off the main thread;
//      bitmaps that fall out of the budget are closed.
// draw() always paints the closest decoded frame and never blocks.

const HERO_SEQUENCE = {
  totalFrames: 300,
  mobileFrames: 150,
  desktopSize: { w: 1920, h: 1080 },
  mobileSize: { w: 720, h: 960 },
  smoothing: 0.18,
  mobileSmoothing: 0.12,
  maxInflight: 6,
  bitmapBudget: 40,
  mobileBitmapBudget: 30,
  decodeConcurrency: 3,
  copyStops: { introExit: 0.28, bridgeReady: 0.84, hudFade: 0.93 },
  statusLoading: 'CARGANDO SECUENCIA · 300 CUADROS',
  statusActive: 'SECUENCIA ACTIVA · DESLIZA PARA CONSTRUIR',
  statusFinal: 'VISTA FINAL · MOVIMIENTO REDUCIDO',
  statusSaveData: 'VISTA FINAL · AHORRO DE DATOS',
  statusError: 'SECUENCIA NO DISPONIBLE · VISTA DE RESPALDO',
};

type Frame = ImageBitmap | HTMLImageElement;

const mobileViewport = window.matchMedia('(max-width: 700px)').matches;
const COUNT = mobileViewport ? HERO_SEQUENCE.mobileFrames : HERO_SEQUENCE.totalFrames;
const SMOOTHING = mobileViewport ? HERO_SEQUENCE.mobileSmoothing : HERO_SEQUENCE.smoothing;
const SOURCE = mobileViewport ? HERO_SEQUENCE.mobileSize : HERO_SEQUENCE.desktopSize;
const pad = (n: number) => String(n).padStart(3, '0');
// Mobile frame i was sampled from source frame sourceFrame(i) of the 300.
const sourceFrame = (n: number) =>
  mobileViewport ? Math.round((n * (HERO_SEQUENCE.totalFrames - 1)) / (HERO_SEQUENCE.mobileFrames - 1)) : n;
const frameSrc = (i: number) => `/seq/${mobileViewport ? 'mobile' : 'desktop'}/f-${pad(i + 1)}.webp`;

const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
const saveData = !!connection && (connection.saveData === true || /(^|-)2g$/.test(connection.effectiveType ?? ''));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Both paths show only the final frame.
const reduced = reducedMotion || saveData;

const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
const BUDGET = Math.max(
  12,
  Math.round(
    (mobileViewport ? HERO_SEQUENCE.mobileBitmapBudget : HERO_SEQUENCE.bitmapBudget) * (deviceMemory <= 2 ? 0.5 : deviceMemory <= 4 ? 0.75 : 1)
  )
);

const hero = document.getElementById('inicio') as HTMLElement | null;
const canvas = document.getElementById('scrub') as HTMLCanvasElement | null;

if (hero && canvas) initHero(hero, canvas);

function initHero(hero: HTMLElement, canvas: HTMLCanvasElement) {
  const stage = canvas.parentElement as HTMLElement;
  const counter = document.getElementById('frameCount');
  const intro = document.getElementById('heroIntro');
  const hud = document.getElementById('heroHud');
  const bridge = document.getElementById('heroBridge');
  const status = document.getElementById('heroStatus');
  const fallback = document.getElementById('heroFallback') as HTMLImageElement | null;
  const poster = document.getElementById('heroPoster');
  const ruler = hud?.querySelector<HTMLElement>('.hud-ruler');
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  const blobs: (Blob | null)[] = new Array(COUNT).fill(null);
  const decoded = new Map<number, Frame>();
  const decoding = new Set<number>();
  const pending = new Set<number>();
  const inflight = new Set<number>();
  const cover = { x: 0, y: 0, w: 0, h: 0 };
  let drawn = -1;
  let firstPaint = false;
  let target = reduced ? COUNT - 1 : 0;
  let displayTarget = target;
  let direction = 1;
  let rafId = 0;
  let heroInView = true;
  let heroTop = 0;
  let scrollable = 1;
  let loaded = 0;
  let failed = 0;
  let introExited = false;
  let hudFaded = false;
  let bridgeIsReady = false;

  const clampIndex = (n: number) => Math.min(COUNT - 1, Math.max(0, n));

  function setStatus(text: string) {
    if (status && status.textContent !== text) status.textContent = text;
  }

  function showFallback() {
    setStatus(HERO_SEQUENCE.statusError);
    if (fallback && !fallback.getAttribute('src')) fallback.src = frameSrc(COUNT - 1);
    fallback?.classList.add('is-visible');
    poster?.classList.add('is-hidden');
  }

  // ---- Drawing -----------------------------------------------------------

  function previousDecodedFrame(n: number) {
    for (let i = clampIndex(n); i >= 0; i--) if (decoded.has(i)) return i;
    return -1;
  }

  function closestDecodedFrame(n: number) {
    if (decoded.has(n)) return n;
    for (let distance = 1; distance < COUNT; distance++) {
      if (n - distance >= 0 && decoded.has(n - distance)) return n - distance;
      if (n + distance < COUNT && decoded.has(n + distance)) return n + distance;
    }
    return -1;
  }

  function draw(n: number) {
    const wanted = clampIndex(n);
    // Scrubbing forward, an earlier frame reads as "not there yet"; a later
    // one would jump ahead. Only fall back to the nearest when nothing
    // earlier is ready (e.g. first paint deep in the page).
    let i = previousDecodedFrame(wanted);
    if (i < 0 || wanted - i > 6) i = closestDecodedFrame(wanted);
    if (i < 0 || i === drawn) return;
    drawn = i;
    ctx!.drawImage(decoded.get(i)!, cover.x, cover.y, cover.w, cover.h);
    if (counter) counter.textContent = `F ${pad(sourceFrame(i) + 1)}/${HERO_SEQUENCE.totalFrames}`;
    if (!firstPaint) {
      // First real frame: hide the poster, announce the live sequence.
      firstPaint = true;
      poster?.classList.add('is-hidden');
      setStatus(reducedMotion ? HERO_SEQUENCE.statusFinal : saveData ? HERO_SEQUENCE.statusSaveData : HERO_SEQUENCE.statusActive);
    }
  }

  function sizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = stage.clientWidth * dpr;
    let h = stage.clientHeight * dpr;
    // A buffer larger than the source only upsamples: cap it so the cover
    // scale never exceeds 1, which also keeps drawImage cheap on 2x screens.
    const scale = Math.max(w / SOURCE.w, h / SOURCE.h);
    if (scale > 1) {
      w /= scale;
      h /= scale;
    }
    w = Math.max(1, Math.round(w));
    h = Math.max(1, Math.round(h));
    // Only re-allocate the buffer when the size actually changed. The
    // sticky stage can report sub-pixel shifts while scrolling, and
    // re-assigning canvas.width/height forces a repaint each time.
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    ctx!.imageSmoothingQuality = 'high';
    const s = Math.max(w / SOURCE.w, h / SOURCE.h);
    cover.w = SOURCE.w * s;
    cover.h = SOURCE.h * s;
    cover.x = (w - cover.w) / 2;
    cover.y = (h - cover.h) / 2;
    drawn = -1;
    draw(Math.round(displayTarget));
  }

  // ---- Decode cache --------------------------------------------------------

  // Frames ahead in the scroll direction are worth more than frames behind.
  const cost = (n: number) => {
    const d = n - target;
    return Math.sign(d) === direction || d === 0 ? Math.abs(d) : Math.abs(d) * 2;
  };

  function evict() {
    if (decoded.size <= BUDGET) return;
    const byCost = [...decoded.keys()].sort((a, b) => cost(b) - cost(a));
    for (const n of byCost) {
      if (decoded.size <= BUDGET) break;
      if (n === drawn) continue;
      const frame = decoded.get(n);
      decoded.delete(n);
      if (frame && 'close' in frame) frame.close();
    }
  }

  async function decodeBlob(blob: Blob): Promise<Frame> {
    if ('createImageBitmap' in window) return createImageBitmap(blob);
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    try {
      await img.decode();
    } finally {
      URL.revokeObjectURL(img.src);
    }
    return img;
  }

  function scheduleDecode() {
    if (decoding.size >= HERO_SEQUENCE.decodeConcurrency) return;
    // Walk outward from the playhead, cheapest first, and stop at the budget.
    const reach = BUDGET;
    const candidates: number[] = [];
    for (let d = 0; d <= reach; d++) {
      const ahead = target + d * direction;
      const behind = target - d * direction;
      if (ahead >= 0 && ahead < COUNT) candidates.push(ahead);
      if (d > 0 && d <= reach / 2 && behind >= 0 && behind < COUNT) candidates.push(behind);
      if (candidates.length >= BUDGET) break;
    }
    for (const n of candidates) {
      if (decoding.size >= HERO_SEQUENCE.decodeConcurrency) break;
      if (decoded.has(n) || decoding.has(n) || !blobs[n]) continue;
      decoding.add(n);
      decodeBlob(blobs[n]!)
        .then((frame) => {
          decoded.set(n, frame);
          evict();
          if (!decoded.has(n)) return;
          if (reduced || !rafId) draw(Math.round(displayTarget));
        })
        .catch(() => {
          // A frame that cannot decode is simply skipped; neighbours cover it.
          blobs[n] = null;
        })
        .finally(() => {
          decoding.delete(n);
          scheduleDecode();
        });
    }
  }

  // ---- Network ---------------------------------------------------------------

  // Coarse-to-fine: a frame on the every-8th grid outranks a fine frame
  // further than 16 steps away, so any scroll position soon has a neighbour.
  const levelPenalty = (n: number) => (n % 8 === 0 ? 0 : n % 4 === 0 ? 16 : n % 2 === 0 ? 32 : 64);
  const fetchScore = (n: number) => Math.abs(n - target) + levelPenalty(n);

  function nextPending() {
    let best = -1;
    let bestScore = Infinity;
    for (const n of pending) {
      const score = fetchScore(n);
      if (score < bestScore) {
        best = n;
        bestScore = score;
      }
    }
    return best;
  }

  function pump() {
    if (document.hidden) return;
    while (inflight.size < HERO_SEQUENCE.maxInflight && pending.size > 0) {
      const n = nextPending();
      pending.delete(n);
      inflight.add(n);
      const near = Math.abs(n - target) < 8;
      fetch(frameSrc(n), { priority: near ? 'high' : 'low' } as RequestInit)
        .then((res) => {
          if (!res.ok) throw new Error(String(res.status));
          return res.blob();
        })
        .then((blob) => {
          blobs[n] = blob;
          loaded += 1;
          scheduleDecode();
        })
        .catch(() => {
          failed += 1;
          if (loaded === 0 && failed >= 8) showFallback();
        })
        .finally(() => {
          inflight.delete(n);
          pump();
        });
    }
  }

  // ---- Progress and overlays -------------------------------------------------

  // Overlay layers follow the same normalized progress (copyStops), so the
  // same scroll position always reproduces the same state — forward or back.
  function applyLayers(p: number) {
    if (reduced) return;
    const stops = HERO_SEQUENCE.copyStops;
    const exit = p > stops.introExit;
    if (exit !== introExited) {
      introExited = exit;
      intro?.classList.toggle('is-exiting', exit);
    }
    const fade = p > stops.hudFade;
    if (fade !== hudFaded) {
      hudFaded = fade;
      hud?.classList.toggle('is-faded', fade);
    }
    const ready = p > stops.bridgeReady;
    if (ready !== bridgeIsReady) {
      bridgeIsReady = ready;
      bridge?.classList.toggle('is-ready', ready);
    }
  }

  // Progress uses the sticky stage height, never window.innerHeight.
  // On mobile the URL toolbar collapses mid-scroll; innerHeight/dvh would
  // remap frames even though the finger moved the same amount. Geometry is
  // cached here so the scroll path reads no layout.
  function measure() {
    heroTop = hero.getBoundingClientRect().top + window.scrollY;
    scrollable = Math.max(1, hero.offsetHeight - stage.offsetHeight);
  }

  const progress = () => Math.min(1, Math.max(0, (window.scrollY - heroTop) / scrollable));

  function tick() {
    rafId = 0;
    displayTarget += (target - displayTarget) * SMOOTHING;
    if (Math.abs(target - displayTarget) < 0.02) displayTarget = target;
    draw(Math.round(displayTarget));
    ruler?.style.setProperty('--p', (displayTarget / (COUNT - 1)).toFixed(4));
    if (displayTarget !== target && heroInView && !document.hidden) rafId = requestAnimationFrame(tick);
  }

  function requestTick() {
    if (reduced || rafId || !heroInView || document.hidden) return;
    if (displayTarget !== target) rafId = requestAnimationFrame(tick);
  }

  function onScroll() {
    // Reduced motion pins the final frame; scroll never moves the playhead.
    if (reduced || !heroInView) return;
    const p = progress();
    applyLayers(p);
    const next = clampIndex(Math.round(p * (COUNT - 1)));
    if (next === target) return;
    direction = next > target ? 1 : -1;
    target = next;
    scheduleDecode();
    requestTick();
  }

  // ---- Wiring --------------------------------------------------------------------

  new ResizeObserver(() => {
    measure();
    sizeCanvas();
    onScroll();
  }).observe(stage);
  new ResizeObserver(measure).observe(hero);
  measure();
  sizeCanvas();

  new IntersectionObserver((entries) => {
    heroInView = entries[0].isIntersecting;
    // While the canvas is on screen the header drops its backdrop blur, which
    // would otherwise be re-rasterized on every scrubbed frame.
    document.documentElement.classList.toggle('on-hero', heroInView);
    if (heroInView) onScroll();
  }).observe(hero);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    pump();
    requestTick();
  });

  window.addEventListener('pagehide', () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  });

  if (reduced) {
    document.documentElement.classList.add('static-hero');
    pending.add(COUNT - 1);
    pump();
    return;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', () => {
    measure();
    onScroll();
  }, { once: true });
  document.fonts?.ready?.then(measure).catch(() => {});

  // Start from wherever the page was restored to.
  target = clampIndex(Math.round(progress() * (COUNT - 1)));
  displayTarget = target;
  applyLayers(progress());
  ruler?.style.setProperty('--p', (target / (COUNT - 1)).toFixed(4));
  for (let n = 0; n < COUNT; n++) pending.add(n);
  pump();
}
