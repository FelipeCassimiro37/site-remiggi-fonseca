/**
 * Consentimento de cookies + Google Analytics 4.
 * - Nada do Google é carregado antes de o visitante clicar em "Aceitar".
 * - A escolha fica em localStorage ("rf-consentimento": "aceito" | "recusado").
 * - Eventos enviados: whatsapp_click (com "origem"), email_click, form_submit.
 */
import { config } from './config-cliente';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CHAVE = 'rf-consentimento';
type Escolha = 'aceito' | 'recusado';

function lerEscolha(): Escolha | null {
  try {
    const v = localStorage.getItem(CHAVE);
    return v === 'aceito' || v === 'recusado' ? v : null;
  } catch {
    return null;
  }
}

function salvarEscolha(v: Escolha) {
  try {
    localStorage.setItem(CHAVE, v);
  } catch {
    /* navegador sem armazenamento: a escolha vale só para esta visita */
  }
}

let gaCarregado = false;
function carregarGA() {
  const id = config().ga4Id;
  if (!id || gaCarregado) return;
  gaCarregado = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id);
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

function apagarCookiesGA() {
  const host = location.hostname;
  const dominios = ['', host, '.' + host, '.' + host.split('.').slice(-3).join('.')];
  document.cookie.split(';').forEach((c) => {
    const nome = c.split('=')[0].trim();
    if (nome === '_ga' || nome.startsWith('_ga_') || nome === '_gid') {
      dominios.forEach((d) => {
        document.cookie = `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? '; domain=' + d : ''}`;
      });
    }
  });
}

/** Envia um evento ao GA4 (somente se o visitante aceitou). */
export function rastrear(evento: string, parametros: Record<string, string> = {}) {
  if (gaCarregado && window.gtag) {
    window.gtag('event', evento, { pagina: location.pathname, ...parametros });
  }
}

const banner = () => document.getElementById('cookie-banner');

function mostrarBanner() {
  const b = banner();
  if (!b) return;
  b.hidden = false;
  document.documentElement.style.setProperty('--banner-altura', `${b.offsetHeight}px`);
}

function esconderBanner() {
  const b = banner();
  if (!b) return;
  b.hidden = true;
  document.documentElement.style.setProperty('--banner-altura', '0px');
}

function decidir(escolha: Escolha) {
  const anterior = lerEscolha();
  salvarEscolha(escolha);
  esconderBanner();
  if (escolha === 'aceito') {
    carregarGA();
  } else if (anterior === 'aceito' || gaCarregado) {
    // Revogação: remove os cookies e recarrega para descarregar o script do Google.
    apagarCookiesGA();
    location.reload();
  }
}

export function iniciarConsentimento() {
  const escolha = lerEscolha();
  if (escolha === 'aceito') carregarGA();
  if (!escolha) mostrarBanner();

  document.addEventListener('click', (ev) => {
    const alvo = ev.target as HTMLElement;
    const botao = alvo.closest<HTMLElement>('[data-consentimento]');
    if (botao) {
      decidir(botao.dataset.consentimento === 'aceitar' ? 'aceito' : 'recusado');
      return;
    }
    if (alvo.closest('[data-abrir-cookies]')) {
      mostrarBanner();
      banner()?.querySelector<HTMLButtonElement>('[data-consentimento="aceitar"]')?.focus();
      return;
    }
    const link = alvo.closest<HTMLAnchorElement>('a[href]');
    if (!link) return;
    if (link.dataset.track === 'whatsapp' || link.href.includes('wa.me/')) {
      rastrear('whatsapp_click', { origem: link.dataset.origem || 'desconhecida' });
    } else if (link.href.startsWith('mailto:')) {
      rastrear('email_click', { origem: link.dataset.origem || 'desconhecida' });
    }
  });

  window.addEventListener('resize', () => {
    if (!banner()?.hidden) mostrarBanner();
  });
}
