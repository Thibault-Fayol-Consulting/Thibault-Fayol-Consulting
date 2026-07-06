/* =========================================================
   Barbecue Zone — configuration centrale du site
   Renseignez vos identifiants ici : tout le reste (consentement,
   tags, formulaires, téléphone) se branche automatiquement.
   ========================================================= */
window.BZ_CONFIG = {
  /* --- Mesure (laisser vide tant que non attribué) --- */
  GTM_ID: "",              // ex : "GTM-XXXXXXX"  (recommandé : tout gérer via GTM)
  GA4_ID: "",              // ex : "G-XXXXXXXXXX" (si pas de GTM)
  ADS_ID: "",              // ex : "AW-XXXXXXXXX" (tag Google Ads, si pas de GTM)

  /* --- Formulaires ---
     Endpoint HTTP qui recevra les soumissions en POST (FormData) :
     Formspree, Brevo, Netlify Forms, API maison…
     Laisser vide = mode démonstration (aucune donnée envoyée). */
  FORM_ENDPOINT: "",       // ex : "https://formspree.io/f/xxxxxxxx"
  NEWSLETTER_ENDPOINT: "", // ex : "https://votre-esp.tld/subscribe"

  /* --- Coordonnées (source unique de vérité) --- */
  PHONE: "+33400000000",         // format tel:
  PHONE_DISPLAY: "04 00 00 00 00",
  EMAIL: "contact@barbecuezone.fr"
};
