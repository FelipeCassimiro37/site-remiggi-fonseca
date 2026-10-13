/**
 * ÁREAS DE ATUAÇÃO (SERVIÇOS)
 * Cada item gera automaticamente:
 *  - um cartão na página inicial e em /areas-de-atuacao/;
 *  - uma página própria em /areas-de-atuacao/<slug>/;
 *  - uma opção no campo "Assunto" do formulário de contato.
 * Os textos abaixo são os já publicados no site.
 */

export interface Servico {
  /** Parte final da URL. Use letras minúsculas, sem acentos, separadas por hífen. */
  slug: string;
  titulo: string;
  /** Frase curta usada nos cartões da página inicial. */
  resumo: string;
  /** Descrição curta para buscadores (até ~155 caracteres). */
  descricaoSeo: string;
  /** Texto completo (cada item do array é um parágrafo). */
  texto: string[];
  /** Lista de temas tratados. */
  temas: string[];
  /** Público atendido. */
  publico: string[];
  /** Mensagem pré-preenchida do botão de WhatsApp desta página. */
  mensagemWhatsApp: string;
}

export const servicos: Servico[] = [
  {
    slug: 'direito-tributario',
    titulo: 'Direito Tributário',
    resumo:
      'Contencioso administrativo e judicial e consultoria preventiva, incluindo os impactos da reforma tributária (IBS, CBS e transição).',
    descricaoSeo:
      'Contencioso administrativo e judicial e consultoria tributária preventiva, incluindo os impactos da reforma tributária (IBS, CBS e transição).',
    texto: [
      'Atuação em contencioso administrativo e judicial e na consultoria preventiva. Acompanhamos defesas em autos de infração, execuções fiscais, revisão de regimes de tributação e recuperação de valores pagos indevidamente. Também prestamos orientação sobre os impactos da reforma tributária (IBS, CBS e transição) na operação de cada cliente.',
    ],
    temas: [
      'Contencioso administrativo tributário',
      'Contencioso judicial tributário',
      'Consultoria preventiva',
      'Defesas em autos de infração',
      'Execuções fiscais',
      'Revisão de regimes de tributação',
      'Recuperação de valores pagos indevidamente',
      'Impactos da reforma tributária (IBS, CBS e transição)',
    ],
    publico: ['Pessoas físicas', 'Empresas de pequeno e médio porte'],
    mensagemWhatsApp:
      'Olá! Gostaria de falar com o escritório Remiggi & Fonseca sobre uma questão de Direito Tributário.',
  },
  {
    slug: 'direito-civel',
    titulo: 'Direito Cível',
    resumo:
      'Conflitos patrimoniais e obrigacionais em responsabilidade civil, relações de consumo e cobranças, da fase pré-processual ao cumprimento de sentença.',
    descricaoSeo:
      'Conflitos patrimoniais e obrigacionais em responsabilidade civil, relações de consumo e cobranças, da fase pré-processual ao cumprimento de sentença.',
    texto: [
      'Cuidamos de conflitos patrimoniais e obrigacionais, com foco em responsabilidade civil, relações de consumo e cobranças. Analisamos cada caso quanto à viabilidade da via judicial e às alternativas de composição antes mesmo do litígio. A atuação abrange desde a fase pré-processual até o cumprimento efetivo da sentença.',
    ],
    temas: [
      'Conflitos patrimoniais e obrigacionais',
      'Responsabilidade civil',
      'Relações de consumo',
      'Cobranças',
      'Análise de viabilidade da via judicial',
      'Alternativas de composição antes do litígio',
      'Cumprimento de sentença',
    ],
    publico: ['Empresas', 'Pessoas físicas'],
    mensagemWhatsApp:
      'Olá! Gostaria de falar com o escritório Remiggi & Fonseca sobre uma questão de Direito Cível.',
  },
  {
    slug: 'direito-trabalhista',
    titulo: 'Direito Trabalhista',
    resumo:
      'Assessoria a empregadores e empregados: ações e defesas em reclamações trabalhistas e gestão de riscos, jornadas, verbas e enquadramento contratual.',
    descricaoSeo:
      'Assessoria a empregadores e empregados: ações e defesas em reclamações trabalhistas e gestão de riscos, jornadas, verbas e enquadramento contratual.',
    texto: [
      'Assessoramos empregadores e empregados, tanto na relação de trabalho, como na gestão de riscos trabalhistas. Atuamos ajuizando ações e realizando defesas em reclamações trabalhistas, além de prestarmos revisões de práticas internas, jornadas, verbas e enquadramento contratual.',
    ],
    temas: [
      'Ajuizamento de ações trabalhistas',
      'Defesas em reclamações trabalhistas',
      'Gestão de riscos trabalhistas',
      'Revisão de práticas internas',
      'Jornadas de trabalho',
      'Verbas trabalhistas',
      'Enquadramento contratual',
    ],
    publico: ['Empregadores', 'Empregados'],
    mensagemWhatsApp:
      'Olá! Gostaria de falar com o escritório Remiggi & Fonseca sobre uma questão de Direito Trabalhista.',
  },
  {
    slug: 'direito-contratual',
    titulo: 'Direito Contratual',
    resumo:
      'Elaboração, revisão e negociação de contratos empresariais e civis, com atenção às cláusulas de risco e às repercussões tributárias.',
    descricaoSeo:
      'Elaboração, revisão e negociação de contratos empresariais e civis, com atenção às cláusulas de risco e às repercussões tributárias.',
    texto: [
      'Elaboramos, revisamos e negociamos contratos empresariais e civis, com atenção às cláusulas de risco e às repercussões tributárias. O objetivo é dar clareza às obrigações assumidas e antecipar pontos que costumam gerar disputa. Também acompanhamos a execução do contrato e eventuais renegociações.',
    ],
    temas: [
      'Elaboração de contratos',
      'Revisão de contratos',
      'Negociação de contratos',
      'Cláusulas de risco',
      'Repercussões tributárias dos contratos',
      'Acompanhamento da execução contratual',
      'Renegociações',
    ],
    publico: ['Empresas (contratos empresariais)', 'Pessoas físicas (contratos civis)'],
    mensagemWhatsApp:
      'Olá! Gostaria de falar com o escritório Remiggi & Fonseca sobre uma questão de Direito Contratual.',
  },
];
