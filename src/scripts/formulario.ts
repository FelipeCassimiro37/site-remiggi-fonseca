/**
 * Envio do formulário de contato.
 * 1. Com a chave do Web3Forms: envia por e-mail (https://api.web3forms.com/submit).
 * 2. Sem a chave: abre o WhatsApp com a mensagem montada.
 * Em caso de erro no envio, oferece o WhatsApp como alternativa.
 */
import { config } from './config-cliente';
import { rastrear } from './analytics';

type Campo = 'nome' | 'telefone' | 'assunto' | 'mensagem' | 'consentimento';

const MENSAGENS: Record<Campo, string> = {
  nome: 'Informe seu nome.',
  telefone: 'Informe um telefone ou WhatsApp com DDD.',
  assunto: 'Selecione o assunto.',
  mensagem: 'Escreva um breve resumo da solicitação.',
  consentimento: 'É necessário concordar com a Política de Privacidade para enviar.',
};

function escapar(texto: string) {
  const d = document.createElement('div');
  d.textContent = texto;
  return d.innerHTML;
}

function linkWhats(texto: string): string | null {
  const numero = config().whatsapp;
  return numero ? `https://wa.me/${numero}?text=${encodeURIComponent(texto)}` : null;
}

export function iniciarFormulario() {
  const form = document.querySelector<HTMLFormElement>('[data-form-contato]');
  if (!form) return;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const botao = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;

  const campo = (nome: Campo) => form.elements.namedItem(nome) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  const erroDe = (nome: Campo) => form.querySelector<HTMLElement>(`[data-erro-para="${nome}"]`)!;

  function validarCampo(nome: Campo): boolean {
    const el = campo(nome);
    let ok: boolean;
    if (nome === 'consentimento') ok = (el as HTMLInputElement).checked;
    else if (nome === 'telefone') ok = el.value.replace(/\D/g, '').length >= 10;
    else ok = el.value.trim().length > 0;
    const erro = erroDe(nome);
    el.setAttribute('aria-invalid', String(!ok));
    erro.hidden = ok;
    erro.textContent = ok ? '' : MENSAGENS[nome];
    return ok;
  }

  const campos: Campo[] = ['nome', 'telefone', 'assunto', 'mensagem', 'consentimento'];
  campos.forEach((n) => {
    const el = campo(n);
    // Revalida enquanto a pessoa digita (e não no blur), para o layout não mudar no meio de um clique.
    const evento = n === 'consentimento' || n === 'assunto' ? 'change' : 'input';
    el.addEventListener(evento, () => {
      if (el.getAttribute('aria-invalid') !== null) validarCampo(n);
    });
  });

  function mostrar(tipo: 'sucesso' | 'erro', html: string) {
    status.dataset.tipo = tipo;
    status.innerHTML = html;
    status.focus();
  }

  function montarTexto(d: Record<string, string>) {
    return [
      `Olá! Meu nome é ${d.nome}.`,
      `Telefone/WhatsApp: ${d.telefone}`,
      `Assunto: ${d.assunto}`,
      '',
      `Resumo da solicitação: ${d.mensagem}`,
    ].join('\n');
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    status.innerHTML = '';

    const invalidos = campos.filter((n) => !validarCampo(n));
    if (invalidos.length) {
      campo(invalidos[0]).focus();
      return;
    }

    const dados = {
      nome: campo('nome').value.trim(),
      telefone: campo('telefone').value.trim(),
      assunto: campo('assunto').value,
      mensagem: campo('mensagem').value.trim(),
    };

    // Honeypot preenchido: provável robô. Finge sucesso e não envia nada.
    if ((form.elements.namedItem('botcheck') as HTMLInputElement).checked) {
      mostrar('sucesso', 'Mensagem enviada. Obrigado pelo contato.');
      form.reset();
      return;
    }

    const texto = montarTexto(dados);
    const whats = linkWhats(texto);
    const { web3formsKey, nomeSite } = config();

    // Modo 2: sem chave do Web3Forms → WhatsApp.
    if (!web3formsKey) {
      if (!whats) {
        mostrar('erro', 'O envio ainda não está configurado. Entre em contato pelo e-mail informado nesta página.');
        return;
      }
      window.open(whats, '_blank', 'noopener');
      rastrear('form_submit', { metodo: 'whatsapp', assunto: dados.assunto });
      mostrar(
        'sucesso',
        `Abrimos o WhatsApp com a sua mensagem pronta — basta tocar em enviar. ` +
          `Se ele não abriu, <a href="${escapar(whats)}" target="_blank" rel="noopener" data-track="whatsapp" data-origem="formulario">clique aqui para abrir o WhatsApp</a>.`,
      );
      return;
    }

    // Modo 1: Web3Forms.
    botao.disabled = true;
    botao.textContent = 'Enviando…';
    const controle = new AbortController();
    const limite = setTimeout(() => controle.abort(), 15000);
    try {
      const resposta = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: web3formsKey,
          subject: `Novo contato pelo site — ${dados.assunto}`,
          from_name: nomeSite,
          nome: dados.nome,
          telefone: dados.telefone,
          assunto: dados.assunto,
          mensagem: dados.mensagem,
          consentimento: 'Concordou com a Política de Privacidade',
          botcheck: false,
        }),
        signal: controle.signal,
      });
      const json = await resposta.json().catch(() => ({}));
      if (!resposta.ok || !json.success) throw new Error(json.message || `HTTP ${resposta.status}`);

      rastrear('form_submit', { metodo: 'web3forms', assunto: dados.assunto });
      form.reset();
      campos.forEach((n) => campo(n).removeAttribute('aria-invalid'));
      mostrar('sucesso', 'Mensagem enviada. Obrigado pelo contato — retornaremos pelo telefone informado.');
    } catch {
      mostrar(
        'erro',
        'Não foi possível enviar a mensagem agora. ' +
          (whats
            ? `Você pode <a href="${escapar(whats)}" target="_blank" rel="noopener" data-track="whatsapp" data-origem="formulario-erro">enviar a mesma mensagem pelo WhatsApp</a> ou tentar novamente em instantes.`
            : 'Tente novamente em instantes.'),
      );
    } finally {
      clearTimeout(limite);
      botao.disabled = false;
      botao.textContent = botao.dataset.rotuloPadrao || 'Enviar';
    }
  });
}
