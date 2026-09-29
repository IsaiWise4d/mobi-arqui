import { defineConfig } from 'astro/config';

// 🔶 Dominio de producción pendiente de confirmar, p. ej. 'https://www.ejemplo.com'.
// Con él se emiten canonical, og:url, og:image absoluta y el sitemap.
const SITE_URL = '';

export default defineConfig({
  site: SITE_URL || undefined,
  devToolbar: {
    enabled: false,
  },
});
