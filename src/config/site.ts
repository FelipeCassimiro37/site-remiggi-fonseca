/**
 * ============================================================
 *  CONFIGURAÇÃO CENTRAL DO SITE
 * ============================================================
 *  Todos os dados de contato, identificadores (GA4, Web3Forms)
 *  e informações institucionais ficam AQUI.
 *
 *  Regra geral: um valor vazio ('') ou entre colchetes
 *  ('[PREENCHER]') é tratado como "não preenchido" — o recurso
 *  correspondente fica oculto ou desativado até ser configurado.
 *  Rode `npm run pendencias` para ver tudo o que falta.
 * ============================================================
 */

export const site = {
  /* ---------- Identificação ---------- */
  nome: 'Remiggi & Fonseca',
  nomeCompleto: 'Remiggi & Fonseca Advogados Associados',
  /** Razão social do controlador dos dados (Política de Privacidade). Confirmar com o contrato social. */
  razaoSocial: 'Remiggi & Fonseca Advogados Associados',
  cnpj: '68.926.594/0001-08',
  /** Registro da sociedade na OAB. */
  registroOab: 'OAB/MG 24.061',
  /** Ano de início das atividades (usado no rodapé e nos dados estruturados). */
  anoFundacao: '2026',

  /** Endereço público do site, sem barra no final. */
  dominio: 'https://remiggiefonseca.com.br',

  /** Tipo de negócio no schema.org. LegalService é o adequado para escritório de advocacia. */
  tipoSchema: 'LegalService',

  /** Descrição curta usada no rodapé. */
  descricaoRodape:
    'Advocacia consultiva e contenciosa em tributário, cível, trabalhista e contratual. Atendemos todo o Brasil, on-line.',

  /* ---------- Contato ---------- */
  contato: {
    /** WhatsApp apenas com dígitos: código do país + DDD + número. */
    whatsapp: '5531990022025',
    /** Como o número aparece escrito no site. */
    whatsappExibicao: '+55 (31) 99002-2025',
    /** Mensagem padrão ao abrir o WhatsApp. */
    whatsappMensagemPadrao: 'Olá! Gostaria de falar com o escritório Remiggi & Fonseca.',
    email: 'contato@remiggiefonseca.com.br',
    /** E-mail para pedidos relativos a dados pessoais (LGPD). */
    emailPrivacidade: 'contato@remiggiefonseca.com.br',
    horario: 'Atendimento 24 horas, todos os dias.',
    abrangencia: 'Atendemos todo o Brasil, on-line.',
  },

  /**
   * Endereço físico (opcional). Só é exibido quando `logradouro` estiver preenchido.
   * O escritório hoje opera de forma remota; deixe em branco se não houver endereço público.
   */
  endereco: {
    logradouro: '', // ex.: 'Rua Exemplo, 123, sala 4'
    bairro: '',
    cidade: '', // ex.: 'Belo Horizonte'
    uf: '', // ex.: 'MG'
    cep: '',
  },

  /**
   * Perfis públicos. Cada link só aparece quando preenchido.
   * Use a URL completa (https://...).
   */
  redes: {
    google: 'https://share.google/nfqRKy0CO9lMFHDtv',
    instagram: '',
    linkedin: '',
    facebook: '',
    youtube: '',
  },

  /* ---------- Integrações ---------- */
  integracoes: {
    /**
     * Google Analytics 4 — ID de medição no formato G-XXXXXXXXXX.
     * Só é carregado depois que o visitante clica em "Aceitar" no aviso de cookies.
     */
    ga4Id: '[PREENCHER]',
    /**
     * Web3Forms — chave de acesso (access key) gerada em https://web3forms.com.
     * Enquanto não estiver preenchida, o formulário abre o WhatsApp com a mensagem montada.
     */
    web3formsKey: '[PREENCHER]',
  },

  /* ---------- Política de Privacidade ---------- */
  privacidade: {
    /** Data da última atualização da política (texto livre). */
    atualizadaEm: '[DATA DA ÚLTIMA ATUALIZAÇÃO]',
    /** Encarregado pelo tratamento de dados (DPO). */
    encarregado: '[NOME DO ENCARREGADO PELO TRATAMENTO DE DADOS]',
    /** Por quanto tempo as mensagens recebidas pelo formulário/WhatsApp/e-mail são guardadas. */
    prazoRetencaoContatos: '[PRAZO DE RETENÇÃO DAS SOLICITAÇÕES DE CONTATO]',
    /** Retenção configurada na propriedade do GA4 (2 ou 14 meses). */
    prazoRetencaoAnalytics: '[2 OU 14 MESES]',
    /** Empresa que hospeda o site (ex.: Cloudflare, Netlify, Vercel). */
    hospedagem: '[PROVEDOR DE HOSPEDAGEM]',
  },
} as const;

/** Retorna true quando o valor foi preenchido de verdade (não vazio e não marcado com colchetes). */
export function preenchido(valor: unknown): valor is string {
  return typeof valor === 'string' && valor.trim() !== '' && !/^\s*\[.*\]\s*$/.test(valor);
}

/** Monta o link do WhatsApp com mensagem pré-preenchida. Retorna null se o número não estiver configurado. */
export function linkWhatsApp(mensagem: string = site.contato.whatsappMensagemPadrao): string | null {
  if (!preenchido(site.contato.whatsapp)) return null;
  return `https://wa.me/${site.contato.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

/** URL absoluta a partir de um caminho interno ("/contato/"). */
export function urlAbsoluta(caminho: string): string {
  return new URL(caminho, site.dominio + '/').toString();
}
