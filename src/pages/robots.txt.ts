import type { APIRoute } from 'astro';
import { site } from '../config/site';

/** robots.txt gerado a partir do domínio configurado. */
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${site.dominio}/sitemap-index.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
