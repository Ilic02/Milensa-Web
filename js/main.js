document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Zatvori meni" : "Otvori meni");
    document.body.classList.toggle("nav-open", open);
  };

  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  const links = [...document.querySelectorAll(".nav__link")];
  const sections = links
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) =>
          l.classList.toggle("is-active", l.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => sectionObserver.observe(s));

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

  const filters = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.filter;
      filters.forEach((f) => f.classList.toggle("is-active", f === btn));
      projects.forEach((p) => {
        const show = cat === "all" || p.dataset.category === cat;
        p.classList.toggle("is-hidden", !show);
      });
    });
  });

  const form = document.getElementById("contact-form");
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
      //  TODO: implementirati funkcionalnost forme;
      console.log("Upit:", data);

      status.classList.add("is-success");
      status.textContent = "Hvala! Vaš upit je poslat — javićemo vam se uskoro.";
      form.reset();
    } catch (err) {
      status.classList.add("is-error");
      status.textContent = "Došlo je do greške. Pokušajte ponovo ili nas pozovite.";
    }
  });

  form.querySelectorAll("input, textarea").forEach((el) =>
    el.addEventListener("input", () => el.closest(".field").classList.remove("has-error"))
  );

  document.getElementById("year").textContent = new Date().getFullYear();
});
