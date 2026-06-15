/* ============================================
   Techno Metrics Solutions — script.js
   ============================================ */
(function () {
  "use strict";

  /* ---- Config Supabase (chave publishable; segura para uso no front) ---- */
  var SUPABASE_URL = "https://vpvrqjuhvwtwkkoykrrd.supabase.co";
  var SUPABASE_KEY = "sb_publishable_pIE8wO-ciEmFYBIxmvzMgA_3fiZmME7";

  // Salva o contato na tabela public.contatos via API REST do Supabase.
  function salvarContato(dados) {
    return fetch(SUPABASE_URL + "/rest/v1/contatos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(dados)
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) {
          throw new Error("Supabase " + res.status + ": " + t);
        });
      }
    });
  }

  /* ---- Ano no rodapé ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Header com sombra ao rolar ---- */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Menu mobile ---- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    var closeMenu = function () {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
    };
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  /* ---- Reveal ao entrar na viewport ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---- Validação + envio do formulário ---- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var required = form.querySelectorAll("[required]");
      var valid = true;
      required.forEach(function (field) {
        var ok = field.value.trim() !== "" &&
          (field.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value));
        field.classList.toggle("invalid", !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        if (status) { status.textContent = "Preencha os campos obrigatórios corretamente."; status.className = "form-status err"; }
        return;
      }

      // Envia a mensagem pelo WhatsApp com os dados preenchidos.
      var WHATSAPP = "5521979312196"; // (21) 97931-2196
      var nome = form.nome.value.trim();
      var email = form.email.value.trim();
      var whatsapp = form.whatsapp ? form.whatsapp.value.trim() : "";
      var assunto = form.assunto.value.trim() || "Contato pelo site";
      var mensagem = form.mensagem.value.trim();

      var texto =
        "*Novo contato pelo site*\n\n" +
        "*Nome:* " + nome + "\n" +
        "*E-mail:* " + email + "\n" +
        (whatsapp ? "*WhatsApp:* " + whatsapp + "\n" : "") +
        "*Assunto:* " + assunto + "\n\n" +
        mensagem;

      // Abre o WhatsApp de imediato (precisa ser no gesto do clique p/ não ser bloqueado).
      window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto), "_blank");

      // Salva o contato no banco (Supabase) em paralelo.
      salvarContato({ nome: nome, email: email, whatsapp: whatsapp || null, assunto: assunto, mensagem: mensagem, origem: "site" })
        .then(function () {
          if (status) { status.textContent = "Obrigado! Recebemos seu contato e abrimos o WhatsApp para concluir."; status.className = "form-status ok"; }
          form.reset();
        })
        .catch(function (err) {
          // Mesmo se o banco falhar, o WhatsApp já foi aberto.
          if (window.console) console.error("Falha ao salvar contato:", err);
          if (status) { status.textContent = "Abrimos o WhatsApp para concluir o envio."; status.className = "form-status ok"; }
          form.reset();
        });
    });
  }
})();
