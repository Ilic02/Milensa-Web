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
    const projects = document.querySelectorAll(".project");
    const empty = document.getElementById("projects-empty");

    const applyFilter = (cat, updateUrl = true) => {
      let visible = 0;
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

      const data = Object.fromEntries(new FormData(form));

      try {
        // TODO: implementirati slanje forme
        console.log("Upit:", data);

        status.classList.add("is-success");
        status.textContent = "Hvala! Vaš upit je poslat, javićemo vam se uskoro.";
        form.reset();
      } catch (err) {
        status.classList.add("is-error");
        status.textContent = "Došlo je do greške. Pokušajte ponovo ili nas pozovite.";
      }
    });

    form.querySelectorAll("input, textarea").forEach((el) =>
      el.addEventListener("input", () => el.closest(".field").classList.remove("has-error"))
    );
  }

  // Godina u footeru
  document.getElementById("year").textContent = new Date().getFullYear();
});
