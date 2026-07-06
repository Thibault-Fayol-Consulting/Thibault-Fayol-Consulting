/* =========================================================
   Barbecue Zone — interactions front-end
   Menu mobile, révélation au scroll, formulaires (endpoint
   configurable + honeypot), événements de conversion dataLayer.
   Aucune dépendance externe.
   ========================================================= */
(function () {
  "use strict";

  var cfg = window.BZ_CONFIG || {};

  /* ----- Événements de mesure (relayés à GTM/GA4 via dataLayer) ----- */
  function track(event, params) {
    window.dataLayer = window.dataLayer || [];
    var payload = { event: event };
    for (var k in (params || {})) payload[k] = params[k];
    window.dataLayer.push(payload);
  }

  /* ----- Année dynamique dans le footer ----- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ----- Menu mobile ----- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });

    // Ferme le menu après un clic sur un lien (mobile)
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Ouvrir le menu");
      }
    });

    // Échap ferme le menu
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ----- Révélation au scroll ----- */
  var revealTargets = document.querySelectorAll(
    ".cat-card, .prod-card, .review, .section__head, .usp__item, .faq__item"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ----- Suivi des appels (conversion click-to-call) ----- */
  document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener("click", function () {
      track("phone_call", { phone_number: a.getAttribute("href").replace("tel:", "") });
    });
  });

  /* ----- Panier démonstration + événement add_to_cart ----- */
  document.querySelectorAll(".add-to-cart").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".prod-card");
      var name = card ? (card.querySelector("h3") || {}).textContent : "";
      track("add_to_cart", { item_name: name || "produit" });
      var original = btn.textContent;
      btn.textContent = "✓ Ajouté";
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
      }, 1400);
    });
  });

  /* ----- Utilitaires formulaires ----- */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  // Anti-spam : champ invisible pour les humains. S'il est rempli,
  // on simule un succès sans rien envoyer.
  function isBot(form) {
    var trap = form.querySelector('input[name="bz_hp"]');
    return !!(trap && trap.value);
  }

  function submitTo(endpoint, form) {
    return fetch(endpoint, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
    });
  }

  function setMsg(node, text, ok, baseClass) {
    node.textContent = text;
    node.className = baseClass + (ok ? " ok" : " err");
  }

  /* ----- Newsletter ----- */
  var nlForm = document.getElementById("newsletter");
  if (nlForm) {
    nlForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("nlEmail");
      var msg = document.getElementById("nlMsg");
      if (!isValidEmail(input.value)) {
        setMsg(msg, "Merci d'entrer une adresse email valide.", false, "newsletter__msg");
        input.focus();
        return;
      }
      var done = function () {
        track("newsletter_signup", {});
        setMsg(msg, "🔥 Inscription confirmée, à très vite pour nos bons plans grillades !", true, "newsletter__msg");
        nlForm.reset();
      };
      if (isBot(nlForm)) { done(); return; }
      if (cfg.NEWSLETTER_ENDPOINT) {
        setMsg(msg, "Inscription en cours…", true, "newsletter__msg");
        submitTo(cfg.NEWSLETTER_ENDPOINT, nlForm).then(done).catch(function () {
          setMsg(msg, "Oups, une erreur est survenue. Merci de réessayer.", false, "newsletter__msg");
        });
      } else {
        done(); // mode démo : aucun envoi
      }
    });
  }

  /* ----- Formulaire d'étude gratuite (lead-gen) ----- */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = document.getElementById("contactMsg");
      var name = document.getElementById("cName");
      var phone = document.getElementById("cPhone");
      var email = document.getElementById("cEmail");
      var rgpd = document.getElementById("cRgpd");
      var problems = [];

      [name, phone, email].forEach(function (f) { if (f) f.classList.remove("invalid"); });

      if (!name.value.trim()) { problems.push(name); }
      if (phone && phone.value.replace(/\D/g, "").length < 9) { problems.push(phone); }
      if (!isValidEmail(email.value)) { problems.push(email); }

      if (problems.length) {
        problems.forEach(function (f) { f.classList.add("invalid"); });
        setMsg(msg, "Merci de compléter les champs surlignés.", false, "form__msg");
        problems[0].focus();
        return;
      }
      if (rgpd && !rgpd.checked) {
        setMsg(msg, "Merci d'accepter le traitement de vos données pour pouvoir vous répondre.", false, "form__msg");
        rgpd.focus();
        return;
      }

      var done = function () {
        track("generate_lead", {
          form: "etude",
          model: (document.getElementById("cSubject") || {}).value || "",
          zip: ((document.getElementById("cZip") || {}).value || "").slice(0, 2)
        });
        setMsg(msg, "Demande envoyée ! Un concepteur vous rappelle sous 24h ouvrées.", true, "form__msg");
        contactForm.reset();
      };
      if (isBot(contactForm)) { done(); return; }
      if (cfg.FORM_ENDPOINT) {
        setMsg(msg, "Envoi en cours…", true, "form__msg");
        submitTo(cfg.FORM_ENDPOINT, contactForm).then(done).catch(function () {
          setMsg(msg, "Oups, l'envoi a échoué. Réessayez ou appelez-nous au " + (cfg.PHONE_DISPLAY || ""), false, "form__msg");
        });
      } else {
        done(); // mode démo : aucun envoi
      }
    });
  }

  /* ----- Pré-sélection du modèle depuis les cartes Pod ----- */
  document.querySelectorAll("[data-pod]").forEach(function (a) {
    a.addEventListener("click", function () {
      var select = document.getElementById("cSubject");
      if (!select) return;
      var wanted = a.getAttribute("data-pod");
      Array.prototype.forEach.call(select.options, function (opt) {
        if (opt.text.indexOf(wanted) === 0) select.value = opt.value || opt.text;
      });
      track("select_item", { item_name: wanted });
    });
  });

  /* ----- Liens "Gérer les cookies" ----- */
  document.querySelectorAll("[data-open-consent]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      if (window.BZ_openConsent) window.BZ_openConsent();
    });
  });
})();
