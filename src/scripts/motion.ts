// Section motion without an animation library:
// - One-shot reveals: an IntersectionObserver adds `.in`; CSS transitions do
//   the rest (opacity/translate/clip-path only, all compositor-friendly).
// - The process line is scrubbed by a CSS scroll-driven animation where
//   supported (see global.css); `.in` is its fallback.
// - Carousel copy uses the Web Animations API.
import EmblaCarousel, { type EmblaCarouselType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion) document.documentElement.classList.add('motion-reduced');

// power2.out, the easing the carousel copy used before.
const EASE_OUT = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

function setupReveals() {
  const targets = document.querySelectorAll('.reveal, .chain, .svc-rail, .ig-sheet, .process-timeline');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    },
    { threshold: 0, rootMargin: '0px 0px -12% 0px' }
  );
  targets.forEach((el) => io.observe(el));
}

function animateCopy(slide: Element) {
  const copy = slide.querySelectorAll<HTMLElement>('.service-copy > *, .ficha-data > *');
  copy.forEach((el, i) => {
    el.getAnimations().forEach((a) => a.cancel());
    el.animate(
      [
        { opacity: 0, transform: 'translateY(16px)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 520, delay: i * 60, easing: EASE_OUT, fill: 'backwards' }
    );
  });
}

function setupCarousel() {
  const roots = document.querySelectorAll<HTMLElement>('[data-carousel]');
  if (!roots.length) return;
  const mql = window.matchMedia('(max-width: 760px)');

  const setupOne = (root: HTMLElement) => {
    try {
      const viewport = root.querySelector<HTMLElement>('.embla__viewport');
      const container = root.querySelector<HTMLElement>('.embla__container');
      const previous = root.querySelector('[data-carousel-prev]');
      const next = root.querySelector('[data-carousel-next]');
      const current = root.querySelector('[data-carousel-current]');
      const progress = root.querySelector<HTMLElement>('.carousel-progress span');
      const slides = root.querySelectorAll<HTMLElement>('.service-slide, .ficha-slide');
      if (!viewport || !slides.length) return;
      const always = root.hasAttribute('data-carousel-fichas');
      const manual = root.hasAttribute('data-carousel-manual');
      const total = slides.length;
      let index = 0;
      let embla: EmblaCarouselType | null = null;

      const paint = (animate: boolean) => {
        if (current) current.textContent = String(index + 1).padStart(2, '0');
        if (progress) {
          progress.style.width = `${100 / total}%`;
          progress.style.transform = `scaleX(${index + 1})`;
        }
        slides.forEach((slide, slideIndex) => {
          slide.setAttribute('aria-hidden', String(slideIndex !== index));
          slide.inert = slideIndex !== index;
        });
        if (animate && !reducedMotion && slides[index]) animateCopy(slides[index]);
      };

      // Las flechas funcionan aunque Embla falle: usan scroll nativo como respaldo.
      // Los carruseles manuales (fichas) usan SIEMPRE scroll nativo con
      // scroll-snap: posicionamiento exacto, sin desfases de transform.
      const goTo = (i: number, animate: boolean) => {
        index = ((i % total) + total) % total;
        if (embla) {
          try {
            embla.scrollTo(index);
          } catch {}
          paint(false);
        } else {
          viewport.scrollTo({ left: index * viewport.clientWidth, behavior: reducedMotion ? 'auto' : 'smooth' });
          paint(animate);
        }
      };

      const init = () => {
        if (embla) return;
        try {
          const plugins = [];
          if (!reducedMotion && !manual) plugins.push(Autoplay({ delay: 4600, stopOnInteraction: false, stopOnMouseEnter: true }));
          embla = EmblaCarousel(viewport, { loop: true, align: 'start', duration: 35 }, plugins);
          embla.on('select', () => {
            index = embla!.selectedScrollSnap();
            paint(true);
          });
        } catch {
          embla = null;
        }
        paint(false);
      };

      const destroy = () => {
        if (embla) {
          try {
            embla.destroy();
          } catch {}
          embla = null;
        }
        if (container) container.style.transform = '';
        index = 0;
        slides.forEach((slide) => {
          slide.removeAttribute('aria-hidden');
          slide.inert = false;
        });
      };

      previous?.addEventListener('click', () => goTo(index - 1, true));
      next?.addEventListener('click', () => goTo(index + 1, true));
      window.addEventListener('load', () => {
        if (!embla) return;
        try {
          embla.reInit();
          paint(false);
        } catch {}
      });

      if (manual) {
        let raf = 0;
        const syncFromScroll = () => {
          if (raf) return;
          raf = requestAnimationFrame(() => {
            raf = 0;
            const w = viewport.clientWidth || 1;
            index = Math.min(total - 1, Math.max(0, Math.round(viewport.scrollLeft / w)));
            paint(false);
          });
        };
        viewport.addEventListener('scroll', syncFromScroll, { passive: true });
        paint(false);
      } else if (always) {
        init();
      } else {
        const sync = (e: MediaQueryList | MediaQueryListEvent) => (e.matches ? init() : destroy());
        mql.addEventListener('change', sync);
        sync(mql);
      }
    } catch {}
  };

  roots.forEach(setupOne);
}

// Mobile-only carousel on native scroll-snap (the Instagram reels). Slides
// snap to the center so both neighbours peek in; the centered one is
// `.is-active`. Above the breakpoint it is a plain grid and nothing here applies.
function setupSnapCarousels() {
  const mql = window.matchMedia('(max-width: 760px)');

  document.querySelectorAll<HTMLElement>('[data-snap-carousel]').forEach((root) => {
    const viewport = root.querySelector<HTMLElement>('[data-snap-viewport]');
    const slides = [...root.querySelectorAll<HTMLElement>('[data-snap-slide]')];
    const current = root.querySelector('[data-snap-current]');
    const progress = root.querySelector<HTMLElement>('.carousel-progress span');
    if (!viewport || !slides.length) return;
    const total = slides.length;
    let index = 0;
    let raf = 0;

    // Slide center in the viewport's scroll coordinates. scale() on inactive
    // slides keeps the center, so the transformed rect is fine here.
    const centerOf = (slide: HTMLElement) => {
      const r = slide.getBoundingClientRect();
      return r.left - viewport.getBoundingClientRect().left + viewport.scrollLeft + r.width / 2;
    };

    const paint = () => {
      const active = mql.matches;
      root.classList.toggle('is-carousel', active);
      if (current) current.textContent = String(index + 1).padStart(2, '0');
      if (progress) {
        progress.style.width = `${100 / total}%`;
        progress.style.transform = `scaleX(${index + 1})`;
      }
      slides.forEach((slide, i) => slide.classList.toggle('is-active', active && i === index));
    };

    const goTo = (i: number) => {
      index = ((i % total) + total) % total;
      viewport.scrollTo({
        left: centerOf(slides[index]) - viewport.clientWidth / 2,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
      paint();
    };

    const syncFromScroll = () => {
      if (raf || !mql.matches) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const mid = viewport.scrollLeft + viewport.clientWidth / 2;
        let nearest = 0;
        let best = Infinity;
        slides.forEach((slide, i) => {
          const d = Math.abs(centerOf(slide) - mid);
          if (d < best) {
            best = d;
            nearest = i;
          }
        });
        if (nearest !== index) {
          index = nearest;
          paint();
        }
      });
    };

    viewport.addEventListener('scroll', syncFromScroll, { passive: true });
    root.querySelector('[data-snap-prev]')?.addEventListener('click', () => goTo(index - 1));
    root.querySelector('[data-snap-next]')?.addEventListener('click', () => goTo(index + 1));
    // Tapping a peeking neighbour brings it to the center instead of leaving
    // the page; the centered card opens its reel as usual.
    slides.forEach((slide, i) => {
      slide.querySelector('a')?.addEventListener('click', (e) => {
        if (!mql.matches || i === index) return;
        e.preventDefault();
        goTo(i);
      });
    });
    mql.addEventListener('change', paint);
    paint();
  });
}

setupCarousel();
setupSnapCarousels();
setupReveals();
