/**
 * EQUIPE — exibida em /quem-somos/
 *
 * Campos obrigatórios: nome, cargo, registro, formacao, email.
 * Campos opcionais (só aparecem quando preenchidos): foto, bio, areasFoco, linkedin.
 *
 * FOTO: coloque o arquivo (JPG, PNG ou WebP, de preferência quadrado,
 * mínimo 600 × 600 px) na pasta src/assets/equipe/ e informe só o nome
 * do arquivo, ex.: foto: 'otavio-fonseca.jpg'. O site gera automaticamente
 * versões otimizadas (WebP) e com dimensões definidas.
 * Sem foto, o cartão mostra as iniciais.
 *
 * Os dados estruturados (schema.org/Person) só são gerados para quem
 * tiver nome preenchido.
 */

export interface Membro {
  nome: string;
  cargo: string;
  /** Ex.: 'OAB/MG 000.000' */
  registro: string;
  formacao: string;
  email: string;
  foto?: string;
  /** Minibiografia — um item por parágrafo. */
  bio?: string[];
  areasFoco?: string[];
  /** URL completa do perfil. */
  linkedin?: string;
}

export const equipe: Membro[] = [
  {
    nome: '[NOME COMPLETO]',
    cargo: '[CARGO]',
    registro: '[OAB/UF Nº]',
    formacao: '[FORMAÇÃO ACADÊMICA]',
    email: '[E-MAIL]',
    foto: '',
    bio: [],
    areasFoco: [],
    linkedin: '',
  },
  {
    nome: '[NOME COMPLETO]',
    cargo: '[CARGO]',
    registro: '[OAB/UF Nº]',
    formacao: '[FORMAÇÃO ACADÊMICA]',
    email: '[E-MAIL]',
    foto: '',
    bio: [],
    areasFoco: [],
    linkedin: '',
  },
];
