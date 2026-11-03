# Milensa — sajt (više stranica)

Statični sajt: HTML + CSS + vanilla JS, bez build alata.

```
milensa-site/
├── index.html      # Početna: hero, kratko o nama, pregled usluga, izdvojeni projekti, utisak
├── o-nama.html     # Priča, brojke, vrednosti, radionica
├── usluge.html     # Pregled svih usluga (kartice) + proces
├── usluge/
│   ├── kuhinje.html
│   ├── plakari.html
│   ├── tv-komode.html
│   ├── kupatila.html
│   ├── biblioteke.html
│   ├── komode.html
│   └── kreveti.html      # svaka: zaglavlje sa fotografijom, šta dobijate, materijali, galerija, ostale usluge
├── projekti.html   # Galerija svih fotografija + filter (radi i preko ?kategorija=kuhinje) + lightbox
├── kontakt.html    # Kontakt podaci, forma, mapa
├── 404.html        # Stranica za nepostojeći link
├── css/style.css
├── js/main.js
├── assets/         # logo, favicon, pattern, og-image.jpg, img/<kategorija>/
├── sitemap.xml     # za Google Search Console
├── robots.txt
└── .htaccess       # 404 stranica + (zakomentarisano) HTTPS/www preusmeravanje
```

## Header i footer
Isti su na svim stranicama. Ako menjaš meni ili kontakt u footeru, izmeni ga u SVIH 13 HTML fajlova (i u usluge/).
Aktivna stranica u meniju se označava sa `aria-current="page"` na odgovarajućem linku.

## Putanje
Stranice u folderu `usluge/` koriste putanje sa `../` (npr. `../css/style.css`, `../kontakt.html`).
Kada praviš novu stranicu u tom folderu, kopiraj postojeću (npr. kuhinje.html) i izmeni samo sadržaj.

## Keš
CSS i JS su učitani sa `?v=5`. Posle izmene CSS-a ili JS-a povećaj broj u svim HTML fajlovima.

## Pre objavljivanja
- [ ] Domen: svuda je `https://www.milensa.rs` (canonical, og:url, sitemap, robots, JSON-LD). Zameniti ako je drugačiji.
- [ ] Pravi tekstovi i brojke (kontakt podaci su uneti)
- [ ] Aktivirati FormSubmit: poslati prvi upit sa sajta i kliknuti link u mejlu na milensa.namestaj@gmail.com
- [ ] Tekstovi na stranicama usluga (moji predlozi, proveriti sa klijentom)
- [ ] Prijaviti sitemap u Google Search Console

## Fotografije
Svaka fotografija postoji u 3 veličine (WebP, bez EXIF/GPS podataka):
- `-sm.webp` 800 px širine (galerija, kartice)
- `-md.webp` 1400 px širine
- `-lg.webp` do 2400 px po dužoj strani (uvećan prikaz u lightbox-u)
Browser sam bira veličinu preko `srcset`/`sizes`.

Dodavanje nove fotografije u galeriju: kopirati jedan `<a class="gallery__item">` blok
(u projekti.html i na stranici usluge), promeniti putanje i `data-category`.
Galerije prikazuju prvih 12 (Projekti: 24) fotografija, ostale na dugme „Prikaži sve fotografije".

## Hero na početnoj
Ugrađena je varijanta A (fotografija preko celog ekrana, `<section class="hero hero--full">`,
`<body class="page-home">`). Varijanta B (tekst levo, slika desno) i dalje postoji u CSS-u.
