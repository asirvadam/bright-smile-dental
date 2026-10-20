(function () {
  "use strict";
  const C = window.CLINIC, B = document.body.dataset.base || "", PAGE = document.body.dataset.page || "";
  if (!C) return;
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const get = (o, p) => p.split(".").reduce((a, k) => (a ? a[k] : ""), o);
  const wa = t => `https://wa.me/${C.whatsapp}` + (t ? `?text=${encodeURIComponent(t)}` : "");
  const on = C.treatments.filter(t => t.enabled);
  const url = p => B + p;

  document.documentElement.style.setProperty("--teal", C.colors.primary);
  document.documentElement.style.setProperty("--teal-dark", C.colors.dark);

  // header, footer, floating buttons
  const links = [["services.html", "Treatments"], ["about.html", "About"], ["faq.html", "FAQs"], ["contact.html", "Contact"]];
  const logo = C.logo ? `<img class="brand-logo" src="${esc(url(C.logo))}" alt="${esc(C.name)} logo" width="42" height="42">` : `<span class="brand-mark" aria-hidden="true">✦</span>`;
  const brand = `<a class="brand" href="${url("index.html")}" aria-label="${esc(C.name)} home">${logo}<span><strong>${esc(C.shortName)}</strong><small>${esc(C.name.replace(C.shortName, "").trim() || C.city)}</small></span></a>`;
  const h = document.getElementById("site-header");
  if (h) h.innerHTML = `<a class="skip" href="#main">Skip to content</a><div class="topbar"><span>${esc(C.hours[0][0])} · ${esc(C.hours[0][1])}</span><a href="tel:${esc(C.phoneTel)}">Call: ${esc(C.phoneDisplay)}</a></div>
  <header class="site-header">${brand}<button class="menu-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="nav">☰</button>
  <nav class="nav" id="nav" aria-label="Main">${links.map(l => `<a href="${url(l[0])}"${PAGE === l[0] ? ' aria-current="page"' : ""}>${l[1]}</a>`).join("")}<a class="button button-small" href="${url("contact.html")}#appointment">Book a visit</a></nav></header>`;
  const f = document.getElementById("site-footer");
  if (f) {
    const soc = Object.entries(C.social).filter(e => e[1]).map(e => `<a href="${esc(e[1])}" target="_blank" rel="noopener">${esc(e[0])}</a>`).join("");
    f.innerHTML = `<footer class="footer">${brand}<p>${esc(C.address)}, ${esc(C.city)}, ${esc(C.state)}</p><div><a href="${url("services.html")}">Treatments</a><a href="${url("privacy.html")}">Privacy</a><a href="${url("terms.html")}">Terms</a>${soc}</div><small>© ${new Date().getFullYear()} ${esc(C.name)}. Information on this site is general and does not replace a dental examination.</small></footer>
    <div class="mobile-bar"><a href="tel:${esc(C.phoneTel)}">Call</a><a href="${wa("Hello, I would like to ask about an appointment.")}" target="_blank" rel="noopener">WhatsApp</a><a href="${url("contact.html")}#appointment">Book</a></div>`;
  }
  const mt = document.querySelector(".menu-toggle"), nav = document.getElementById("nav");
  if (mt) mt.addEventListener("click", () => { const o = nav.classList.toggle("open"); mt.setAttribute("aria-expanded", String(o)); mt.setAttribute("aria-label", o ? "Close navigation" : "Open navigation"); });

  // simple bindings (textContent only, so config text cannot inject HTML)
  document.querySelectorAll("[data-c]").forEach(e => e.textContent = get(C, e.dataset.c));
  document.querySelectorAll("[data-link]").forEach(e => {
    const t = e.dataset.link;
    if (t === "tel") e.href = "tel:" + C.phoneTel;
    if (t === "wa") { e.href = wa("Hello, I would like to ask about an appointment."); e.target = "_blank"; e.rel = "noopener"; }
    if (t === "map") { e.href = C.mapsUrl; e.target = "_blank"; e.rel = "noopener"; }
    if (t === "mail") { if (C.email) e.href = "mailto:" + C.email; else e.hidden = true; }
  });
  document.querySelectorAll("[data-photo]").forEach(e => {
    const src = e.dataset.photo === "dentist" ? C.dentist.photo : C.photos[e.dataset.photo];
    if (src) e.innerHTML = `<img src="${esc(url(src))}" alt="${esc(e.dataset.alt || C.name)}" loading="${e.dataset.eager ? "eager" : "lazy"}" width="600" height="450">`;
  });

  // rendered lists
  const R = {
    treatments: e => { const n = +e.dataset.limit || on.length; e.innerHTML = on.slice(0, n).map(t => `<article class="service-card"><span class="service-icon" aria-hidden="true">${esc(t.icon)}</span><h3>${esc(t.title)}</h3><p>${esc(t.short)}</p><a href="${url("treatments/" + t.slug + ".html")}">Learn more →</a></article>`).join(""); },
    hours: e => { e.innerHTML = C.hours.map(r => `<tr><th scope="row">${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join(""); },
    faq: e => { const n = +e.dataset.limit || C.faqs.length; e.innerHTML = C.faqs.slice(0, n).map(q => `<details><summary>${esc(q[0])}</summary><p>${esc(q[1])}</p></details>`).join(""); },
    dentist: e => { const d = C.dentist; e.innerHTML = `<div class="doctor-photo" data-photo="dentist" data-alt="${esc(d.name)}"><span>Add dentist photo</span></div><div><p class="eyebrow">YOUR DENTIST</p><h3>${esc(d.name)}</h3><p class="credentials">${esc(d.qualifications)}${d.registration ? " · Reg. " + esc(d.registration) : ""}</p><p>${esc(d.bio)}</p></div>`; if (d.photo) e.querySelector("[data-photo]").innerHTML = `<img src="${esc(url(d.photo))}" alt="${esc(d.name)}" loading="lazy" width="260" height="235">`; },
    map: e => { e.innerHTML = C.mapsEmbed ? `<iframe title="Map of ${esc(C.name)}" src="${esc(C.mapsEmbed)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` : ""; }
  };
  document.querySelectorAll("[data-render]").forEach(e => R[e.dataset.render] && R[e.dataset.render](e));

  // appointment form
  const form = document.getElementById("appointmentForm");
  if (form) {
    const sel = document.getElementById("treatment");
    sel.innerHTML = ["General check-up", "Tooth pain / urgent problem"].concat(on.map(t => t.title), ["Other / not sure"]).map(o => `<option>${esc(o)}</option>`).join("");
    const msg = document.getElementById("formMessage"), live = !!C.formEndpoint;
    document.getElementById("formMode").textContent = live ? "Your request is sent to the clinic, which will contact you to confirm. It is not a confirmed booking." : "Demo mode: this form opens WhatsApp with a prepared message. Nothing is stored or sent to a server.";
    document.getElementById("date").min = new Date().toISOString().slice(0, 10);
    form.addEventListener("submit", async ev => {
      ev.preventDefault();
      const v = id => document.getElementById(id).value.trim();
      const phone = v("phone").replace(/[\s-]/g, "");
      msg.className = "form-message";
      if (v("name").length < 2) { msg.textContent = "Please enter your name."; msg.classList.add("err"); return document.getElementById("name").focus(); }
      if (!/^(\+91|0)?[6-9]\d{9}$/.test(phone)) { msg.textContent = "Please enter a valid 10-digit Indian mobile number."; msg.classList.add("err"); return document.getElementById("phone").focus(); }
      const data = { name: v("name"), phone, treatment: v("treatment"), date: v("date") || "Flexible" };
      if (live) {
        try {
          const r = await fetch(C.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
          if (!r.ok) throw new Error();
          form.reset(); msg.textContent = "Thank you. Your request has been sent. The clinic will contact you to confirm; your appointment is not confirmed until then.";
        } catch (x) { msg.textContent = "Sorry, we could not send your request. Please call " + C.phoneDisplay + " or use WhatsApp."; msg.classList.add("err"); }
        return;
      }
      const text = ["Hello, I would like to request an appointment.", "Name: " + data.name, "Phone: " + data.phone, "Reason: " + data.treatment, "Preferred date: " + data.date, "Please confirm availability."].join("\n");
      msg.textContent = "Opening WhatsApp. Please review the message and press send. The appointment is confirmed only when the clinic replies.";
      window.open(wa(text), "_blank", "noopener");
    });
  }

  // SEO: title, description, canonical, Open Graph, structured data
  const base = C.seo.siteUrl.replace(/\/$/, ""), path = location.pathname.replace(/^.*?(treatments\/)?([^\/]*)$/, (m, a, b) => (a || "") + b);
  const setMeta = (sel, attrs) => { let m = document.head.querySelector(sel); if (!m) { m = document.createElement(sel.startsWith("link") ? "link" : "meta"); document.head.appendChild(m); } Object.entries(attrs).forEach(k => m.setAttribute(k[0], k[1])); };
  const home = PAGE === "index.html";
  if (home) { document.title = C.seo.title; setMeta('meta[name="description"]', { name: "description", content: C.seo.description }); }
  else document.title = document.title.replace(/\|.*$/, "| " + C.name);
  setMeta('link[rel="canonical"]', { rel: "canonical", href: base + "/" + (home ? "" : path) });
  setMeta('meta[property="og:title"]', { property: "og:title", content: document.title });
  setMeta('meta[property="og:description"]', { property: "og:description", content: (document.querySelector('meta[name="description"]') || {}).content || C.seo.description });
  setMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
  setMeta('meta[property="og:url"]', { property: "og:url", content: base + "/" + path });
  const ld = { "@context": "https://schema.org", "@type": "Dentist", name: C.name, url: base + "/", telephone: C.phoneTel, address: { "@type": "PostalAddress", streetAddress: C.address, addressLocality: C.city, addressRegion: C.state, postalCode: C.postalCode || undefined, addressCountry: "IN" }, openingHours: C.schemaHours, hasMap: C.mapsUrl };
  if (C.email) ld.email = C.email;
  if (C.photos.clinic) ld.image = base + "/" + C.photos.clinic;
  const same = Object.values(C.social).filter(Boolean); if (same.length) ld.sameAs = same;
  const s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld); document.head.appendChild(s);
})();
