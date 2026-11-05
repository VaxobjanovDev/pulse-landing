// Landing page behaviour: the app's Home screen inside the phone, numbers in the visitor's language, small effects.
(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Categories as seeded in the app (src/data/seed.ts): names, colours and icons.
  // Amounts add up to the "spent" figure of the budget card ($1,368 of $1,800).
  var CATS = [
    { id: 'food', amount: 520, limit: 610, color: '#ff7f7f', icon: 'restaurant', name: { en: 'Food & Dining', uz: 'Oziq-ovqat', ru: 'Продукты', es: 'Comida y restaurantes', pt: 'Alimentação', tr: 'Yeme içme', de: 'Essen & Trinken', fr: 'Alimentation', id: 'Makanan & Minuman', ar: 'طعام ومطاعم' } },
    { id: 'utilities', amount: 330, color: '#f5a623', icon: 'home', name: { en: 'Utilities', uz: "Kommunal to'lovlar", ru: 'Коммунальные услуги', es: 'Servicios del hogar', pt: 'Contas da casa', tr: 'Faturalar', de: 'Nebenkosten', fr: 'Factures & Logement', id: 'Tagihan Rumah', ar: 'فواتير وخدمات' } },
    { id: 'transport', amount: 230, color: '#6c8cff', icon: 'car', name: { en: 'Transport', uz: 'Transport', ru: 'Транспорт', es: 'Transporte', pt: 'Transporte', tr: 'Ulaşım', de: 'Transport', fr: 'Transports', id: 'Transportasi', ar: 'مواصلات' } },
    { id: 'entertainment', amount: 175, color: '#b07cff', icon: 'movie', name: { en: 'Entertainment', uz: "Ko'ngilochar", ru: 'Развлечения', es: 'Ocio', pt: 'Lazer', tr: 'Eğlence', de: 'Unterhaltung', fr: 'Loisirs', id: 'Hiburan', ar: 'ترفيه' } },
    { id: 'health', amount: 113, color: '#4cd4a0', icon: 'fitness', name: { en: 'Health', uz: 'Salomatlik', ru: 'Здоровье', es: 'Salud', pt: 'Saúde', tr: 'Sağlık', de: 'Gesundheit', fr: 'Santé', id: 'Kesehatan', ar: 'صحة' } }
  ];
  var BUDGET = 1800, SPENT = 1368, DAYS_LEFT = 12;
  var MONTHS_IN = [{ income: 2400, expense: 1650 }, { income: 2400, expense: 1720 }, { income: 2400, expense: 1368 }];
  // Month names from src/utils/dates.ts (MONTHS and the Russian genitive forms).
  var MONTHS = {
    uz: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'],
    ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    pt: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
    de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    id: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
    ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
  };
  var RU_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  // Sample data for the other tabs, consistent with the Home screen and the landing sections.
  var GOAL = { emoji: '💻', saved: 780, target: 1200, monthly: 140 };
  var GOALS_SAVED = 1180, GOALS_TARGET = 3700, GOALS_MONTHLY = 205;
  function goalName() { return Pulse.t('g_name'); }
  // Weekly bars of the budget cycle (17 Oct – 16 Nov); the 4th week is the current one.
  var WEEKS = [['17–23', 360], ['24–30', 410], ['31–6', 380], ['7–13', 218], ['14–16', 0]];
  var DEBTS = [{ name: 'Alex', type: 'in', total: 600, paid: 300 }, { name: 'Dana', type: 'in', total: 150, paid: 0 }, { name: 'Sam', type: 'out', total: 40, paid: 0 }];
  var WALLETS = [
    { icon: 'payments', primary: true, usd: 640, name: { uz: 'Naqd pul', ru: 'Наличные', en: 'Cash', es: 'Efectivo', pt: 'Dinheiro', tr: 'Nakit', de: 'Bargeld', fr: 'Espèces', id: 'Tunai', ar: 'نقود' } },
    { icon: 'card', usd: 1920, mask: '•• 4821', name: { en: 'Visa' } },
    { icon: 'bank', usd: 918, eur: 850, name: { en: 'EUR' } }
  ];

  // Material Symbols used by the app, as plain SVG paths.
  var ICON = {
    pulse: '<svg viewBox="0 0 24 24" width="18" height="18" style="fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round"><path d="M2 12h4l2.5-6 4 13 3-9 1.5 2H22"/></svg>',
    history: 'M13 3a9 9 0 0 0-9 9H1l3.9 3.9L9 12H6a7 7 0 1 1 2.05 4.95l-1.42 1.42A9 9 0 1 0 13 3zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8z',
    bell: 'M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',
    tune: 'M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z',
    share: 'M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3v2H6v11h12V10h-3V8h3a2 2 0 0 1 2 2z',
    calendar: 'M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zM7 12h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z',
    add: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z',
    swap: 'M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z',
    sparkle: 'M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25z',
    chevron: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
    arrow: 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z',
    trend: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z',
    home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    savings: 'M19.83 7.5l-2.27-2.27c.07-.42.18-.81.32-1.15A1.5 1.5 0 0 0 16.5 2c-1.64 0-3.09.79-4 2h-5C4.46 4 2 6.46 2 9.5S4.5 21 4.5 21H10v-2h2v2h5.5l1.68-5.59 2.82-.94V7.5zM13 9H8V7h5zm3 2a1 1 0 1 1 0-2 1 1 0 0 1 0 2z',
    stats: 'M19.88 18.47c.44-.7.7-1.51.7-2.39a4.5 4.5 0 1 0-4.51 4.5c.88 0 1.7-.26 2.39-.7L21.58 23 23 21.58zm-3.8.11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zM15.72 10.08c-.74.02-1.45.18-2.1.45l-.55-.83-3.8 6.18-3.01-3.52-3.63 5.81L1 17l5-8 3 3.5L13 6zm2.59.5c-.64-.28-1.33-.45-2.05-.49L21.38 2 23 3.18z',
    receipt: 'M19.5 3.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2v14H3v3a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V2zM19 19a1 1 0 0 1-2 0v-3H8V5h11zM9 7h6v2H9zm7 0h2v2h-2zm-7 3h6v2H9zm7 0h2v2h-2z',
    wallet: 'M21 18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1h-9a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2zm-9-2h10V8H12zm4-2.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z',
    restaurant: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z',
    car: 'M18.92 6.01A1.5 1.5 0 0 0 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-8zM6.5 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM5 11l1.5-4.5h11L19 11z',
    movie: 'M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4z',
    trendDown: 'M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z',
    stars: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23z',
    event: 'M17 12h-5v5h5zM16 1v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1zm3 18H5V8h14z',
    payments: 'M19 14V6a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zm-9-1a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm13-6v11a2 2 0 0 1-2 2H4v-2h17V7z',
    pie: 'M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2.03 0v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99zm0 11.01V22c4.74-.47 8.5-4.25 8.97-8.99z',
    bank: 'M4 10v7h3v-7zm6 0v7h3v-7zM2 22h19v-3H2zm14-12v7h3v-7zm-4.5-9L2 6v2h19V6z',
    barchart: 'M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z',
    speed: 'M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44zm-9.79 6.84a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z',
    group: 'M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
    warning: 'M1 21h22L12 2zm12-3h-2v-2h2zm0-4h-2v-4h2z',
    down: 'M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8z',
    up: 'M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8z',
    alarm: 'M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37zM12 4a9 9 0 1 0 .01 18A9 9 0 0 0 12 4zm0 16a7 7 0 1 1 0-14 7 7 0 0 1 0 14z',
    send: 'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z',
    fx: 'M12.89 11.1c-1.78-.59-2.64-.96-2.64-1.9 0-1.02 1.11-1.39 1.81-1.39 1.31 0 1.79.99 1.9 1.34l1.58-.67c-.15-.45-.82-1.92-2.54-2.24V5h-2v1.26c-2.48.56-2.49 2.86-2.49 2.96 0 2.27 2.25 2.91 3.35 3.31 1.58.56 2.28 1.07 2.28 2.03 0 1.13-1.05 1.61-1.98 1.61-1.82 0-2.34-1.87-2.4-2.09l-1.66.67c.63 2.19 2.28 2.78 2.9 2.96V19h2v-1.24c.4-.09 2.9-.59 2.9-3.22 0-1.39-.61-2.61-3.1-3.44zM3 21H1v-6h6v2H4.52c1.61 2.41 4.36 4 7.48 4a9 9 0 0 0 9-9h2c0 6.08-4.92 11-11 11-3.72 0-7.01-1.85-9-4.67zm-2-9C1 5.92 5.92 1 12 1c3.72 0 7.01 1.85 9 4.67V3h2v6h-6V7h2.48C17.87 4.59 15.12 3 12 3a9 9 0 0 0-9 9z',
    addcard: 'M20 4H4a2 2 0 0 0-1.99 2L2 18a2 2 0 0 0 2 2h10v-2H4v-6h18V6a2 2 0 0 0-2-2zm0 4H4V6h16zm4 9v2h-3v3h-2v-3h-3v-2h3v-3h2v3z',
    card: 'M20 4H4a2 2 0 0 0-1.99 2L2 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H4v-6h16zm0-10H4V6h16z',
    bolt: 'M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13.01 3h1l-1 7h3.51c.4 0 .62.19.4.66C12.97 17.55 11 21 11 21z',
    fitness: 'M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z'
  };
  function icon(name, size) {
    if (name === 'pulse') return ICON.pulse;
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '"><path d="' + ICON[name] + '"/></svg>';
  }

  // The app's translate(): {name} parameters and {count|one|other} plurals (src/i18n/index.tsx).
  function tr(key, params) {
    var s = Pulse.app(key);
    params = params || {};
    s = s.replace(/\{(\w+)\|([^|}]*)\|([^}]*)\}/g, function (m, n, one, other) { return n in params ? (Number(params[n]) === 1 ? one : other) : m; });
    return s.replace(/\{(\w+)\}/g, function (m, n) { return n in params ? String(params[n]) : m; });
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function money(n, sign) { return (sign && n > 0 ? '+' : '') + Pulse.money(n); }
  function catName(c) { return c.name[Pulse.lang] || c.name.en; }

  // Bubble slots from HomeCategoryBubblesCard.tsx, in a 330-wide sandbox, biggest spend first.
  var SLOTS = [
    { size: 104, x: 10, y: 50, compact: false },
    { size: 98, x: 218, y: 40, compact: false },
    { size: 90, x: 120, y: 54, compact: false },
    { size: 62, x: 28, y: 8, compact: true },
    { size: 58, x: 150, y: 2, compact: true }
  ];

  // ---------- The app inside the phone: five tab screens ----------
  var screen = document.getElementById('appScreen');
  var app = document.createElement('div');
  app.className = 'app';
  screen.appendChild(app);
  var scroll, sand = null, bubbles = [], scale = 1, appH = 0, tab = 'home';

  // formatDate() from src/utils/dates.ts; the year shows only when it is not the current one.
  var NOW_YEAR = 2026;
  function appDate(y, m, d) {
    var code = Pulse.lang, name = (MONTHS[code] || MONTHS.en)[m - 1];
    var year = y !== NOW_YEAR ? ' ' + y : '';
    switch (code) {
      case 'en': return name + ' ' + d + (year ? ',' + year : '');
      case 'ru': return d + ' ' + RU_GEN[m - 1] + year;
      case 'es': case 'pt': return d + ' de ' + name.toLowerCase() + (year ? ' de' + year : '');
      case 'de': return d + '. ' + name + year;
      case 'fr': return d + ' ' + name.toLowerCase() + year;
      case 'tr': case 'id': case 'ar': return d + ' ' + name + year;
      default: return d + '-' + name.toLowerCase() + year;
    }
  }
  function shortMonth(m) { return (MONTHS[Pulse.lang] || MONTHS.en)[m - 1].slice(0, 3); }

  var TABS = [['home', 'home', 'tabs.home', 'header.home'], ['goals', 'savings', 'tabs.goals', 'header.goals'], ['analytics', 'stats', 'tabs.analytics', 'header.analytics'],
    ['debts', 'receipt', 'tabs.debts', 'header.debts'], ['wallets', 'wallet', 'tabs.wallets', 'header.wallets']];

  function homeScreen() {
    var range = ('17 ' + shortMonth(10) + ' – 16 ' + shortMonth(11)).toUpperCase();
    var pct = Math.round((SPENT / BUDGET) * 100);
    var left = BUDGET - SPENT;
    var net = MONTHS_IN.reduce(function (s, x) { return s + x.income - x.expense; }, 0);
    var max = Math.max.apply(null, MONTHS_IN.map(function (x) { return Math.max(x.income, x.expense); }));
    var food = CATS[0];
    var bars = MONTHS_IN.map(function (x, i) {
      return '<div class="m"><div class="pair"><i style="height:' + Math.round((x.income / max) * 80) + 'px;background:#2f3132"></i><i style="height:' + Math.round((x.expense / max) * 80) + 'px;background:#d4f34a"></i></div><small>' + esc(shortMonth(9 + i)) + '</small></div>';
    }).join('');
    var rows = CATS.map(function (c) {
      var limit = c.limit || 0;
      return '<div class="a-row"><div class="l"><span class="tile" style="background:' + c.color + '">' + icon(c.icon, 18) + '</span><div style="min-width:0"><div class="nm">' + esc(catName(c)) + '</div>' +
        (limit ? '<div class="ok">' + esc(tr('homex.withinLimit')) + '</div>' : '') + '</div></div>' +
        '<div class="r"><div><div class="v num' + (limit ? ' lime' : '') + '">' + money(c.amount) + '</div>' + (limit ? '<div class="lim num">/ ' + money(limit) + '</div>' : '') + '</div>' + icon('chevron', 16) + '</div></div>';
    }).join('');
    return '<div class="a-greet"><div><small>' + esc(tr('home.goodEvening')) + '</small><b>' + esc(tr('home.hello', { name: 'Alex' })) + '</b></div><div class="acts"><span class="a-sq">' + icon('tune', 19) + '</span><span class="a-sq">' + icon('share', 19) + '</span></div></div>' +
      '<div class="a-budget"><div class="top"><span class="a-month">' + icon('calendar', 14) + '<span>' + esc(range) + '</span></span><span class="a-edit">' + esc(tr('home.editBudget')) + '</span></div>' +
        '<div class="lbl">' + esc(tr('home.plannedBudget')) + '</div><div class="amt num">' + money(BUDGET) + '</div>' +
        '<div class="a-prog"><div class="row"><span>' + esc(tr('home.spentOfLimit')) + '</span><b class="num">' + pct + '% (' + money(SPENT) + ')</b></div>' +
        '<div class="a-bar"><i></i></div>' +
        '<div class="row"><span>' + esc(tr('home.remaining')) + ' <b class="x num">' + money(left) + '</b></span><span class="days">' + esc(tr('home.daysLeft', { days: DAYS_LEFT })) + '</span></div>' +
        '<span class="days">' + esc(tr('home.dailyAllowance', { amount: money(Math.round(left / DAYS_LEFT)) })) + '</span></div></div>' +
      '<div class="a-actions"><span class="a-add">' + icon('add', 18) + esc(tr('header.addTransaction')) + '</span><span class="a-tr">' + icon('swap', 20) + esc(tr('walletx.transfer')) + '</span></div>' +
      '<div class="a-chart"><div class="head"><div><div class="t">' + esc(tr('home.incomeVsExpense')) + '</div><div class="s">' + esc(tr('home.lastMonths', { count: 3 })) + '</div></div>' +
        '<div class="net"><small>' + esc(tr('home.netSaved', { count: 3 })) + '</small><span class="a-pill">' + icon('trend', 15) + '<span class="num">' + money(net, true) + '</span></span></div></div>' +
        '<div class="a-bars">' + bars + '</div>' +
        '<div class="a-legend"><span><i style="background:#2f3132"></i>' + esc(tr('common.income')) + '</span><span><i style="background:#d4f34a"></i>' + esc(tr('common.expense')) + '</span></div></div>' +
      '<div class="a-tip"><span class="b">' + icon('sparkle', 12) + esc(tr('insight.badge')) + '</span><p>' + esc(tr('insight.nearLimit', { percent: Math.round((food.amount / food.limit) * 100), category: catName(food) })) + '</p>' +
        '<span class="cta">' + esc(tr('insight.reviewCategory')) + icon('chevron', 14) + '</span></div>' +
      '<div class="a-cats" id="aCats"><div class="head"><div style="min-width:0"><div class="t">' + esc(tr('homex.byCategory')) + '</div><div class="s">' + esc(tr('homex.monthlySplit')) + '</div></div>' +
        '<div class="acts"><span class="a-drag"><i></i>' + esc(tr('homex.dragHint')) + '</span><span class="a-arrow">' + icon('arrow', 16) + '</span></div></div>' +
        '<div class="a-sand" id="aSand"></div><div class="a-rows">' + rows + '</div></div>';
  }

  // GoalsScreen: summary ribbon, the main goal and the Pulse tip.
  function goalsScreen() {
    var g = GOAL, pct = Math.round((g.saved / g.target) * 100), deadline = appDate(2027, 3, 4);
    return '<div class="a-row2"><div class="g-rib a-white"><div class="a-k">' + esc(tr('goalsx.totalSaved')) + '</div><div class="v num">' + money(GOALS_SAVED) + '</div><div class="s num">/ ' + money(GOALS_TARGET) + '</div></div>' +
        '<div class="g-rib a-white"><div class="a-k a-ell">' + esc(tr('goalsx.monthly')) + '</div><div style="display:flex;align-items:baseline;gap:2px"><span class="v num" style="color:#556500">' + money(GOALS_MONTHLY) + '</span><span class="s">' + esc(tr('goalsx.perMonth')) + '</span></div></div></div>' +
      '<div class="g-hero"><div class="g-photo"><span class="g-badge">' + icon('stars', 13) + esc(tr('goalsx.mainBadge')) + '</span>' + g.emoji + '</div>' +
        '<div class="g-body"><div class="g-title">' + esc(goalName()) + ' ' + g.emoji + '</div>' +
          '<div class="g-amts"><div><small>' + esc(tr('goalsx.savedAmount')) + '</small><div class="cur num">' + money(g.saved) + '</div></div><div style="text-align:end"><small>' + esc(tr('goalsx.targetAmount')) + '</small><div class="tgt num">' + money(g.target) + '</div></div></div>' +
          '<div class="g-track"><i style="width:' + pct + '%"></i></div>' +
          '<div class="g-meta-row"><b>' + esc(tr('goalsx.pctCollected', { percent: pct })) + '</b><span class="rem">' + esc(tr('goalsx.moreNeeded', { amount: money(g.target - g.saved) })) + '</span></div>' +
          '<div class="g-box"><div class="g-meta-row"><span>' + icon('calendar', 14) + esc(tr('goalsx.monthlyNeed')) + '</span><b class="num">' + money(g.monthly) + '</b></div>' +
            '<div class="g-meta-row"><span>' + icon('event', 14) + esc(tr('goalsx.deadline')) + '</span><b>' + esc(deadline) + '</b></div></div>' +
          '<div class="g-btns"><span style="flex:1.2;background:#fff">' + icon('add', 16) + esc(tr('goalsx.fill')) + '</span><span style="background:rgba(24,30,0,0.12)">' + icon('payments', 16) + esc(tr('goalsx.withdraw')) + '</span><span style="background:#181e00;color:#fff">' + icon('tune', 16) + esc(tr('goalsx.edit')) + '</span></div>' +
        '</div></div>' +
      '<div class="g-tip"><span class="ic">' + icon('sparkle', 20) + '</span><div><div class="hd"><span class="kk">' + esc(tr('goalsx.tipKicker')) + '</span><span class="tg">' + esc(tr('goalsx.tipTag')) + '</span></div>' +
        '<p>' + esc(tr('goalsx.tipPlanLead', { goal: goalName() })) + '<b class="num">' + money(g.monthly) + '</b>' + esc(tr('goalsx.tipPlanMid', { goal: goalName() })) + '<b>' + esc(deadline) + '</b>' + esc(tr('goalsx.tipPlanTail')) + '</p></div></div>';
  }

  // AnalyticsScreen, "Expenses" mode for the month: top bar, the dark hero card and the weekly bars.
  function analyticsScreen() {
    var pct = Math.round((SPENT / BUDGET) * 100), left = BUDGET - SPENT;
    var maxW = Math.max.apply(null, WEEKS.map(function (w) { return w[1]; })), peak = 0;
    WEEKS.forEach(function (w, i) { if (w[1] > WEEKS[peak][1]) peak = i; });
    var bars = WEEKS.map(function (w, i) {
      var isPeak = i === peak, isNow = i === 3 && !isPeak;
      var h = w[1] > 0 ? Math.max(12, Math.round((w[1] / maxW) * 100)) : 4;
      var cls = isPeak ? ' pk' : isNow ? ' ac' : '';
      return '<div class="c' + cls + '"><small class="num' + cls + '">' + (w[1] > 0 ? money(w[1]) : '—') + '</small><span class="tr"><i style="height:' + h + '%;background:' + (isPeak ? '#ff7f7f' : isNow ? '#d4f34a' : '#eeeef0') + '"></i></span><span class="num">' + w[0] + '</span></div>';
    }).join('');
    return '<div class="n-bar"><span class="n-seg"><span>' + esc(tr('anx.week')) + '</span><span class="on">' + esc(tr('anx.month')) + '</span><span>' + esc(tr('anx.year')) + '</span></span><span class="n-util">' + icon('tune', 18) + '</span></div>' +
      '<div class="n-mode"><span class="on">' + icon('pie', 18) + '<span class="a-ell">' + esc(tr('anx.modeExpenses')) + '</span></span><span>' + icon('bank', 18) + '<span class="a-ell">' + esc(tr('anx.modeDebts')) + '</span></span></div>' +
      '<div class="n-hero"><div class="n-top"><span class="n-lbl"><i></i>' + esc(tr('anx.budgetLabel')) + '</span><span class="n-pill">' + icon('trendDown', 13) + '<span class="a-ell">' + esc(tr('anx.savedBy', { amount: money(left), percent: pct })) + '</span></span></div>' +
        '<div class="n-sub">' + esc(tr('anx.totalMonth')) + '</div><div class="n-amt"><b class="num">' + money(SPENT) + '</b><span>' + esc(tr('anx.planSuffix', { amount: money(BUDGET) })) + '</span></div>' +
        '<div class="n-ok">' + esc(tr('anx.underText', { amount: money(left) })) + '</div>' +
        '<div class="n-track"><i style="width:' + pct + '%"></i></div><div class="n-leg"><i></i>' + esc(tr('anx.withinLegend', { amount: money(BUDGET), percent: pct })) + '</div>' +
        '<div class="n-subs"><div><span class="l">' + icon('tune', 16) + '<span class="a-ell">' + esc(tr('anx.plannedBudget')) + '</span></span><b class="num">' + money(BUDGET) + '</b><span class="s">' + esc(tr('anx.setLimit')) + '</span></div>' +
          '<div><span class="l">' + icon('speed', 16) + '<span class="a-ell">' + esc(tr('anx.dailyAvg')) + '</span></span><b class="num">' + money(Math.round(SPENT / 20)) + '<small>' + esc(tr('anx.perDay')) + '</small></b><span class="s lime">' + esc(tr('anx.daysLeft', { days: DAYS_LEFT })) + '</span></div></div></div>' +
      '<div class="n-vel a-white"><div class="hd"><div class="tt"><span class="n-pod">' + icon('barchart', 16) + '</span><div style="min-width:0"><div class="t">' + esc(tr('anx.velocityTitleMonth')) + '</div><div class="s">' + esc(tr('anx.velocitySubMonth')) + '</div></div></div><span class="n-wk">' + esc(tr('anx.thisMonth')) + '</span></div>' +
        '<div class="n-bars">' + bars + '</div></div>';
  }

  // DebtsScreen, "All" tab: filter chips, the two totals, the net balance and the next debt due.
  function debtsScreen() {
    var inc = DEBTS.filter(function (d) { return d.type === 'in'; }), out = DEBTS.filter(function (d) { return d.type === 'out'; });
    var sum = function (l) { return l.reduce(function (s, d) { return s + d.total - d.paid; }, 0); };
    var owed = sum(inc), owe = sum(out), hero = DEBTS[0], pct = Math.round((hero.paid / hero.total) * 100);
    return '<div class="d-chips"><span class="d-chip on">' + esc(tr('debtsx.tabAll')) + '<em>' + DEBTS.length + '</em></span><span class="d-chip">' + icon('group', 14) + esc(tr('debtsx.tabContacts')) + '<em>' + DEBTS.length + '</em></span><span class="d-chip od">' + icon('warning', 13) + esc(tr('debtsx.tabOverdue')) + '<em>0</em></span></div>' +
      '<div class="d-met"><div><div class="tp"><span class="a-k a-ell" style="color:#76786b">' + esc(tr('debtsx.owedToMe')) + '</span><span class="ar" style="background:#d4f34a;color:#181e00">' + icon('down', 14) + '</span></div><b class="num">' + money(owed) + '</b><div class="ft" style="color:#556500"><i style="background:#556500"></i><span class="a-ell">' + esc(tr('debtsx.peopleWaiting', { count: inc.length })) + '</span></div></div>' +
        '<div><div class="tp"><span class="a-k a-ell" style="color:#76786b">' + esc(tr('debtsx.iOwe')) + '</span><span class="ar" style="background:#ffdad8;color:#410007">' + icon('up', 14) + '</span></div><b class="num" style="color:#a43a3d">' + money(owe) + '</b><div class="ft" style="color:#a43a3d"><i style="background:#a43a3d"></i><span class="a-ell">' + esc(tr('debtsx.obligations', { count: out.length })) + '</span></div></div></div>' +
      '<div class="d-net"><div class="l"><span class="ic">' + icon('bank', 20) + '</span><div style="min-width:0"><div class="t">' + esc(tr('debtsx.netTitle')) + '</div><div class="s">' + esc(tr('debtsx.netSub')) + '</div></div></div><div class="r"><b class="num">' + money(owed - owe, true) + '</b><small>' + esc(tr('debtsx.positive')) + '</small></div></div>' +
      '<div class="d-hero"><div class="tp"><span class="d-alarm">' + icon('alarm', 13) + esc(tr('debts.dueInDays', { days: 5 }).toUpperCase()) + '</span><span class="dt">' + esc(appDate(2026, 11, 10)) + '</span></div>' +
        '<div class="md"><div style="min-width:0"><div class="nm">' + esc(hero.name) + icon('chevron', 18) + '</div><div class="sb">' + esc(tr('debts.owesYou')) + '</div></div><div><div class="rl">' + esc(tr('debtsx.remainingAmount')) + '</div><div class="ra num">' + money(hero.total - hero.paid) + '</div></div></div>' +
        '<div class="pl"><span>' + esc(tr('debtsx.paidPct', { amount: money(hero.paid), percent: pct })) + '</span><span>' + esc(tr('debtsx.total', { amount: money(hero.total) })) + '</span></div><div class="tk"><i style="width:' + pct + '%"></i></div>' +
        '<div class="bt"><span style="background:#181e00;color:#d4f34a">' + icon('send', 18) + esc(tr('debtsx.remind')) + '</span><span style="background:#fff;border:1px solid rgba(0,0,0,0.08)">' + icon('add', 18) + esc(tr('debtsx.pay')) + '</span></div></div>' +
      '<div class="g-tip" style="border-radius:16px"><span class="ic">' + icon('sparkle', 20) + '</span><div><div style="font-size:12px;font-weight:800;margin-bottom:4px">' + esc(tr('debtsx.adviceTitle')) + '</div>' +
        '<p style="font-size:11px;color:#454935">' + esc(tr('debtsx.adviceLead')) + '<b class="num" style="color:#1a1c1d">' + money(owed) + '</b>' + esc(tr('debtsx.adviceMid')) + '<b style="color:#1a1c1d">“' + esc(goalName()) + '”</b>' +
        esc(tr('debtsx.adviceTail', { percent: Math.min(100, Math.round((owed / (GOAL.target - GOAL.saved)) * 100)) })) + '</p></div></div>' +
      '<div class="d-lh"><b>' + esc(tr('debtsx.listTitle')) + '</b><span>' + esc(tr('debtsx.listSub')) + '</span></div>' +
      '<div class="d-card"><div class="hd"><div class="p"><span class="av">D</span><div style="min-width:0"><div class="nm">Dana</div><div class="sb">' + esc(tr('debts.owesYou')) + '</div></div></div><span class="bd">' + esc(tr('debtsx.noDeadline')) + '</span></div>' +
        '<div class="mt"><span>' + esc(tr('debtsx.paidLine')) + '<b class="num">' + money(0) + '</b></span><b class="g num">' + esc(tr('debtsx.left', { amount: money(150) })) + '</b></div><div class="tk"><i style="width:0"></i></div>' +
        '<div class="ft"><span>' + esc(tr('debtsx.closedPct', { percent: 0 })) + '</span><b>' + esc(tr('debtsx.details')) + icon('chevron', 14) + '</b></div></div>';
  }

  // WalletsScreen: total balance, quick actions and the wallet list.
  function walletsScreen() {
    var eur = function (n) { try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n); } catch (e) { return '€' + n; } };
    var total = WALLETS.reduce(function (s, w) { return s + w.usd; }, 0);
    var net = MONTHS_IN[2].income - MONTHS_IN[2].expense;
    var actions = [['addcard', 'walletx.addCard'], ['swap', 'walletx.transfer'], ['payments', 'walletx.pay', true], ['fx', 'walletx.exchange']].map(function (a) {
      return '<div>' + (a[2] ? '<span class="soon">' + esc(tr('walletx.soonBadge')) + '</span>' : '<i class="dot"></i>') + '<span class="ic">' + icon(a[0], 20) + '</span><span>' + esc(tr(a[1])) + '</span></div>';
    }).join('');
    var items = WALLETS.map(function (w) {
      var name = w.name[Pulse.lang] || w.name.en || w.name;
      var sub = [w.primary ? tr('walletx.primary') : null, w.mask || null].filter(Boolean).join(' • ');
      return '<div class="w-item"><div class="l"><span class="ic' + (w.primary ? ' pri' : '') + '">' + icon(w.icon, 20) + '</span><div style="min-width:0"><div class="t a-ell">' + esc(name) + '</div>' + (sub ? '<div class="s">' + esc(sub) + '</div>' : '') + '</div></div><b class="num">' + (w.eur ? eur(w.eur) : money(w.usd)) + '</b></div>';
    }).join('');
    return '<div class="w-hero"><div class="w-top"><span class="w-k"><i></i>' + esc(tr('walletx.total')) + '</span><span class="w-cur">' + icon('fx', 16) + 'USD</span></div>' +
        '<div class="w-bal num">' + money(total) + '</div><div class="w-note">' + esc(tr('fx.totalApprox')) + '</div>' +
        '<div class="w-trend"><span>' + icon('trend', 15) + '<span class="num">' + money(net, true) + '</span></span><span>' + esc(tr('walletx.monthNet')) + '</span></div></div>' +
      '<div class="w-qa a-white">' + actions + '</div>' +
      '<div class="w-list a-white"><div class="hd"><span>' + icon('wallet', 20) + esc(tr('walletx.listTitle')) + '</span><span class="ct">' + WALLETS.length + '</span></div><div>' + items + '</div></div>' +
      '<div class="w-list a-white"><div class="hd"><span>' + icon('barchart', 20) + esc(tr('walletx.budgetTitle')) + '</span><span class="ct" style="background:rgba(212,243,74,0.3)">Money Tracker</span></div>' +
        '<div class="w-lim"><div class="r"><span>' + esc(tr('walletx.limitLabel')) + '</span><b class="num">' + money(SPENT) + ' / ' + money(BUDGET) + '</b></div><div class="tk"><i style="width:' + Math.round((SPENT / BUDGET) * 100) + '%"></i></div>' +
          '<div class="r"><b class="g">' + esc(tr('walletx.spentPct', { percent: Math.round((SPENT / BUDGET) * 100) })) + '</b><span>' + esc(tr('walletx.leftAmount', { amount: money(BUDGET - SPENT) })) + '</span></div></div>' +
        '<div class="w-sw"><span class="ic">' + icon('bell', 18) + '</span><div style="flex:1;min-width:0"><div class="t">' + esc(tr('walletx.alertTitle')) + '</div><div class="s">' + esc(tr('walletx.alertSub', { percent: 90 })) + '</div></div><i class="sw"></i></div></div>';
  }

  var SCREENS = { home: homeScreen, goals: goalsScreen, analytics: analyticsScreen, debts: debtsScreen, wallets: walletsScreen };

  function build() {
    var current = TABS.filter(function (t) { return t[0] === tab; })[0];
    var tabs = TABS.map(function (t) {
      return '<button type="button" class="a-tab' + (t[0] === tab ? ' on' : '') + '" data-tab="' + t[0] + '" aria-pressed="' + (t[0] === tab) + '">' + icon(t[1], 22) + '<span>' + esc(tr(t[2])) + '</span></button>';
    }).join('');
    // The header shows the PRO button on Goals and Wallet for free users, like the app.
    var pro = tab === 'goals' || tab === 'wallets' ? '<span class="a-pro">' + icon('bolt', 15) + 'PRO</span>' : '';

    app.innerHTML =
      '<div class="a-status"><span>9:41</span><span><i style="width:16px;height:9px"></i><i style="width:3px;height:9px;opacity:.5"></i><i style="width:22px;height:11px;border-radius:3px"></i></span></div>' +
      '<div class="a-header"><div class="left"><span class="a-logo">' + icon('pulse') + '</span><div><div class="a-kicker">PULSE</div><div class="a-title">' + esc(tr(current[3])) + '</div></div></div>' +
        '<div class="right">' + pro + '<span class="a-ibtn">' + icon('history', 22) + '</span><span class="a-ibtn">' + icon('bell', 22) + '<i class="a-dot"></i></span><span class="a-ava">A</span></div></div>' +
      '<div class="a-scroll">' + SCREENS[tab]() + '</div>' +
      '<div class="a-tabs">' + tabs + '</div><i class="a-home"></i>';

    scroll = app.querySelector('.a-scroll');
    sand = app.querySelector('#aSand');
    var btns = app.querySelectorAll('.a-tab');
    for (var i = 0; i < btns.length; i++) btns[i].addEventListener('click', onTab);
    if (sand) buildBubbles(); else bubbles = [];
    fit();
    goTo(tab === 'home' ? stage : 0, true);
  }

  function switchTo(next) {
    tab = next;
    stage = 0;
    build();
    scroll.classList.add('a-fade');
  }

  function onTab(e) {
    var next = e.currentTarget.getAttribute('data-tab');
    // A click by the visitor pauses the tour, so the screen they picked stays put for a while.
    touched = Date.now();
    if (next !== tab) switchTo(next);
    cycle();
  }

  // ---------- Bubbles: drag, throw, tilt; they drift back to their slot like the app ----------
  function buildBubbles() {
    var keep = {};
    bubbles.forEach(function (b) { keep[b.id] = b; });
    bubbles = CATS.map(function (c, i) {
      var slot = SLOTS[i];
      var old = keep[c.id];
      var el = document.createElement('div');
      el.className = 'a-bub';
      el.style.width = el.style.height = slot.size + 'px';
      el.style.background = c.color;
      el.innerHTML = slot.compact
        ? icon(c.icon, 18) + '<span class="cv num">' + money(c.amount) + '</span>'
        : '<span class="ic">' + icon(c.icon, 15) + '</span><span class="n">' + esc(catName(c)) + '</span><span class="v num">' + money(c.amount) + '</span>';
      sand.appendChild(el);
      var b = old || { id: c.id, x: 0, y: 0, vx: 0, vy: 0, phase: i * 1.7 };
      b.el = el; b.size = slot.size; b.slot = slot; b.r = slot.size / 2;
      attachDrag(b);
      return b;
    });
  }

  var SW = 343, SH = 190;
  function homeOf(b) { return { x: Math.min(b.slot.x * (SW / 330), SW - b.size) + b.r, y: b.slot.y + b.r }; }
  function placeAtHome() { bubbles.forEach(function (b) { var h = homeOf(b); if (!b.placed) { b.x = h.x; b.y = h.y; b.placed = true; } }); }

  var drag = null, lastX = 0, lastY = 0, gx = 0, gy = 0, touched = 0;
  function local(e) { var r = sand.getBoundingClientRect(); return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale }; }
  function attachDrag(b) {
    b.el.addEventListener('pointerdown', function (e) {
      var p = local(e);
      drag = b; lastX = p.x; lastY = p.y; touched = Date.now();
      b.el.classList.add('drag');
      b.el.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    b.el.addEventListener('pointermove', function (e) {
      if (drag !== b) return;
      var p = local(e);
      b.vx = (p.x - lastX) * 0.7; b.vy = (p.y - lastY) * 0.7;
      b.x = Math.min(SW - b.r, Math.max(b.r, p.x)); b.y = Math.min(SH - b.r, Math.max(b.r, p.y));
      lastX = p.x; lastY = p.y; touched = Date.now();
      if (reduced) render();
    });
    var end = function () { if (drag === b) { b.el.classList.remove('drag'); drag = null; } };
    b.el.addEventListener('pointerup', end);
    b.el.addEventListener('pointercancel', end);
  }
  window.addEventListener('deviceorientation', function (e) {
    if (e.gamma == null || e.beta == null) return;
    gx = Math.max(-1, Math.min(1, e.gamma / 45)) * 0.25;
    gy = Math.max(-1, Math.min(1, (e.beta - 35) / 45)) * 0.25;
  });

  var t = 0;
  function step() {
    t += 0.016;
    bubbles.forEach(function (b) {
      if (b === drag) return;
      var h = homeOf(b);
      // A gentle float around the slot, and a soft pull back to it.
      var fx = h.x + Math.sin(t * 0.9 + b.phase) * 6, fy = h.y + Math.cos(t * 0.7 + b.phase) * 5;
      b.vx += (fx - b.x) * 0.004 + gx; b.vy += (fy - b.y) * 0.004 + gy;
      b.vx *= 0.94; b.vy *= 0.94;
      b.x += b.vx; b.y += b.vy;
      if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx) * 0.6; }
      if (b.x > SW - b.r) { b.x = SW - b.r; b.vx = -Math.abs(b.vx) * 0.6; }
      if (b.y < b.r) { b.y = b.r; b.vy = Math.abs(b.vy) * 0.6; }
      if (b.y > SH - b.r) { b.y = SH - b.r; b.vy = -Math.abs(b.vy) * 0.6; }
    });
    for (var i = 0; i < bubbles.length; i++) {
      for (var j = i + 1; j < bubbles.length; j++) {
        var p = bubbles[i], q = bubbles[j];
        var dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy) || 0.01, min = p.r + q.r + 2;
        if (d < min) {
          var nx = dx / d, ny = dy / d, push = (min - d) / 2;
          if (p !== drag) { p.x -= nx * push; p.y -= ny * push; p.vx -= nx * 0.3; p.vy -= ny * 0.3; }
          if (q !== drag) { q.x += nx * push; q.y += ny * push; q.vx += nx * 0.3; q.vy += ny * 0.3; }
        }
      }
    }
  }
  function render() {
    bubbles.forEach(function (b) { b.el.style.transform = 'translate(' + (b.x - b.r).toFixed(1) + 'px,' + (b.y - b.r).toFixed(1) + 'px)'; });
  }

  // ---------- Fit the 411-wide screen into the phone ----------
  function fit() {
    scale = screen.clientWidth / 411;
    appH = screen.clientHeight / scale;
    app.style.height = appH + 'px';
    app.style.transform = 'scale(' + scale + ')';
    if (sand) { SW = sand.clientWidth || 343; placeAtHome(); }
    render();
  }

  // ---------- Scroll the screen like a person would: budget first, then the bubbles ----------
  var stage = 0, timer = null;
  function goTo(s, instant) {
    stage = s;
    var y = 0;
    if (s === 1) {
      var cats = app.querySelector('#aCats');
      // Bring the category card just under the floating header.
      y = Math.max(0, Math.min(cats.offsetTop - 122, scroll.offsetHeight - appH + 10));
    }
    if (instant) scroll.style.transition = 'none';
    scroll.style.transform = 'translateY(' + -y + 'px)';
    if (instant) { scroll.offsetHeight; scroll.style.transition = ''; }
  }
  // ---------- The tour: the phone taps through the five tabs by itself ----------
  // Home shows the budget, then scrolls to the bubbles; every other tab stays a few seconds.
  // Then the next tab button is "pressed" and its screen opens, round and round.
  var IDLE = 8000;
  function cycle() {
    clearTimeout(timer);
    if (reduced) return;
    var wait = tab === 'home' ? (stage === 0 ? 3200 : 6000) : 4500;
    timer = setTimeout(function () {
      // Hold still while the phone is off screen or the visitor has just clicked or dragged.
      if (!visible || document.hidden || Date.now() - touched < IDLE) return cycle();
      if (tab === 'home' && stage === 0) { goTo(1); return cycle(); }
      pressNext();
    }, wait);
  }
  function pressNext() {
    var i = 0;
    while (TABS[i][0] !== tab) i++;
    var next = TABS[(i + 1) % TABS.length][0];
    var btn = app.querySelector('.a-tab[data-tab="' + next + '"]');
    if (btn) btn.classList.add('a-press');
    timer = setTimeout(function () { switchTo(next); cycle(); }, 420);
  }

  // Only animate while the phone is on screen.
  var visible = true, running = false;
  function loop() {
    if (!visible) { running = false; return; }
    step(); render(); requestAnimationFrame(loop);
  }
  function start() { if (!running && !reduced) { running = true; requestAnimationFrame(loop); } }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) start(); }).observe(screen);
  }

  // ---------- Floating bubbles in the "live bubbles" section ----------
  var blobBox = document.getElementById('blobs');
  var BLOB_SPOTS = [[6, 8, 150], [52, 2, 118], [42, 46, 104], [2, 58, 92], [70, 58, 78]];
  function renderBlobs() {
    blobBox.innerHTML = CATS.map(function (c, i) {
      var s = BLOB_SPOTS[i];
      return '<div class="blob" style="left:' + s[0] + '%;top:' + s[1] + '%;width:' + s[2] + 'px;height:' + s[2] + 'px;background:' + c.color + ';color:#181e00;animation-delay:' + (-i * 1.3) + 's">' +
        '<div>' + esc(catName(c)) + '<small>' + Pulse.money(c.amount) + '</small></div></div>';
    }).join('');
  }

  // ---------- Facts strip ----------
  var track = document.getElementById('track');
  function renderTrack() {
    var items = '';
    for (var i = 1; i <= 10; i++) items += '<span dir="auto">' + esc(Pulse.t('mq' + i)) + '</span>';
    track.innerHTML = items + items;
  }

  // ---------- Language buttons ----------
  var langBox = document.getElementById('langBtns');
  var sel = document.getElementById('lang');
  for (var j = 0; j < sel.options.length; j++) {
    var o = sel.options[j];
    var btn = document.createElement('button');
    btn.type = 'button'; btn.textContent = o.textContent; btn.setAttribute('data-lang', o.value);
    btn.addEventListener('click', function () {
      sel.value = this.getAttribute('data-lang');
      sel.dispatchEvent(new Event('change'));
    });
    langBox.appendChild(btn);
  }

  // ---------- Numbers in the visitor's language ----------
  function setNumbers() {
    var ms = document.querySelectorAll('[data-m]');
    for (var i = 0; i < ms.length; i++) {
      var el = ms[i];
      el.textContent = (el.getAttribute('data-p') || '') + Pulse.money(parseFloat(el.getAttribute('data-m')), parseInt(el.getAttribute('data-d') || '0', 10));
    }
    document.getElementById('scanDate').textContent = Pulse.date(2026, 11, 4);
  }

  Pulse.onLang(function (code) {
    build();
    setNumbers();
    renderBlobs();
    renderTrack();
    var bs = langBox.querySelectorAll('button');
    for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', bs[i].getAttribute('data-lang') === code ? 'true' : 'false');
  });

  // ---------- Confetti on the goal ----------
  var goalBox = document.getElementById('goalBox');
  var COLORS = ['#d4f34a', '#ff7f7f', '#6c8cff', '#f5a623', '#4cd4a0', '#b07cff'];
  function confetti() {
    if (reduced) return;
    var rect = goalBox.getBoundingClientRect();
    for (var i = 0; i < 34; i++) {
      var c = document.createElement('i');
      c.className = 'confetti';
      c.style.left = (rect.width * 0.32 + Math.random() * 40) + 'px';
      c.style.top = (rect.height * 0.45) + 'px';
      c.style.background = COLORS[i % COLORS.length];
      c.style.setProperty('--dx', (Math.random() * rect.width * 0.9 - rect.width * 0.3) + 'px');
      c.style.setProperty('--dy', (Math.random() * 220 - 170) + 'px');
      c.style.setProperty('--rot', (Math.random() * 540 - 270) + 'deg');
      goalBox.appendChild(c);
      setTimeout(function (el) { el.remove(); }.bind(null, c), 1500);
    }
  }
  document.getElementById('goal').addEventListener('click', confetti);
  if ('IntersectionObserver' in window) {
    var seen = false;
    new IntersectionObserver(function (es) {
      if (!seen && es[0].isIntersecting) { seen = true; setTimeout(confetti, 1500); }
    }, { threshold: 0.6 }).observe(goalBox);
  }

  // ---------- Sticky download bar once the hero is out of view ----------
  var sticky = document.getElementById('sticky');
  var hero = document.querySelector('.hero');
  var end = document.querySelector('.end');
  if ('IntersectionObserver' in window) {
    var heroOut = false, endIn = false;
    var upd = function () { sticky.classList.toggle('show', heroOut && !endIn); };
    new IntersectionObserver(function (es) { heroOut = !es[0].isIntersecting; upd(); }).observe(hero);
    new IntersectionObserver(function (es) { endIn = es[0].isIntersecting; upd(); }).observe(end);
  }

  window.addEventListener('resize', fit);
  cycle();
  start();
})();
