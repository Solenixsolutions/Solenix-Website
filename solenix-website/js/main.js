/* Solenix Solutions v6 — catalog, search, filters, enquiry form,
   scroll reveals, counters, header state, back-to-top. */

(function () {
  const grid = document.getElementById("grid");
  const chipsWrap = document.getElementById("chips");
  const searchInput = document.getElementById("search");
  const resultCount = document.getElementById("result-count");
  const emptyState = document.getElementById("empty");
  const clearBtn = document.getElementById("clear-search");
  const yearEl = document.getElementById("year");
  const footerCats = document.getElementById("footer-cats");
  const form = document.getElementById("enquiry-form");
  const topbar = document.getElementById("topbar");
  const toTop = document.getElementById("to-top");

  let activeCategory = "All";
  let query = "";

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----- category links (nav dropdown + footer) ----- */
  const catLinks = CATEGORIES.map(
    (c) => `<li><a href="#catalog" data-cat="${c}">${c}</a></li>`
  ).join("");
  if (footerCats) footerCats.innerHTML = catLinks;
  const navCats = document.getElementById("nav-cats");
  if (navCats) navCats.innerHTML = catLinks;
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-cat]");
    if (link) selectCategory(link.dataset.cat);
  });

  /* ----- category chips ----- */
  ["All", ...CATEGORIES].forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.textContent = cat;
    btn.setAttribute("aria-pressed", cat === activeCategory ? "true" : "false");
    btn.addEventListener("click", () => selectCategory(cat));
    chipsWrap.appendChild(btn);
  });

  function selectCategory(cat) {
    activeCategory = cat;
    chipsWrap.querySelectorAll(".chip").forEach((c) =>
      c.setAttribute("aria-pressed", c.textContent === cat ? "true" : "false")
    );
    render();
  }

  /* ----- search ----- */
  searchInput.addEventListener("input", () => {
    query = searchInput.value.trim().toLowerCase();
    render();
  });
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    query = "";
    searchInput.focus();
    render();
  });

  function matches(p) {
    if (activeCategory !== "All" && p.category !== activeCategory) return false;
    if (!query) return true;
    const hay = [p.sku, p.name, p.desc, p.category, ...(p.tags || [])].join(" ").toLowerCase();
    return query.split(/\s+/).every((w) => hay.includes(w));
  }

  /* ----- rendering ----- */
  function cardHTML(p) {
    const wa = "https://wa.me/919417122679?text=" +
      encodeURIComponent(`Hi Solenix Solutions, I'd like a quote for: ${p.name} (item ${p.sku}).`);
    return `
      <article class="card reveal">
        <div class="card-media">
          <picture>
            <source srcset="${p.image.replace(/\.jpg$/i, ".webp")}" type="image/webp" />
            <img src="${p.image}" alt="${p.alt || p.name}" loading="lazy" width="720" height="540" />
          </picture>
        </div>
        <div class="card-body">
          <span class="card-cat">${p.category}</span>
          <h3>${p.name}</h3>
          <p class="card-desc">${p.desc}</p>
          <div class="card-foot">
            <span class="card-sku">SLX-${p.sku}</span>
            <a class="card-enquire" href="${wa}" target="_blank" rel="noopener">Get a quote
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M13 5l7 7-7 7-1.4-1.4L16.2 13H4v-2h12.2l-4.6-4.6z"/></svg>
            </a>
          </div>
        </div>
      </article>`;
  }

  function render() {
    const visible = PRODUCTS.filter(matches);
    grid.innerHTML = visible.map(cardHTML).join("");
    emptyState.hidden = visible.length !== 0;
    resultCount.textContent =
      `Showing ${visible.length} of ${PRODUCTS.length} products` +
      (activeCategory !== "All" ? ` · ${activeCategory}` : "") +
      (query ? ` · “${searchInput.value.trim()}”` : "");
    observeReveals(grid);
    // cards inside the already-visible viewport should appear immediately
    requestAnimationFrame(() =>
      grid.querySelectorAll(".reveal").forEach((el) => {
        if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in-view");
      })
    );
  }

  /* ----- enquiry form -> WhatsApp ----- */
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (typeof gtag === "function") gtag("event", "enquiry_form_submit", {});
      const name = document.getElementById("f-name").value.trim();
      const phone = document.getElementById("f-phone").value.trim();
      const msg = document.getElementById("f-msg").value.trim();
      const text = `Hi Solenix Solutions,\nMy name is ${name} (${phone}).\n` +
        (msg || "I'd like to know more about your products.");
      window.open("https://wa.me/919417122679?text=" + encodeURIComponent(text), "_blank", "noopener");
    });
  }

  /* ----- decision metrics: contact-action events (GA4) -----
     One delegated listener records every WhatsApp / call / e-mail / distributor
     click as a GA4 event — the metric the 1-year domain review hinges on.
     Guarded by `typeof gtag` so the site still works if analytics is blocked or
     not configured. Event names are read verbatim by the review; see METRICS_LOG.md. */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a || typeof gtag !== "function") return;
    var href = a.getAttribute("href") || "";
    var loc = a.closest("section,header,footer");
    var where = loc ? (loc.id || loc.className.split(" ")[0]) : "page";
    if (href.indexOf("wa.me") > -1)         gtag("event", "whatsapp_click", { link_location: where });
    else if (href.indexOf("tel:") === 0)    gtag("event", "call_click",     { link_location: where });
    else if (href.indexOf("mailto:") === 0) gtag("event", "email_click",    { link_location: where });
    if ((a.textContent || "").indexOf("Distributor") > -1) gtag("event", "distributor_click", { link_location: where });
  });

  /* ----- scroll reveals ----- */
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let io = null;
  if ("IntersectionObserver" in window && !reduceMotion) {
    io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in-view"); io.unobserve(en.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
  }
  function observeReveals(scope) {
    (scope || document).querySelectorAll(".reveal:not(.in-view)").forEach((el) => {
      if (io) io.observe(el);
      else el.classList.add("in-view");
    });
  }
  observeReveals(document);

  /* ----- featured slider ----- */
  const FEATURED = ["01", "04", "08", "07", "09"];
  const slidesEl = document.getElementById("slides");
  const dotsEl = document.getElementById("sc-dots");
  if (slidesEl && dotsEl) {
    const feats = FEATURED.map((s) => PRODUCTS.find((p) => p.sku === s)).filter(Boolean);
    slidesEl.innerHTML = feats.map((p, i) => `
      <div class="slide${i === 0 ? " active" : ""}" role="group" aria-label="${i + 1} of ${feats.length}">
        <div class="slide-media"><picture><source srcset="${p.image.replace(/\.jpg$/i, ".webp")}" type="image/webp" /><img src="${p.image}" alt="${p.alt || p.name}" ${i === 0 ? "" : 'loading="lazy"'} width="720" height="540" /></picture></div>
        <div class="slide-info">
          <p class="kicker">Featured · SLX-${p.sku}</p>
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <a class="card-enquire" href="https://wa.me/919417122679?text=${encodeURIComponent("Hi Solenix Solutions, I'd like a quote for: " + p.name + " (item " + p.sku + ").")}" target="_blank" rel="noopener">Get a quote
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M13 5l7 7-7 7-1.4-1.4L16.2 13H4v-2h12.2l-4.6-4.6z"/></svg>
          </a>
        </div>
      </div>`).join("");
    dotsEl.innerHTML = feats.map((_, i) =>
      `<button class="sc-dot" aria-label="Go to slide ${i + 1}" ${i === 0 ? 'aria-current="true"' : ""}></button>`).join("");

    const slideEls = [...slidesEl.querySelectorAll(".slide")];
    const dotEls = [...dotsEl.querySelectorAll(".sc-dot")];
    let cur = 0, timer = null;
    function go(n) {
      cur = (n + slideEls.length) % slideEls.length;
      slideEls.forEach((s, i) => s.classList.toggle("active", i === cur));
      dotEls.forEach((d, i) => d.setAttribute("aria-current", i === cur ? "true" : "false"));
    }
    function play() { if (!reduceMotion) { stop(); timer = setInterval(() => go(cur + 1), 4500); } }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    document.getElementById("sc-prev").addEventListener("click", () => { go(cur - 1); play(); });
    document.getElementById("sc-next").addEventListener("click", () => { go(cur + 1); play(); });
    dotEls.forEach((d, i) => d.addEventListener("click", () => { go(i); play(); }));
    slidesEl.addEventListener("mouseenter", stop);
    slidesEl.addEventListener("mouseleave", play);
    slidesEl.addEventListener("touchstart", stop, { passive: true });
    play();
  }

  /* ----- header shadow + back-to-top ----- */
  function onScroll() {
    const y = scrollY || document.documentElement.scrollTop;
    topbar.classList.toggle("is-scrolled", y > 8);
    toTop.classList.toggle("show", y > 700);
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  render();
})();
