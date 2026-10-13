/**
 * Lista os campos de conteúdo ainda não preenchidos (marcados com [COLCHETES]).
 * Uso: npm run pendencias
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const raiz = new URL('..', import.meta.url).pathname;
const pastas = ['src/config', 'src/data'];
const marcador = /(?:(\w+)\s*:\s*)?['"`](\[[^\]'"`]+\])['"`]/g;
let total = 0;

function arquivos(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? arquivos(p) : [p];
  });
}

for (const pasta of pastas) {
  for (const arq of arquivos(join(raiz, pasta))) {
    const linhas = readFileSync(arq, 'utf8').split('\n');
    linhas.forEach((linha, i) => {
      if (linha.trim().startsWith('//') || linha.trim().startsWith('*')) return;
      for (const m of linha.matchAll(marcador)) {
        total++;
        console.log(`${relative(raiz, arq)}:${i + 1}  ${m[1] ? m[1] + ' → ' : ''}${m[2]}`);
      }
    });
  }
}

const fotos = readdirSync(join(raiz, 'src/assets/equipe')).filter((f) => !f.startsWith('.'));
if (fotos.length === 0) {
  total++;
  console.log('src/assets/equipe/  [nenhuma foto da equipe adicionada]');
}

console.log(total ? `\n${total} pendência(s) de conteúdo.` : '\nNenhuma pendência encontrada.');
