/* ==========================================================================
   Luca Montanari — Portfolio Foto & Video — main.js
   ========================================================================== */
(() => {
  "use strict";

  /* ---------- data: gallery items (from assets/js/media.js) ---------- */
  const MEDIA = window.LM_MEDIA || { projects: {}, photos: [], videos: [] };
  // "" sulla home, "../" sulle pagine dentro progetti/: lo dichiara <body data-base>
  const BASE = document.body.dataset.base || "";
  const MEDIA_BASE = BASE + "assets/media/";
  // valorizzato solo sulle pagine di progetto, via <body data-project="slug">
  const PAGE_PROJECT = document.body.dataset.project || null;
  const SLUGS = Object.keys(MEDIA.projects); // l'ordine in media.js e l'ordine in pagina

  // tutti i contenuti, raggruppati per progetto: prima i video del progetto, poi le foto
  const ITEMS = [];
  SLUGS.forEach((slug) => {
    const proj = MEDIA.projects[slug] || {};
    MEDIA.videos
      .filter((v) => v.p === slug)
      .forEach((v) => {
        ITEMS.push({
          type: "video",
          slug,
          label: proj.label || "Video",
          project: proj.title || "",
          title: v.title || proj.title || "",
          src: MEDIA_BASE + "video/" + v.f,
          poster: MEDIA_BASE + "video/" + v.f.replace(/\.mp4$/, ".jpg"),
          vertical: !!v.vertical,
        });
      });
    const photos = MEDIA.photos.filter((ph) => ph.p === slug);
    photos.forEach((ph, k) => {
      ITEMS.push({
        type: "photo",
        slug,
        label: proj.label || "Fotografia",
        project: proj.title || "",
        title: proj.title || "",
        thumb: MEDIA_BASE + "thumbs/" + slug + "/" + ph.f,
        src: MEDIA_BASE + "full/" + slug + "/" + ph.f,
        w: ph.w,
        h: ph.h,
        num: k + 1,
        of: photos.length,
      });
    });
  });

  let currentAlbum = null; // slug del progetto aperto, null = elenco progetti
  let currentLbIndex = 0;

  /** indici degli item del progetto aperto, nell'ordine in cui stanno nella griglia */
  function albumIndexes() {
    return ITEMS.reduce((acc, it, i) => {
      if (it.slug === currentAlbum) acc.push(i);
      return acc;
    }, []);
  }

  /** riga di contesto sotto al titolo del progetto: luogo · data · committente */
  function projectMeta(proj, slug) {
    const photos = ITEMS.filter((it) => it.slug === slug && it.type === "photo").length;
    const videos = ITEMS.filter((it) => it.slug === slug && it.type === "video").length;
    const conteggio = [
      photos ? `${photos} foto` : "",
      videos ? `${videos} video` : "",
    ].filter(Boolean).join(" · ");
    return [proj.luogo, proj.data, proj.committente, conteggio].filter(Boolean).join(" · ");
  }

  /* ---------- preloader ---------- */
  function initPreloader() {
    const el = document.getElementById("preloader");
    const num = document.getElementById("preloaderNum");
    if (!el || !num) return; // le pagine di progetto non hanno il preloader
    let n = 0;
    const step = () => {
      n += Math.ceil(Math.random() * 12);
      if (n >= 100) n = 100;
      num.textContent = n;
      if (n < 100) {
        setTimeout(step, 90);
      } else {
        setTimeout(() => el.classList.add("done"), 250);
      }
    };
    step();
  }

  /* ---------- custom cursor ---------- */
  function initCursor() {
    const cursor = document.getElementById("cursor");
    const ring = document.getElementById("cursorRing");
    if (!cursor || !ring) return;
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + "px";
      cursor.style.top = my + "px";
    });
    const loop = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll('a, button, .g-item, [data-cursor="link"]').forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
    });
  }

  /* ---------- nav behavior ---------- */
  function initNav() {
    const nav = document.getElementById("nav");
    const burger = document.getElementById("burger");
    const mobileMenu = document.getElementById("mobileMenu");
    if (!nav || !burger || !mobileMenu) return;
    let lastY = window.scrollY;

    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      nav.classList.toggle("scrolled", y > 40);
      if (y > lastY && y > 200) nav.classList.add("hide-nav");
      else nav.classList.remove("hide-nav");
      lastY = y;
      updateProgress();
    });

    burger.addEventListener("click", () => {
      burger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
    });
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        burger.classList.remove("open");
        mobileMenu.classList.remove("open");
      })
    );
  }

  function updateProgress() {
    const bar = document.getElementById("scrollProgress");
    if (!bar) return;
    const h = document.documentElement;
    const pct = (h.scrollTop || document.body.scrollTop) / ((h.scrollHeight || document.body.scrollHeight) - h.clientHeight) * 100;
    bar.style.width = pct + "%";
  }

  /* ---------- theme toggle ---------- */
  function initTheme() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    const saved = localStorage.getItem("lm-theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    btn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      if (cur === "dark") document.documentElement.removeAttribute("data-theme");
      else document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("lm-theme", cur === "dark" ? "" : "light");
    });
  }

  /* ---------- reveal on scroll ---------- */
  function initReveal() {
    const targets = document.querySelectorAll(".reveal-up"); // i .g-item li gestisce galleryIO
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach((t) => io.observe(t));

    // hero line reveal (staggered on load)
    document.querySelectorAll(".hero-tag span, .hero-title .reveal, .hero-sub span, .hero-cta span").forEach((el, i) => {
      el.style.transform = "translateY(110%)";
      el.style.transition = `transform .9s cubic-bezier(.16,.84,.44,1) ${0.15 + i * 0.06}s`;
      requestAnimationFrame(() => requestAnimationFrame(() => (el.style.transform = "translateY(0)")));
    });
  }

  /* ---------- portfolio ----------
     index.html          -> elenco delle schede; ogni scheda e un link vero a progetti/<slug>.html
     progetti/<slug>.html -> <body data-project="slug">: la pagina mostra l'album di quel progetto
     Cosi ogni lavoro ha un indirizzo suo, il tasto "indietro" funziona e il link e condivisibile.
  */
  const galleryIO = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), galleryIO.unobserve(e.target))),
    { threshold: 0.1 }
  );

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  /** copertina di un progetto: dalla miniatura indicata in media.js, o dal primo contenuto */
  function coverSrc(slug, proj) {
    if (proj.cover) {
      return proj.cat === "video"
        ? MEDIA_BASE + "video/" + proj.cover
        : MEDIA_BASE + "thumbs/" + slug + "/" + proj.cover;
    }
    const first = ITEMS.find((it) => it.slug === slug);
    return first ? first.thumb || first.poster : "";
  }

  /* ---- home: le schede dei progetti ---- */
  function renderProjects() {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;
    gallery.className = "gallery projects";
    // Schede larghe (due colonne su tre) alternate quando i progetti sono in numero pari:
    // ogni riga diventa [larga][normale] e non resta una scheda spaiata in fondo.
    // Con un numero dispari basta la prima larga; `grid-auto-flow: dense` copre i casi residui.
    const isWide = (i) => (SLUGS.length % 2 === 0 ? i % 2 === 0 : i === 0);
    gallery.innerHTML = SLUGS.map((slug, i) => {
      const proj = MEDIA.projects[slug] || {};
      return `
        <a class="p-card${isWide(i) ? " wide" : ""}" href="${BASE}progetti/${slug}.html">
          <img class="g-visual" src="${coverSrc(slug, proj)}" alt="" loading="${i < 3 ? "eager" : "lazy"}" decoding="async">
          <span class="p-body">
            <span class="g-cat">${esc(proj.label || "")}</span>
            <span class="p-title">${esc(proj.title || slug)}</span>
            <span class="p-meta">${esc(projectMeta(proj, slug))}</span>
          </span>
          <span class="p-go" aria-hidden="true">Guarda il progetto →</span>
        </a>`;
    }).join("");

    gallery.querySelectorAll(".p-card").forEach((el) => {
      hoverCursor(el);
      fadeInWhenLoaded(el.querySelector(".g-visual"));
      galleryIO.observe(el);
    });
  }

  /* ---- pagina progetto: la griglia dell'album ---- */
  function itemMarkup(item, i, pos) {
    // riquadri 4/5, con qualche orizzontale su due colonne per rompere la griglia
    const shape = item.type === "photo" && item.w > item.h && pos % 7 === 3 ? " wide" : "";
    const sub = item.type === "photo" ? `Foto ${item.num} di ${item.of}` : "Video";
    const visual =
      item.type === "video"
        ? `<img class="g-visual" src="${item.poster}" alt="${esc(item.title)}" loading="lazy" decoding="async">`
        : `<img class="g-visual" src="${item.thumb}" alt="${esc(item.title)} — foto ${item.num}" width="${item.w}" height="${item.h}" loading="lazy" decoding="async">`;

    return `
      <figure class="g-item${shape}" data-index="${i}" tabindex="0" role="button"
              aria-label="Ingrandisci ${esc(item.title)}">
        ${visual}
        <figcaption class="g-overlay">
          <span class="g-sub">${esc(sub)}</span>
        </figcaption>
        ${item.type === "video" ? '<div class="g-play" aria-hidden="true">▶</div>' : ""}
      </figure>`;
  }

  function renderAlbum(slug) {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;
    currentAlbum = slug;
    gallery.className = "gallery";
    gallery.innerHTML = albumIndexes().map((i, pos) => itemMarkup(ITEMS[i], i, pos)).join("");

    gallery.querySelectorAll(".g-item").forEach((el) => {
      const open = () => openLightbox(parseInt(el.dataset.index, 10));
      el.addEventListener("click", open);
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });
      hoverCursor(el);
      fadeInWhenLoaded(el.querySelector(".g-visual"));
      galleryIO.observe(el);
    });
  }

  /* ---- utilita condivise ---- */
  function hoverCursor(el) {
    const ring = document.getElementById("cursorRing");
    if (!ring) return;
    el.addEventListener("mouseenter", () => ring.classList.add("hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
  }

  function fadeInWhenLoaded(img) {
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) img.classList.add("loaded");
    else img.addEventListener("load", () => img.classList.add("loaded"));
  }

  function initPortfolio() {
    if (PAGE_PROJECT) renderAlbum(PAGE_PROJECT);
    else renderProjects();
  }

  /* ---------- lightbox ---------- */
  function initLightbox() {
    if (!document.getElementById("lightbox")) return;
    document.getElementById("lbClose").addEventListener("click", closeLightbox);
    document.getElementById("lbPrev").addEventListener("click", () => navLightbox(-1));
    document.getElementById("lbNext").addEventListener("click", () => navLightbox(1));
    document.getElementById("lightbox").addEventListener("click", (e) => {
      if (e.target.id === "lightbox") closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      const lb = document.getElementById("lightbox");
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navLightbox(-1);
      if (e.key === "ArrowRight") navLightbox(1);
    });

    // swipe su mobile
    const content = document.getElementById("lbContent");
    let startX = null;
    content.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
    content.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 60) navLightbox(dx < 0 ? 1 : -1);
      startX = null;
    }, { passive: true });
  }

  function renderLightbox(index) {
    const item = ITEMS[index];
    const content = document.getElementById("lbContent");
    const caption = document.getElementById("lbCaption");

    content.innerHTML = "";
    content.classList.add("loading");
    content.classList.toggle("is-vertical", item.type === "video" && item.vertical);

    if (item.type === "video") {
      const v = document.createElement("video");
      v.src = item.src;
      v.poster = item.poster;
      v.controls = true;
      v.playsInline = true;
      v.preload = "metadata";
      v.addEventListener("loadeddata", () => content.classList.remove("loading"));
      content.appendChild(v);
      v.play().catch(() => {}); // autoplay bloccato: resta il controllo manuale
    } else {
      const img = document.createElement("img");
      img.alt = item.title;
      img.decoding = "async";
      img.addEventListener("load", () => content.classList.remove("loading"));
      img.src = item.src;
      content.appendChild(img);
      preloadNeighbours(index);
    }

    const list = albumIndexes();
    const pos = list.indexOf(index);
    // il nome del progetto e gia nell'intestazione dell'album: qui basta il contesto breve
    const sub = item.type === "photo" ? `${item.label} — foto ${item.num} di ${item.of}` : item.label;
    caption.innerHTML =
      `<strong>${esc(item.title)}</strong>` +
      `<span>${esc(sub)}</span>` +
      (pos >= 0 ? `<span class="lb-counter">${pos + 1} / ${list.length}</span>` : "");
  }

  /** scarica in anticipo la foto precedente e successiva dell'album aperto */
  function preloadNeighbours(index) {
    const list = albumIndexes();
    const pos = list.indexOf(index);
    if (pos < 0) return;
    [-1, 1].forEach((d) => {
      const it = ITEMS[list[(pos + d + list.length) % list.length]];
      if (it && it.type === "photo") new Image().src = it.src;
    });
  }

  function openLightbox(index) {
    currentLbIndex = index;
    renderLightbox(index);
    document.getElementById("lightbox").classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    const content = document.getElementById("lbContent");
    const video = content.querySelector("video");
    if (video) video.pause();
    content.innerHTML = "";
    document.getElementById("lightbox").classList.remove("open");
    document.body.style.overflow = "";
  }

  /** naviga solo fra gli item dell'album aperto */
  function navLightbox(dir) {
    const list = albumIndexes();
    if (!list.length) return;
    const pos = list.indexOf(currentLbIndex);
    currentLbIndex = list[((pos < 0 ? 0 : pos) + dir + list.length) % list.length];
    renderLightbox(currentLbIndex);
  }

  /* ---------- slideshow di sfondo dell'hero ---------- */
  function initHeroSlides() {
    const wrap = document.getElementById("heroSlides");
    if (!wrap) return;
    const slides = Array.from(wrap.querySelectorAll(".hero-slide"));
    if (slides.length < 2) return;
    // chi ha chiesto meno animazioni vede solo la prima foto, ferma
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let i = 0;
    let timer = null;

    const next = () => {
      // salta le foto non ancora scaricate: eviterebbero un lampo nero
      let n = i;
      for (let k = 0; k < slides.length; k++) {
        n = (n + 1) % slides.length;
        if (slides[n].complete && slides[n].naturalWidth > 0) break;
      }
      if (n === i) return;
      slides[i].classList.remove("is-active");
      i = n;
      slides[i].classList.add("is-active");
    };

    // ruota solo mentre l'hero e davvero sullo schermo
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !timer) timer = setInterval(next, 6500);
        else if (!e.isIntersecting && timer) { clearInterval(timer); timer = null; }
      },
      { threshold: 0.25 }
    );
    io.observe(document.querySelector(".hero"));
  }

  /* ---------- particles canvas (hero) ---------- */
  function initParticles() {
    const canvas = document.getElementById("particles");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, particles;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    function makeParticles() {
      const count = Math.min(70, Math.floor((w * h) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        a: Math.random() * 0.5 + 0.15,
      }));
    }
    function tick() {
      ctx.clearRect(0, 0, w, h);
      const rgb = "255,255,255"; // l'hero e sempre scuro: particelle sempre chiare
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${p.a})`;
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    resize();
    makeParticles();
    tick();
    window.addEventListener("resize", () => {
      resize();
      makeParticles();
    });
  }

  /* ---------- hero parallax on mouse move ---------- */
  function initParallax() {
    const blobs = document.querySelectorAll(".blob");
    window.addEventListener("mousemove", (e) => {
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      blobs.forEach((b, i) => {
        const depth = (i + 1) * 14;
        b.style.marginLeft = `${cx * depth}px`;
        b.style.marginTop = `${cy * depth}px`;
      });
    });
  }

  /* ---------- contact form ----------
     Due modi di funzionare:
     - FORM_ENDPOINT vuoto (com'e ora): il form apre il programma di posta con il messaggio
       gia scritto. Non serve nessun servizio esterno e non promette invii che non avvengono.
     - FORM_ENDPOINT compilato: invio vero in background. Crea un form gratuito su
       formspree.io, copia l'URL che ti danno (tipo https://formspree.io/f/abcdwxyz)
       e incollalo qui sotto: il resto funziona da solo, fallback alla mail se l'invio fallisce.
  */
  const FORM_ENDPOINT = "";
  const CONTACT_EMAIL = "montanariluca1998@gmail.com";

  function initForm() {
    const form = document.getElementById("contactForm");
    const note = document.getElementById("formNote");
    if (!form) return;

    const say = (testo, tipo) => {
      note.textContent = testo;
      note.className = "form-note show " + tipo; // tipo: ok | ko
    };

    /** compone il messaggio leggibile a partire dai campi */
    function comporre() {
      const tipo = form.fType.options[form.fType.selectedIndex].text;
      return {
        nome: form.fName.value.trim(),
        email: form.fEmail.value.trim(),
        tipo,
        messaggio: form.fMsg.value.trim(),
      };
    }

    function apriPosta(d) {
      const oggetto = `Richiesta dal sito — ${d.tipo}`;
      const corpo =
        `Nome: ${d.nome}\n` +
        `Email: ${d.email}\n` +
        `Tipo: ${d.tipo}\n\n` +
        `${d.messaggio}\n`;
      // un link usa e getta: la pagina resta dov'e, a differenza di location.href
      const a = document.createElement("a");
      a.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(oggetto)}&body=${encodeURIComponent(corpo)}`;
      a.click();
      say(
        `Ho aperto il tuo programma di posta con il messaggio già pronto: controlla e premi invia. ` +
        `Se non si è aperto nulla, scrivimi direttamente a ${CONTACT_EMAIL}.`,
        "ok"
      );
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const d = comporre();

      if (!FORM_ENDPOINT) { apriPosta(d); return; }

      form.classList.add("loading");
      note.className = "form-note";
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        say("Messaggio inviato, grazie. Ti rispondo appena posso.", "ok");
      } catch (err) {
        // l'invio non e riuscito: lo dico e passo alla posta, senza far finta di niente
        say(
          `Non sono riuscito a inviare il messaggio. Riprova fra poco oppure scrivimi a ${CONTACT_EMAIL}.`,
          "ko"
        );
      } finally {
        form.classList.remove("loading");
      }
    });
  }

  /* ---------- year ---------- */
  function initYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initPreloader();
    initCursor();
    initNav();
    initTheme();
    initPortfolio();
    initLightbox();
    initHeroSlides();
    initParticles();
    initParallax();
    initForm();
    initYear();
    initReveal();
    updateProgress();
  });
})();
