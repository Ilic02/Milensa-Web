document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  // Header menja izgled posle skrola
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobilni meni
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Zatvori meni" : "Otvori meni");
    document.body.classList.toggle("nav-open", open);
  };

  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  // Scroll reveal animacije
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  // Filter projekata (samo na projekti.html)
  // Podržava link oblika projekti.html?kategorija=kuhinje
  const filters = document.querySelectorAll(".filter");
  if (filters.length) {
    const projects = document.querySelectorAll(".gallery__item");
    const empty = document.getElementById("projects-empty");

    const applyFilter = (cat, updateUrl = true) => {
      let visible = 0;
      document.dispatchEvent(new CustomEvent("gallery:filter", { detail: cat }));
      filters.forEach((f) => {
        const active = f.dataset.filter === cat;
        f.classList.toggle("is-active", active);
        f.setAttribute("aria-pressed", String(active));
      });
      projects.forEach((p) => {
        const show = cat === "all" || p.dataset.category === cat;
        p.classList.toggle("is-hidden", !show);
        if (show) visible++;
      });
      if (empty) empty.hidden = visible > 0;

      if (updateUrl) {
        const url = new URL(window.location.href);
        if (cat === "all") url.searchParams.delete("kategorija");
        else url.searchParams.set("kategorija", cat);
        history.replaceState(null, "", url);
      }
    };

    filters.forEach((btn) => btn.addEventListener("click", () => applyFilter(btn.dataset.filter)));

    const initial = new URLSearchParams(window.location.search).get("kategorija");
    if (initial && [...filters].some((f) => f.dataset.filter === initial)) {
      applyFilter(initial, false);
    }
  }

  // Galerija: prikazuje prvih N fotografija, ostale na klik "Prikaži sve"
  document.querySelectorAll("[data-gallery][data-limit]").forEach((gallery) => {
    const limit = Number(gallery.dataset.limit);
    const all = [...gallery.querySelectorAll(".gallery__item")];
    if (all.length <= limit) return;

    const wrap = document.createElement("div");
    wrap.className = "gallery__more";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn--ghost";
    wrap.appendChild(btn);
    gallery.after(wrap);

    const collapse = () => {
      all.forEach((el, i) => el.classList.toggle("is-more", i >= limit));
      btn.textContent = `Prikaži sve fotografije (${all.length})`;
      wrap.hidden = false;
    };
    const expand = () => {
      all.forEach((el) => el.classList.remove("is-more"));
      wrap.hidden = true;
    };
    btn.addEventListener("click", expand);
    // izabrana kategorija na stranici Projekti uvek prikazuje sve svoje fotografije
    document.addEventListener("gallery:filter", (e) => (e.detail === "all" ? collapse() : expand()));
    const filtered = document.querySelector(".filter.is-active:not([data-filter='all'])");
    filtered ? expand() : collapse();
  });

  // Lightbox: uvećan prikaz fotografija iz galerije
  const galleries = document.querySelectorAll("[data-gallery]");
  if (galleries.length) {
    const box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Galerija fotografija");
    box.innerHTML = `
      <button class="lightbox__close" type="button" aria-label="Zatvori">×</button>
      <button class="lightbox__prev" type="button" aria-label="Prethodna fotografija">←</button>
      <figure class="lightbox__figure">
        <img class="lightbox__img" alt="" />
        <figcaption class="lightbox__caption"></figcaption>
      </figure>
      <button class="lightbox__next" type="button" aria-label="Sledeća fotografija">→</button>`;
    document.body.appendChild(box);

    const boxImg = box.querySelector(".lightbox__img");
    const caption = box.querySelector(".lightbox__caption");
    let items = [];
    let index = 0;
    let lastFocus = null;

    const show = (i) => {
      index = (i + items.length) % items.length;
      const item = items[index];
      boxImg.classList.add("is-loading");
      boxImg.onload = () => boxImg.classList.remove("is-loading");
      boxImg.src = item.href;
      boxImg.alt = item.querySelector("img").alt;
      caption.textContent = `${item.dataset.caption} · ${index + 1} / ${items.length}`;
      // učitaj susedne fotografije unapred
      [index - 1, index + 1].forEach((n) => {
        const next = items[(n + items.length) % items.length];
        if (next) new Image().src = next.href;
      });
    };

    const open = (gallery, item) => {
      items = [...gallery.querySelectorAll(".gallery__item:not(.is-hidden)")];
      lastFocus = document.activeElement;
      show(items.indexOf(item));
      box.classList.add("is-open");
      document.body.classList.add("lightbox-open");
      box.querySelector(".lightbox__close").focus();
    };

    const close = () => {
      box.classList.remove("is-open");
      document.body.classList.remove("lightbox-open");
      if (lastFocus) lastFocus.focus();
    };

    galleries.forEach((gallery) => {
      gallery.addEventListener("click", (e) => {
        const item = e.target.closest(".gallery__item");
        if (!item) return;
        e.preventDefault();
        open(gallery, item);
      });
    });

    box.querySelector(".lightbox__close").addEventListener("click", close);
    box.querySelector(".lightbox__prev").addEventListener("click", () => show(index - 1));
    box.querySelector(".lightbox__next").addEventListener("click", () => show(index + 1));
    box.addEventListener("click", (e) => {
      if (e.target === box || e.target.classList.contains("lightbox__figure")) close();
    });

    document.addEventListener("keydown", (e) => {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });

    // prevlačenje prstom na telefonu
    let startX = null;
    box.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }

  // Kontakt forma (samo na kontakt.html)
  const form = document.getElementById("contact-form");
  if (form) {
    const status = document.getElementById("form-status");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.className = "form__status";
      status.textContent = "";

      let valid = true;
      form.querySelectorAll("[required]").forEach((input) => {
        const field = input.closest(".field");
        const ok = input.value.trim() !== "";
        field.classList.toggle("has-error", !ok);
        if (!ok) valid = false;
      });

      const email = form.elements.email;
      if (email.value && !email.checkValidity()) {
        email.closest(".field").classList.add("has-error");
        valid = false;
      }

      if (!valid) {
        status.classList.add("is-error");
        status.textContent = "Molimo popunite obavezna polja.";
        return;
      }

      // Slanje preko FormSubmit-a (https://formsubmit.co) na mejl firme.
      // Posle aktivacije možeš "milensa.namestaj@gmail.com" zameniti nasumičnim
      // kodom koji FormSubmit pošalje mejlom, da adresa ne bude vidljiva u kodu.
      const ENDPOINT = "https://formsubmit.co/ajax/milensa.namestaj@gmail.com";
      const v = (n) => (form.elements.namedItem(n)?.value || "").trim();
      const payload = {
        "Ime i prezime": v("name"),
        "Telefon": v("phone"),
        "Email": v("email") || "—",
        "Vrsta projekta": v("type") || "—",
        "Poruka": v("message"),
        _subject: `Novi upit sa sajta: ${v("name")}`,
        _template: "table",
        _captcha: "false",
        _honey: v("_honey"),
      };
      if (v("email")) payload._replyto = v("email");

      const button = form.querySelector('button[type="submit"]');
      const label = button.textContent;
      button.disabled = true;
      button.textContent = "Šalje se…";

      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json().catch(() => ({}));
        if (!res.ok || String(result.success) !== "true") throw new Error(result.message || res.status);

        status.classList.add("is-success");
        status.textContent = "Hvala! Vaš upit je poslat, javićemo vam se uskoro.";
        form.reset();
      } catch (err) {
        status.classList.add("is-error");
        status.textContent = "Upit nije poslat. Pokušajte ponovo ili nas pozovite na 063 198 3744.";
      } finally {
        button.disabled = false;
        button.textContent = label;
      }
    });

    form.querySelectorAll(".field input, .field textarea").forEach((el) =>
      el.addEventListener("input", () => el.closest(".field").classList.remove("has-error"))
    );
  }

  // Brojke: odbrojavanje od 1 do vrednosti kada sekcija uđe u ekran
  const counters = document.querySelectorAll("[data-count]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (counters.length && !reduceMotion) {
    const run = (el) => {
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const duration = 1800;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);            // usporava pri kraju
        el.textContent = Math.max(1, Math.round(eased * target)) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    counters.forEach((el) => { el.textContent = "1" + (el.dataset.suffix || ""); });
    const countObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          run(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countObserver.observe(el));
  }

  // Godina u footeru
  document.getElementById("year").textContent = new Date().getFullYear();
});
