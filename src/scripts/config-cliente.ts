/** Lê as configurações públicas injetadas pelo BaseLayout (<script id="config-site">). */
export interface ConfigCliente {
  ga4Id: string | null;
  web3formsKey: string | null;
  whatsapp: string | null;
  nomeSite: string;
}

let cache: ConfigCliente | null = null;
export function config(): ConfigCliente {
  if (cache) return cache;
  const el = document.getElementById('config-site');
  cache = el ? (JSON.parse(el.textContent || '{}') as ConfigCliente) : { ga4Id: null, web3formsKey: null, whatsapp: null, nomeSite: '' };
  return cache;
}
