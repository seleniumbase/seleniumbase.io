const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const modal = document.querySelector('#game-modal');
const modalTitle = document.querySelector('#modal-title');
const modalMessage = document.querySelector('#modal-message');
const closeButton = document.querySelector('.modal-close');
const coinButton = document.querySelector('#modal-coin');
let lastFocusedElement = null;

document.querySelectorAll('.play-link').forEach((button) => {
  button.addEventListener('click', () => {
    lastFocusedElement = button;
    modalTitle.textContent = button.dataset.game;
    modalMessage.textContent = `The ${button.dataset.game} cabinet is warming up. Your next high score starts here!`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  });
});

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusedElement) lastFocusedElement.focus();
}

closeButton.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

coinButton.addEventListener('click', () => {
  modalMessage.textContent = 'CONTINUE? Just kidding — this is a demo cabinet. Bring your best button-mashing energy!';
  coinButton.textContent = 'PLAYER 1 READY ✓';
  coinButton.disabled = true;
  coinButton.style.opacity = '.7';
});

// Keep the current year fresh in the footer if the page is reused later.
const footerNote = document.querySelector('.site-footer p');
footerNote.textContent = `© 1985–${new Date().getFullYear()} NEON ARCADE. GAME ON FOREVER.`;
