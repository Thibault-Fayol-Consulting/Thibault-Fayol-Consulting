/* =========================================================
   Barbecue Zone — interactions front-end
   Menu mobile, révélation au scroll, formulaires, panier démo.
   Aucune dépendance externe.
   ========================================================= */
(function () {
  "use strict";

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

  /* ----- Panier démonstration ----- */
  var cartCount = 0;
  document.querySelectorAll(".add-to-cart").forEach(function (btn) {
    btn.addEventListener("click", function () {
      cartCount += 1;
      var original = btn.textContent;
      btn.textContent = "✓ Ajouté";
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
      }, 1400);
    });
  });

  /* ----- Utilitaire de validation email ----- */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  /* ----- Newsletter ----- */
  var nlForm = document.getElementById("newsletter");
  if (nlForm) {
    nlForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("nlEmail");
      var msg = document.getElementById("nlMsg");
      if (!isValidEmail(input.value)) {
        msg.textContent = "Merci d'entrer une adresse email valide.";
        msg.className = "newsletter__msg err";
        input.focus();
        return;
      }
      msg.textContent = "🔥 Inscription confirmée, à très vite pour nos bons plans grillades !";
      msg.className = "newsletter__msg ok";
      nlForm.reset();
    });
  }

  /* ----- Formulaire de contact ----- */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = document.getElementById("contactMsg");
      var name = document.getElementById("cName");
      var email = document.getElementById("cEmail");
      var message = document.getElementById("cMessage");
      var problems = [];

      [name, email, message].forEach(function (f) { f.classList.remove("invalid"); });

      if (!name.value.trim()) { problems.push(name); }
      if (!isValidEmail(email.value)) { problems.push(email); }
      if (!message.value.trim()) { problems.push(message); }

      if (problems.length) {
        problems.forEach(function (f) { f.classList.add("invalid"); });
        msg.textContent = "Merci de compléter les champs surlignés.";
        msg.className = "form__msg err";
        problems[0].focus();
        return;
      }

      msg.textContent = "Message envoyé ! Notre équipe vous répond sous 24h ouvrées.";
      msg.className = "form__msg ok";
      contactForm.reset();
    });
  }
})();
