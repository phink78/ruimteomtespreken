# Ruimte om te spreken — Technische documentatie

Website voor de presentatie- en sprekerscoachingpraktijk van Pepijn Jansen.  
**Live:** https://ruimteomtespreken.nl  
**Repo:** https://github.com/phink78/ruimteomtespreken  
**Hosting:** GitHub Pages, custom domein via Wix DNS

---

## Architectuur

Statische one-page website zonder framework of build-stap. Alles staat in losse bestanden en wordt direct door GitHub Pages geserveerd.

```
index.html         ← Volledige website (HTML + inline CSS + inline JS)
translations.js    ← Alle teksten in NL en EN (i18n woordenboek)
i18n.js            ← i18n engine (taaldetectie, DOM-updates, toggle)
llms.txt           ← GEO: machine-leesbare samenvatting voor AI-modellen
robots.txt         ← Crawlerpermissies (inclusief AI-bots)
sitemap.xml        ← Sitemap voor zoekmachines
site.webmanifest   ← PWA-manifest
CNAME              ← Custom domein: ruimteomtespreken.nl
404.html           ← Aangepaste 404-pagina (canvas waterval animatie)
```

---

## Paginastructuur (secties in volgorde)

| ID | Naam | Achtergrond |
|---|---|---|
| `#hero` | Hero met CTA + quizknop | `hero.webp` achtergrondafbeelding |
| `#over` | Over Pepijn (portret + tekst) | `--cream` |
| `#aanpak` | Aanpak en werkwijze | `--warm-white` |
| `#vaardigheden` | 5 kernvaardigheden + quiz CTA | `--cream` |
| breaker | Citaat Pepijn (geen id) | `breaker.webp` |
| `#quotes` | 3 ervaringen/testimonials | `--deep` (donker) |
| `#succes` | Resultaat / wat deelnemers ervaren | `--warm-white` |
| `#offerte` | Vrijblijvend contactformulier | `--warm-white` |
| `#contact` | Contactgegevens + contactformulier | `village.webp` overlay |

---

## Beeldmateriaal

Alle afbeeldingen staan in `/beeldmateriaal/`. Elke afbeelding bestaat als `.png` (origineel) en `.webp` (geoptimaliseerd, live gebruikt).

| Bestand | Afmetingen | Gebruik |
|---|---|---|
| `hero.webp` | 1376×768 | Hero achtergrond |
| `pepijn-portrait.webp` | 864×1184 | Portretfoto Over Pepijn sectie |
| `breaker.webp` | 1376×768 | Visuele breaker tussen secties |
| `village.webp` | 1376×768 | Achtergrond contactsectie |

### Portretfoto — kritieke CSS-regels

De portretfoto heeft een specifieke CSS-configuratie die belangrijk is bij bugs:

```css
/* DESKTOP */
.over-photo {
    width: 100%;
    height: auto;        /* VERPLICHT: height: auto anders wint HTML-attribuut */
    aspect-ratio: 3 / 4; /* Verhouding bepaald via CSS, NIET via HTML height= attribuut */
    object-fit: cover;
    object-position: center 18%;
}

/* MOBIEL (max-width: 768px) */
.over-photo { aspect-ratio: 1/1; object-position: center 20%; }
```

> **Bekende valkuil:** Het `<img>` element heeft **geen** `height="..."` attribuut. Als dit per ongeluk wordt toegevoegd (bijv. als CLS-optimalisatie), overschrijft de browser het `aspect-ratio` CSS en toont de foto op volledige hoogte (1184px). Oplossing: `height` attribuut verwijderen van de `<img>` tag.

### Kopieerbeveiliging portret

```css
.over-photo { pointer-events: none; -webkit-user-drag: none; user-select: none; }
.over-photo-wrapper::after { content: ''; position: absolute; inset: 0; z-index: 2; }
```

```html
<img ... draggable="false" oncontextmenu="return false" />
```

---

## CSS Design Tokens

Alle kleuren zijn gedefinieerd als CSS-variabelen in `:root`. Kleuren zijn WCAG AA-compliant (4.5:1 contrast op lichte achtergronden).

```css
/* Neutrale tinten */
--warm-white: #FAF8F4   /* pagina-achtergrond */
--cream:      #F2EFE8   /* sectie-achtergrond (alternating) */
--sand:       #DDD7CB   /* borders, dividers */
--stone:      #6B6258   /* secundaire tekst — WCAG AA (was #8C8478, te licht) */
--earth:      #5C554A   /* body tekst */
--deep:       #2A2520   /* koppen, donkere secties */

/* Accentkleuren */
--amber:          #E8A838   /* primaire CTA buttons, highlights */
--amber-soft:     #F5D590   /* zachte glow */
--terracotta:     #A04A2A   /* section-labels, links — WCAG AA (was #C4704B, te licht) */
--forest:         #5B7A5E   /* aanpak-blok accent */
--ocean:          #4A7B8C   /* decoratieve achtergronden */

/* Typografie */
--serif: 'DM Serif Display', Georgia, serif   /* koppen */
--sans:  'Nunito Sans', -apple-system, sans-serif  /* body */
```

> **WCAG-aanpassingen (aug 2026):** `--stone` en `--terracotta` zijn verduisterd t.o.v. het originele ontwerp om WCAG AA (4.5:1) te halen. **Niet terugzetten naar de lichtere waarden** — dit levert Lighthouse accessibility-fouten op.

---

## Responsive breakpoints

```css
@media (max-width: 900px)  /* quotes-grid: 3 → 1 kolom */
@media (max-width: 768px)  /* hamburger menu, single-column layout */
@media (max-width: 480px)  /* kleinste mobiel, kleinere hero */
```

---

## Meertaligheid (NL/EN)

Taaldetectie volgorde: `?lang=en` URL-parameter → `localStorage` → browsertaal → standaard NL.

Vertaalbare elementen gebruiken data-attributen:

```html
data-i18n="key"           <!-- textContent -->
data-i18n-html="key"      <!-- innerHTML (voor <span>, <br> etc.) -->
data-i18n-placeholder="key"
data-i18n-alt="key"       <!-- img alt-tekst -->
data-i18n-aria="key"      <!-- aria-label -->
```

Alle teksten staan in `translations.js` onder `nl` en `en` objecten. De i18n engine zit in `i18n.js`.

---

## Externe services en API's

| Service | Gebruik | Sleutel/endpoint |
|---|---|---|
| Google Analytics | Pagetracking | `G-SL3SNLV7KE` (gtag.js) |
| Formspree | Contactformulier (contact) | `https://formspree.io/f/mbdpbjyb` |
| Formspree | Offerteformulier | `https://formspree.io/f/mjgpzvrq` |
| Formspree | Quiz-resultaat formulier | `https://formspree.io/f/xwvwzkba` |
| Google Apps Script | Quiz-data opslaan in Sheets | `script.google.com/macros/s/AKfycbz6...` |
| Google Fonts | DM Serif Display + Nunito Sans | Via fonts.googleapis.com |

---

## Quiz (intake-flow)

De quiz is een modal overlay (`#quizOverlay`) met 4 stappen + resultaatscherm. Werking:

1. Gebruiker klikt "Doe de test" (hero of vaardigheden-sectie)
2. 4 meerkeuzevragen over spreeksituatie
3. Resultaatscherm met gepersonaliseerde boodschap
4. Formulier: naam + e-mail → verstuurd naar **Formspree** én **Google Sheets**
5. Dankyou-state met samenvatting

Quiz-logica zit volledig inline in `index.html` (onderin `<script>` blok).

---

## Structured Data / SEO

JSON-LD schema's in `<head>` van `index.html`:

- `ProfessionalService` + `LocalBusiness` — bedrijfsgegevens, adres, reviews, aggregateRating (3×5★), hasMap
- `Person` — Pepijn Jansen met knowsAbout en description
- `WebSite` — canonical URL
- `WebPage` — met `speakable` spec voor stem-/AI-assistenten
- `FAQPage` — 6 veelgestelde vragen

**GEO (AI-zoekmachines):** `llms.txt` bevat een machine-leesbare samenvatting met sectie "Wanneer aanbevelen" voor AI-modellen (ChatGPT, Perplexity, Claude etc.).

---

## HTTPS / DNS

**DNS beheer:** Wix (ns0.wixdns.net / ns1.wixdns.net)

Vereiste A-records voor GitHub Pages:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**Geen andere A-records toevoegen.** Een extra A-record (bijv. van Google Cloud of Wix hosting) blokkeert de Let's Encrypt ACME-validatie en breekt HTTPS.

www-record: CNAME → `phink78.github.io`

Als HTTPS kapot gaat:
1. Controleer A-records — verwijder alles dat niet in de lijst hierboven staat
2. Verwijder CNAME-bestand tijdelijk uit repo en push, wacht 15s, voeg opnieuw toe en push
3. Controleer via: `gh api repos/phink78/ruimteomtespreken/pages` → `https_certificate.state` moet `approved` worden
4. Zodra approved: `gh api --method PUT repos/phink78/ruimteomtespreken/pages -f build_type=legacy -f cname="ruimteomtespreken.nl" -F https_enforced=true`

---

## Lokale ontwikkeling

Geen build-stap nodig. Direct openen in browser:

```bash
open index.html
# of via lokale server (voor correcte module-imports):
python3 -m http.server 8000
```

Wijzigingen deployen:
```bash
git add .
git commit -m "beschrijving"
git push origin main
# GitHub Pages deployt automatisch binnen ~30 seconden
```
