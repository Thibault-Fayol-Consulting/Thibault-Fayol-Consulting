/* =========================================================
   Barbecue Zone — gestion du consentement (CMP légère)
   + Google Consent Mode v2.

   Fonctionnement (mode "basique", conforme aux attentes CNIL) :
   - Consentement par défaut : tout refusé.
   - Aucun tag de mesure n'est chargé avant un choix positif.
   - Choix mémorisé 6 mois (localStorage), modifiable à tout moment
     via le lien "Gérer les cookies" (window.BZ_openConsent).
   ========================================================= */
(function () {
  "use strict";

  var KEY = "bz-consent-v1";
  var SIX_MONTHS = 1000 * 60 * 60 * 24 * 182;
  var cfg = window.BZ_CONFIG || {};

  /* ----- Consent Mode v2 : défauts refusés, posés avant tout tag ----- */
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500
  });

  function readChoice() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var c = JSON.parse(raw);
      if (!c || typeof c.ts !== "number" || Date.now() - c.ts > SIX_MONTHS) return null;
      return c;
    } catch (e) { return null; }
  }

  function saveChoice(analytics, ads) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ analytics: !!analytics, ads: !!ads, ts: Date.now() }));
    } catch (e) { /* stockage indisponible : le bandeau réapparaîtra */ }
  }

  function applyChoice(c) {
    gtag("consent", "update", {
      analytics_storage: c.analytics ? "granted" : "denied",
      ad_storage: c.ads ? "granted" : "denied",
      ad_user_data: c.ads ? "granted" : "denied",
      ad_personalization: c.ads ? "granted" : "denied"
    });
    if (c.analytics || c.ads) loadTags();
  }

  /* ----- Chargement des tags, uniquement après consentement ----- */
  var tagsLoaded = false;
  function loadTags() {
    if (tagsLoaded) return;
    tagsLoaded = true;

    if (cfg.GTM_ID) {
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      inject("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(cfg.GTM_ID));
      return; // GTM pilote GA4/Ads : ne pas doubler les tags
    }
    var first = cfg.GA4_ID || cfg.ADS_ID;
    if (!first) return;
    inject("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(first));
    gtag("js", new Date());
    if (cfg.GA4_ID) gtag("config", cfg.GA4_ID);
    if (cfg.ADS_ID) gtag("config", cfg.ADS_ID);
  }

  function inject(src) {
    var s = document.createElement("script");
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  /* ----- Bandeau ----- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html) n.innerHTML = html;
    return n;
  }

  var banner = null;

  function closeBanner() {
    if (banner) { banner.remove(); banner = null; }
  }

  function openBanner(expanded) {
    closeBanner();
    banner = el("div", "consent");
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-modal", "false");
    banner.setAttribute("aria-label", "Gestion des cookies");

    var box = el("div", "consent__box");
    box.appendChild(el("p", "consent__title", "🍪 Respect de votre vie privée"));
    box.appendChild(el("p", "consent__text",
      "Nous utilisons des cookies pour mesurer l'audience et l'efficacité de nos campagnes publicitaires. " +
      "Aucun cookie de mesure n'est déposé sans votre accord. " +
      '<a href="confidentialite.html">En savoir plus</a>.'));

    var panel = el("div", "consent__panel");
    panel.hidden = !expanded;
    panel.innerHTML =
      '<label class="consent__opt"><input type="checkbox" disabled checked> <span><strong>Nécessaires</strong> — fonctionnement du site (toujours actifs)</span></label>' +
      '<label class="consent__opt"><input type="checkbox" id="bzCkAnalytics"> <span><strong>Mesure d\'audience</strong> — statistiques anonymisées (GA4)</span></label>' +
      '<label class="consent__opt"><input type="checkbox" id="bzCkAds"> <span><strong>Publicité</strong> — mesure des conversions Google Ads</span></label>';
    box.appendChild(panel);

    var actions = el("div", "consent__actions");
    var btnAccept = el("button", "btn btn--primary btn--sm", "Tout accepter");
    var btnRefuse = el("button", "btn btn--ghost btn--sm", "Continuer sans accepter");
    var btnCustom = el("button", "consent__link", panel.hidden ? "Personnaliser" : "Valider mes choix");

    btnAccept.addEventListener("click", function () {
      var c = { analytics: true, ads: true };
      saveChoice(true, true); applyChoice(c); closeBanner();
    });
    btnRefuse.addEventListener("click", function () {
      saveChoice(false, false); closeBanner();
    });
    btnCustom.addEventListener("click", function () {
      if (panel.hidden) {
        panel.hidden = false;
        btnCustom.textContent = "Valider mes choix";
      } else {
        var a = !!document.getElementById("bzCkAnalytics").checked;
        var p = !!document.getElementById("bzCkAds").checked;
        saveChoice(a, p); applyChoice({ analytics: a, ads: p }); closeBanner();
      }
    });

    actions.appendChild(btnAccept);
    actions.appendChild(btnRefuse);
    actions.appendChild(btnCustom);
    box.appendChild(actions);
    banner.appendChild(box);
    document.body.appendChild(banner);
  }

  /* Ré-ouverture depuis n'importe quelle page ("Gérer les cookies") */
  window.BZ_openConsent = function () { openBanner(true); };

  var stored = readChoice();
  if (stored) {
    applyChoice(stored);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { openBanner(false); });
  } else {
    openBanner(false);
  }
})();
