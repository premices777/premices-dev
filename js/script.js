// =========================================================
// Mode sombre / clair
// =========================================================
(function initTheme() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const STORAGE_KEY = 'portfolio-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    toggleBtn.setAttribute('aria-pressed', theme === 'light');
  }

  let saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    // localStorage indisponible (mode privé, etc.) : on ignore simplement
  }

  if (saved === 'light' || saved === 'dark') {
    applyTheme(saved);
  } else {
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(prefersLight ? 'light' : 'dark');
  }

  toggleBtn.addEventListener('click', function () {
    const current = root.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      // silencieux si le stockage n'est pas disponible
    }
  });
})();

// =========================================================
// Formulaire de contact (envoi via client mail, sans backend)
// =========================================================
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return; // Cette page n'a pas de formulaire de contact (ex: index.html)
  const status = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Merci de remplir tous les champs.';
      status.classList.remove('success');
      return;
    }

    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours…';
    status.textContent = '';
    status.classList.remove('success');

    const formData = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (data.success) {
          status.textContent = 'Message envoyé, merci ! Je vous réponds rapidement.';
          status.classList.add('success');
          form.reset();
        } else {
          status.textContent = "L'envoi a échoué, réessayez ou écrivez directement par e-mail.";
        }
      })
      .catch(function () {
        status.textContent = "L'envoi a échoué (connexion), réessayez ou écrivez directement par e-mail.";
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      });
  });
})();

// =========================================================
// Année dans le pied de page
// =========================================================
document.getElementById('year').textContent = new Date().getFullYear();

// =========================================================
// Apparition au scroll
// =========================================================
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach(function (el) { observer.observe(el); });
})();
