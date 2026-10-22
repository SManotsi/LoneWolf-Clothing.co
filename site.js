/* LoneWolf shared shell: header, footer, bag, wishlist, search, quick view, toasts */
(function () {
  "use strict";
  var P = window.LW_DATA.products;
  var FREE_SHIP = 1000, STANDARD = 80, EXPRESS = 150;
  var CART_KEY = "lonewolf-cart-v2", WISH_KEY = "lonewolf-wish-v1";
  var PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480"><rect width="400" height="480" fill="#DEE4E0"/><g transform="translate(150 190) scale(1.1)"><path d="M14 15 36 25 48 18 60 25 82 15 76 43 82 59 64 79 48 86 32 79 14 59 20 43Z" fill="#17232D" stroke="#D39A5B" stroke-width="3"/></g></svg>');

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function money(n) { return "R" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  function read(key, fallback) { try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch (e) { return fallback; } }
  function write(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ } }
  function byId(id) { for (var i = 0; i < P.length; i++) if (P[i].id === id) return P[i]; return null; }
  function emit() { document.dispatchEvent(new CustomEvent("lw:update")); }

  var ICON = {
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.7 3.6 4.5 6.9 4.5c2 0 3.7 1.1 5.1 3 1.4-1.9 3.1-3 5.1-3 3.3 0 5.3 3.2 4.1 6.6-1.7 4.8-9.2 9.4-9.2 9.4Z"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>'
  };

  /* ---------- Cart ---------- */
  var cart = {
    get: function () { var c = read(CART_KEY, []); return Array.isArray(c) ? c.filter(function (i) { return i && byId(i.id); }) : []; },
    save: function (items) { write(CART_KEY, items); emit(); },
    count: function () { return cart.get().reduce(function (s, i) { return s + (i.qty || 0); }, 0); },
    subtotal: function () { return cart.get().reduce(function (s, i) { return s + byId(i.id).price * i.qty; }, 0); },
    add: function (id, color, size, qty) {
      var items = cart.get(), found = null;
      items.forEach(function (i) { if (i.id === id && i.color === color && i.size === size) found = i; });
      if (found) found.qty = Math.min(10, found.qty + (qty || 1)); else items.push({ id: id, color: color, size: size, qty: qty || 1 });
      cart.save(items);
    },
    setQty: function (idx, qty) { var items = cart.get(); if (!items[idx]) return; if (qty <= 0) items.splice(idx, 1); else items[idx].qty = Math.min(10, qty); cart.save(items); },
    clear: function () { cart.save([]); }
  };
  var wish = {
    get: function () { var w = read(WISH_KEY, []); return Array.isArray(w) ? w.filter(byId) : []; },
    has: function (id) { return wish.get().indexOf(id) > -1; },
    toggle: function (id) {
      var w = wish.get(), i = w.indexOf(id);
      if (i > -1) w.splice(i, 1); else w.push(id);
      write(WISH_KEY, w); emit(); return i === -1;
    }
  };

  /* ---------- Toast ---------- */
  function toast(msg) {
    var wrap = $("#lw-toasts"); if (!wrap) return;
    var t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg; wrap.appendChild(t);
    setTimeout(function () { t.classList.add("out"); setTimeout(function () { t.remove(); }, 300); }, 2400);
  }

  /* ---------- Cards ---------- */
  function dotsHTML(p) { return '<div class="dots" aria-label="' + p.colors.length + ' colours">' + p.colors.map(function (c) { return '<i title="' + esc(c.name) + '" style="background:' + c.hex + '"></i>'; }).join("") + "</div>"; }
  function priceHTML(p) { return '<div class="price-row"><span class="price">' + money(p.price) + "</span>" + (p.was ? '<span class="was">' + money(p.was) + "</span>" : "") + "</div>"; }
  function heartBtn(id) {
    var on = wish.has(id);
    return '<button class="wish-btn" type="button" data-wish-id="' + id + '" aria-pressed="' + on + '" aria-label="Save to wishlist">' + ICON.heart + "</button>";
  }
  function cardHTML(p) {
    var alt = p.images && p.images[1] ? '<img class="alt" src="' + esc(p.images[1]) + '" alt="" loading="lazy">' : "";
    var tag = p.was ? '<span class="p-tag sale">Sale</span>' : (p.badge ? '<span class="p-tag">' + esc(p.badge) + "</span>" : "");
    return '<article class="p-card"><div class="p-media"><a class="p-link" href="product.html?id=' + p.id + '" aria-label="' + esc(p.name) + '"><img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy">' + alt + "</a>" + tag + heartBtn(p.id) +
      '<button class="btn btn-primary quick-add" type="button" data-quick="' + p.id + '">Quick add</button></div>' +
      '<div class="p-info"><span class="cat">' + esc(p.category) + '</span><h3><a href="product.html?id=' + p.id + '">' + esc(p.name) + "</a></h3>" + dotsHTML(p) + priceHTML(p) + "</div></article>";
  }

  /* ---------- Option picker (shared by product page + quick view) ---------- */
  function pickerHTML(p) {
    return '<div class="picker">' +
      '<div class="opt-label"><span>Colour: <b data-color-name></b></span></div><div class="swatches" role="radiogroup" aria-label="Colour">' +
      p.colors.map(function (c, i) { return '<button type="button" class="swatch" role="radio" aria-checked="' + (i === 0) + '" data-color="' + esc(c.name) + '" title="' + esc(c.name) + '" aria-label="' + esc(c.name) + '" style="background:' + c.hex + '"></button>'; }).join("") + "</div>" +
      '<div class="opt-label"><span>Size</span><a href="#" data-size-guide>Size guide</a></div><div class="sizes" role="radiogroup" aria-label="Size"></div>' +
      '<div class="field-error" data-error role="alert"></div>' +
      '<div class="buy-row"><div class="qty" aria-label="Quantity"><button type="button" data-dec aria-label="Decrease quantity">−</button><span data-qty>1</span><button type="button" data-inc aria-label="Increase quantity">+</button></div>' +
      '<button class="btn btn-primary" type="button" data-add>Add to bag</button></div></div>';
  }
  function mountPicker(root, p, opts) {
    opts = opts || {};
    var state = { color: p.colors[0].name, size: p.sizes.length === 1 ? p.sizes[0] : null, qty: 1 };
    var sizesEl = $(".sizes", root), err = $("[data-error]", root);
    function paintSizes() {
      var out = (p.soldOut && p.soldOut[state.color]) || [];
      if (state.size && out.indexOf(state.size) > -1) state.size = null;
      sizesEl.innerHTML = p.sizes.map(function (s) {
        var dis = out.indexOf(s) > -1;
        return '<button type="button" class="size" role="radio" data-size="' + esc(s) + '" aria-checked="' + (state.size === s) + '"' + (dis ? ' disabled title="Sold out"' : "") + ">" + esc(s) + "</button>";
      }).join("");
      $("[data-color-name]", root).textContent = state.color;
    }
    paintSizes();
    root.addEventListener("click", function (e) {
      var sw = e.target.closest(".swatch"), sz = e.target.closest(".size"), t = e.target;
      if (sw) { state.color = sw.dataset.color; $$(".swatch", root).forEach(function (b) { b.setAttribute("aria-checked", String(b === sw)); }); paintSizes(); if (opts.onColor) opts.onColor(state.color); }
      else if (sz && !sz.disabled) { state.size = sz.dataset.size; err.textContent = ""; $$(".size", root).forEach(function (b) { b.setAttribute("aria-checked", String(b === sz)); }); }
      else if (t.closest("[data-inc]")) { state.qty = Math.min(10, state.qty + 1); $("[data-qty]", root).textContent = state.qty; }
      else if (t.closest("[data-dec]")) { state.qty = Math.max(1, state.qty - 1); $("[data-qty]", root).textContent = state.qty; }
      else if (t.closest("[data-add]")) {
        if (!state.size) { err.textContent = "Please choose a size."; return; }
        cart.add(p.id, state.color, state.size, state.qty);
        toast("Added to your bag: " + p.name);
        if (opts.onAdd) opts.onAdd(); else openBag();
      }
    });
    return state;
  }

  /* ---------- Shell ---------- */
  var NAV = [["index.html", "Home"], ["shop.html", "Shop"], ["lookbook.html", "Lookbook"], ["our-story.html", "The Story"], ["country-impact.html", "Our Standard"], ["faq.html", "FAQ"], ["contact.html", "Contact"]];
  function pageName() { var f = location.pathname.split("/").pop() || "index.html"; return f; }

  function buildHeader() {
    var cur = pageName();
    var links = NAV.map(function (n) {
      var aria = (n[0] === cur || (n[0] === "shop.html" && cur === "product.html")) ? ' aria-current="page"' : "";
      if (n[0] === "shop.html") return '<div class="nav-item"><a href="shop.html"' + aria + '>Shop</a><div class="nav-drop"><a href="shop.html">All products</a><a href="shop.html?cat=Layers">Layers</a><a href="shop.html?cat=Tops">Tops</a><a href="shop.html?cat=Accessories">Accessories</a><a href="shop.html?sale=1">Sale</a></div></div>';
      return '<a href="' + n[0] + '"' + aria + ">" + n[1] + "</a>";
    }).join("");
    return '<a class="skip-link" href="#main">Skip to content</a><div class="announce">Free delivery on orders over <b>R1,000</b> · Demo store, no real orders</div>' +
      '<header class="site-header"><div class="nav-wrap"><button class="icon-btn menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="lw-nav">' + ICON.menu + "</button>" +
      '<a class="brand" href="index.html" aria-label="LoneWolf Clothing.co home"><img src="wolf-mark.svg" alt=""><span class="brand-copy"><strong>LoneWolf</strong><small>Clothing.co</small></span></a>' +
      '<nav class="nav-links" id="lw-nav" aria-label="Main navigation"><button class="icon-btn nav-close" type="button" aria-label="Close menu">' + ICON.close + "</button>" + links + "</nav>" +
      '<div class="nav-actions"><button class="icon-btn" type="button" data-open-search aria-label="Search">' + ICON.search + '</button>' +
      '<a class="icon-btn" href="wishlist.html" aria-label="Wishlist">' + ICON.heart + '<span class="badge-count" data-wish-count></span></a>' +
      '<button class="icon-btn" type="button" data-open-bag aria-label="Open shopping bag">' + ICON.bag + '<span class="badge-count" data-bag-count></span></button></div></div></header>';
  }
  function buildFooter() {
    return '<footer class="site-footer"><div class="container"><div class="news"><div><span class="eyebrow light">Stay in the pack</span><h2>New drops. No noise.</h2><p>Join the demo list for first looks and restocks. Nothing is actually sent.</p></div>' +
      '<form id="newsForm" novalidate><input type="email" id="newsEmail" placeholder="Your email address" aria-label="Email address" required><button class="btn btn-primary" type="submit">Subscribe</button></form></div>' +
      '<div class="foot-grid"><div><a class="brand" href="index.html"><img src="wolf-mark.svg" alt=""><span class="brand-copy"><strong>LoneWolf</strong><small>Clothing.co</small></span></a><p>Independent by nature. Unapologetic by design. Everyday streetwear for people who choose their own direction.</p></div>' +
      '<div><h4>Shop</h4><a href="shop.html">All products</a><a href="shop.html?cat=Layers">Layers</a><a href="shop.html?cat=Tops">Tops</a><a href="shop.html?cat=Accessories">Accessories</a><a href="shop.html?sale=1">Sale</a></div>' +
      '<div><h4>Help</h4><a href="faq.html">FAQ</a><a href="shipping-returns.html">Shipping &amp; returns</a><a href="#" data-size-guide>Size guide</a><a href="contact.html">Contact</a><a href="wishlist.html">Wishlist</a></div>' +
      '<div><h4>Brand</h4><a href="our-story.html">The Story</a><a href="country-impact.html">Our Standard</a><a href="lookbook.html">Lookbook</a></div></div>' +
      '<div class="foot-bottom"><span>© 2026 LoneWolf Clothing.co. All rights reserved.</span><span>Demo store · Prices use R as a sample currency marker · No payments are taken</span></div></div></footer>';
  }
  function buildOverlays() {
    return '<div class="scrim" id="lw-scrim"></div>' +
      '<aside class="drawer" id="lw-drawer" aria-label="Shopping bag" aria-hidden="true"><div class="drawer-head"><h2>Your bag</h2><button class="icon-btn" type="button" data-close aria-label="Close shopping bag">' + ICON.close + '</button></div><div class="ship-meter" id="lw-meter"></div><div class="drawer-body" id="lw-bag-items"></div><div class="drawer-foot"><div class="row-between"><strong>Subtotal</strong><strong id="lw-bag-total">R0</strong></div><p style="color:var(--muted);font-size:.84rem;margin:6px 0 14px">Delivery and discount codes are applied at checkout.</p><a class="btn btn-primary btn-block" id="lw-checkout" href="checkout.html">Checkout</a><p style="text-align:center;font-size:.8rem;color:var(--muted);margin-top:10px">Demo checkout. No payment is collected.</p></div></aside>' +
      '<div class="modal" id="lw-quick" role="dialog" aria-modal="true" aria-label="Quick add" aria-hidden="true"></div>' +
      '<div class="modal small" id="lw-guide" role="dialog" aria-modal="true" aria-label="Size guide" aria-hidden="true"><button class="icon-btn modal-close" type="button" data-close aria-label="Close">' + ICON.close + '</button><h2 style="margin-bottom:6px">Size guide</h2><p style="color:var(--muted);margin-bottom:16px">Body measurements in cm. Our pieces have a relaxed fit; between sizes, size down for a closer fit or up for extra room.</p><div class="table-wrap"><table><thead><tr><th>Size</th><th>Chest</th><th>Waist</th><th>Sleeve*</th></tr></thead><tbody>' +
      window.LW_DATA.sizeGuide.map(function (r) { return "<tr><td><b>" + r[0] + "</b></td><td>" + r[1] + "</td><td>" + r[2] + "</td><td>" + r[3] + "</td></tr>"; }).join("") + '</tbody></table></div><p style="color:var(--muted);font-size:.8rem;margin-top:12px">*Sample measurements for this demo store. Sleeve is shown in inches from shoulder seam.</p></div>' +
      '<div class="search-panel" id="lw-search" role="dialog" aria-modal="true" aria-label="Search" aria-hidden="true"><div class="container"><div class="search-box">' + ICON.search.replace("<svg", '<svg width="26" height="26" style="stroke:currentColor;fill:none;stroke-width:1.8"') + '<input id="lw-search-input" type="search" placeholder="Search hoodies, tees, caps…" aria-label="Search products" autocomplete="off"><button class="icon-btn" type="button" data-close aria-label="Close search">' + ICON.close + '</button></div><div class="search-results" id="lw-search-results"></div></div></div>' +
      '<div class="toast-wrap" id="lw-toasts" aria-live="polite"></div>';
  }

  /* ---------- Overlay control ---------- */
  var lastFocus = null;
  function openEl(el, focusSel) {
    closeAll(true); lastFocus = document.activeElement;
    el.classList.add("open"); el.setAttribute("aria-hidden", "false"); $("#lw-scrim").classList.add("open"); document.body.style.overflow = "hidden";
    var f = focusSel ? $(focusSel, el) : $("button,a,input", el); if (f) setTimeout(function () { f.focus(); }, 60);
  }
  function closeAll(keepFocus) {
    $$(".drawer.open,.modal.open,.search-panel.open").forEach(function (e) { e.classList.remove("open"); e.setAttribute("aria-hidden", "true"); });
    $("#lw-scrim").classList.remove("open"); document.body.style.overflow = "";
    var nav = $("#lw-nav"); if (nav && nav.classList.contains("open")) { nav.classList.remove("open"); $(".menu-toggle").setAttribute("aria-expanded", "false"); }
    if (!keepFocus && lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) { /* ignore */ } }
  }
  function openBag() { renderBag(); openEl($("#lw-drawer"), "[data-close]"); }
  function openSizeGuide() { openEl($("#lw-guide"), "[data-close]"); }
  function openQuickView(id) {
    var p = byId(id); if (!p) return;
    var m = $("#lw-quick");
    m.innerHTML = '<button class="icon-btn modal-close" type="button" data-close aria-label="Close">' + ICON.close + '</button><div class="qv"><img id="qv-img" src="' + esc(p.image) + '" alt="' + esc(p.name) + '"><div class="qv-body"><span class="eyebrow">' + esc(p.category) + '</span><h2 style="font-size:1.8rem;margin:8px 0 8px">' + esc(p.name) + "</h2>" + priceHTML(p).replace("price-row", "price-row\" style=\"padding:0 0 10px") + '<p style="color:var(--muted)">' + esc(p.description) + "</p>" + pickerHTML(p) + '<a class="link-arrow" href="product.html?id=' + p.id + '" style="margin-top:12px">View full details →</a></div></div>';
    mountPicker($(".picker", m), p, { onAdd: function () { openBag(); } });
    openEl(m, ".swatch");
  }

  /* ---------- Bag render ---------- */
  function renderBag() {
    var items = cart.get(), box = $("#lw-bag-items"); if (!box) return;
    var sub = cart.subtotal();
    box.innerHTML = items.length ? items.map(function (it, idx) {
      var p = byId(it.id);
      return '<div class="line-item"><a href="product.html?id=' + p.id + '"><img src="' + esc(p.image) + '" alt="' + esc(p.name) + '"></a><div><h4>' + esc(p.name) + "</h4><small>" + esc(it.color) + " · " + esc(it.size) + '</small><div class="qty"><button type="button" data-line="' + idx + '" data-d="-1" aria-label="Decrease quantity">−</button><span>' + it.qty + '</span><button type="button" data-line="' + idx + '" data-d="1" aria-label="Increase quantity">+</button></div><button class="remove" type="button" data-line="' + idx + '" data-d="-99">Remove</button></div><strong>' + money(p.price * it.qty) + "</strong></div>";
    }).join("") : '<div class="empty"><h3>Your bag is empty</h3><p>Add a piece or two and it will wait for you here.</p><a class="btn btn-primary" style="margin-top:18px" href="shop.html">Shop the collection</a></div>';
    $("#lw-bag-total").textContent = money(sub);
    var co = $("#lw-checkout"); co.style.pointerEvents = items.length ? "" : "none"; co.style.opacity = items.length ? "" : ".5";
    var left = FREE_SHIP - sub, pct = Math.min(100, sub / FREE_SHIP * 100);
    $("#lw-meter").innerHTML = items.length ? ((left > 0 ? "You're <b>" + money(left) + "</b> away from free delivery" : "<b>You've unlocked free delivery</b>") + '<div class="bar"><i style="width:' + pct + '%"></i></div>') : "Free delivery on orders over " + money(FREE_SHIP);
  }
  function syncCounts() {
    var b = cart.count(), w = wish.get().length;
    $$("[data-bag-count]").forEach(function (e) { e.textContent = b || ""; e.dataset.n = b; });
    $$("[data-wish-count]").forEach(function (e) { e.textContent = w || ""; e.dataset.n = w; });
    $$("[data-wish-id]").forEach(function (btn) { btn.setAttribute("aria-pressed", String(wish.has(btn.dataset.wishId))); });
    renderBag();
  }

  /* ---------- Search ---------- */
  function runSearch(q) {
    q = q.trim().toLowerCase(); var out = $("#lw-search-results");
    var hits = P.filter(function (p) { return !q || (p.name + " " + p.category + " " + p.description + " " + p.colors.map(function (c) { return c.name; }).join(" ")).toLowerCase().indexOf(q) > -1; }).slice(0, 8);
    out.innerHTML = hits.length ? hits.map(function (p) { return '<a class="search-hit" href="product.html?id=' + p.id + '"><img src="' + esc(p.image) + '" alt=""><div><b>' + esc(p.name) + "</b><span>" + esc(p.category) + " · " + money(p.price) + "</span></div></a>"; }).join("") : '<p style="color:var(--muted)">No pieces match “' + esc(q) + "”. Try another word.</p>";
  }

  /* ---------- Init ---------- */
  function init() {
    var h = $("#lw-header") || document.body.insertBefore(document.createElement("div"), document.body.firstChild); h.id = "lw-header"; h.innerHTML = buildHeader();
    var f = $("#lw-footer") || document.body.appendChild(document.createElement("div")); f.id = "lw-footer"; f.innerHTML = buildFooter();
    var o = document.createElement("div"); o.innerHTML = buildOverlays(); while (o.firstChild) document.body.appendChild(o.firstChild);
    var main = $("main"); if (main && !main.id) main.id = "main";

    document.addEventListener("click", function (e) {
      var t = e.target;
      var w = t.closest("[data-wish-id]");
      if (w) { e.preventDefault(); var added = wish.toggle(w.dataset.wishId); toast(added ? "Saved to your wishlist" : "Removed from your wishlist"); return; }
      if (t.closest("[data-open-bag]")) { openBag(); return; }
      if (t.closest("[data-open-search]")) { openEl($("#lw-search"), "#lw-search-input"); runSearch(""); return; }
      var q = t.closest("[data-quick]"); if (q) { openQuickView(q.dataset.quick); return; }
      var g = t.closest("[data-size-guide]"); if (g) { e.preventDefault(); openSizeGuide(); return; }
      if (t.closest("[data-close]") || t.id === "lw-scrim") { closeAll(); return; }
      var ln = t.closest("[data-line]"); if (ln) { var idx = +ln.dataset.line, items = cart.get(); if (items[idx]) cart.setQty(idx, items[idx].qty + (+ln.dataset.d)); return; }
      if (t.closest(".menu-toggle")) { var nav = $("#lw-nav"), open = !nav.classList.contains("open"); nav.classList.toggle("open", open); $(".menu-toggle").setAttribute("aria-expanded", String(open)); return; }
      if (t.closest(".nav-close")) { $("#lw-nav").classList.remove("open"); $(".menu-toggle").setAttribute("aria-expanded", "false"); }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
    var si = $("#lw-search-input");
    si.addEventListener("input", function () { runSearch(si.value); });
    si.addEventListener("keydown", function (e) { if (e.key === "Enter" && si.value.trim()) location.href = "shop.html?q=" + encodeURIComponent(si.value.trim()); });
    document.addEventListener("error", function (e) { var im = e.target; if (im && im.tagName === "IMG" && !im.dataset.fb) { im.dataset.fb = "1"; im.src = PLACEHOLDER; } }, true);

    var nf = $("#newsForm");
    nf.addEventListener("submit", function (e) {
      e.preventDefault(); var em = $("#newsEmail");
      if (!em.value || !em.checkValidity()) { em.setAttribute("aria-invalid", "true"); toast("Please enter a valid email address."); return; }
      em.removeAttribute("aria-invalid"); write("lonewolf-newsletter", em.value); nf.reset(); toast("You're on the demo list. Nothing is sent.");
    });

    document.addEventListener("lw:update", syncCounts);
    window.addEventListener("storage", function (e) { if (e.key === CART_KEY || e.key === WISH_KEY) syncCounts(); });
    syncCounts();

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { threshold: .08 });
      var watch = function () { $$(".reveal:not(.in)").forEach(function (el) { io.observe(el); }); };
      watch(); window.LW_watch = watch;
    } else { $$(".reveal").forEach(function (el) { el.classList.add("in"); }); window.LW_watch = function () {}; }
  }

  window.LW = { P: P, $: $, $$: $$, esc: esc, money: money, read: read, write: write, byId: byId, cart: cart, wish: wish, toast: toast, cardHTML: cardHTML, pickerHTML: pickerHTML, mountPicker: mountPicker, openBag: openBag, openQuickView: openQuickView, openSizeGuide: openSizeGuide, emit: emit, FREE_SHIP: FREE_SHIP, STANDARD: STANDARD, EXPRESS: EXPRESS, heartBtn: heartBtn, priceHTML: priceHTML };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
