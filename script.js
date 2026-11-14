const opening = document.querySelector('#opening');
const envelope = document.querySelector('#envelope');
const openInvitation = document.querySelector('#openInvitation');
const openingHint = document.querySelector('#openingHint');
let openingTimers = [];

function dismissOpening() {
  openingTimers.forEach(window.clearTimeout);
  openingTimers = [];
  document.querySelector('.page-content').classList.add('is-revealed');
  opening.classList.add('is-leaving');
  window.setTimeout(() => {
    opening.hidden = true;
    document.querySelector('#accueil').focus({ preventScroll: true });
  }, 1400);
}

openInvitation.addEventListener('click', () => {
  if (envelope.classList.contains('is-unsealing') || envelope.classList.contains('is-open')) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  envelope.classList.add('is-unsealing');
  openingHint.textContent = 'Le sceau se brise doucement…';
  openingTimers.push(window.setTimeout(() => {
    envelope.classList.remove('is-unsealing');
    envelope.classList.add('is-open');
    openingHint.textContent = 'Votre invitation vous attend…';
  }, reducedMotion ? 0 : 360));
  openingTimers.push(window.setTimeout(() => opening.classList.add('is-revealing'), reducedMotion ? 0 : 1300));
  openingTimers.push(window.setTimeout(dismissOpening, reducedMotion ? 400 : 3300));
});

function updateCountdown() {
  const target = new Date('2026-12-04T19:00:00');
  const remaining = target.getTime() - Date.now();
  const values = remaining <= 0
    ? { days: 0, hours: 0, minutes: 0, seconds: 0 }
    : {
        days: Math.floor(remaining / 86400000),
        hours: Math.floor((remaining / 3600000) % 24),
        minutes: Math.floor((remaining / 60000) % 60),
        seconds: Math.floor((remaining / 1000) % 60),
      };

  for (const [unit, value] of Object.entries(values)) {
    document.querySelector(`[data-unit="${unit}"]`).textContent = String(value).padStart(2, '0');
  }
}

updateCountdown();
window.setInterval(updateCountdown, 1000);
