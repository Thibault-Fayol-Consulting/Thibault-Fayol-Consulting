# Barbecue Zone — Site vitrine multi-pages

Site vitrine pour **Barbecue Zone** : page d'accueil conversion-first (pensée landing Google Ads),
6 pages catégories SEO, pages légales, CMP RGPD maison avec Consent Mode v2 et tracking prêt à brancher.
100 % statique, **zéro build, zéro dépendance**.

## Aperçu

```bash
cd barbecue-zone-website
python3 -m http.server 8000
# puis http://localhost:8000
```

## Structure

```
barbecue-zone-website/
├── index.html                 # Accueil / landing (hero, univers, best-sellers, guide, avis, contact)
├── barbecue-charbon.html      # Pages catégories : produits + conseils + FAQ
├── barbecue-gaz.html          #   + fil d'Ariane et BreadcrumbList JSON-LD
├── barbecue-electrique.html
├── planchas.html
├── fumoirs.html
├── accessoires.html
├── mentions-legales.html      # Pages légales (gabarits à compléter, noindex)
├── cgv.html
├── confidentialite.html
├── 404.html
├── robots.txt · sitemap.xml
├── _headers · .htaccess       # En-têtes de sécurité (Netlify/CF Pages · Apache)
├── AUDIT.md                   # Audit complet + plan d'action (FR)
└── assets/
    ├── css/styles.css
    ├── js/config.js           # ← IDs GTM/GA4/Ads, endpoints formulaires, téléphone
    ├── js/consent.js          # CMP maison + Google Consent Mode v2 (défaut : tout refusé)
    ├── js/main.js             # UI + formulaires + événements dataLayer
    ├── fonts/README.md        # Polices auto-hébergées (RGPD) — mode d'emploi
    └── og-image.jpg           # Image de partage 1200×630
```

## Mise en service (checklist)

1. **`assets/js/config.js`** : renseigner `GTM_ID` (ou `GA4_ID`/`ADS_ID`), `FORM_ENDPOINT`,
   `NEWSLETTER_ENDPOINT`, téléphone et email réels.
2. **Coordonnées** : remplacer `04 00 00 00 00` / `contact@barbecuezone.fr` dans les pages HTML.
3. **Pages légales** : compléter les champs `[À COMPLÉTER]` et faire valider juridiquement.
4. **Polices** : déposer les `.woff2` dans `assets/fonts/` et décommenter le bloc `@font-face`
   (voir `assets/fonts/README.md`).
5. **Catalogue** : remplacer les produits de démonstration par le vrai catalogue.
6. **Hébergement** : servir en HTTPS avec les en-têtes de `_headers` ou `.htaccess`.

## Mesure & conversions (Google Ads ready)

- **Consent Mode v2** : consentement par défaut refusé, bandeau CMP sans dépendance,
  choix mémorisé 6 mois, ré-ouvrable via « Gérer les cookies ».
- Les tags (GTM ou gtag.js) ne se chargent **qu'après consentement** (mode basique, conforme CNIL).
- Événements poussés dans le `dataLayer` : `generate_lead` (formulaire), `phone_call`
  (click-to-call), `add_to_cart`, `newsletter_signup` → à mapper en conversions dans GTM/Google Ads.

## Formulaires

Sans `FORM_ENDPOINT` configuré, les formulaires fonctionnent en **mode démonstration**
(aucune donnée envoyée). Avec un endpoint (Formspree, Brevo, API maison…), l'envoi se fait
en `POST FormData` avec anti-spam honeypot et case de consentement RGPD obligatoire.

## Accessibilité & performance

Skip-link, ARIA, navigation clavier avec focus visible, `prefers-reduced-motion`,
contrastes AA, aucune image externe (illustrations CSS/emoji), ~50 Ko de code au total.
