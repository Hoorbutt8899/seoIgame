/* =====================================================================
   SEOIGAME SEO - script.js
   Sections covered: header, hero, stats, audit, order form, services,
   dev services, cost estimator, DR simulator, packages, footer.
   No external libraries needed.
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. CONFIG  -  EDIT THIS BLOCK FIRST
   --------------------------------------------------------------------- */
var CONFIG = {
  BRAND: 'SEOIGAME',                       // shown in every order message
  WHATSAPP: '10000000000',                  // digits only, with country code
  TELEGRAM_SHARE_URL: 'https://seoigame.com',// link attached to Telegram messages
  EMAIL: 'you@example.com'                  // used for the Gmail buttons
};

/* ---------------------------------------------------------------------
   2. DATA  -  all prices below are SAMPLE values, replace with yours
   --------------------------------------------------------------------- */
var GUARANTEES = {
  m3: { label: '3-Month Refill Guarantee', delivery: '10-15 Days', priceX: 1.0 },
  m6: { label: '6-Month Refill Guarantee', delivery: '10 Days',    priceX: 1.6 },
  y1: { label: '1-Year Refill Guarantee',  delivery: '10 Days',    priceX: 2.4 }
};

var METRICS = {
  DR: { label: 'DR - Domain Rating',    tool: 'Ahrefs', tiers: [['DR 30', 50, ''], ['DR 40', 80, 'Popular'], ['DR 50', 110, ''], ['DR 60', 150, ''], ['DR 70', 220, 'Premium']] },
  DA: { label: 'DA - Domain Authority', tool: 'Moz',    tiers: [['DA 10+', 40, ''], ['DA 20+', 90, 'Popular'], ['DA 30+', 150, ''], ['DA 40+', 230, 'Premium']] },
  TF: { label: 'TF - Trust Flow',       tool: 'Majestic', tiers: [['TF 10', 40, ''], ['TF 20', 90, ''], ['TF 30', 170, 'Popular'], ['TF 40', 280, 'Premium']] }
};

var DEV_PLANS = [
  { name: 'SaaS MVP Build',   price: 'from $2,500', delivery: '6-8 Weeks', guarantee: '30-Day Bug-Fix Warranty', features: ['Product discovery and wireframes', 'User accounts and billing', 'Admin dashboard', 'Responsive UI/UX design', 'SEO-ready code', 'Deployment and documentation'] },
  { name: 'Business Website', price: 'from $400',   delivery: '2-3 Weeks', guarantee: '30-Day Bug-Fix Warranty', features: ['5-10 custom pages', 'Conversion-focused design', 'Mobile-responsive build', 'On-page SEO setup', 'Contact and lead forms', 'Analytics setup'] },
  { name: 'E-commerce Store', price: 'from $1,000', delivery: '4-5 Weeks', guarantee: '30-Day Bug-Fix Warranty', features: ['Store build and custom theme', 'Payment gateway setup', 'Product and category SEO', 'Speed optimization', 'Analytics and pixel setup', 'Training handover'] },
  { name: 'Custom Web App',   price: 'from $2,000', delivery: '6-8 Weeks', guarantee: '30-Day Bug-Fix Warranty', features: ['Custom dashboard or portal', 'Auth and permissions', 'API development', 'Database design', 'Third-party integrations', 'Testing and QA'] }
];

/* Build the authority plans (DR / DA / TF x 3 guarantee periods) from the data above */
var PLANS = { m3: { DR: [], DA: [], TF: [] }, m6: { DR: [], DA: [], TF: [] }, y1: { DR: [], DA: [], TF: [] } };
Object.keys(GUARANTEES).forEach(function (g) {
  Object.keys(METRICS).forEach(function (m) {
    METRICS[m].tiers.forEach(function (t, i) {
      var price = Math.round(t[1] * GUARANTEES[g].priceX / 5) * 5;
      PLANS[g][m].push({
        cls: m,
        catLabel: METRICS[m].label,
        name: t[0],
        price: '$' + price,
        per: '/ one-time',
        label: t[2],
        guarantee: GUARANTEES[g].label,
        delivery: GUARANTEES[g].delivery,
        features: [
          (5 + i * 5) + ' Profile backlinks',
          (5 + i * 5) + ' Social bookmarks',
          (3 + i * 4) + ' Web 2.0 backlinks',
          (1 + i) + (i === 0 ? ' Article submission' : ' Article submissions'),
          (1 + i) + (i === 0 ? ' Contextual PBN backlink' : ' Contextual PBN backlinks'),
          'No spam score increase',
          '2-3 Focus keywords',
          'Before and after ' + m + ' screenshot'
        ]
      });
    });
  });
});

var DEV_ITEMS = DEV_PLANS.map(function (d) {
  return { cls: 'dev', catLabel: 'Software House', name: d.name, price: d.price, per: '/ project',
           label: '', guarantee: d.guarantee, delivery: d.delivery, features: d.features };
});

/* ---------------------------------------------------------------------
   3. HELPERS
   --------------------------------------------------------------------- */
function $(id) { return document.getElementById(id); }
function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

function waUrl(msg) { return 'https://wa.me/' + CONFIG.WHATSAPP + '?text=' + encodeURIComponent(msg); }
function tgUrl(msg) { return 'https://t.me/share/url?url=' + encodeURIComponent(CONFIG.TELEGRAM_SHARE_URL) + '&text=' + encodeURIComponent(msg); }
function gmUrl(msg, subject) {
  return 'https://mail.google.com/mail/?view=cm&to=' + encodeURIComponent(CONFIG.EMAIL) +
         '&su=' + encodeURIComponent(subject || CONFIG.BRAND + ' Inquiry') + '&body=' + encodeURIComponent(msg);
}
function setHref(id, url) { var el = $(id); if (el) el.href = url; }
function stripEmoji(s) { return String(s || '').trim(); }   // kept as a hook in case you add emoji to option labels
function validSite(u) { return /^[\w-]+(\.[\w-]+)+/.test(u.replace(/^https?:\/\//, '')) && u.indexOf(' ') < 0; }

function orderMessage(item, x) {
  x = x || {};
  return 'Hello ' + CONFIG.BRAND + ',\n\nI want to order this service:\n\n' +
    'Service: ' + item.name + '\n' +
    'Category: ' + item.catLabel + '\n' +
    'Price: ' + item.price + '\n' +
    'Guarantee: ' + item.guarantee + '\n' +
    'Delivery: ' + item.delivery + '\n\n' +
    'Included:\n' + item.features.map(function (f) { return '- ' + f; }).join('\n') + '\n\n' +
    'My Website URL: ' + (x.url || '') + '\n' +
    'My Focus Keywords: ' + (x.kw || '') + '\n' +
    'My Target Country: ' + (x.country || '') + '\n' +
    'My Niche: ' + (x.niche || '') + '\n' +
    (x.budget ? 'Project Budget: ' + x.budget + '\n' : '') +
    (x.pay ? 'Payment Method: ' + x.pay + '\n' : '') +
    '\nPlease confirm availability and next steps.';
}
function orderLinks(item, x) {
  var m = orderMessage(item, x);
  return { wa: waUrl(m), tg: tgUrl(m), gm: gmUrl(m, 'Order Request - ' + item.name + ' ' + item.price) };
}

/* ---------------------------------------------------------------------
   4. GENERAL CONTACT LINKS (header, hero, footer, mobile menu)
   --------------------------------------------------------------------- */
(function initContactLinks() {
  var base = 'Hello ' + CONFIG.BRAND + ',\n\nI want details about your SEO authority services.\n\n' +
             'My Website URL:\nMy Focus Keywords:\nMy Target Country:\nMy Niche:\nPlease guide me.';
  ['navWa', 'heroWa', 'footWa', 'mWa'].forEach(function (id) { setHref(id, waUrl(base)); });
  ['navTg', 'heroTg', 'footTg', 'mTg'].forEach(function (id) { setHref(id, tgUrl(base)); });
  setHref('footMail', gmUrl(base));
  $all('[data-brand]').forEach(function (el) { el.textContent = CONFIG.BRAND; });
})();

/* ---------------------------------------------------------------------
   5. HEADER + MOBILE MENU + REVEAL + COUNTERS
   --------------------------------------------------------------------- */
(function initChrome() {
  var header = $('siteHeader');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var ham = $('hamburger'), menu = $('mobileMenu');
  function closeMenu() { ham.classList.remove('open'); menu.classList.remove('open'); ham.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll'); }
  ham.addEventListener('click', function () {
    var open = ham.classList.toggle('open');
    menu.classList.toggle('open', open);
    ham.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('no-scroll', open);
  });
  $all('#mobileMenu a[href^="#"]').forEach(function (a) { a.addEventListener('click', closeMenu); });

  /* reveal on scroll */
  var items = $all('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  /* animated counters */
  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count')), start = null, dur = 1600;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = $all('[data-count]');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else { counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); }); }
})();

/* ---------------------------------------------------------------------
   6. PLAN CARDS + PACKAGES SECTION + ORDER MODAL
   --------------------------------------------------------------------- */
var ITEMS = [];               // every rendered card registers here so buttons can find it by index
function shortCat(item) { return { DR: 'DR', DA: 'DA', TF: 'TF', dev: 'DEV' }[item.cls] || item.cls; }

function cardHTML(item) {
  var id = ITEMS.push(item) - 1;
  return '<article class="plan ' + item.cls + '">' +
    '<div class="topline"><span class="cat">' + shortCat(item) + '</span>' +
    (item.label ? '<span class="tagx">&#9733; ' + item.label + '</span>' : '') + '</div>' +
    '<h3>' + item.name + '</h3>' +
    '<div class="price">' + item.price + ' <small>' + item.per + '</small></div>' +
    '<div class="meta2"><div>Guarantee<b>' + item.guarantee + '</b></div><div>Delivery<b>' + item.delivery + '</b></div></div>' +
    '<ul>' + item.features.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul>' +
    '<div class="auto">Order message auto-fills this exact plan</div>' +
    '<button class="btn gold ord-now" type="button" data-item="' + id + '">Order now</button>' +
    '</article>';
}

var curTab = 'm3', curMetric = 'DR';
function renderPlans() {
  ITEMS.length = 0;                                   // reset registry before re-render
  $('planGrid').innerHTML = PLANS[curTab][curMetric].map(cardHTML).join('');
  $all('#planGrid .plan').forEach(function (c, i) { c.style.animationDelay = (i * 50) + 'ms'; });
}

(function initPackages() {
  $all('#gTabs .tab-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      $all('#gTabs .tab-btn').forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
      b.classList.add('active'); b.setAttribute('aria-selected', 'true');
      curTab = b.getAttribute('data-tab'); renderPlans();
    });
  });
  $all('#mPills .mpill').forEach(function (b) {
    b.addEventListener('click', function () {
      $all('#mPills .mpill').forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
      b.classList.add('active'); b.setAttribute('aria-selected', 'true');
      curMetric = b.getAttribute('data-metric'); renderPlans();
      updateMetricInfo();
    });
  });
  function updateMetricInfo() {
    var m = METRICS[curMetric];
    $('metricInfo').innerHTML = '<b>' + m.label + '</b> &middot; measured with ' + m.tool + '. Pick a guarantee period above, then order any plan below.';
  }
  updateMetricInfo();
  renderPlans();
})();

/* ---- order modal ---- */
(function initOrderModal() {
  var om = $('orderModal'), current = null, lastFocus = null;
  var f = { url: $('omUrl'), kw: $('omKw'), country: $('omCountry'), niche: $('omNiche'), pay: $('omPay'), terms: $('omTerms') };

  function extra() {
    return { url: f.url.value.trim(), kw: f.kw.value.trim(), country: f.country.value.trim(), niche: f.niche.value.trim(), pay: stripEmoji(f.pay.value) };
  }
  function valid() { return validSite(f.url.value.trim()) && f.kw.value.trim().length > 1 && f.terms.checked; }
  function refresh() {
    if (!current) return;
    var l = orderLinks(current, extra());
    $('omWa').href = l.wa; $('omTg').href = l.tg; $('omGm').href = l.gm;
  }
  function open(item) {
    current = item; lastFocus = document.activeElement;
    $('omCat').textContent = item.catLabel;
    $('omName').textContent = item.name;
    $('omPrice').textContent = item.price + ' ' + item.per;
    $('omMeta').innerHTML = '<span>Guarantee: <b>' + item.guarantee + '</b></span><span>Delivery: <b>' + item.delivery + '</b></span>';
    $('omFeats').innerHTML = item.features.map(function (x) { return '<li>' + x + '</li>'; }).join('');
    f.url.value = $('fUrl').value; f.kw.value = $('fKw').value;
    f.country.value = $('fCountry').value; f.niche.value = $('fNiche').value;
    f.pay.value = $('fPay').value; f.terms.checked = true;
    $('omErr').classList.remove('show');
    refresh();
    om.classList.add('open'); om.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    f.url.focus();
  }
  function close() {
    om.classList.remove('open'); om.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  [f.url, f.kw, f.country, f.niche].forEach(function (el) { el.addEventListener('input', refresh); });
  f.pay.addEventListener('change', refresh);
  f.terms.addEventListener('change', refresh);
  ['omWa', 'omTg', 'omGm'].forEach(function (id) {
    $(id).addEventListener('click', function (e) {
      refresh();
      if (!valid()) {
        e.preventDefault();
        $('omErr').classList.add('show');
        var box = om.querySelector('.om-box');
        box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
      }
    });
  });
  om.querySelector('.om-x').addEventListener('click', close);
  om.addEventListener('click', function (e) { if (e.target === om) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && om.classList.contains('open')) close(); });

  /* one delegated listener for every "Order now" button */
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.ord-now') : null;
    if (b) open(ITEMS[parseInt(b.getAttribute('data-item'), 10)]);
  });
})();

/* ---------------------------------------------------------------------
   7. ORDER FORM (main form + summary card)
   --------------------------------------------------------------------- */
var orderForm = (function () {
  var fCat = $('fCat'), fTab = $('fTab'), fPlan = $('fPlan'), fPay = $('fPay');
  var fUrl = $('fUrl'), fKw = $('fKw'), fCountry = $('fCountry'), fNiche = $('fNiche'), fBudget = $('fBudget');

  function isAuthority() { return fCat.value === 'DR' || fCat.value === 'DA' || fCat.value === 'TF'; }
  function isDev() { return fCat.value === 'dev'; }
  function list() { return isAuthority() ? PLANS[fTab.value][fCat.value] : DEV_ITEMS; }
  function item() { return list()[parseInt(fPlan.value || '0', 10)] || list()[0]; }

  function fillPlans() {
    fPlan.innerHTML = list().map(function (it, i) { return '<option value="' + i + '">' + it.name + ' - ' + it.price + '</option>'; }).join('');
  }
  function refresh() {
    var it = item();
    $('sumPlan').textContent = it.name + ' | ' + shortCat(it);
    $('sumGuar').textContent = it.guarantee;
    $('sumDel').textContent = it.delivery;
    $('sumPay').textContent = stripEmoji(fPay.value);
    $('sumPrice').textContent = it.price;
    $('fTabWrap').style.display = isAuthority() ? '' : 'none';
    $('fBudgetWrap').style.display = isDev() ? '' : 'none';
    $('sumBudgetWrap').style.display = isDev() ? '' : 'none';
    if (isDev()) $('sumBudget').textContent = stripEmoji(fBudget.value);
    var l = orderLinks(it, { url: fUrl.value, kw: fKw.value, country: fCountry.value, niche: fNiche.value,
                             pay: stripEmoji(fPay.value), budget: isDev() ? stripEmoji(fBudget.value) : '' });
    $('formWa').href = l.wa; $('formTg').href = l.tg; $('formGm').href = l.gm;
  }
  function setErr(el, on) { var w = el.closest('.f-field'); if (w) w.classList.toggle('err', !!on); }
  function validate() {
    var okUrl = validSite(fUrl.value.trim()), okKw = fKw.value.trim().length > 0, okTerms = $('fTerms').checked;
    setErr(fUrl, !okUrl); setErr(fKw, !okKw);
    $('fTermsRow').classList.toggle('err', !okTerms);
    return okUrl && okKw && okTerms;
  }

  fCat.addEventListener('change', function () { fillPlans(); refresh(); });
  fTab.addEventListener('change', function () { fillPlans(); refresh(); });
  [fPlan, fPay, fBudget].forEach(function (el) { el.addEventListener('change', refresh); });
  [fUrl, fKw, fCountry, fNiche].forEach(function (el) { el.addEventListener('input', function () { setErr(el, false); refresh(); }); });
  $('fTerms').addEventListener('change', function () { $('fTermsRow').classList.remove('err'); });

  ['formWa', 'formTg', 'formGm'].forEach(function (id) {
    $(id).addEventListener('click', function (e) {
      if (!validate()) {
        e.preventDefault();
        var bad = document.querySelector('#order-form .f-field.err input') || $('fTerms');
        bad.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (bad.focus) bad.focus();
      }
    });
  });

  fillPlans(); refresh();

  /* other sections call this to pre-select a plan */
  return {
    selectDev: function (index) {
      fCat.value = 'dev'; fillPlans(); fPlan.value = String(index || 0); refresh();
    },
    setBudget: function (i) { fBudget.selectedIndex = i; refresh(); }
  };
})();

/* dev-service cards: "Order this" buttons pre-select the form */
$all('.dev-order').forEach(function (a) {
  a.addEventListener('click', function () { orderForm.selectDev(parseInt(a.getAttribute('data-plan') || '0', 10)); });
});

/* ---------------------------------------------------------------------
   8. PROJECT COST ESTIMATOR
   --------------------------------------------------------------------- */
(function initEstimator() {
  var EST = { typeIdx: 0, base: 2500, weeks: 6, name: 'SaaS MVP', pages: 8, mult: 1, speed: 'Standard' };

  function addonOn(name) {
    var el = document.querySelector('#eAddons .addon[data-name="' + name + '"]');
    return !!(el && el.classList.contains('on'));
  }
  function calc() {
    var extraPages = Math.max(0, EST.pages - 5);
    var addons = $all('#eAddons .addon.on').map(function (a) { return { name: a.getAttribute('data-name'), price: parseInt(a.getAttribute('data-price'), 10) }; });
    var addonSum = addons.reduce(function (s, a) { return s + a.price; }, 0);
    var mid = (EST.base + extraPages * 50 + addonSum) * EST.mult;
    var weeks = Math.max(1, Math.round((EST.weeks + extraPages * 0.15 + addons.length * 0.5) / (EST.mult > 1 ? 1.25 : 1)));
    var design = 20 + (addonOn('UI/UX Design') ? 10 : 0);
    var content = 6 + (addonOn('SEO Setup') ? 4 : 0) + (addonOn('Copywriting') ? 4 : 0);
    var qa = 10;
    return { lo: mid * 0.95, hi: mid * 1.15, weeks: weeks, addons: addons, design: design, content: content, qa: qa, dev: 100 - design - content - qa };
  }
  function render() {
    var r = calc();
    $('ePrice').textContent = money(r.lo) + ' - ' + money(r.hi);
    $('eWeeks').textContent = r.weeks + (r.weeks === 1 ? ' week' : ' weeks');
    $('eName').textContent = EST.name + ' | ' + EST.speed;
    $('ePagesVal').textContent = EST.pages;
    [['eBarD', 'eBarDv', r.design], ['eBarDev', 'eBarDv2', r.dev], ['eBarC', 'eBarCv', r.content], ['eBarQ', 'eBarQv', r.qa]].forEach(function (b) {
      $(b[0]).style.width = b[2] + '%'; $(b[1]).textContent = b[2] + '%';
    });
    var msg = 'Hello ' + CONFIG.BRAND + ',\n\nI used your Project Cost Estimator:\n\n' +
      'Project Type: ' + EST.name + '\nSize: ' + EST.pages + ' pages / screens\n' +
      'Add-ons: ' + (r.addons.length ? r.addons.map(function (a) { return a.name; }).join(', ') : 'None') + '\n' +
      'Delivery Speed: ' + EST.speed + '\nEstimated Investment: ' + money(r.lo) + ' - ' + money(r.hi) + '\n' +
      'Estimated Timeline: ' + r.weeks + ' weeks\n\nPlease confirm the final quote and next steps.';
    $('estWa').href = waUrl(msg);
  }

  $all('#eTypes .etype').forEach(function (t, i) {
    t.addEventListener('click', function () {
      $all('#eTypes .etype').forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
      t.classList.add('active'); t.setAttribute('aria-pressed', 'true');
      EST.typeIdx = i;
      EST.base = parseInt(t.getAttribute('data-base'), 10);
      EST.weeks = parseInt(t.getAttribute('data-weeks'), 10);
      EST.name = t.getAttribute('data-name');
      render();
    });
  });
  $('ePages').addEventListener('input', function () { EST.pages = parseInt(this.value, 10); paintRange(this); render(); });
  $all('#eAddons .addon').forEach(function (a) {
    a.addEventListener('click', function () { var on = a.classList.toggle('on'); a.setAttribute('aria-pressed', on ? 'true' : 'false'); render(); });
  });
  $all('#eSpeed .speed').forEach(function (s) {
    s.addEventListener('click', function () {
      $all('#eSpeed .speed').forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
      s.classList.add('active'); s.setAttribute('aria-pressed', 'true');
      EST.mult = parseFloat(s.getAttribute('data-mult')); EST.speed = s.getAttribute('data-name');
      render();
    });
  });
  $('estToForm').addEventListener('click', function () {
    var r = calc(), mid = (r.lo + r.hi) / 2;
    orderForm.selectDev(Math.min(EST.typeIdx, DEV_PLANS.length - 1));
    var bands = [[500, 0], [1500, 1], [3000, 2], [6000, 3], [Infinity, 4]];
    for (var i = 0; i < bands.length; i++) { if (mid < bands[i][0]) { orderForm.setBudget(bands[i][1]); break; } }
  });
  paintRange($('ePages'));
  render();
})();

function paintRange(input) {      // fills the left side of a range slider
  var p = (input.value - input.min) / (input.max - input.min) * 100;
  input.style.setProperty('--fill', p + '%');
}

/* ---------------------------------------------------------------------
   9. DR GROWTH SIMULATOR
   --------------------------------------------------------------------- */
(function initSimulator() {
  var state = { cur: 20, boost: 25, shown: 20 };
  var slider = $('drSlider');

  /* background grid lines of the chart */
  var gl = '';
  [0, 25, 50, 75, 100].forEach(function (v) {
    var y = 300 - (v / 100) * 280;
    gl += '<line x1="30" y1="' + y + '" x2="550" y2="' + y + '" class="sg-line"/><text x="4" y="' + (y + 4) + '" class="sg-txt">' + v + '</text>';
  });
  $('gridLines').innerHTML = gl;

  function path(cur, proj) {
    var pts = [];
    for (var i = 0; i <= 60; i++) {
      var t = i / 60, v = cur + (proj - cur) * (1 - Math.pow(1 - t, 2.4));
      pts.push([30 + t * 520, 300 - (v / 100) * 280]);
    }
    var d = 'M' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' L');
    return { line: d, area: d + ' L550,300 L30,300 Z', end: pts[60] };
  }
  function draw(proj) {
    var p = path(state.cur, proj);
    $('simLine').setAttribute('d', p.line);
    $('simArea').setAttribute('d', p.area);
    $('simDot').setAttribute('cx', p.end[0]); $('simDot').setAttribute('cy', p.end[1]);
    $('simLbl').setAttribute('x', p.end[0] - 46); $('simLbl').setAttribute('y', p.end[1] - 14);
    $('simLbl').textContent = 'DR ' + Math.round(proj);
    $('gaugeNum').textContent = Math.round(proj);
    $('drProj').textContent = Math.round(proj);
    var deg = Math.min(proj, 100) / 100 * 360;
    $('gauge').style.background = 'conic-gradient(var(--accent) 0deg, var(--brand-l) ' + deg + 'deg, var(--gauge-track) ' + deg + 'deg)';
  }
  var anim = null;
  function update() {
    var proj = Math.min(92, state.cur + state.boost);
    $('drCur').textContent = state.cur;
    var from = state.shown, t0 = null;
    cancelAnimationFrame(anim);
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / 700, 1), v = from + (proj - from) * (1 - Math.pow(1 - p, 3));
      draw(v); state.shown = v;
      if (p < 1) anim = requestAnimationFrame(step);
    }
    anim = requestAnimationFrame(step);
    var tier = document.querySelector('.tier.active').getAttribute('data-name');
    setHref('simOrder', waUrl('Hello ' + CONFIG.BRAND + ',\n\nI used your DR Simulator:\nCurrent DR: ' + state.cur + '\nTarget: DR ' + proj + ' (' + tier + ')\n\nMy Website URL:\nMy Focus Keywords:\nMy Target Country:\nMy Niche:\n\nPlease confirm pricing and next steps.'));
  }
  slider.addEventListener('input', function () { state.cur = parseInt(slider.value, 10); paintRange(slider); update(); });
  $all('.tier').forEach(function (t) {
    t.addEventListener('click', function () {
      $all('.tier').forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
      t.classList.add('active'); t.setAttribute('aria-pressed', 'true');
      state.boost = parseInt(t.getAttribute('data-boost'), 10); update();
    });
  });
  paintRange(slider);
  draw(Math.min(92, state.cur + state.boost)); state.shown = Math.min(92, state.cur + state.boost);
  update();
})();

/* ---------------------------------------------------------------------
   10. FREE AUDIT FORM
   --------------------------------------------------------------------- */
(function initAudit() {
  var form = $('auditForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var u = $('aUrl').value.trim(), k = $('aKw').value.trim(), c = $('aContact').value.trim();
    var bad = false;
    [['aUrl', !validSite(u)], ['aContact', !c]].forEach(function (p) { $(p[0]).classList.toggle('bad', p[1]); if (p[1]) bad = true; });
    if (bad) return;
    window.open(waUrl('Hello ' + CONFIG.BRAND + ',\n\nI would like a FREE SEO AUDIT:\n\nWebsite: ' + u + '\nKeyword / Niche: ' + (k || '-') + '\nMy contact: ' + c + '\n\nThank you!'), '_blank', 'noopener');
  });
  $all('#auditForm input').forEach(function (i) { i.addEventListener('input', function () { i.classList.remove('bad'); }); });
})();

/* ---------------------------------------------------------------------
   11. CUSTOM CURSOR (small dot + ring that trails behind and grows on links)
   Skipped automatically on touch screens and for reduced-motion users.
   --------------------------------------------------------------------- */
(function initCursor() {
  if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var dot = document.createElement('div'); dot.className = 'cursor-dot';
  var ring = document.createElement('div'); ring.className = 'cursor-ring';
  dot.setAttribute('aria-hidden', 'true'); ring.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ring); document.body.appendChild(dot);

  var tx = -100, ty = -100, rx = -100, ry = -100;
  window.addEventListener('mousemove', function (e) {
    tx = e.clientX; ty = e.clientY;
    dot.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
    document.body.classList.add('cursor-on');
  }, { passive: true });
  document.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-on'); });
  document.addEventListener('mouseenter', function () { document.body.classList.add('cursor-on'); });

  (function follow() {                       // the ring eases toward the pointer
    rx += (tx - rx) * 0.16; ry += (ty - ry) * 0.16;
    ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
    requestAnimationFrame(follow);
  })();

  var HOVER = 'a, button, select, input, label, .tier, .etype, .addon, .speed, .plan';
  document.addEventListener('mouseover', function (e) { if (e.target.closest && e.target.closest(HOVER)) document.body.classList.add('cursor-hover'); });
  document.addEventListener('mouseout',  function (e) { if (e.target.closest && e.target.closest(HOVER)) document.body.classList.remove('cursor-hover'); });
  document.addEventListener('mousedown', function () { document.body.classList.add('cursor-down'); });
  document.addEventListener('mouseup',   function () { document.body.classList.remove('cursor-down'); });
})();

/* =====================================================================
   CASE STUDIES - AUTO-PLAY (video style)
   REPLACE the earlier case-study JS block with this one (paste at the very end of index.js)
   (it uses waUrl() and CONFIG from the top of index.js)
   ===================================================================== */
(function initCaseStudies() {
  var slider = document.getElementById('csSlider');
  if (!slider) return;
  var track = document.getElementById('csTrack');
  var viewport = document.getElementById('csViewport');
  var slides = Array.prototype.slice.call(track.children);
  var dots = Array.prototype.slice.call(document.querySelectorAll('#csDots .cs-dot'));
  var index = 0, timer = null, paused = false, inView = false;
  var DELAY = 4500;   // milliseconds each case study stays on screen
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var bar = document.createElement('div');
  bar.className = 'cs-progress'; bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = '<i></i>';
  slider.querySelector('.cs-controls').insertAdjacentElement('afterend', bar);
  var barFill = bar.firstChild;
  function restartBar() {
    barFill.style.animation = 'none'; void barFill.offsetWidth;
    barFill.style.animation = (timer && !paused) ? 'csFill ' + DELAY + 'ms linear forwards' : 'none';
  }

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    slides.forEach(function (s, n) {
      var on = n === index;
      s.setAttribute('aria-hidden', on ? 'false' : 'true');
      if ('inert' in s) s.inert = !on;           // keeps hidden slides out of the Tab order
    });
    dots.forEach(function (d, n) {
      d.classList.toggle('active', n === index);
      d.setAttribute('aria-current', n === index ? 'true' : 'false');
    });
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } restartBar(); }
  function start() {
    if (reduced || slides.length < 2 || paused || !inView || document.hidden) return;
    if (timer) clearInterval(timer);
    timer = setInterval(function () { go(index + 1); restartBar(); }, DELAY);
    restartBar();
  }
  // a click on an arrow or dot just jumps there - the video keeps playing afterwards
  function manual(i) { go(i); if (timer) start(); }
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });

  document.getElementById('csPrev').addEventListener('click', function () { manual(index - 1); });
  document.getElementById('csNext').addEventListener('click', function () { manual(index + 1); });
  dots.forEach(function (d, n) { d.addEventListener('click', function () { manual(n); }); });
  slider.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { manual(index - 1); }
    else if (e.key === 'ArrowRight') { manual(index + 1); }
  });

  /* swipe on touch screens and trackpads */
  var x0 = null;
  viewport.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
  viewport.addEventListener('pointerup', function (e) {
    if (x0 === null) return;
    var dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) manual(dx < 0 ? index + 1 : index - 1);
  });
  viewport.addEventListener('pointercancel', function () { x0 = null; });

  /* "Get results like this" buttons -> pre-filled WhatsApp message */
  Array.prototype.forEach.call(document.querySelectorAll('.cs-cta'), function (a, n) {
    var who = slides[n] ? (slides[n].querySelector('.cs-client b') || {}).textContent : '';
    var title = slides[n] ? (slides[n].querySelector('h3') || {}).textContent : '';
    a.href = waUrl('Hello ' + CONFIG.BRAND + ',\n\nI saw your case study (' + (who || 'client') + ': ' + (title || '') + ') and want similar results.\n\nMy Website URL:\nMy Focus Keywords:\nMy Target Country:\nMy Niche:\n\nPlease guide me.');
  });

  /* click a screenshot to view it full size */
  var box = document.createElement('div');
  box.className = 'cs-lightbox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Screenshot full size');
  box.innerHTML = '<button type="button" aria-label="Close">&times;</button><img alt="">';
  document.body.appendChild(box);
  var boxImg = box.querySelector('img'), lastFocus = null;
  function openBox(src, alt) {
    lastFocus = document.activeElement;
    boxImg.src = src; boxImg.alt = alt || '';
    paused = true; stop();
    box.classList.add('open'); document.body.classList.add('no-scroll');
    box.querySelector('button').focus();
  }
  function closeBox() {
    paused = false; start();
    box.classList.remove('open'); document.body.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  Array.prototype.forEach.call(document.querySelectorAll('.cs-shot'), function (b) {
    b.addEventListener('click', function () {
      var img = b.querySelector('img');
      openBox(b.getAttribute('data-zoom') || img.src, img.alt);
    });
  });
  box.addEventListener('click', function (e) { if (e.target === box || e.target.tagName === 'BUTTON') closeBox(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('open')) closeBox(); });

  go(0);
  // plays by itself as soon as the section is on screen, stops when it is off screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { inView = en.isIntersecting; if (inView) start(); else stop(); });
    }, { threshold: 0.35 }).observe(slider);
  } else { inView = true; start(); }
})();