// ─── i18n Engine ───
const i18n = (function() {
  let currentLang = 'nl';

  // Detect language: URL param > localStorage > browser > default nl
  function detectLanguage() {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang && translations[urlLang]) return urlLang;

    const stored = localStorage.getItem('lang');
    if (stored && translations[stored]) return stored;

    const browserLang = (navigator.language || navigator.userLanguage || 'nl').toLowerCase();
    if (browserLang.startsWith('en')) return 'en';

    return 'nl';
  }

  // Get translation by key
  function t(key) {
    return (translations[currentLang] && translations[currentLang][key]) || (translations.nl && translations.nl[key]) || key;
  }

  // Apply translations to all data-i18n elements
  function applyTranslations() {
    // Text content
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });

    // HTML content (for strings containing markup like <span>, <strong>, <br>)
    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-html');
      el.innerHTML = t(key);
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = t(key);
    });

    // Aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-aria');
      el.setAttribute('aria-label', t(key));
    });

    // Alt texts
    document.querySelectorAll('[data-i18n-alt]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-alt');
      el.alt = t(key);
    });

    // Meta tags
    document.title = t('meta.title');
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = t('meta.description');
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = t('meta.og_title');
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = t('meta.og_description');
    var twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.content = t('meta.twitter_title');
    var twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.content = t('meta.twitter_description');
    var ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.content = currentLang === 'en' ? 'en_GB' : 'nl_NL';

    // HTML lang attribute
    document.documentElement.lang = currentLang;

    // Update language switcher buttons
    updateSwitcherButtons();
  }

  // Update the language switcher button labels
  function updateSwitcherButtons() {
    document.querySelectorAll('.lang-switch').forEach(function(btn) {
      if (currentLang === 'nl') {
        btn.innerHTML = '<span class="lang-flag">🇬🇧</span>';
      } else {
        btn.innerHTML = '<span class="lang-flag">🇳🇱</span>';
      }
    });
  }

  // Set language and apply
  function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
  }

  // Toggle between NL and EN
  function toggleLanguage() {
    setLanguage(currentLang === 'nl' ? 'en' : 'nl');
  }

  // Get current language
  function getLang() {
    return currentLang;
  }

  // Initialize
  function init() {
    currentLang = detectLanguage();
    applyTranslations();
    // Remove FOUC prevention
    document.body.classList.add('i18n-ready');
  }

  return {
    t: t,
    setLanguage: setLanguage,
    toggleLanguage: toggleLanguage,
    getLang: getLang,
    init: init
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  i18n.init();
});
