# Barbecue Zone — Site vitrine

Site vitrine one-page pour **Barbecue Zone**, spécialiste du barbecue, de la plancha et du fumoir.
Page moderne, responsive, optimisée SEO et pensée pour la conversion (parfait comme page de destination Google Ads).

## Aperçu

Ouvrez simplement `index.html` dans un navigateur — le site est 100 % statique, sans build ni dépendance à installer.

```bash
# ou servez-le localement
cd barbecue-zone-website
python3 -m http.server 8000
# puis http://localhost:8000
```

## Contenu

| Section | Rôle |
|---------|------|
| Hero | Accroche + double CTA (découvrir / conseil) |
| Engagements (USP) | Livraison, garantie, retours, SAV |
| Nos univers | 6 catégories (charbon, gaz, électrique, plancha, fumoir, accessoires) |
| Meilleures ventes | 4 fiches produits avec prix, notes, badges |
| Guide d'achat | Bloc conseil + FAQ dépliable |
| Marques | Bandeau des marques distribuées |
| Avis clients | 3 témoignages + note globale |
| Newsletter | Capture d'email avec validation |
| Contact | Coordonnées + formulaire validé |

## Choix techniques

- **Zéro dépendance** : HTML/CSS/JS natifs, aucun framework, aucun build.
- **Illustrations sans images externes** : barbecue et braises en CSS/emoji → rien ne casse hors-ligne.
- **SEO** : balises meta, Open Graph/Twitter, `canonical`, données structurées JSON-LD (`Store`), `robots.txt` et `sitemap.xml`.
- **Accessibilité** : navigation clavier, `skip-link`, libellés ARIA, `prefers-reduced-motion` respecté.
- **Performance** : CSS et JS séparés et légers, `defer` sur le script, animations GPU-friendly.

## Structure

```
barbecue-zone-website/
├── index.html
├── robots.txt
├── sitemap.xml
├── README.md
└── assets/
    ├── css/styles.css
    └── js/main.js
```

## À personnaliser avant mise en ligne

- Téléphone, email et adresse (placeholders `04 00 00 00 00`, `contact@barbecuezone.fr`).
- Le formulaire et la newsletter sont en démo côté client — brancher un back-end / service d'emailing.
- Remplacer les fiches produits par le vrai catalogue.
- Ajouter une vraie image `og-image.jpg` pour le partage sur les réseaux.

Les formulaires sont volontairement simulés côté navigateur (aucune donnée n'est envoyée) tant qu'un back-end n'est pas branché.
