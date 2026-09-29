// Header: hides on scroll down, returns on scroll up; mobile section menu.

const siteNav = document.getElementById('siteNav');
const navToggle = document.querySelector<HTMLButtonElement>('.nav-toggle');
const menuPanel = document.getElementById('menuPanel');
let lastScrollY = window.scrollY;
let scrollFrame = 0;

const isMenuOpen = () => navToggle?.getAttribute('aria-expanded') === 'true';

function setMenuOpen(open: boolean) {
  if (!navToggle || !menuPanel) return;
  navToggle.setAttribute('aria-expanded', String(open));
  menuPanel.hidden = !open;
  navToggle.setAttribute('aria-label', open ? 'Cerrar menú de secciones' : 'Abrir menú de secciones');
  if (open) {
    siteNav?.classList.remove('is-hidden');
    menuPanel.querySelector('a')?.focus();
  }
}

function updateNav() {
  const currentY = window.scrollY;
  const delta = currentY - lastScrollY;
  if (siteNav) {
    siteNav.classList.toggle('is-scrolled', currentY > 24);
    if (currentY <= 24 || delta < -8 || document.activeElement?.closest('.cajetin') || isMenuOpen()) {
      siteNav.classList.remove('is-hidden');
    } else if (delta > 8) {
      siteNav.classList.add('is-hidden');
      setMenuOpen(false);
    }
  }
  lastScrollY = currentY;
  scrollFrame = 0;
}

window.addEventListener(
  'scroll',
  () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateNav);
  },
  { passive: true }
);
siteNav?.addEventListener('focusin', () => siteNav.classList.remove('is-hidden'));

if (navToggle && menuPanel) {
  navToggle.addEventListener('click', () => setMenuOpen(!isMenuOpen()));
  menuPanel.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) setMenuOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen()) {
      setMenuOpen(false);
      navToggle.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!isMenuOpen()) return;
    const el = e.target as Element;
    if (!el.closest('.menu-panel') && !el.closest('.nav-toggle')) setMenuOpen(false);
  });
}
