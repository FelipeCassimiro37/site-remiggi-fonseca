/**
 * Gera as imagens de identidade em public/:
 *  - og-default.png        (1200 × 630, imagem de compartilhamento)
 *  - apple-touch-icon.png  (180 × 180)
 *  - favicon.ico           (16, 32 e 48 px)
 *  - favicon.svg           (monograma vetorial)
 * Uso: npm run gerar:imagens
 * Para mudar textos ou cores, edite as constantes abaixo e rode o comando de novo.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const require = createRequire(import.meta.url);
const pub = new URL('../public/', import.meta.url);

const COR = { verde: '#2e3d2c', verdeEscuro: '#212d20', creme: '#f4f1e8', oliva: '#b8b596' };
const TEXTO = {
  nome: 'Remiggi & Fonseca',
  sub: 'Advogados Associados',
  areas: 'Tributário · Cível · Trabalhista · Contratual',
  dominio: 'remiggiefonseca.com.br',
};

const fonte = (peso) =>
  readFileSync(require.resolve(`@fontsource/cormorant-garamond/files/cormorant-garamond-latin-${peso}-normal.woff`));
const fonts = [
  { name: 'Cormorant', data: fonte(500), weight: 500, style: 'normal' },
  { name: 'Cormorant', data: fonte(600), weight: 600, style: 'normal' },
];

const h = (type, style, children) => ({ type, props: { style: { display: 'flex', ...style }, children } });

/** Monograma R|F com moldura. `t` = altura da letra em px. */
function monograma(t, cor) {
  return h(
    'div',
    { alignItems: 'center', border: `${Math.max(1, Math.round(t / 22))}px solid ${cor}`, padding: `${t * 0.16}px ${t * 0.22}px`, gap: t * 0.12, color: cor },
    [
      h('div', { fontSize: t, fontWeight: 600, lineHeight: 1 }, 'R'),
      h('div', { width: Math.max(1, Math.round(t / 26)), height: t * 0.95, backgroundColor: cor }),
      h('div', { fontSize: t, fontWeight: 600, lineHeight: 1 }, 'F'),
    ],
  );
}

async function png(node, w, h2) {
  const svg = await satori(node, { width: w, height: h2, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: w } }).render().asPng();
}

/* ---------- Imagem Open Graph ---------- */
const og = h(
  'div',
  { width: 1200, height: 630, backgroundColor: COR.verde, fontFamily: 'Cormorant', padding: 40 },
  [
    h(
      'div',
      { width: 1120, height: 550, boxSizing: 'border-box', flexDirection: 'column', justifyContent: 'space-between', border: `1px solid rgba(244,241,232,0.35)`, padding: '64px 72px' },
      [
        h('div', { alignItems: 'center', gap: 36 }, [
          monograma(92, COR.creme),
          h('div', { width: 1, height: 130, backgroundColor: 'rgba(244,241,232,0.5)' }),
          h('div', { flexDirection: 'column', gap: 14 }, [
            h('div', { fontSize: 58, fontWeight: 600, letterSpacing: 4, color: COR.creme, textTransform: 'uppercase' }, TEXTO.nome),
            h('div', { fontSize: 26, fontWeight: 600, letterSpacing: 8, color: COR.oliva, textTransform: 'uppercase' }, TEXTO.sub),
          ]),
        ]),
        h('div', { flexDirection: 'column', gap: 22 }, [
          h('div', { width: 96, height: 1, backgroundColor: 'rgba(244,241,232,0.6)' }),
          h('div', { fontSize: 40, fontWeight: 500, color: COR.creme }, TEXTO.areas),
          h('div', { fontSize: 26, fontWeight: 600, letterSpacing: 3, color: COR.oliva }, TEXTO.dominio),
        ]),
      ],
    ),
  ],
);
writeFileSync(new URL('og-default.png', pub), await png(og, 1200, 630));

/* ---------- Ícones ---------- */
const icone = (lado, letra) =>
  h('div', { width: lado, height: lado, backgroundColor: COR.verde, alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant' }, [
    monograma(letra, COR.creme),
  ]);

writeFileSync(new URL('apple-touch-icon.png', pub), await png(icone(180, 70), 180, 180));

// favicon.ico com PNGs embutidos (formato aceito por todos os navegadores atuais).
const tamanhos = [16, 32, 48];
const pngs = [];
for (const t of tamanhos) pngs.push(await png(icone(t, Math.round(t * 0.42)), t, t));
const cabecalho = Buffer.alloc(6 + 16 * pngs.length);
cabecalho.writeUInt16LE(0, 0);
cabecalho.writeUInt16LE(1, 2);
cabecalho.writeUInt16LE(pngs.length, 4);
let deslocamento = cabecalho.length;
pngs.forEach((buf, i) => {
  const o = 6 + i * 16;
  cabecalho.writeUInt8(tamanhos[i], o);
  cabecalho.writeUInt8(tamanhos[i], o + 1);
  cabecalho.writeUInt8(0, o + 2);
  cabecalho.writeUInt8(0, o + 3);
  cabecalho.writeUInt16LE(1, o + 4);
  cabecalho.writeUInt16LE(32, o + 6);
  cabecalho.writeUInt32LE(buf.length, o + 8);
  cabecalho.writeUInt32LE(deslocamento, o + 12);
  deslocamento += buf.length;
});
writeFileSync(new URL('favicon.ico', pub), Buffer.concat([cabecalho, ...pngs]));

// favicon.svg: monograma convertido em vetor (não depende de fontes instaladas).
const svgIcone = await satori(icone(64, 26), { width: 64, height: 64, fonts });
writeFileSync(new URL('favicon.svg', pub), svgIcone);

console.log('Imagens geradas em public/: og-default.png, apple-touch-icon.png, favicon.ico, favicon.svg');
