# Site — Remiggi & Fonseca Advogados Associados

Site institucional estático feito com [Astro](https://astro.build). Gera páginas HTML prontas, sem banco de dados e sem servidor próprio.

---

## 1. Como rodar o projeto

Requisitos: **Node.js 22** (ou superior) instalado no computador.

```bash
npm install          # instala as dependências (só na primeira vez)
npm run dev          # abre o site em http://localhost:4321 e atualiza a cada alteração salva
npm run build        # gera a versão final na pasta dist/
npm run preview      # mostra a versão final (dist/) em http://localhost:4321
npm run pendencias   # lista todos os campos de conteúdo ainda não preenchidos
npm run gerar:imagens  # recria a imagem de compartilhamento e os ícones
npm run check        # verifica erros de código
```

---

## 2. Onde editar cada conteúdo

Regra geral: **todo texto ou dado entre colchetes, como `[PREENCHER]`, é tratado como "não preenchido"**. Campos opcionais vazios (`''`) ou entre colchetes simplesmente não aparecem no site. Campos obrigatórios da página Quem somos aparecem com **borda tracejada** até serem preenchidos.

| O que mudar | Arquivo |
|---|---|
| **Contatos, CNPJ, OAB, domínio, endereço, redes sociais, GA4, Web3Forms, dados da Política de Privacidade** | `src/config/site.ts` (arquivo único de configuração) |
| Áreas de atuação (textos, temas, público, mensagem do WhatsApp de cada página) | `src/data/servicos.ts` |
| Página **Quem somos** (título, apresentação, trajetória, valores) | `src/data/quem-somos.ts` |
| Equipe (cartões) | `src/data/equipe.ts` |
| Fotos da equipe | pasta `src/assets/equipe/` |
| Depoimentos | `src/data/depoimentos.json` |
| Perguntas frequentes | `src/data/faq.ts` |
| Textos da página inicial | `src/data/home.ts` |
| Texto da Política de Privacidade | `src/pages/politica-de-privacidade.astro` |
| Cores, fontes e espaçamentos | `src/styles/global.css` (variáveis no topo do arquivo) |
| Itens do menu | `src/lib/navegacao.ts` |

### Equipe

Em `src/data/equipe.ts`, cada pessoa tem:

- **Obrigatórios:** `nome`, `cargo`, `registro` (ex.: `OAB/MG 000.000`), `formacao`, `email`.
- **Opcionais** (só aparecem se preenchidos): `foto`, `bio` (lista de parágrafos), `areasFoco` (lista), `linkedin` (URL completa).

Para a foto: coloque o arquivo em `src/assets/equipe/` (JPG, PNG ou WebP, de preferência quadrado, com no mínimo 600 × 600 px) e escreva só o nome do arquivo no campo `foto`, por exemplo `foto: 'otavio-fonseca.jpg'`. O site gera sozinho as versões otimizadas (AVIF/WebP) em vários tamanhos. Sem foto, o cartão mostra as iniciais.

Para adicionar ou remover uma pessoa, copie ou apague um bloco `{ ... }` inteiro.

### Depoimentos

Em `src/data/depoimentos.json`, adicione um bloco por avaliação **real**:

```json
{
  "autor": "Nome da pessoa",
  "texto": "Texto da avaliação, exatamente como publicado.",
  "nota": 5,
  "fonte": "Google",
  "data": ""
}
```

A média e o total de avaliações exibidos são calculados a partir do arquivo.

### Áreas de atuação

Cada item de `src/data/servicos.ts` cria automaticamente um cartão na página inicial, uma página própria (`/areas-de-atuacao/<slug>/`) e uma opção no campo "Assunto" do formulário. O `slug` é o final do endereço: use letras minúsculas, sem acento, com hífens.

### Imagem de compartilhamento e ícones

`public/og-default.png` (1200 × 630), `public/favicon.ico`, `public/favicon.svg` e `public/apple-touch-icon.png` são gerados por `scripts/gerar-imagens.mjs`. Para mudar textos ou cores, edite as constantes no início desse arquivo e rode `npm run gerar:imagens`.

---

## 3. Como configurar o Google Analytics 4

1. Acesse [analytics.google.com](https://analytics.google.com) com a conta Google do escritório e crie uma **propriedade** para o site.
2. Em **Administrador → Fluxos de dados → Adicionar fluxo → Web**, informe `remiggiefonseca.com.br`.
3. Copie o **ID de medição** (formato `G-XXXXXXXXXX`).
4. Em `src/config/site.ts`, substitua `ga4Id: '[PREENCHER]'` pelo ID, por exemplo `ga4Id: 'G-ABC123XYZ'`.
5. Gere e publique o site novamente (`npm run build`).

**Consentimento:** o script do Google só é carregado depois que o visitante clica em **Aceitar** no aviso de cookies. Quem clica em **Recusar** não é medido. O visitante pode mudar a escolha a qualquer momento pelo link **Preferências de cookies**, no rodapé.

**Eventos enviados:**

| Evento | Quando | Parâmetros |
|---|---|---|
| `whatsapp_click` | clique em qualquer botão ou link de WhatsApp | `origem` (`topo`, `chamada-inicio`, `rodape`, `flutuante`, `contato`, `areas-de-atuacao`, `servico-<área>`, `servico-<área>-rodape`, `formulario`, `formulario-erro`), `pagina` |
| `email_click` | clique em um e-mail | `origem` (`rodape`, `contato`, `equipe`, `politica`), `pagina` |
| `form_submit` | envio do formulário de contato | `metodo` (`web3forms` ou `whatsapp`), `assunto`, `pagina` |

**Recomendado, depois de alguns dias de dados:**

- Em **Administrador → Exibição de dados → Eventos**, marque `whatsapp_click`, `form_submit` e `email_click` como **eventos principais** (conversões).
- Em **Administrador → Exibição de dados → Definições personalizadas**, crie dimensões personalizadas de escopo "Evento" para os parâmetros `origem`, `metodo` e `assunto`. Assim eles aparecem nos relatórios.
- Em **Administrador → Coleta e modificação de dados → Retenção de dados**, escolha 2 ou 14 meses e informe o mesmo prazo em `privacidade.prazoRetencaoAnalytics`, no arquivo de configuração.

---

## 4. Como configurar o Web3Forms (formulário por e-mail)

1. Acesse [web3forms.com](https://web3forms.com), informe o e-mail que deve receber as mensagens (ex.: `contato@remiggiefonseca.com.br`) e confirme.
2. Você receberá uma **Access Key** por e-mail.
3. Em `src/config/site.ts`, substitua `web3formsKey: '[PREENCHER]'` pela chave.
4. Gere e publique o site novamente.

**Enquanto a chave não estiver configurada**, o formulário monta a mensagem com os dados preenchidos e abre o WhatsApp do escritório com o texto pronto. Se o envio pelo Web3Forms falhar, a pessoa vê uma mensagem de erro com um link para enviar o mesmo texto pelo WhatsApp.

A chave do Web3Forms é feita para ficar no código da página e não é um segredo. O formulário também tem um campo oculto anti-spam (honeypot) e exige a caixa de consentimento com a Política de Privacidade.

---

## 5. Como publicar

O site gerado fica na pasta `dist/` e pode ser hospedado em qualquer serviço de site estático.

### Cloudflare Pages (o site atual aparenta estar na Cloudflare)

1. Coloque o projeto em um repositório no GitHub (conta do escritório).
2. No painel da Cloudflare: **Workers & Pages → Criar → Pages → Conectar ao Git** e escolha o repositório.
3. Configuração de build: comando **`npm run build`**, pasta de saída **`dist`**. Em variáveis de ambiente, defina `NODE_VERSION` = `22`.
4. Em **Domínios personalizados**, adicione `remiggiefonseca.com.br` (e `www`, se usado).
5. Cada alteração enviada ao GitHub publica o site automaticamente.

**Atenção ao `robots.txt`:** o site atual exibe um `robots.txt` gerado pela própria Cloudflare ("Managed robots.txt"), sem a linha do sitemap. Depois de publicar, abra `https://remiggiefonseca.com.br/robots.txt` e confira se aparece a linha `Sitemap:`. Se não aparecer, desative em **Segurança → Bots → robots.txt gerenciado** (o nome pode variar no painel).

### Netlify ou Vercel

Importe o repositório, use o comando `npm run build` e a pasta `dist`. Os dois detectam projetos Astro automaticamente.

### Acessos a garantir

Como o código anterior ficou com o antigo desenvolvedor, confirme que o escritório tem acesso direto (login próprio) ao **registro do domínio** (Registro.br), à **conta de hospedagem/DNS** (Cloudflare) e às contas do **Google Analytics** e do **Web3Forms**.

### Depois de publicar

- Envie o sitemap (`https://remiggiefonseca.com.br/sitemap-index.xml`) no [Google Search Console](https://search.google.com/search-console).
- Teste a imagem de compartilhamento colando um link do site em uma conversa do WhatsApp. O WhatsApp e as redes sociais guardam a prévia antiga em cache por algum tempo.
- Valide os dados estruturados em [validator.schema.org](https://validator.schema.org) e no [Teste de pesquisa aprimorada](https://search.google.com/test/rich-results) do Google.

---

## 6. Pendências de conteúdo

Rode `npm run pendencias` para a lista atualizada. Na entrega:

**Configuração (`src/config/site.ts`)**
- [ ] `ga4Id`: ID de medição do Google Analytics 4
- [ ] `web3formsKey`: chave de acesso do Web3Forms
- [ ] `privacidade.atualizadaEm`: data da última atualização da política
- [ ] `privacidade.encarregado`: encarregado pelo tratamento de dados (DPO)
- [ ] `privacidade.prazoRetencaoContatos`: prazo de guarda das solicitações de contato
- [ ] `privacidade.prazoRetencaoAnalytics`: 2 ou 14 meses, conforme o GA4
- [ ] `privacidade.hospedagem`: empresa que hospeda o site
- [ ] Confirmar `razaoSocial` com o contrato social (hoje está igual ao nome do escritório)
- [ ] Opcional: `endereco` e redes sociais (`instagram`, `linkedin`, `facebook`, `youtube`)

**Página Quem somos (`src/data/quem-somos.ts`)**
- [ ] Título da página e parágrafo de apresentação
- [ ] Três parágrafos da trajetória
- [ ] Três valores (título e descrição)

**Equipe (`src/data/equipe.ts` e `src/assets/equipe/`)**
- [ ] Nome, cargo, registro na OAB, formação e e-mail de cada pessoa
- [ ] Fotos
- [ ] Opcional: minibiografia, áreas de foco e LinkedIn

**Revisões**
- [ ] **Política de Privacidade:** revisar o texto e, depois de aprovado, mudar `const minuta = true` para `false` em `src/pages/politica-de-privacidade.astro`. Isso retira o aviso de minuta.
- [ ] Confirmar que os depoimentos, o botão flutuante e os demais elementos de divulgação estão de acordo com as regras de publicidade da OAB (Provimento 205/2021).

---

## 7. Estrutura do projeto

```
public/                    arquivos servidos como estão (ícones, og-default.png)
scripts/
  gerar-imagens.mjs        gera og-default.png, favicon.ico, favicon.svg e apple-touch-icon.png
  pendencias.mjs           lista os campos não preenchidos
src/
  config/site.ts           ← CONFIGURAÇÃO CENTRAL
  data/                    ← CONTEÚDO EDITÁVEL (serviços, equipe, quem somos, FAQ, depoimentos, home)
  assets/equipe/           fotos da equipe (otimizadas no build)
  components/              partes reutilizáveis (cabeçalho, rodapé, formulário, aviso de cookies...)
  layouts/BaseLayout.astro estrutura comum: meta tags, Open Graph, dados estruturados, fontes
  lib/                     dados estruturados (schema.org) e menu
  pages/                   uma página por arquivo; [slug].astro gera as páginas de cada área
  scripts/                 código do navegador: menu, consentimento, GA4 e formulário
  styles/global.css        identidade visual
astro.config.mjs           domínio, URLs com "/" no final e sitemap
```
