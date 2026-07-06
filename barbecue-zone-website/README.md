# Barbecue Zone — Landing lead-gen « Pods » (cuisine extérieure premium)

Maquette de site pour **Barbecue Zone** (barbecuezone.fr) : cuisines d'été extérieures
fermées en inox 304, sur mesure, posées en 1 journée — **12 490 € à 17 900 € TTC**.
Site orienté **génération de leads** (étude gratuite), avec CMP RGPD maison,
**Google Consent Mode v2** et événements de conversion prêts pour Google Ads.
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
├── index.html                 # Landing : hero, 3 Pods, concept/comparatif, processus,
│                              #   FAQ, guide (lead magnet), formulaire d'étude qualifiant
├── pod-compact.html           # Fiches produit (12 490 €) — JSON-LD Product + Breadcrumb
├── pod-riviera.html           #   (14 900 €, « le plus choisi »)
├── pod-signature.html         #   (17 900 €)
├── mentions-legales.html      # Pages légales (gabarits à compléter, noindex)
├── cgv.html                   #   CGV adaptées au sur-mesure (rétractation L221-28 3°)
├── confidentialite.html
├── 404.html
├── robots.txt · sitemap.xml
├── _headers · .htaccess       # En-têtes de sécurité (Netlify/CF Pages · Apache)
├── AUDIT.md                   # Audit + plan d'action (rédigé sur la v1, méthodo réutilisable)
└── assets/
    ├── css/styles.css
    ├── js/config.js           # ← IDs GTM/GA4/Ads, endpoints formulaires, téléphone
    ├── js/consent.js          # CMP maison + Consent Mode v2 (défaut : tout refusé)
    ├── js/main.js             # UI + formulaire d'étude + événements dataLayer
    ├── fonts/README.md        # Polices auto-hébergées (RGPD) — mode d'emploi
    └── og-image.jpg           # Image de partage 1200×630
```

## Mesure & conversions (Google Ads ready)

- **Consent Mode v2**, tags chargés uniquement après consentement (mode basique CNIL).
- Événements `dataLayer` : **`generate_lead`** (formulaire d'étude, avec modèle envisagé et
  département), **`phone_call`** (click-to-call), **`select_item`** (choix d'un Pod),
  **`newsletter_signup`** (guide) → à mapper en conversions dans GTM/Google Ads.
- Formulaire d'étude **qualifiant** : téléphone requis, code postal, modèle envisagé
  (pré-rempli au clic sur une carte Pod), honeypot anti-spam, consentement RGPD.

## Mise en service (checklist)

1. `assets/js/config.js` : IDs GTM/GA4/Ads, `FORM_ENDPOINT`, coordonnées réelles.
2. Remplacer `04 00 00 00 00` / `contact@barbecuezone.fr` dans les pages.
3. Compléter et faire valider les pages légales (`[À COMPLÉTER]`).
4. Déposer les `.woff2` dans `assets/fonts/` et décommenter les `@font-face`.
5. Remplacer les illustrations CSS par de vraies photos produit (WebP + lazy-load).
6. Servir en HTTPS avec les en-têtes de `_headers` ou `.htaccess`.

## Accessibilité & performance

Skip-link, ARIA, navigation clavier avec focus visible, `prefers-reduced-motion`,
contrastes AA, aucune ressource externe, ~55 Ko de code au total.
