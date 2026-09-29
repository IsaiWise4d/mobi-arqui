import type { APIRoute } from 'astro';

// Single-page site: the sitemap lists only the home page. It stays empty
// until `site` is set in astro.config.mjs, since sitemap URLs must be absolute.
export const GET: APIRoute = ({ site }) => {
  const urls = site ? [`  <url><loc>${new URL('/', site).href}</loc></url>`] : [];
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
  ].join('\n');
  return new Response(body + '\n', { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
