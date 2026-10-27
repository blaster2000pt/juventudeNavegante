(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- toast ---------- */
  const toastEl = $("#toast");
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2800);
  };

  /* ---------- nav & smooth scroll ---------- */
  const nav = $(".nav");
  const navLinks = $("#navLinks");
  const navToggle = $("#navToggle");
  const closeMenu = () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu");
  };
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });

  const scrollToId = (id) => {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  };
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-scroll]");
    if (!link) return;
    e.preventDefault();
    closeMenu();
    scrollToId(link.getAttribute("href").slice(1));
  });

  const progressBar = $("#progressBar");
  const toTop = $("#toTop");
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progressBar.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
    nav.classList.toggle("is-scrolled", y > 30);
    toTop.classList.toggle("show", y > 600);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => scrollToId("inicio"));

  const sections = ["inicio", "quem-somos", "agenda", "inscricoes"].map((id) => document.getElementById(id));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      $$(".nav__links a:not(.btn)").forEach((a) =>
        a.classList.toggle("is-active", a.getAttribute("href") === `#${en.target.id}`)
      );
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  /* ---------- reveal & counters ---------- */
  const countUp = (el) => {
    const end = +el.dataset.count;
    if (reduceMotion) { el.textContent = end; return; }
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min((t - start) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      $$("[data-count]", en.target).forEach(countUp);
      revealer.unobserve(en.target);
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    revealer.observe(el);
  });

  /* ---------- hero stopwatch ---------- */
  const sw = $("#stopwatch");
  const t0 = performance.now();
  const fmt = (ms) => {
    const total = ms % 60000;
    const m = Math.floor(ms / 60000) % 60;
    const s = Math.floor(total / 1000);
    const cs = Math.floor((total % 1000) / 10);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(cs).padStart(2, "0")}`;
  };
  const runClock = () => { sw.textContent = fmt(performance.now() - t0); requestAnimationFrame(runClock); };
  if (reduceMotion) { $("#trackSvg").pauseAnimations?.(); sw.textContent = "00:10,84"; } else runClock();

  /* ---------- generic toggles (accordion / bios / story) ---------- */
  const setToggle = (btn, open) => {
    const panel = document.getElementById(btn.dataset.toggle || btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", String(open));
    panel.classList.toggle("is-open", open);
  };
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-toggle]");
    if (!btn) return;
    setToggle(btn, btn.getAttribute("aria-expanded") !== "true");
  });

  /* ---------- agenda ---------- */
  const events = [
    { d: "01", m: "nov", wd: "dom", cat: "community", title: "Corrida das Famílias à Beira-Rio", time: "09:30", place: "Passeio ribeirinho", dist: "3 km / 5 km", text: "Uma volta descontraída junto ao rio para todas as idades. Carrinhos de bebé e cães são bem-vindos — há medalha para cada criança que terminar." },
    { d: "07", m: "nov", wd: "sáb", cat: "training", title: "Clínica de Partidas de Velocidade", time: "10:00", place: "Pista · corredores 1–4", dist: "A partir dos 12 anos", text: "Partidas de blocos, exercícios de reação e técnica de aceleração com a treinadora Marta. Traz bicos se tiveres." },
    { d: "14", m: "nov", wd: "sáb", cat: "competition", title: "Abertura Regional de Pista Coberta", time: "08:30", place: "Pavilhão Municipal", dist: "Sub-14 · Sub-16 · Sub-18", text: "Primeira prova de pista coberta da época. O autocarro sai da sede às 07:15. Inscrições até 9 de novembro." },
    { d: "21", m: "nov", wd: "sáb", cat: "training", title: "Laboratório de Saltos: Comprimento e Triplo", time: "09:00", place: "Caixa de saltos", dist: "Todos os níveis", text: "Ritmo da corrida de balanço, chamada e receção com o treinador Tiago. Análise em vídeo para cada atleta." },
    { d: "28", m: "nov", wd: "sáb", cat: "community", title: "Sábado de Pista Aberta", time: "10:00", place: "Pista principal", dist: "Grátis · todas as idades", text: "O nosso dia aberto mensal: experimenta velocidade, barreiras e lançamentos sem compromisso. Ideal para estreantes e pais." },
    { d: "05", m: "dez", wd: "sáb", cat: "competition", title: "Taça de Corta-Mato do Clube", time: "09:00", place: "Pinhal municipal", dist: "1,5 km – 8 km", text: "O nosso campeonato interno, com muita lama e ainda mais carinho. Chocolate quente à chegada e classificação por equipas e escalões." },
    { d: "12", m: "dez", wd: "sáb", cat: "training", title: "Barreiras para Iniciantes", time: "11:00", place: "Pista · reta oposta", dist: "A partir dos 9 anos", text: "Barreiras de espuma, jogos de ritmo e padrões de três passadas. Sem medo, só fluidez." },
    { d: "19", m: "dez", wd: "sáb", cat: "community", title: "Estafeta do Pai Natal e Festa", time: "16:00", place: "Sede do clube", dist: "4 × 200 m", text: "Estafeta mascarada seguida da festa de fim de ano e entrega de prémios aos atletas. As famílias estão convidadas!" },
  ];
  const reserved = new Set();
  const list = $("#events");
  const label = { training: "Treino", competition: "Competição", community: "Comunidade" };

  const render = (filter = "all") => {
    list.innerHTML = "";
    events
      .map((ev, i) => ({ ...ev, i }))
      .filter((ev) => filter === "all" || ev.cat === filter)
      .forEach((ev, n) => {
        const li = document.createElement("li");
        li.className = "event";
        li.style.animationDelay = `${n * 60}ms`;
        const done = reserved.has(ev.i);
        li.innerHTML = `
          <button class="event__head" aria-expanded="false" aria-controls="ev-${ev.i}">
            <span class="event__date"><b>${ev.d}</b><small>${ev.m} · ${ev.wd}</small></span>
            <span>
              <span class="event__title">${ev.title}</span>
              <span class="event__meta"><span class="tag tag--${ev.cat}">${label[ev.cat]}</span>${ev.time} · ${ev.place}</span>
            </span>
            <i class="event__plus" aria-hidden="true">+</i>
          </button>
          <div class="collapse event__body" id="ev-${ev.i}">
            <div><div>
              <div>
                <p>${ev.text}</p>
                <ul><li>⏱ ${ev.time}</li><li>📍 ${ev.place}</li><li>🏃 ${ev.dist}</li></ul>
              </div>
              <div class="event__actions">
                <button class="btn btn--small ${done ? "btn--orange reserve is-done" : "btn--orange reserve"}" data-i="${ev.i}">${                done ? "Lugar reservado ✓" : "Reservar lugar"}</button>
                                <a href="#inscricoes" data-scroll class="btn btn--small btn--line">Tornar-me sócio</a>
              </div>
            </div></div>
          </div>`;
        list.appendChild(li);
      });
  };
  render();

  list.addEventListener("click", (e) => {
    const head = e.target.closest(".event__head");
    if (head) {
      setToggle(head, head.getAttribute("aria-expanded") !== "true");
      return;
    }
    const r = e.target.closest(".reserve");
    if (r) {
      const i = +r.dataset.i;
      if (reserved.has(i)) {
        reserved.delete(i);
        r.classList.remove("is-done");
        r.textContent = "Reservar lugar";
        toast(`Reserva cancelada: ${events[i].title}.`);
      } else {
        reserved.add(i);
        r.classList.add("is-done");
        r.textContent = "Lugar reservado ✓";
        toast(`Até dia ${events[i].d} de ${events[i].m} — ${events[i].title}! 🧡💙`);
      }
    }
  });

  $$(".filter").forEach((f) =>
    f.addEventListener("click", () => {
      $$(".filter").forEach((b) => { b.classList.toggle("is-active", b === f); b.setAttribute("aria-selected", String(b === f)); });
      render(f.dataset.filter);
    })
  );

  /* ---------- billing switch ---------- */
  const billing = $("#billingSwitch");
  billing.addEventListener("click", () => {
    const yearly = billing.getAttribute("aria-checked") !== "true";
    billing.setAttribute("aria-checked", String(yearly));
    $("#lblMonthly").classList.toggle("is-on", !yearly);
    $("#lblYearly").classList.toggle("is-on", yearly);
    $$(".plan__price").forEach((p) => {
      const amt = $(".amt", p);
      amt.textContent = yearly ? amt.dataset.year : amt.dataset.month;
      $(".per", p).textContent = yearly ? "/ano" : "/mês";
      amt.classList.remove("flip"); void amt.offsetWidth; amt.classList.add("flip");
    });
  });

  /* ---------- plan choose ---------- */
  const planSelect = $("#planSelect");
  const highlightPlan = (name) => $$(".plan").forEach((p) => p.classList.toggle("is-chosen", p.dataset.plan === name));
  $$("[data-choose]").forEach((b) =>
    b.addEventListener("click", () => {
      const name = b.dataset.choose;
      planSelect.value = name;
      planSelect.closest("label").classList.remove("invalid");
      highlightPlan(name);
      scrollToId("formulario");
      setTimeout(() => $("#joinForm input[name=name]").focus({ preventScroll: true }), 600);
      toast(`Plano ${name} selecionado — faltam só alguns dados.`);
    })
  );
  planSelect.addEventListener("change", () => highlightPlan(planSelect.value));

  /* ---------- form ---------- */
  const form = $("#joinForm");
  const success = $("#success");
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  form.addEventListener("input", (e) => e.target.closest("label")?.classList.remove("invalid"));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name, email = form.elements.email, plan = form.elements.plan, consent = form.elements.consent;
    const checks = [
      [name, name.value.trim().length > 1],
      [email, emailOk(email.value.trim())],
      [plan, !!plan.value],
    ];
    let firstBad = null;
    checks.forEach(([el, ok]) => {
      el.closest("label").classList.toggle("invalid", !ok);
      if (!ok && !firstBad) firstBad = el;
    });
    $(".err--check").classList.toggle("show", !consent.checked);
    if (!consent.checked && !firstBad) firstBad = consent;
    if (firstBad) { firstBad.focus(); return; }

    const first = name.value.trim().split(/\s+/)[0];
    $("#successMsg").textContent = `Obrigado, ${first}! O teu treino experimental no plano ${plan.value} ficou marcado para ${form.elements.day.value}. Vamos confirmar para ${email.value.trim()} nas próximas 24 h.`;
    form.hidden = true;
    success.hidden = false;
    toast("Treino experimental reservado! 🎉");
  });
  form.elements.consent.addEventListener("change", () => $(".err--check").classList.toggle("show", false));

  $("#resetForm").addEventListener("click", () => {
    form.reset();
    highlightPlan("");
    success.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });

  /* ---------- social ---------- */
  $$("[data-toast]").forEach((b) => b.addEventListener("click", () => toast(b.dataset.toast)));

  addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
})();
