/** Geração dos dados estruturados (schema.org / JSON-LD). */
import { site, preenchido, urlAbsoluta } from '../config/site';
import { servicos } from '../data/servicos';
import { equipe, type Membro } from '../data/equipe';

const ORG_ID = `${site.dominio}/#organizacao`;
const SITE_ID = `${site.dominio}/#website`;

export function membrosPreenchidos(): Membro[] {
  return equipe.filter((m) => preenchido(m.nome));
}

export function pessoaId(m: Membro): string {
  const slug = m.nome
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${site.dominio}/quem-somos/#${slug}`;
}

/** Organização (LegalService) — presente em todas as páginas. */
export function organizacao() {
  const e = site.endereco;
  const sameAs = Object.values(site.redes).filter(preenchido);
  const membros = membrosPreenchidos();
  const org: Record<string, unknown> = {
    '@type': site.tipoSchema,
    '@id': ORG_ID,
    name: site.nomeCompleto,
    legalName: preenchido(site.razaoSocial) ? site.razaoSocial : undefined,
    url: `${site.dominio}/`,
    logo: urlAbsoluta('/apple-touch-icon.png'),
    image: urlAbsoluta('/og-default.png'),
    description: site.descricaoRodape,
    telephone: preenchido(site.contato.whatsapp) ? `+${site.contato.whatsapp}` : undefined,
    email: preenchido(site.contato.email) ? site.contato.email : undefined,
    taxID: preenchido(site.cnpj) ? site.cnpj : undefined,
    foundingDate: preenchido(site.anoFundacao) ? site.anoFundacao : undefined,
    areaServed: { '@type': 'Country', name: 'Brasil' },
    knowsAbout: servicos.map((s) => s.titulo),
    sameAs: sameAs.length ? sameAs : undefined,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Áreas de atuação',
      itemListElement: servicos.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.titulo,
          url: urlAbsoluta(`/areas-de-atuacao/${s.slug}/`),
        },
      })),
    },
    employee: membros.length ? membros.map((m) => ({ '@id': pessoaId(m) })) : undefined,
  };
  if (preenchido(e.logradouro)) {
    org.address = {
      '@type': 'PostalAddress',
      streetAddress: [e.logradouro, e.bairro].filter(preenchido).join(', '),
      addressLocality: preenchido(e.cidade) ? e.cidade : undefined,
      addressRegion: preenchido(e.uf) ? e.uf : undefined,
      postalCode: preenchido(e.cep) ? e.cep : undefined,
      addressCountry: 'BR',
    };
  }
  return org;
}

export function website() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: `${site.dominio}/`,
    name: site.nomeCompleto,
    inLanguage: 'pt-BR',
    publisher: { '@id': ORG_ID },
  };
}

export interface Migalha {
  nome: string;
  caminho: string;
}

export function breadcrumb(itens: Migalha[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: itens.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.nome,
      item: urlAbsoluta(it.caminho),
    })),
  };
}

export function pessoa(m: Membro) {
  return {
    '@type': 'Person',
    '@id': pessoaId(m),
    name: m.nome,
    jobTitle: preenchido(m.cargo) ? m.cargo : undefined,
    email: preenchido(m.email) ? m.email : undefined,
    identifier: preenchido(m.registro) ? m.registro : undefined,
    description: m.bio?.filter(preenchido).join(' ') || undefined,
    knowsAbout: m.areasFoco?.filter(preenchido).length ? m.areasFoco.filter(preenchido) : undefined,
    sameAs: preenchido(m.linkedin) ? [m.linkedin] : undefined,
    worksFor: { '@id': ORG_ID },
  };
}

export function faqPage(itens: { pergunta: string; resposta: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: itens.map((q) => ({
      '@type': 'Question',
      name: q.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: q.resposta },
    })),
  };
}

export function servicoSchema(slug: string) {
  const s = servicos.find((x) => x.slug === slug)!;
  return {
    '@type': 'Service',
    name: s.titulo,
    description: s.descricaoSeo,
    url: urlAbsoluta(`/areas-de-atuacao/${s.slug}/`),
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Brasil' },
    audience: s.publico.map((p) => ({ '@type': 'Audience', audienceType: p })),
  };
}

/** Junta tudo em um @graph. */
export function grafo(...nos: object[]) {
  return { '@context': 'https://schema.org', '@graph': [organizacao(), website(), ...nos] };
}
