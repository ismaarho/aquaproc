/* Aquaproc — comportamiento de la página. Sin dependencias. */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Configuración
     Para cambiar el destino del formulario, cambia FORM_ENDPOINT:
       - Formspree:  https://formspree.io/f/XXXX
       - Make:       https://hook.eu2.make.com/XXXX
       - Netlify Fn: /.netlify/functions/lead
     El cuerpo se envía como FormData (campos: nombre, telefono, email,
     cp, consentimiento, _subject) y se espera un 2xx.
     ------------------------------------------------------------------ */
  var FORM_ENDPOINT = "https://formspree.io/f/xbdvjgle";

  /* Analítica: Plausible si está cargado; si no, no-op. Para GA4 cambia
     track() por gtag('event', name, props). */
  function track(name, props) {
    try {
      if (window.plausible) window.plausible(name, { props: props || {} });
    } catch (e) {
      /* silencio */
    }
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     Nav móvil
     ------------------------------------------------------------------ */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    var closeNav = function () {
      toggle.setAttribute("aria-expanded", "false");
      links.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    };
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      if (open) {
        closeNav();
      } else {
        toggle.setAttribute("aria-expanded", "true");
        links.classList.add("is-open");
        document.body.classList.add("nav-open");
        var first = links.querySelector("a");
        if (first) first.focus();
      }
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("is-open")) {
        closeNav();
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 768px)").addEventListener("change", function (m) {
      if (m.matches) closeNav();
    });
  }

  /* ------------------------------------------------------------------
     Aparición al hacer scroll (una vez por elemento)
     ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-in");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     Calculadora de ahorro
     ahorro anual = garrafas/semana × precio garrafa × 52
     (coste de filtros no se resta porque no tenemos el dato: ver nota)
     ------------------------------------------------------------------ */
  var calc = document.getElementById("calc");
  if (calc) {
    var qty = calc.querySelector("#calc-qty");
    var qtyOut = calc.querySelector("#calc-qty-out");
    var price = calc.querySelector("#calc-price");
    var yearOut = calc.querySelector("#calc-year");
    var tenOut = calc.querySelector("#calc-ten");
    var bottlesOut = calc.querySelector("#calc-bottles");
    var litresOut = calc.querySelector("#calc-litres");
    var fmtEur = new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0
    });
    var fmtNum = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 });
    var calcTracked = false;

    var update = function () {
      var n = Number(qty.value) || 0;
      var p = Number(String(price.value).replace(",", ".")) || 0;
      var year = n * p * 52;
      qtyOut.textContent = n;
      yearOut.textContent = fmtEur.format(year);
      tenOut.textContent = fmtEur.format(year * 10);
      bottlesOut.textContent = fmtNum.format(n * 52);
      litresOut.textContent = fmtNum.format(n * 52 * 8) + " L";
    };
    qty.addEventListener("input", update);
    price.addEventListener("input", update);
    calc.addEventListener(
      "input",
      function () {
        if (!calcTracked) {
          calcTracked = true;
          track("Calculadora usada");
        }
      },
      { once: true }
    );
    update();
  }

  /* ------------------------------------------------------------------
     Formulario de demo
     ------------------------------------------------------------------ */
  var form = document.getElementById("demo-form");
  if (form) {
    var status = form.querySelector(".form-status");
    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn.querySelector(".label");
    var success = document.getElementById("form-success");
    var startedAt = Date.now();
    var formStarted = false;

    var fields = {
      nombre: {
        el: form.elements.nombre,
        check: function (v) {
          return v.trim().length >= 2 ? "" : "Escribe tu nombre.";
        }
      },
      telefono: {
        el: form.elements.telefono,
        check: function (v) {
          var digits = v.replace(/[^\d+]/g, "");
          return /^(\+?\d{9,15})$/.test(digits) ? "" : "Escribe un teléfono válido (9 cifras).";
        }
      },
      email: {
        el: form.elements.email,
        check: function (v) {
          if (!v.trim()) return "";
          return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Revisa el email: parece incompleto.";
        }
      },
      cp: {
        el: form.elements.cp,
        check: function (v) {
          return /^\d{5}$/.test(v.trim()) ? "" : "Escribe tu código postal (5 cifras).";
        }
      },
      consentimiento: {
        el: form.elements.consentimiento,
        check: function (v, el) {
          return el.checked ? "" : "Necesitamos tu consentimiento para contactarte.";
        }
      }
    };

    var setError = function (key, msg) {
      var f = fields[key];
      var wrap = f.el.closest(".field, .check");
      var msgEl = wrap.querySelector(".error-msg");
      if (msg) {
        wrap.classList.add("is-invalid");
        f.el.setAttribute("aria-invalid", "true");
        if (msgEl) msgEl.textContent = msg;
      } else {
        wrap.classList.remove("is-invalid");
        f.el.removeAttribute("aria-invalid");
        if (msgEl) msgEl.textContent = "";
      }
    };

    var validate = function (key) {
      var f = fields[key];
      var msg = f.check(f.el.value, f.el);
      setError(key, msg);
      return !msg;
    };

    Object.keys(fields).forEach(function (key) {
      var el = fields[key].el;
      // Validar al salir del campo; limpiar el error al corregir.
      el.addEventListener("blur", function () {
        if (el.value || el.type === "checkbox") validate(key);
      });
      el.addEventListener("input", function () {
        if (el.closest(".field, .check").classList.contains("is-invalid")) validate(key);
        if (!formStarted) {
          formStarted = true;
          track("Formulario iniciado");
        }
      });
      el.addEventListener("change", function () {
        if (el.type === "checkbox") validate(key);
      });
    });

    var setStatus = function (msg, kind) {
      status.textContent = msg;
      status.className = "form-status" + (kind ? " is-" + kind : "");
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      setStatus("", "");

      var firstInvalid = null;
      Object.keys(fields).forEach(function (key) {
        if (!validate(key) && !firstInvalid) firstInvalid = fields[key].el;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        setStatus("Revisa los campos marcados.", "error");
        return;
      }

      // Antispam: honeypot relleno o envío en < 3 s → fingimos éxito sin enviar.
      var honeypot = form.querySelector('input[name="empresa_web"]');
      if ((honeypot && honeypot.value) || Date.now() - startedAt < 3000) {
        showSuccess();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading");
      submitLabel.textContent = "Enviando";

      var data = new FormData(form);
      data.delete("empresa_web");

      fetch(FORM_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          track("Demo solicitada", { canal: "formulario" });
          showSuccess();
        })
        .catch(function () {
          setStatus(
            "No hemos podido enviar la solicitud. Prueba de nuevo o escríbenos por WhatsApp.",
            "error"
          );
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.classList.remove("is-loading");
          submitLabel.textContent = "Solicitar demo gratuita";
        });
    });

    function showSuccess() {
      form.hidden = true;
      success.classList.add("is-visible");
      success.setAttribute("tabindex", "-1");
      success.focus();
    }
  }

  /* ------------------------------------------------------------------
     Eventos de analítica en WhatsApp y llamada
     ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="https://wa.me"], a[href^="https://api.whatsapp.com"]').forEach(function (a) {
    a.addEventListener("click", function () {
      track("Clic WhatsApp", { lugar: a.dataset.place || "otro" });
    });
  });
  document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener("click", function () {
      track("Clic llamada", { lugar: a.dataset.place || "otro" });
    });
  });

  /* ------------------------------------------------------------------
     Botón flotante: se oculta mientras el formulario está en pantalla
     ------------------------------------------------------------------ */
  var wa = document.querySelector(".wa-float");
  var demo = document.getElementById("demo");
  if (wa && demo && "IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        wa.classList.toggle("is-hidden", entries[0].isIntersecting);
      },
      { threshold: 0.2 }
    ).observe(demo);
  }
})();
