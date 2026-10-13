export function iniciarMenu() {
  const botao = document.querySelector<HTMLButtonElement>('.site-header__toggle');
  const nav = document.getElementById('site-nav');
  if (!botao || !nav) return;

  const definir = (aberto: boolean) => {
    botao.setAttribute('aria-expanded', String(aberto));
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', aberto);
  };

  botao.addEventListener('click', () => definir(botao.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') {
      definir(false);
      botao.focus();
    }
  });
}
