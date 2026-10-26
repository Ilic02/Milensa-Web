# Milensa — sajt (više stranica)

Statični sajt: HTML + CSS + vanilla JS, bez build alata.

```
milensa-site/
├── index.html      # Početna: hero, kratko o nama, pregled usluga, izdvojeni projekti, utisak
├── o-nama.html     # Priča, brojke, vrednosti, radionica
├── usluge.html     # 4 usluge detaljno (#kuhinje #plakari #boravak #poslovni) + proces
├── projekti.html   # Svi projekti + filter (radi i preko ?kategorija=kuhinje)
├── kontakt.html    # Kontakt podaci, forma, mapa
├── 404.html        # Stranica za nepostojeći link
├── css/style.css
├── js/main.js
├── assets/         # logo, favicon, pattern, img/
├── sitemap.xml     # za Google Search Console
├── robots.txt
└── .htaccess       # 404 stranica + (zakomentarisano) HTTPS/www preusmeravanje
```

## Header i footer
Isti su na svim stranicama. Ako menjaš meni ili kontakt u footeru, izmeni ga u SVIH 6 HTML fajlova.
Aktivna stranica u meniju se označava sa `aria-current="page"` na odgovarajućem linku.

## Pre objavljivanja
- [ ] Domen: svuda je `https://www.milensa.rs` (canonical, og:url, sitemap, robots, JSON-LD). Zameniti ako je drugačiji.
- [ ] `assets/og-image.jpg` (1200×630) — slika za prikaz linka na društvenim mrežama
- [ ] Pravi tekstovi, brojke, kontakt podaci (i u JSON-LD bloku u index.html)
- [ ] Fotografije umesto `.img-ph` blokova
- [ ] Google Maps iframe na kontakt.html
- [ ] Slanje forme (TODO u js/main.js)
- [ ] Prijaviti sitemap u Google Search Console
