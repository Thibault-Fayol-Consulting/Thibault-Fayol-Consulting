# Audit complet & plan d'action — Site Barbecue Zone

> **Addendum (06/07/2026)** : cet audit a été rédigé sur la première version de la maquette
> (boutique barbecue générique). Le site a depuis été **repositionné sur l'activité réelle
> de Barbecue Zone** (Pods de cuisine extérieure haut de gamme, modèle lead-gen) et les
> chantiers P0/P1 ont été **implémentés** : CMP + Consent Mode v2, pages légales, formulaires
> branchables + RGPD, polices auto-hébergées, JSON-LD assaini, og-image, sitemap propre,
> événements de conversion, barre CTA mobile, en-têtes de sécurité. La méthodologie et les
> grilles de priorisation restent la référence pour la suite (phase 3+).

> Document de travail — audit technique, SEO, conversion, conformité et sécurité du site vitrine `barbecue-zone-website/`, assorti d'un plan d'action priorisé pour passer de la maquette actuelle à un site de production.
>
> **Date :** juillet 2026 · **Périmètre :** page vitrine one-page livrée sur la branche `claude/barbecue-zone-website-egxpd2` · **Version auditée :** commit initial du site.

---

## 1. Synthèse exécutive

Le site livré est une **maquette statique de très bonne facture technique** (léger, responsive, accessible, SEO on-page propre) mais **non commercialisable en l'état** : il manque les fondations d'un site de production français — mesure d'audience, conformité RGPD, pages légales, back-end des formulaires et vrai catalogue.

| Domaine | Note | Verdict |
|---|:---:|---|
| SEO technique | 🟢 16/20 | Balisage propre ; corriger sitemap, JSON-LD fictif, `og:image`. |
| SEO contenu & maillage | 🟡 10/20 | One-page sans pages catégories/produits → potentiel SEO bridé. |
| Performance / Core Web Vitals | 🟢 17/20 | ~46 Ko de code, très léger ; polices Google bloquantes à optimiser. |
| Accessibilité (RGAA/WCAG) | 🟢 16/20 | Structure exemplaire ; un contraste marginal à corriger. |
| UX & Conversion (CRO) | 🟡 13/20 | Bonnes bases ; manque CTA mobile persistant, réassurance, tracking. |
| **Tracking / Analytics / Google Ads** | 🔴 2/20 | **Aucune mesure.** Bloquant absolu pour une landing page Ads. |
| **Conformité RGPD & légale** | 🔴 3/20 | **Pas de CMP, pas de pages légales.** Risque juridique. |
| Sécurité | 🟡 11/20 | Statique = surface faible ; en-têtes HTTP et anti-spam à prévoir. |
| Qualité du code | 🟢 17/20 | Code natif, lisible, sans dette ; formulaires en démo à brancher. |

**Verdict global : 🟠 maquette solide, ~5 chantiers bloquants avant mise en ligne.**
Les deux urgences pour un contexte Google Ads sont le **tracking (Consent Mode v2 + GA4 + conversions Ads)** et la **conformité RGPD/légale**.

---

## 2. Méthodologie & périmètre

- **Analyse statique du code** (HTML/CSS/JS) livré dans `barbecue-zone-website/`.
- **Rendu réel** via Chromium/Playwright en desktop (1280 px) et mobile (390 px).
- **Mesures automatisées** : poids des fichiers, ratios de contraste WCAG calculés, hiérarchie des titres, labels de formulaire, présence des balises tracking/consentement.
- **Non couvert** (nécessite l'environnement de production) : mesure Core Web Vitals terrain (PageSpeed/CrUX), en-têtes HTTP serveur, comparaison avec le site `barbecuezone.fr` réel — **l'accès à ce dernier étant bloqué par la politique réseau, le contenu audité est celui de la maquette (données placeholder).**

---

## 3. Audit détaillé

Sévérité : 🔴 Critique (bloquant mise en ligne) · 🟠 Majeur · 🟡 Mineur · 🟢 Conforme.

### 3.1 — SEO technique 🟢

| # | Constat | Sévérité |
|---|---|:---:|
| 3.1.1 | `title`, `meta description`, `canonical`, Open Graph/Twitter, `lang="fr"` : **présents et corrects.** | 🟢 |
| 3.1.2 | Hiérarchie des titres : **1 seul `<h1>`, ordre h1→h2→h3 sans saut.** | 🟢 |
| 3.1.3 | **`sitemap.xml` contient des URL à fragment** (`/#categories`, `/#contact`…). Google ignore les ancres : ces entrées sont inutiles voire du bruit. | 🟠 |
| 3.1.4 | **JSON-LD `Store` avec `aggregateRating` fictif (4.8 / 2143 avis) et `telephone` placeholder.** Données structurées non étayées par des avis réels sur la page → risque d'action manuelle Google (« avis non conformes ») et de fausse déclaration. | 🔴 |
| 3.1.5 | **`og:image` référencé (`assets/og-image.jpg`) mais fichier absent.** Aperçu réseaux sociaux cassé. | 🟠 |
| 3.1.6 | Pas de `favicon` haute résolution ni `apple-touch-icon` (seul un emoji SVG inline). | 🟡 |

### 3.2 — SEO contenu & maillage 🟡

| # | Constat | Sévérité |
|---|---|:---:|
| 3.2.1 | **Architecture one-page : aucune page catégorie ni fiche produit indexable.** Impossible de se positionner sur « barbecue au charbon », « plancha inox », etc. → plafond de verre SEO. | 🟠 |
| 3.2.2 | Les 6 cartes « univers » et les 4 produits pointent tous vers `#contact` : **aucun maillage interne réel.** | 🟠 |
| 3.2.3 | Contenu éditorial mince (pas de guides, pas de blog) — or le SEO barbecue se joue sur le contenu conseil (recettes, comparatifs, entretien). | 🟡 |
| 3.2.4 | Pas de `robots meta` problématique ; `robots.txt` correct. | 🟢 |

### 3.3 — Performance & Core Web Vitals 🟢

| # | Constat | Sévérité |
|---|---|:---:|
| 3.3.1 | **Poids total du code ≈ 46 Ko non compressé** (HTML 21,9 + CSS 20,3 + JS 4,7). Excellent, LCP attendu très bas. | 🟢 |
| 3.3.2 | **Polices Google Fonts chargées via `<link>` bloquant le rendu** (2 familles). Même avec `display=swap`, cela crée une dépendance réseau tierce et un risque de FOUT/CLS. | 🟠 |
| 3.3.3 | Illustrations 100 % CSS/emoji : **zéro requête image** aujourd'hui — mais le vrai catalogue apportera le vrai poids : prévoir WebP/AVIF, `width`/`height`, `loading="lazy"`. | 🟡 |
| 3.3.4 | JS en `defer`, animations `will-change`-friendly et `prefers-reduced-motion` respecté. | 🟢 |
| 3.3.5 | `backdrop-filter: blur()` sur le header collant : léger coût GPU sur mobile bas de gamme. | 🟡 |
| 3.3.6 | ⚠️ *Core Web Vitals terrain non mesurés (réseau bloqué). À confirmer via PageSpeed Insights en production.* | — |

### 3.4 — Accessibilité (RGAA / WCAG 2.1 AA) 🟢

| # | Constat | Sévérité |
|---|---|:---:|
| 3.4.1 | `skip-link`, ARIA sur la nav/le burger, `role="status"` sur les messages, `<details>` natif pour la FAQ. | 🟢 |
| 3.4.2 | **5 champs de formulaire, tous associés à un `<label>`.** Aucune image sans `alt` (0 `<img>`). | 🟢 |
| 3.4.3 | **Contraste bandeau marques `#9c918a` sur blanc = 3,07:1.** Passe tout juste le seuil « texte large » (3:1) mais reste limite. Texte courant sur blanc (`#6b625c`) = 5,95:1 → conforme AA. | 🟡 |
| 3.4.4 | Focus clavier : boutons OK (`:focus-visible`), mais **liens de navigation sans anneau de focus visible** marqué (repose sur le soulignement). | 🟡 |
| 3.4.5 | L'ajout au panier (« ✓ Ajouté ») n'est pas annoncé aux lecteurs d'écran (pas de zone `aria-live` panier). | 🟡 |

### 3.5 — UX & Conversion (CRO) 🟡

| # | Constat | Sévérité |
|---|---|:---:|
| 3.5.1 | Points forts : CTA clairs, réassurance (livraison/garantie/SAV), avis, téléphone en en-tête, hero convaincant. | 🟢 |
| 3.5.2 | **Pas de CTA persistant sur mobile** (barre « Appeler / Voir les barbecues » collée en bas) — levier de conversion majeur sur mobile. | 🟠 |
| 3.5.3 | **Pas de réassurance au point de conversion** : coût/délai de livraison chiffré, moyens de paiement, mention RGPD sous le formulaire. | 🟠 |
| 3.5.4 | Pas de click-to-call traqué, pas de chat, pas d'indicateur de stock/urgence. | 🟡 |
| 3.5.5 | Formulaires **fonctionnels côté client mais non branchés** : une soumission n'envoie rien → fuite de leads si mis en ligne tel quel. | 🔴 |

### 3.6 — Tracking, Analytics & Google Ads 🔴

| # | Constat | Sévérité |
|---|---|:---:|
| 3.6.1 | **Aucune balise de mesure : ni GA4, ni Google Tag Manager, ni tag Google Ads.** | 🔴 |
| 3.6.2 | **Aucun suivi de conversion Ads** (formulaire, click-to-call, ajout panier) → impossible d'optimiser les campagnes, le Smart Bidding pilote à l'aveugle. | 🔴 |
| 3.6.3 | **Pas de Consent Mode v2** (obligatoire pour la mesure Ads/Analytics dans l'EEE depuis 2024). | 🔴 |
| 3.6.4 | Pas d'Enhanced Conversions, pas de suivi d'appels, pas d'événements sur les CTA. | 🟠 |
| 3.6.5 | *C'est le chantier n°1 pour un site pensé « landing page Google Ads » — sujet cœur de métier de Thibault Fayol Consulting.* | — |

### 3.7 — Conformité RGPD & légale (France) 🔴

| # | Constat | Sévérité |
|---|---|:---:|
| 3.7.1 | **Mentions légales, CGV et Politique de confidentialité = liens morts (`href="#"`, lignes 478-480).** Obligatoires (LCEN / Code de la consommation). | 🔴 |
| 3.7.2 | **Aucune CMP / bandeau cookies.** Dès qu'un tag marketing sera posé, consentement préalable requis (CNIL). | 🔴 |
| 3.7.3 | **Formulaire de contact sans mention d'information RGPD ni case de consentement** (finalité, base légale, droits). | 🟠 |
| 3.7.4 | **Google Fonts chargées depuis les serveurs Google** = transfert d'IP à un tiers US. Jurisprudence (LG München 2022) et vigilance CNIL → **auto-héberger les polices.** | 🟠 |

### 3.8 — Sécurité 🟡

| # | Constat | Sévérité |
|---|---|:---:|
| 3.8.1 | Site statique = surface d'attaque faible (pas de base de données, pas de back-end exposé). | 🟢 |
| 3.8.2 | **En-têtes de sécurité à définir côté hébergement** : `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, HSTS. | 🟠 |
| 3.8.3 | À la mise en service des formulaires : **anti-spam (honeypot + reCAPTCHA/Turnstile), validation serveur, rate-limiting** indispensables. | 🟠 |
| 3.8.4 | Forcer HTTPS + redirection `www`/apex canonique. | 🟡 |

### 3.9 — Qualité du code & maintenabilité 🟢

| # | Constat | Sévérité |
|---|---|:---:|
| 3.9.1 | HTML/CSS/JS natifs, sans build ni dépendance : lisible, versionnable, facile à reprendre. | 🟢 |
| 3.9.2 | CSS structuré par sections avec variables ; JS en IIFE `"use strict"`, sobre. | 🟢 |
| 3.9.3 | Pas de tests, pas de CI, pas de linter/formatter (HTMLHint/Stylelint/ESLint). | 🟡 |
| 3.9.4 | Données de contact en dur (`04 00 00 00 00`, `contact@barbecuezone.fr`) dupliquées en plusieurs endroits → centraliser à terme. | 🟡 |

---

## 4. Plan d'action priorisé

Priorités : **P0** = bloquant avant mise en ligne · **P1** = fort impact court terme · **P2** = moyen terme / croissance.
Effort indicatif : ⏱️ faible (≤ ½ j) · ⏱️⏱️ moyen (1-3 j) · ⏱️⏱️⏱️ élevé (> 3 j).

| Prio | Action | Domaine | Impact | Effort |
|:---:|---|---|:---:|:---:|
| **P0** | Rédiger et brancher **Mentions légales, CGV, Politique de confidentialité** | Légal | Élevé | ⏱️⏱️ |
| **P0** | Installer une **CMP + Consent Mode v2** (Axeptio/Tarteaucitron/CookieYes) | RGPD | Élevé | ⏱️⏱️ |
| **P0** | **Brancher les formulaires** à un back-end (service email/API) + anti-spam + validation serveur | Conversion/Sécurité | Élevé | ⏱️⏱️ |
| **P0** | **Auto-héberger les polices** (supprimer l'appel Google Fonts) | RGPD/Perf | Moyen | ⏱️ |
| **P0** | Corriger le **JSON-LD** (retirer l'`aggregateRating` fictif, vrai téléphone/adresse) | SEO | Moyen | ⏱️ |
| **P0** | Ajouter la vraie **`og-image.jpg`** (1200×630) | SEO/Social | Moyen | ⏱️ |
| **P1** | Poser **GTM + GA4 + tag Google Ads** derrière le consentement | Tracking | Élevé | ⏱️⏱️ |
| **P1** | Configurer les **conversions Ads** (formulaire, click-to-call, ajout panier) + Enhanced Conversions | Tracking | Élevé | ⏱️⏱️ |
| **P1** | **Barre CTA mobile persistante** (Appeler / Voir les barbecues) | CRO | Élevé | ⏱️ |
| **P1** | **Réassurance au point de conversion** (délai/coût livraison, paiement, mention RGPD) | CRO | Moyen | ⏱️ |
| **P1** | Nettoyer le **`sitemap.xml`** (supprimer les URL à fragment) | SEO | Faible | ⏱️ |
| **P1** | Corriger le **contraste du bandeau marques** + focus visible sur les liens | A11y | Faible | ⏱️ |
| **P2** | Créer de **vraies pages catégories & fiches produits** (+ `Product`/`BreadcrumbList` JSON-LD) | SEO | Élevé | ⏱️⏱️⏱️ |
| **P2** | **Contenu éditorial** : guides d'achat, recettes, entretien (SEO longue traîne) | SEO | Élevé | ⏱️⏱️⏱️ |
| **P2** | **En-têtes de sécurité HTTP** (CSP, HSTS…) + HTTPS/canonique | Sécurité | Moyen | ⏱️ |
| **P2** | Optimiser les **vraies images** (WebP/AVIF, lazy-load, dimensions) | Perf | Moyen | ⏱️⏱️ |
| **P2** | **Lint + CI** (HTMLHint/Stylelint/ESLint, GitHub Actions) | Qualité | Faible | ⏱️ |
| **P2** | Trancher **statique enrichi vs plateforme e-commerce** (cf. §6) | Stratégie | Élevé | ⏱️⏱️⏱️ |

---

## 5. Roadmap par phases

### Phase 0 — Mise en conformité « avant mise en ligne » (≈ 1 semaine)
Toutes les actions **P0**. Objectif : un site **légalement publiable et qui ne perd aucun lead**. Livrables : 3 pages légales, CMP + Consent Mode, formulaires branchés + anti-spam, polices auto-hébergées, JSON-LD assaini, `og-image`.

### Phase 1 — Mesure & conversion (≈ 1 semaine)
Actions **P1**. Objectif : **rendre les campagnes Google Ads pilotables**. GTM/GA4/Ads sous consentement, conversions + Enhanced Conversions + suivi d'appels, CTA mobile, réassurance. C'est la phase à plus fort ROI pour l'acquisition payante.

### Phase 2 — SEO & contenu (2-4 semaines)
Pages catégories/produits, données structurées produit, maillage interne, guides/recettes, optimisation images. Objectif : **capter le trafic organique** en complément du payant.

### Phase 3 — Industrialisation (continu)
Sécurité (en-têtes HTTP), lint + CI, tests de rendu, monitoring (uptime, erreurs), suivi Core Web Vitals terrain.

### Phase 4 — E-commerce (si stratégie de vente en ligne)
Panier réel, paiement (Stripe/PayPlug), gestion stock/commandes — ou **migration vers une plateforme** (cf. §6).

---

## 6. Décision structurante : statique enrichi vs plateforme e-commerce

| Option | Quand la choisir | Avantages | Limites |
|---|---|---|---|
| **Statique enrichi** (l'actuel + pages produits générées) | Vitrine + génération de leads, catalogue restreint, vente par téléphone/devis | Ultra-rapide, peu coûteux, SEO/CWV excellents, sécurité maximale | Pas de vente en ligne native, gestion catalogue manuelle |
| **Shopify** | Vente en ligne rapide, sans maintenance technique | Time-to-market, paiement/stock/SAV intégrés | Coût mensuel, moins de liberté design/SEO technique |
| **WooCommerce / PrestaShop** | Vente en ligne + contrôle total, catalogue large | Flexibilité, écosystème FR, maîtrise SEO | Maintenance, sécurité et perf à gérer soi-même |

**Recommandation :** conserver la base statique comme **landing page d'acquisition** (parfaite pour Google Ads) et, si la vente en ligne est un objectif, y adosser une plateforme e-commerce plutôt que redévelopper un panier maison.

---

## 7. Quick wins (< 1 jour, fort ratio impact/effort)

1. Supprimer l'appel Google Fonts → polices auto-hébergées (RGPD + perf).
2. Retirer l'`aggregateRating` fictif du JSON-LD (risque pénalité).
3. Nettoyer le `sitemap.xml` (URL à fragment).
4. Ajouter la vraie `og-image.jpg`.
5. Corriger le contraste du bandeau marques + focus visible des liens.
6. Barre CTA mobile persistante (Appeler / Découvrir).
7. Ajouter la mention RGPD + case de consentement sous le formulaire de contact.

---

## 8. Annexe — Mesures brutes

```
Poids du code (non compressé)
  index.html ............ 21 917 o
  assets/css/styles.css . 20 263 o
  assets/js/main.js .....  4 704 o
  TOTAL ................. 46 884 o

Accessibilité
  <h1> ................... 1 (ordre des titres : OK)
  Champs de formulaire .. 5 (labellisés : 5 / non labellisés : 0)
  Images sans alt ....... 0
  lang .................. fr   |   viewport : OK

Contrastes WCAG (texte / fond)
  .section__sub  #6b625c / blanc ...... 5,95:1  ✅ AA
  .cat-card p    #6b625c / blanc ...... 5,95:1  ✅ AA
  .brands li     #9c918a / blanc ...... 3,07:1  ⚠️ limite (texte large)
  .footer li     #cbc1b8 / charbon .... 10,15:1 ✅ AAA
  .announce      #f3ede6 / charbon .... 15,46:1 ✅ AAA
  (hero : texte clair sur dégradé sombre — conforme, > 10:1)

Tracking / conformité
  GA4 / GTM / Google Ads .... aucun
  CMP / consentement ........ aucun
  Pages légales ............. 3 liens morts (href="#")
  og-image.jpg .............. absent
```

---

*Audit réalisé sur la maquette de la branche `claude/barbecue-zone-website-egxpd2`. Les données de contenu (catalogue, avis, coordonnées) étant des placeholders, certains constats disparaîtront une fois les vraies données intégrées ; les chantiers P0/P1 restent valables dans tous les cas.*
