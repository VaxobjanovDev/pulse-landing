// Pulse site: language, theme, store links and scroll reveal. Shared by index, support and privacy.
// A page sets window.PAGE_T = { en: {...}, uz: {...}, ... } before loading this file.
(function () {
  // Store links. The site is published once Pulse is live in both stores, and every text says so.
  // Fill in the App Store URL before publishing; while it is empty the App Store badge links nowhere.
  var STORES = {
    android: 'https://play.google.com/store/apps/details?id=com.gavsiddin.pulse',
    ios: ''
  };

  var LANGS = [
    ['en', 'English'], ['uz', "O'zbekcha"], ['ru', 'Русский'], ['es', 'Español'], ['pt', 'Português'],
    ['tr', 'Türkçe'], ['de', 'Deutsch'], ['fr', 'Français'], ['id', 'Bahasa Indonesia'], ['ar', 'العربية']
  ];
  var LOCALE = { en: 'en-US', uz: 'uz-Latn-UZ', ru: 'ru-RU', es: 'es-ES', pt: 'pt-BR', tr: 'tr-TR', de: 'de-DE', fr: 'fr-FR', id: 'id-ID', ar: 'ar' };

  var COMMON = {
    en: { nav_get: 'Get the app', f_home: 'Home', f_privacy: 'Privacy', f_support: 'Support', f_tag: 'Feel the pulse of your money.', st_get: 'Get it on', st_ios: 'Download on the', theme: 'Switch theme' },
    uz: { nav_get: 'Ilovani olish', f_home: 'Bosh sahifa', f_privacy: 'Maxfiylik', f_support: 'Yordam', f_tag: 'Pulingiz pulsini his qiling.', st_get: 'Yuklab oling', st_ios: 'Yuklab oling', theme: 'Mavzuni almashtirish' },
    ru: { nav_get: 'Скачать', f_home: 'Главная', f_privacy: 'Конфиденциальность', f_support: 'Поддержка', f_tag: 'Почувствуйте пульс своих денег.', st_get: 'Доступно в', st_ios: 'Загрузите в', theme: 'Сменить тему' },
    es: { nav_get: 'Descargar', f_home: 'Inicio', f_privacy: 'Privacidad', f_support: 'Soporte', f_tag: 'Siente el pulso de tu dinero.', st_get: 'Disponible en', st_ios: 'Descárgalo en', theme: 'Cambiar tema' },
    pt: { nav_get: 'Baixar', f_home: 'Início', f_privacy: 'Privacidade', f_support: 'Suporte', f_tag: 'Sinta o pulso do seu dinheiro.', st_get: 'Disponível no', st_ios: 'Baixar na', theme: 'Mudar tema' },
    tr: { nav_get: 'İndir', f_home: 'Ana sayfa', f_privacy: 'Gizlilik', f_support: 'Destek', f_tag: 'Paranın nabzını hisset.', st_get: 'Hemen indir', st_ios: 'İndirin', theme: 'Temayı değiştir' },
    de: { nav_get: 'App laden', f_home: 'Startseite', f_privacy: 'Datenschutz', f_support: 'Hilfe', f_tag: 'Spür den Puls deines Geldes.', st_get: 'Jetzt bei', st_ios: 'Laden im', theme: 'Design wechseln' },
    fr: { nav_get: 'Télécharger', f_home: 'Accueil', f_privacy: 'Confidentialité', f_support: 'Assistance', f_tag: 'Sentez le pouls de votre argent.', st_get: 'Disponible sur', st_ios: 'Télécharger dans', theme: 'Changer de thème' },
    id: { nav_get: 'Unduh', f_home: 'Beranda', f_privacy: 'Privasi', f_support: 'Bantuan', f_tag: 'Rasakan denyut uangmu.', st_get: 'Dapatkan di', st_ios: 'Unduh di', theme: 'Ganti tema' },
    ar: { nav_get: 'حمّل التطبيق', f_home: 'الرئيسية', f_privacy: 'الخصوصية', f_support: 'الدعم', f_tag: 'اشعر بنبض أموالك.', st_get: 'احصل عليه من', st_ios: 'حمّله من', theme: 'تبديل المظهر' }
  };

  if (!STORES.ios) console.warn("Pulse site: STORES.ios is empty, so the App Store badge links nowhere. Set it before publishing.");

  var PAGE = window.PAGE_T || {};
  var APP = window.APP_STR || {};
  var listeners = [];
  var root = document.documentElement;
  root.classList.add('js');

  var Pulse = window.Pulse = {
    lang: 'en',
    stores: STORES,
    ready: false,
    // Called now with the current language, and again on every change.
    onLang: function (fn) { listeners.push(fn); if (Pulse.ready) fn(Pulse.lang); },
    t: function (key) { var l = Pulse.lang; return (PAGE[l] && PAGE[l][key]) || (COMMON[l] && COMMON[l][key]) || (PAGE.en && PAGE.en[key]) || COMMON.en[key] || ''; },
    app: function (key) { return (APP[Pulse.lang] && APP[Pulse.lang][key]) || (APP.en && APP.en[key]) || ''; },
    money: function (n, digits) {
      try {
        return new Intl.NumberFormat(LOCALE[Pulse.lang], { style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol', minimumFractionDigits: digits || 0, maximumFractionDigits: digits || 0 }).format(n);
      } catch (e) { return '$' + n; }
    },
    date: function (y, m, d) {
      // Browsers have no Uzbek month names, so spell them out like the app does.
      if (Pulse.lang === 'uz') {
        var UZ = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
        return y + '-yil ' + d + '-' + UZ[m - 1];
      }
      try { return new Intl.DateTimeFormat(LOCALE[Pulse.lang], { dateStyle: 'long' }).format(new Date(y, m - 1, d)); } catch (e) { return y + '-' + m + '-' + d; }
    }
  };

  // "{=key}" inserts an app string as is, "{key}" inserts it in quotes, "{path}" is the backup menu path.
  function fill(text) {
    return text.replace(/\{(=?)([a-zA-Z0-9_.]+)\}/g, function (_, raw, key) {
      if (key === 'path') return '“' + [Pulse.app('settings.title'), Pulse.app('settings.data'), Pulse.app('data.exportBackup')].join(' → ') + '”';
      var v = Pulse.app(key);
      if (!v) return _;
      return raw ? v : '“' + v + '”';
    });
  }

  // The store of the visitor's device: 'ios', 'android', or null on a computer.
  function platform() {
    var ua = navigator.userAgent || '';
    if (/android/i.test(ua)) return 'android';
    // iPadOS reports itself as a Mac, so a Mac with a touch screen is an iPad.
    if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
    return null;
  }

  function badge(url, small, name) {
    // Without a URL (the App Store link not filled in yet) the badge still looks ready but goes nowhere.
    var href = url ? ' href="' + url + '" target="_blank" rel="noopener"' : '';
    return '<a class="store live"' + href + '><small>' + small + '</small><b>' + name + '</b></a>';
  }

  function renderStores() {
    var os = platform();
    var play = badge(STORES.android, Pulse.t('st_get'), 'Google Play');
    var apple = badge(STORES.ios, Pulse.t('st_ios'), 'App Store');
    // The visitor's own store comes first.
    var html = os === 'ios' ? apple + play : play + apple;
    var boxes = document.querySelectorAll('.stores');
    for (var i = 0; i < boxes.length; i++) boxes[i].innerHTML = html;

    // "Get the app" opens the store of this phone; on a computer it goes to the section with both badges.
    var own = os === 'ios' ? STORES.ios : os === 'android' ? STORES.android : '';
    var section = document.getElementById('get') ? '#get' : './#get';
    var gets = document.querySelectorAll('a.get-app');
    for (var j = 0; j < gets.length; j++) {
      if (own) {
        gets[j].href = own;
        gets[j].target = '_blank';
        gets[j].rel = 'noopener';
      } else {
        gets[j].href = section;
        gets[j].removeAttribute('target');
        gets[j].removeAttribute('rel');
      }
    }
  }

  function apply(code) {
    Pulse.lang = code;
    root.lang = code;
    root.dir = code === 'ar' ? 'rtl' : 'ltr';
    if (Pulse.t('title')) document.title = Pulse.t('title');
    var nodes = document.querySelectorAll('[data-i]');
    for (var i = 0; i < nodes.length; i++) {
      var v = Pulse.t(nodes[i].getAttribute('data-i'));
      if (v) nodes[i].textContent = fill(v);
    }
    var appNodes = document.querySelectorAll('[data-a]');
    for (var k = 0; k < appNodes.length; k++) {
      var a = Pulse.app(appNodes[k].getAttribute('data-a'));
      if (a) appNodes[k].textContent = a;
    }
    var btn = document.getElementById('theme');
    if (btn) btn.setAttribute('aria-label', Pulse.t('theme'));
    renderStores();
    var sel = document.getElementById('lang');
    if (sel) sel.value = code;
    try { localStorage.setItem('pulse-lang', code); } catch (e) {}
    listeners.forEach(function (fn) { fn(code); });
  }

  function pick() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q && COMMON[q]) return q;
    try { var s = localStorage.getItem('pulse-lang'); if (s && COMMON[s]) return s; } catch (e) {}
    var prefs = navigator.languages || [navigator.language || 'en'];
    for (var i = 0; i < prefs.length; i++) {
      var c = String(prefs[i]).toLowerCase().split('-')[0];
      if (COMMON[c]) return c;
    }
    return 'en';
  }

  // Language picker
  var sel = document.getElementById('lang');
  if (sel) {
    LANGS.forEach(function (l) { var o = document.createElement('option'); o.value = l[0]; o.textContent = l[1]; sel.appendChild(o); });
    sel.addEventListener('change', function () {
      apply(sel.value);
      var url = new URL(location.href);
      url.searchParams.set('lang', sel.value);
      history.replaceState(null, '', url);
    });
  }

  // Theme: follows the system until the visitor picks one.
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function effective() { return root.getAttribute('data-theme') || (media && media.matches ? 'dark' : 'light'); }
  function setMeta() { var m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = effective() === 'dark' ? '#0f1112' : '#f9f9fb'; }
  if (!root.getAttribute('data-theme')) root.setAttribute('data-theme', effective());
  if (media && media.addEventListener) media.addEventListener('change', function () {
    var stored = null; try { stored = localStorage.getItem('pulse-theme'); } catch (e) {}
    if (!stored) { root.setAttribute('data-theme', media.matches ? 'dark' : 'light'); setMeta(); }
  });
  var themeBtn = document.getElementById('theme');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = effective() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('pulse-theme', next); } catch (e) {}
    setMeta();
  });
  setMeta();

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    for (var r = 0; r < items.length; r++) io.observe(items[r]);
  } else {
    for (var s = 0; s < items.length; s++) items[s].classList.add('in');
  }

  apply(pick());
  Pulse.ready = true;
})();
