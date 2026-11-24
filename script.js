const opening = document.querySelector('#opening');
const envelope = document.querySelector('#envelope');
const openInvitation = document.querySelector('#openInvitation');
const openingHint = document.querySelector('#openingHint');
const backgroundMusic = document.querySelector('#backgroundMusic');
const musicToggle = document.querySelector('#musicToggle');
let openingTimers = [];
let musicFailed = false;

function updateMusicToggle() {
  const isPlaying = !backgroundMusic.paused;
  const label = isPlaying ? 'Arrêter la musique' : 'Relancer la musique';
  musicToggle.setAttribute('aria-label', label);
  musicToggle.setAttribute('aria-pressed', String(isPlaying));
  musicToggle.title = label;
}

function updateOpeningHint(message) {
  if (!musicFailed) openingHint.textContent = message;
}

function startBackgroundMusic() {
  backgroundMusic.volume = 0.35;
  backgroundMusic.play().catch((error) => {
    musicFailed = true;
    openingHint.textContent = 'La musique n’a pas pu démarrer.';
    console.error('Impossible de lancer la musique de fond.', error);
  });
}

function dismissOpening() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  openingTimers.forEach(window.clearTimeout);
  openingTimers = [];
  document.querySelector('.page-content').classList.add('is-revealed');
  musicToggle.classList.add('is-visible');
  opening.classList.add('is-leaving');
  window.setTimeout(() => {
    opening.hidden = true;
    document.querySelector('#accueil').focus({ preventScroll: true });
  }, reducedMotion ? 0 : 1600);
}

openInvitation.addEventListener('click', () => {
  if (envelope.classList.contains('is-unsealing') || envelope.classList.contains('is-open')) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  startBackgroundMusic();
  envelope.classList.add('is-unsealing');
  updateOpeningHint('Le sceau se brise doucement…');
  openingTimers.push(window.setTimeout(() => {
    envelope.classList.remove('is-unsealing');
    envelope.classList.add('is-open');
    updateOpeningHint('Votre invitation se dévoile…');
  }, reducedMotion ? 0 : 360));
  openingTimers.push(window.setTimeout(() => {
    opening.classList.add('is-revealing');
    updateOpeningHint('Découvrez votre invitation…');
  }, reducedMotion ? 0 : 1900));
  openingTimers.push(window.setTimeout(dismissOpening, reducedMotion ? 400 : 3650));
});

backgroundMusic.addEventListener('play', updateMusicToggle);
backgroundMusic.addEventListener('pause', updateMusicToggle);
musicToggle.addEventListener('click', () => {
  if (backgroundMusic.paused) {
    startBackgroundMusic();
  } else {
    backgroundMusic.pause();
  }
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

const revealTargets = document.querySelectorAll([
  '.invitation__topline',
  '.invitation__eyebrow',
  '.invitation__body h2',
  '.invitation__message',
  '.invitation__signature',
  '.invitation__bottom',
  '.countdown > .eyebrow',
  '.countdown__unit',
  '.countdown__note',
  '.details__intro > *',
  '.details__row',
  '.details__actions',
  '.portrait__image-wrap',
  '.portrait__caption > *',
  '.footer > *',
].join(','));

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  revealTargets.forEach((target) => {
    target.classList.add('scroll-reveal');
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
}
