(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

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
    if (target)
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
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

  const sections = ["inicio", "quem-somos", "galeria", "agenda", "contactos", "inscricoes"].map((id) =>
    document.getElementById(id),
  );
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        $$(".nav__links a:not(.btn)").forEach((a) =>
          a.classList.toggle(
            "is-active",
            a.getAttribute("href") === `#${en.target.id}`,
          ),
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- reveal & counters ---------- */
  const countUp = (el) => {
    const end = +el.dataset.count;
    if (reduceMotion) {
      el.textContent = end;
      return;
    }
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min((t - start) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const revealer = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        $$("[data-count]", en.target).forEach(countUp);
        revealer.unobserve(en.target);
      });
    },
    { threshold: 0.12 },
  );
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
  const runClock = () => {
    sw.textContent = fmt(performance.now() - t0);
    requestAnimationFrame(runClock);
  };
  if (reduceMotion) {
    $("#trackSvg").pauseAnimations?.();
    sw.textContent = "00:10,84";
  } else runClock();

  /* ---------- generic toggles (accordion / bios / story) ---------- */
  const setToggle = (btn, open) => {
    const panel = document.getElementById(
      btn.dataset.toggle || btn.getAttribute("aria-controls"),
    );
    btn.setAttribute("aria-expanded", String(open));
    panel.classList.toggle("is-open", open);
  };
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-toggle]");
    if (!btn) return;
    setToggle(btn, btn.getAttribute("aria-expanded") !== "true");
  });

  /* ---------- agenda ---------- */
  const ageGroups = [
    { id: "sub-10", label: "Sub-10" },
    { id: "sub-12", label: "Sub-12" },
    { id: "sub-14", label: "Sub-14" },
    { id: "sub-15", label: "Sub-15" },
    { id: "sub-16", label: "Sub-16" },
    { id: "sub-18", label: "Sub-18" },
    { id: "sub-20", label: "Sub-20" },
    { id: "sub-23", label: "Sub-23" },
    { id: "seniores", label: "Séniores" },
    { id: "veteranos", label: "Veteranos" },
  ];
  const allAgeGroups = ageGroups.map(({ id }) => id);
  const events = [
    { date: "2026-09-26", d: "26", m: "set", wd: "sáb", categories: ["sub-10", "sub-12"], title: "Taça Regional Sub-12", place: "Seixal" },
    { date: "2026-09-27", d: "27", m: "set", wd: "dom", categories: ["sub-10", "sub-12"], title: "Taça Regional Sub-12", place: "Almada" },
    { date: "2026-11-01", d: "1", m: "nov", wd: "dom", categories: ["sub-10", "sub-12", "sub-14", "sub-16", "sub-18", "sub-20", "seniores", "veteranos"], title: "Campeonato Regional de Corta-Mato", place: "Amora" },
    { date: "2026-11-08", d: "8", m: "nov", wd: "dom", categories: ["sub-14", "sub-15"], title: "Concentração de Salto em Altura", place: "Seixal", text: "Sob convocatória." },
    { date: "2026-11-14", d: "14", m: "nov", wd: "sáb", categories: ["sub-10", "sub-12"], title: "Taça Regional Sub-12", place: "Escola Básica Quinta Nova da Telha, Barreiro" },
    { date: "2026-11-15", d: "15", m: "nov", wd: "dom", categories: ["sub-14", "sub-16"], title: "Provas de Preparação", place: "A definir" },
    { date: "2026-11-22", d: "22", m: "nov", wd: "dom", categories: ["sub-14", "sub-16", "sub-18"], title: "Campeonato Nacional de Corta-Mato", place: "Valença" },
    { date: "2026-11-28", d: "28–29", m: "nov", wd: "sáb/dom", categories: ["sub-18", "sub-20", "sub-23", "seniores", "veteranos"], title: "Provas de Preparação", place: "A definir", text: "Provas nos dias 28 e 29 de novembro." },
    { date: "2026-12-01", d: "1", m: "dez", wd: "ter", categories: [], title: "Corta-Mato da Machada", place: "Barreiro", text: "Sob convocatória; possível prova de treino." },
    { date: "2026-12-05", d: "5", m: "dez", wd: "sáb", categories: [], title: "Concentração de Martelo", place: "Seixal", text: "Sob convocatória." },
    { date: "2026-12-08", d: "8", m: "dez", wd: "ter", categories: ["sub-12"], title: "Taça Regional Sub-12", place: "Seixal" },
    { date: "2026-12-08", d: "8", m: "dez", wd: "ter", categories: allAgeGroups, title: "Gala de Natal da Juventude Navegante", place: "Atalaia", text: "Encontro para atletas, famílias e parceiros." },
    { date: "2026-12-12", d: "12", m: "dez", wd: "sáb", categories: ["sub-12", "sub-14", "seniores", "veteranos"], title: "São Silvestre Alcochete", place: "Alcochete" },
    { date: "2026-12-13", d: "13", m: "dez", wd: "dom", categories: ["sub-18"], title: "Provas de Preparação Sub-18", place: "Pista Carla Sacramento, Seixal" },
    { date: "2026-12-19", d: "19–20", m: "dez", wd: "sáb/dom", categories: ["sub-14", "sub-16", "sub-18", "sub-20", "sub-23", "seniores", "veteranos"], title: "Triatlo Técnico e Provas de Preparação de Absolutos", place: "A definir", text: "Provas nos dias 19 e 20 de dezembro." },
    { date: "2027-01-16", d: "16", m: "jan", wd: "sáb", categories: [], title: "InterAssociações de Triatlo Técnico", place: "Alpiarça", text: "Convocatória do Diretor Técnico Regional." },
    { date: "2027-01-17", d: "17", m: "jan", wd: "dom", categories: ["sub-12", "sub-14"], title: "Taça Regional Sub-12 e Provas de Preparação Sub-14", place: "A definir" },
    { date: "2027-01-23", d: "23–24", m: "jan", wd: "sáb/dom", categories: ["sub-18", "sub-20", "sub-23", "seniores"], title: "Campeonato Regional de Lançamentos Longos", place: "A definir", text: "Provas nos dias 23 e 24 de janeiro." },
    { date: "2027-01-30", d: "30", m: "jan", wd: "sáb", categories: ["sub-18", "sub-20", "sub-23", "seniores"], title: "Campeonato Regional de Absolutos", place: "A definir" },
    { date: "2027-01-31", d: "31", m: "jan", wd: "dom", categories: [], title: "Triatlo Técnico – Final Nacional", place: "A definir (pista curta)", text: "Convocatória do Diretor Técnico Regional." },
    { date: "2027-02-06", d: "6–7", m: "fev", wd: "sáb/dom", categories: ["sub-18"], title: "Campeonato Nacional de Pista Coberta Sub-18", place: "A definir", text: "Provas nos dias 6 e 7 de fevereiro; necessários mínimos." },
    { date: "2027-02-27", d: "27", m: "fev", wd: "sáb", categories: ["sub-10", "sub-12"], title: "Taça Regional Sub-10 e Sub-12", place: "Barreiro" },
    { date: "2027-02-27", d: "27", m: "fev", wd: "sáb", categories: ["sub-18", "sub-20", "sub-23", "seniores"], title: "Campeonato Nacional de Longos", place: "A definir", text: "Do escalão Sub-18 a Séniores; necessários mínimos." },
    { date: "2027-03-06", d: "6–7", m: "mar", wd: "sáb/dom", categories: ["sub-20"], title: "Campeonato Nacional Sub-20 de Pista Curta", place: "A definir", text: "Provas nos dias 6 e 7 de março; necessário mínimo." },
    { date: "2027-03-20", d: "20", m: "mar", wd: "sáb", categories: ["sub-14", "sub-16"], title: "Apuramento de Salto em Altura e Provas de Preparação", place: "A definir" },
    { date: "2027-03-21", d: "21", m: "mar", wd: "dom", categories: ["sub-12", "sub-14"], title: "Apuramento 1 km Jovem, Provas de Preparação e Taça Regional Sub-12", place: "A definir" },
    { date: "2027-04-03", d: "3–4", m: "abr", wd: "sáb/dom", categories: ["sub-14"], title: "Atleta Completo Regional", place: "A definir", text: "Provas nos dias 3 e 4 de abril." },
    { date: "2027-04-10", d: "10", m: "abr", wd: "sáb", categories: [], title: "Campeonato Regional de Trail", place: "A definir", text: "Sob convocatória." },
    { date: "2027-04-10", d: "10", m: "abr", wd: "sáb", categories: ["sub-14"], title: "Campeonato Regional Sub-14", place: "A definir" },
    { date: "2027-04-17", d: "17", m: "abr", wd: "sáb", categories: [], title: "Atleta Completo Nacional", place: "Ponta Delgada (Açores)", text: "Convocatória do Diretor Regional." },
    { date: "2027-04-18", d: "18", m: "abr", wd: "dom", categories: ["sub-12"], title: "Taça Regional Sub-12", place: "Sobreda" },
    { date: "2027-05-01", d: "1–2", m: "mai", wd: "sáb/dom", categories: ["sub-16", "sub-18"], title: "Olímpico Jovem Regional", place: "A definir", text: "Provas nos dias 1 e 2 de maio." },
    { date: "2027-05-08", d: "8–9", m: "mai", wd: "sáb/dom", categories: ["sub-14", "sub-16"], title: "Campeonato Regional Sub-16", place: "A definir", text: "Provas nos dias 8 e 9 de maio." },
    { date: "2027-05-15", d: "15–16", m: "mai", wd: "sáb/dom", categories: ["sub-10", "sub-12"], title: "Campeonato Regional Sub-10 e Sub-12", place: "A definir", text: "Provas nos dias 15 e 16 de maio." },
    { date: "2027-05-15", d: "15–16", m: "mai", wd: "sáb/dom", categories: [], title: "Olímpico Jovem Nacional", place: "Albufeira", text: "Provas nos dias 15 e 16 de maio; convocatória do Diretor Técnico Regional." },
    { date: "2027-05-16", d: "16", m: "mai", wd: "dom", categories: ["sub-14", "sub-16", "sub-18"], title: "Meeting Sub-14, Sub-16 e Sub-18", place: "A definir" },
    { date: "2027-05-22", d: "22–23", m: "mai", wd: "sáb/dom", categories: ["sub-14"], title: "Campeonato Nacional Sub-14", place: "A definir", text: "Provas nos dias 22 e 23 de maio." },
    { date: "2027-05-29", d: "29–30", m: "mai", wd: "sáb/dom", categories: ["sub-16", "sub-18"], title: "Campeonato Regional Sub-18", place: "Pista Carla Sacramento, Seixal", text: "Provas nos dias 29 e 30 de maio." },
    { date: "2027-06-09", d: "9", m: "jun", wd: "qua", categories: ["sub-16", "sub-18", "sub-20"], title: "Meeting do Seixal", place: "Pista Carla Sacramento, Seixal" },
    { date: "2027-06-19", d: "19–20", m: "jun", wd: "sáb/dom", categories: ["sub-16", "sub-18"], title: "Campeonato Nacional Sub-18", place: "Pista Carla Sacramento, Seixal", text: "Provas nos dias 19 e 20 de junho." },
    { date: "2027-06-26", d: "26–27", m: "jun", wd: "sáb/dom", categories: ["sub-20", "sub-23", "seniores"], title: "Campeonato Regional de Absolutos e Sub-20", place: "Pista Carla Sacramento, Seixal", text: "Provas nos dias 26 e 27 de junho." },
    { date: "2027-07-03", d: "3–4", m: "jul", wd: "sáb/dom", categories: ["sub-18", "sub-20"], title: "Campeonato Nacional Sub-20", place: "A definir", text: "Provas nos dias 3 e 4 de julho." },
    { date: "2027-07-10", d: "10–11", m: "jul", wd: "sáb/dom", categories: ["sub-20", "sub-23"], title: "Campeonato Nacional Sub-23", place: "A definir", text: "Provas nos dias 10 e 11 de julho." },
  ];

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const nextEvent = events
    .map((event) => {
      const [year, month, day] = event.date.split("-").map(Number);
      return { ...event, date: new Date(year, month - 1, day) };
    })
    .filter((event) => event.date >= now)
    .sort((a, b) => a.date - b.date)[0];

  const nextEventTitle = $("#nextEventTitle");
  if (nextEvent) {
    nextEventTitle.textContent = nextEvent.title;
  } else {
    nextEventTitle.textContent = "Sem eventos programados";
  }
  
  const list = $("#events");
  const labels = Object.fromEntries(ageGroups.map(({ id, label }) => [id, label]));

  const render = (filter = "all") => {
    list.innerHTML = "";
    events
      .map((ev, i) => ({ ...ev, i }))
      .filter((ev) => filter === "all" || ev.categories.includes(filter))
      .forEach((ev, n) => {
        const li = document.createElement("li");
        li.className = "event";
        li.style.animationDelay = `${n * 60}ms`;
        const categoryTags = ev.categories
          .map((category) => `<span class="tag">${labels[category]}</span>`)
          .join("");
        const eventDetails = [
          ev.time && `⏱ ${ev.time}`,
          ev.place && `📍 ${ev.place}`,
          ev.dist && `🏃 ${ev.dist}`,
        ].filter(Boolean);
        const eventMeta = [ev.time, ev.place].filter(Boolean).join(" · ");
        li.innerHTML = `
          <button class="event__head" aria-expanded="false" aria-controls="ev-${ev.i}">
            <span class="event__date ${ev.d.includes("–") ? "event__date--range" : ""}"><b>${ev.d}</b><small>${ev.m} · ${ev.wd}</small></span>
            <span>
              <span class="event__title">${ev.title}</span>
              <span class="event__meta">${categoryTags}${eventMeta}</span>
            </span>
            <i class="event__plus" aria-hidden="true">+</i>
          </button>
          <div class="collapse event__body" id="ev-${ev.i}">
            <div><div>
              <div>
                ${ev.text ? `<p>${ev.text}</p>` : ""}
                ${eventDetails.length ? `<ul>${eventDetails.map((detail) => `<li>${detail}</li>`).join("")}</ul>` : ""}
              </div>
              ${ev.place && ev.place !== "A definir" && !ev.place.startsWith("A definir ") ? `
                <div class="event__actions">
                  <a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(ev.place)}" target="_blank" rel="noopener noreferrer" class="btn btn--small btn--line">📍 Ver localização</a>
                </div>
              ` : ""}
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
  });

  $$(".filter").forEach((f) =>
    f.addEventListener("click", () => {
      $$(".filter").forEach((b) => {
        b.classList.toggle("is-active", b === f);
        b.setAttribute("aria-pressed", String(b === f));
      });
      render(f.dataset.filter);
    }),
  );

  /* ---------- gallery ---------- */
  const galleryImages = window.JUNA_GALLERY_IMAGES;
  const gallery = $("#galleryCarousel");
  if (!Array.isArray(galleryImages) || !galleryImages.every((image) =>
    image && typeof image.src === "string" && typeof image.alt === "string" &&
    image.src.trim() && image.alt.trim())) {
    console.error("A lista de fotografias da galeria está em falta ou é inválida. Execute node scripts\\update-gallery.cjs.");
    $("#galleryEmpty").hidden = true;
    $("#galleryStatus").textContent = "Não foi possível carregar a lista de fotografias da galeria.";
  } else if (galleryImages.length) {
    const viewport = $("#galleryViewport");
    const dots = $("#galleryDots");
    const status = $("#galleryStatus");
    const counter = $("#galleryCounter");
    const pause = $("#galleryPause");
    let current = 0;
    let paused = false;
    let visible = false;
    let hovering = false;
    let timer;
    const slides = [];
    const indicators = [];

    const updateTimer = () => {
      clearInterval(timer);
      pause.textContent = paused ? "Reproduzir" : "Pausar";
      if (galleryImages.length > 1 && !paused && visible && !hovering &&
          !gallery.contains(document.activeElement) && !document.hidden) {
        timer = setInterval(() => showSlide(current + 1), 3000);
      }
    };
    const showSlide = (index, announce = false) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.hidden = i !== current;
        indicators[i].setAttribute("aria-current", String(i === current));
      });
      counter.textContent = `${current + 1} / ${slides.length}`;
      if (announce) status.textContent = `Fotografia ${current + 1} de ${slides.length}: ${galleryImages[current].alt}`;
      updateTimer();
    };

    galleryImages.forEach(({ src, alt }, i) => {
      const slide = document.createElement("figure");
      slide.className = "gallery__slide";
      slide.hidden = i !== 0;
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-label", `${i + 1} de ${galleryImages.length}`);
      const image = document.createElement("img");
      image.alt = alt;
      image.loading = i === 0 ? "eager" : "lazy";
      image.decoding = "async";
      image.addEventListener("error", () => {
        console.error("Não foi possível carregar a fotografia da galeria:", src);
        paused = true;
        status.textContent = `Não foi possível carregar a fotografia: ${alt}.`;
        updateTimer();
      });
      image.src = src;
      slide.append(image);
      viewport.append(slide);
      slides.push(slide);
      const indicator = document.createElement("button");
      indicator.type = "button";
      indicator.setAttribute("aria-label", `Ver fotografia ${i + 1}`);
      indicator.setAttribute("aria-controls", "galleryViewport");
      indicator.addEventListener("click", () => showSlide(i, true));
      dots.append(indicator);
      indicators.push(indicator);
    });
    $("#galleryEmpty").hidden = true;
    $("#galleryControls").hidden = galleryImages.length < 2;
    counter.hidden = false;
    showSlide(0);

    $("#galleryPrev").addEventListener("click", () => showSlide(current - 1, true));
    $("#galleryNext").addEventListener("click", () => showSlide(current + 1, true));
    pause.addEventListener("click", () => {
      paused = !paused;
      updateTimer();
    });
    gallery.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      showSlide(current + (e.key === "ArrowRight" ? 1 : -1), true);
    });
    gallery.addEventListener("mouseenter", () => { hovering = true; updateTimer(); });
    gallery.addEventListener("mouseleave", () => { hovering = false; updateTimer(); });
    gallery.addEventListener("focusin", updateTimer);
    gallery.addEventListener("focusout", () => queueMicrotask(updateTimer));
    document.addEventListener("visibilitychange", updateTimer);
    let touchStart;
    viewport.addEventListener("touchstart", (e) => {
      const touch = e.changedTouches[0];
      touchStart = { x: touch.clientX, y: touch.clientY };
    }, { passive: true });
    viewport.addEventListener("touchend", (e) => {
      if (!touchStart) return;
      const dx = e.changedTouches[0].clientX - touchStart.x;
      const dy = e.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) showSlide(current + (dx < 0 ? 1 : -1), true);
      touchStart = null;
    }, { passive: true });
    viewport.addEventListener("touchcancel", () => { touchStart = null; });
    const galleryObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateTimer();
    }, { threshold: 0.25 });
    galleryObserver.observe(gallery);
  }

  /* ---------- billing switch ---------- */
  const billing = $("#billingSwitch");
  if (billing) {
    billing.addEventListener("click", () => {
      const yearly = billing.getAttribute("aria-checked") !== "true";
      billing.setAttribute("aria-checked", String(yearly));
      $("#lblMonthly").classList.toggle("is-on", !yearly);
      $("#lblYearly").classList.toggle("is-on", yearly);
      $$(".plan__price").forEach((p) => {
        const amt = $(".amt", p);
        amt.textContent = yearly ? amt.dataset.year : amt.dataset.month;
        $(".per", p).textContent = yearly ? "/ano" : "/mês";
        amt.classList.remove("flip");
        void amt.offsetWidth;
        amt.classList.add("flip");
      });
    });
  }

  /* ---------- more plans ---------- */
  const morePlansToggle = $("#morePlansToggle");
  const extraPlans = $("#extraPlans");
  morePlansToggle.addEventListener("click", () => {
    const expanded = morePlansToggle.getAttribute("aria-expanded") !== "true";
    morePlansToggle.setAttribute("aria-expanded", String(expanded));
    extraPlans.hidden = !expanded;
    $(".plans-toggle__icon", morePlansToggle).textContent = expanded ? "−" : "+";
    $("#morePlansLabel").textContent = expanded ? "Ver menos planos" : "Ver mais planos";
  });

  /* ---------- plan choose ---------- */
  // joinForm desativado.
  // const planSelect = $("#planSelect");
  const planForm = $("#planForm");
  const planFormTitle = $("#planFormTitle");
  const planFormLink = $("#planFormLink");
  const planFormQr = $("#planFormQr");
  const planForms = {
    "Escola de atletismo": {
      url: "https://forms.gle/vGCrbrNZmsZP7H5y6",
      qr: "images/qr-plano-escola-atletismo.png",
    },
    "Escola de atletismo — 1x por semana": {
      url: "https://forms.gle/vGCrbrNZmsZP7H5y6",
      qr: "images/qr-plano-escola-atletismo.png",
    },
    Competição: {
      url: "https://forms.gle/vGCrbrNZmsZP7H5y6",
      qr: "images/qr-plano-competicao.png",
    },
    "Sócio Navegante": {
      url: "https://forms.gle/RANdVUvJaWkeo52G7",
      qr: "images/qr-plano-socio-navegante.png",
    },
  };
  $$("[data-choose]").forEach((b) =>
    b.addEventListener("click", () => {
      const name = b.dataset.choose;
      const formDetails = planForms[name];
      if (!formDetails) return;
      // planSelect.value = name;
      // planSelect.closest("label").classList.remove("invalid");
      planFormTitle.textContent = `Inscrição — ${name}`;
      planFormLink.href = formDetails.url;
      planFormQr.src = formDetails.qr;
      planFormQr.alt = `Código QR para o formulário do plano ${name}`;
      planForm.hidden = false;
      scrollToId("planForm");
      toast(`Plano ${name} selecionado.`);
    }),
  );

  /* ---------- form ---------- */
  /* joinForm desativado.
  const form = $("#joinForm");
  const success = $("#success");
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  form.addEventListener("input", (e) =>
    e.target.closest("label")?.classList.remove("invalid"),
  );
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name,
      email = form.elements.email,
      plan = form.elements.plan,
      consent = form.elements.consent;
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
    if (firstBad) {
      firstBad.focus();
      return;
    }

    const first = name.value.trim().split(/\s+/)[0];
    $("#successMsg").textContent =
      `Obrigado, ${first}! O teu treino experimental no plano ${plan.value} ficou marcado para ${form.elements.day.value}. Vamos confirmar para ${email.value.trim()} nas próximas 24 h.`;
    form.hidden = true;
    success.hidden = false;
    toast("Treino experimental reservado! 🎉");
  });
  form.elements.consent.addEventListener("change", () =>
    $(".err--check").classList.toggle("show", false),
  );

  $("#resetForm").addEventListener("click", () => {
    form.reset();
    success.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });
  */

  /* ---------- social ---------- */
  $$("[data-toast]").forEach((b) =>
    b.addEventListener("click", () => toast(b.dataset.toast)),
  );

  addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
})();
