# Polices auto-hébergées

Pour des raisons de **RGPD** (pas de transfert d'IP vers Google Fonts) et de
**performance** (pas de requête tierce bloquante), les polices sont servies
depuis ce dossier.

## Marche à suivre

1. Téléchargez les fichiers `.woff2` (par exemple via [gwfh.mranftl.com](https://gwfh.mranftl.com/fonts) —
   « google-webfonts-helper ») :
   - `barlow-condensed-v13-latin-700.woff2`
   - `barlow-condensed-v13-latin-800.woff2`
   - `inter-v20-latin-regular.woff2`
   - `inter-v20-latin-600.woff2`
2. Déposez-les dans ce dossier (`assets/fonts/`).
3. Décommentez le bloc `@font-face` en tête de `assets/css/styles.css`.

En attendant, le site utilise une pile de polices système : aucun rendu cassé,
simplement un style typographique un peu moins marqué.
