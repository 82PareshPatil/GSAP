/* ======================== */
/* Step 01 - Render Logic   */
/* ======================== */

const fallbackSvgDataUri = (label = "Missing") => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="700">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="#e8e8e8" offset="0"/>
          <stop stop-color="#cfcfcf" offset="1"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="system-ui" font-size="34" fill="#666">
        ${label}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const el = (tag, className) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
};

const applyThemeData = (panelEl, theme) => {
  if (!theme) return;

  if (typeof theme === "string") {
    panelEl.dataset.theme = theme;
    return;
  }

  panelEl.dataset.theme = "custom";
  const map = {
    bg: "themeBg",
    fg: "themeFg",
    muted: "themeMuted",
    year: "themeYear",
    cardBg: "themeCardBg",
    cardBorder: "themeCardBorder",
    yearLayerOpacity: "themeYearLayerOpacity",
  };

  for (const [key, dataKey] of Object.entries(map)) {
    const val = theme[key];
    if (val == null) continue;
    panelEl.dataset[dataKey] = String(val);
  }
};

const buildTile = (tileData) => {
  const tileEl = el("div", `tile ${tileData.pos || ""}`.trim());

  tileEl.style.setProperty("--w", tileData.w || "30vw");
  tileEl.style.setProperty("--ratio", tileData.ratio || "16 / 9");
  tileEl.style.setProperty("--z", String(tileData.z ?? 1));

  tileEl.dataset.depth = String(tileData.depth ?? 0);

  const boxEl = el("div", "tile__box");

  switch (tileData.type) {
    case "text": {
      boxEl.classList.add("text-only__box");

      const textEl = el("div", "tile__text");
      textEl.dataset.reveal = "text";

      const h = el("h3");
      h.textContent = tileData.heading || "";

      const p = el("p");
      p.textContent = tileData.copy || "";

      textEl.append(h, p);
      boxEl.appendChild(textEl);
      break;
    }
    case "image": {
      const img = el("img", "tile__media");
      img.loading = "lazy";
      img.decoding = "async";
      img.alt = tileData.alt || "";
      img.src = tileData.src;
      img.dataset.reveal = "media";

      img.onerror = () => {
        img.onerror = null;
        img.src = fallbackSvgDataUri(tileData.alt || "Image");
      };

      boxEl.appendChild(img);
      break;
    }
    case "video": {
      const video = el("video", "tile__media");
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.autoplay = true;
      video.preload = "metadata";
      if (tileData.poster) video.poster = tileData.poster;
      video.dataset.reveal = "video";

      const source = el("source");
      source.src = tileData.src;
      source.type = tileData.src?.endsWith(".webm")
        ? "video/webm"
        : "video/mp4";

      video.appendChild(source);
      boxEl.appendChild(video);
      break;
    }
  }

  tileEl.appendChild(boxEl);
  return tileEl;
};

// ----- DATA -----
const timelineItems = [
  {
    id: "KIKI",
    year: "1989",
    theme: "kikis",
    tiles: [
      { type: "image", pos: "pos-top-left-10", w: "25vw", ratio: "16 / 9", src: "https://www.ghibli.jp/gallery/kiki033.jpg", alt: "Kiki flying", depth: 10, z: 1 },
      { type: "text", pos: "pos-bottom-right", w: "500px", ratio: "16 / 9", heading: "Kiki's Delivery Service", copy: "A young witch moves to a new town and uses her flying ability to earn a living.", depth: 20, z: 4 },
      { type: "image", pos: "pos-bottom-left", w: "35vw", ratio: "16 / 9", src: "https://www.ghibli.jp/gallery/kiki001.jpg", alt: "Kiki", depth: 25, z: 1 }
    ],
  },
  {
    id: "TOTORO",
    year: "1988",
    theme: "totoro",
    tiles: [
      { type: "image", pos: "pos-top-right", w: "30vw", ratio: "16 / 9", src: "https://www.ghibli.jp/gallery/totoro001.jpg", alt: "Catbus", depth: 15, z: 2 },
      { type: "text", pos: "pos-top-left-10", w: "450px", ratio: "1 / 1", heading: "My Neighbor Totoro", copy: "Two sisters move to the country and encounter friendly forest spirits.", depth: 10, z: 3 },
      { type: "image", pos: "pos-bottom-center-lg", w: "40vw", ratio: "16 / 9", src: "https://www.ghibli.jp/gallery/totoro012.jpg", alt: "Totoro", depth: 30, z: 1 }
    ],
  },
  {
    id: "MONONOKE",
    year: "1997",
    theme: "mononoke",
    tiles: [
      { type: "image", pos: "pos-bottom-left-10", w: "28vw", ratio: "16 / 9", src: "https://www.ghibli.jp/gallery/mononoke007.jpg", alt: "San", depth: 20, z: 2 },
      { type: "text", pos: "pos-top-right", w: "400px", ratio: "16 / 9", heading: "Princess Mononoke", copy: "A journey to find a cure for a curse leads to a war between forest gods and humans.", depth: 15, z: 4 },
      { type: "image", pos: "pos-top-quarter-left", w: "30vw", ratio: "4 / 3", src: "https://www.ghibli.jp/gallery/mononoke014.jpg", alt: "Ashitaka", depth: 5, z: 1 }
    ],
  },
  {
    id: "SPIRITED",
    year: "2001",
    theme: "spirited",
    tiles: [
      { type: "image", pos: "pos-top-left", w: "35vw", ratio: "16 / 9", src: "https://www.ghibli.jp/gallery/chihiro001.jpg", alt: "Chihiro", depth: 10, z: 2 },
      { type: "text", pos: "pos-bottom-left", w: "500px", ratio: "16 / 9", heading: "Spirited Away", copy: "A girl wanders into a world ruled by gods, witches, and spirits.", depth: 25, z: 3 },
      { type: "image", pos: "pos-bottom-right-10", w: "25vw", ratio: "16 / 9", src: "https://www.ghibli.jp/gallery/chihiro043.jpg", alt: "Haku", depth: 15, z: 1 }
    ],
  },
  {
    id: "HOWL",
    year: "2004",
    theme: "howl",
    tiles: [
      { type: "image", pos: "pos-top-right", w: "32vw", ratio: "16 / 9", src: "https://www.ghibli.jp/gallery/howl005.jpg", alt: "Moving Castle", depth: 10, z: 2 },
      { type: "text", pos: "pos-bottom-center-lg", w: "480px", ratio: "16 / 9", heading: "Howl's Moving Castle", copy: "A young woman is cursed with an old body and seeks a wizard for help.", depth: 20, z: 4 },
      { type: "image", pos: "pos-top-left-10", w: "28vw", ratio: "16 / 9", src: "https://www.ghibli.jp/gallery/howl012.jpg", alt: "Sophie", depth: 30, z: 1 }
    ],
  },
  {
    id: "PONYO",
    year: "2008",
    theme: "ponyo",
    tiles: [
      { type: "image", pos: "pos-bottom-right", w: "30vw", ratio: "16 / 9", src: "https://www.ghibli.jp/gallery/ponyo001.jpg", alt: "Ponyo", depth: 15, z: 2 },
      { type: "text", pos: "pos-top-left", w: "450px", ratio: "16 / 9", heading: "Ponyo", copy: "A goldfish princess longs to become human and befriends a boy named Sosuke.", depth: 10, z: 3 },
      { type: "image", pos: "pos-top-quarter-left", w: "35vw", ratio: "16 / 9", src: "https://www.ghibli.jp/gallery/ponyo022.jpg", alt: "Ocean", depth: 25, z: 1 }
    ],
  }
];

const mountPanels = () => {
  const listFrag = document.createDocumentFragment();

  for (const item of timelineItems) {
    const li = el("li");

    const panel = el("article", "panel");
    panel.dataset.entryId = item.id;
    applyThemeData(panel, item.theme);

    const stage = el("div", "panel__stage");
    for (const tileData of item.tiles) {
      stage.appendChild(buildTile(tileData));
    }

    panel.appendChild(stage);
    li.appendChild(panel);
    listFrag.appendChild(li);
  }

  const panelsList = document.querySelector("[data-panels]");
  if (panelsList) panelsList.appendChild(listFrag);
};

const mountYears = () => {
  const yearsFrag = document.createDocumentFragment();

  for (const item of timelineItems) {
    const yearEl = el("div", "year");
    yearEl.dataset.timeline = "year";

    for (const ch of String(item.year)) {
      const span = el("span", "char");
      span.textContent = ch;
      yearEl.appendChild(span);
    }
    yearsFrag.appendChild(yearEl);
  }

  const yearsRail = document.querySelector('[data-timeline="years-wrapper"]');
  if (yearsRail) yearsRail.appendChild(yearsFrag);
};

function initTimeline() {
  const lenis = new Lenis({ smooth: true });
  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  const timelineRoot = document.querySelector('[data-app="timeline"]');
  if (!timelineRoot) return;

  const panelsList = timelineRoot.querySelector("[data-panels]");
  const yearsRail = timelineRoot.querySelector('[data-timeline="years-wrapper"]');

  if (!panelsList || !yearsRail) return;

  mountPanels();
  mountYears();
}

/* Step 02 - Reveal Logic */
/* ====================== */
function initRevealAndParallax() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!window.gsap || !window.ScrollTrigger) {
    console.warn("GSAP/ScrollTrigger missing for reveal.");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const showInstant = (node) => {
    node.style.opacity = "1";
    node.style.transform = "none";
  };

  const animateReveal = (node, { kind, triggerStart, duration }) => {
    if (reduceMotion) return showInstant(node);

    const tileTrigger = node.closest(".tile") || node;

    if (kind === "media") {
      gsap.fromTo(
        node,
        { opacity: 0, scale: 1.1 },
        {
          opacity: 1,
          scale: 1,
          duration,
          ease: "power2.out",
          scrollTrigger: {
            trigger: tileTrigger,
            start: triggerStart,
            once: true,
          },
        },
      );
      return;
    }

    // kind === "text"
    gsap.to(node, {
      opacity: 1,
      y: 0,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: tileTrigger,
        start: triggerStart,
        once: true,
      },
    });
  };

  const whenImgReady = (img, cb) => {
    if (img.complete && img.naturalWidth > 0) cb();
    else img.addEventListener("load", cb, { once: true });
  };

  // Images
  document.querySelectorAll('[data-reveal="media"]').forEach((img) => {
    whenImgReady(img, () =>
      animateReveal(img, {
        kind: "media",
        triggerStart: "top 60%",
        duration: 0.8,
      }),
    );
  });

  // Text blocks
  document.querySelectorAll('[data-reveal="text"]').forEach((textBlock) => {
    if (!reduceMotion) gsap.set(textBlock, { opacity: 0, y: 24 });

    animateReveal(textBlock, {
      kind: "text",
      triggerStart: "top 60%",
      duration: 0.7,
    });
  });

  // Videos: reveal + auto play/pause based on visibility
  document.querySelectorAll('[data-reveal="video"]').forEach((videoEl) => {
    const tileTrigger = videoEl.closest(".tile") || videoEl;

    const initVideo = () => {
      animateReveal(videoEl, {
        kind: "media",
        triggerStart: "top 60%",
        duration: 0.8,
      });

      ScrollTrigger.create({
        trigger: tileTrigger,
        start: "top center",
        end: "bottom top",
        onEnter: () => videoEl.play().catch(() => {}),
        onEnterBack: () => videoEl.play().catch(() => {}),
        onLeave: () => videoEl.pause(),
        onLeaveBack: () => videoEl.pause(),
      });
    };

    if (videoEl.readyState >= 1) initVideo();
    else videoEl.addEventListener("loadedmetadata", initVideo, { once: true });
  });

  // Tile Parallax
  gsap.utils.toArray(".panel").forEach((panelEl) => {
    panelEl.querySelectorAll(".tile").forEach((tileEl) => {
      const parallaxDepth = Number(tileEl.dataset.depth || 18);

      gsap.fromTo(
        tileEl,
        { y: -parallaxDepth },
        {
          y: parallaxDepth * 5,
          ease: "none",
          scrollTrigger: {
            trigger: panelEl,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        },
      );
    });
  });

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

/* Step 03 - Theme Logic */
/* ===================== */
function initYearSwapAndTheme() {
  const themePresets = {
    kikis: {
      bg: "#354152",
      fg: "#354152",
      muted: "#4f5563",
      year: "#ffece6",
      cardBg: "#ffffffcc",
      cardBorder: "transparent",
      yearLayerOpacity: 0.4,
    },
    totoro: {
      bg: "#e4e4e4",
      fg: "#432f23",
      muted: "#6d5546",
      year: "#64441c",
      cardBg: "#ffffffcc",
      cardBorder: "transparent",
      yearLayerOpacity: 0.43,
    },
    mononoke: {
      bg: "#79b0b4",
      fg: "#79b0b4",
      muted: "#ffffff",
      year: "#012d31",
      cardBg: "#12151ccc",
      cardBorder: "transparent",
      yearLayerOpacity: 0.33,
    },
    spirited: {
      bg: "#edf8f4",
      fg: "#1d2535",
      muted: "#5c6b7f",
      year: "#c2d1d9",
      cardBg: "#ffffffcc",
      cardBorder: "transparent",
      yearLayerOpacity: 0.4,
    },
    howl: {
      bg: "#ffffff",
      fg: "#111111",
      muted: "rgba(17, 17, 17, 0.7)",
      year: "#2a2a2a",
      cardBg: "rgba(255, 255, 255, 0)",
      cardBorder: "rgba(0, 0, 0, 0.08)",
      yearLayerOpacity: 1,
    },
    ponyo: {
      bg: "#ffffff",
      fg: "#111111",
      muted: "rgba(17, 17, 17, 0.7)",
      year: "#2a2a2a",
      cardBg: "rgba(255, 255, 255, 0)",
      cardBorder: "rgba(0, 0, 0, 0.08)",
      yearLayerOpacity: 1,
    },
  };

  const panelEls = gsap.utils.toArray(".panel");
  const yearEls = gsap.utils.toArray('[data-timeline="year"]');

  if (!panelEls.length || !yearEls.length) return;

  const getPanelTheme = (panelEl) => {
    const themeName = panelEl.dataset.theme;

    // Named theme
    if (themeName && themeName !== "custom") {
      return themePresets[themeName] || themePresets.light;
    }

    // Custom theme from dataset
    const customTheme = {
      bg: panelEl.dataset.themeBg,
      fg: panelEl.dataset.themeFg,
      muted: panelEl.dataset.themeMuted,
      year: panelEl.dataset.themeYear,
      cardBg: panelEl.dataset.themeCardBg,
      cardBorder: panelEl.dataset.themeCardBorder,
      yearLayerOpacity: panelEl.dataset.themeYearLayerOpacity
        ? Number(panelEl.dataset.themeYearLayerOpacity)
        : undefined,
    };

    // Merge onto light defaults, ignoring null/undefined
    return {
      ...themePresets.light,
      ...Object.fromEntries(
        Object.entries(customTheme).filter(([ , v]) => v != null),
      ),
    };
  };

  const setCssVars = (theme, { animate = true } = {}) => {
    const root = document.documentElement;

    const vars = {
      "--bg": theme.bg,
      "--fg": theme.fg,
      "--muted": theme.muted,
      "--year": theme.year,
      "--cardBg": theme.cardBg,
      "--cardBorder": theme.cardBorder,
      "--yearLayerOpacity": String(theme.yearLayerOpacity ?? 0.4),
    };

    if (!animate) {
      for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
      return;
    }

    gsap.to(root, {
      duration: 0.45,
      ease: "power2.out",
      ...vars,
    });
  };

  const initYearChars = () => {
    yearEls.forEach((yearEl, i) => {
      const chars = yearEl.querySelectorAll(".char");
      gsap.set(chars, {
        yPercent: i === 0 ? 0 : 100,
        opacity: i === 0 ? 1 : 0,
      });
    });
  };

  const setupYearSwap = () => {
    panelEls.forEach((panelEl, i) => {
      if (i === 0) return;

      const prevYearEl = yearEls[i - 1];
      const nextYearEl = yearEls[i];
      if (!prevYearEl || !nextYearEl) return;

      const prevChars = prevYearEl.querySelectorAll(".char");
      const nextChars = nextYearEl.querySelectorAll(".char");

      gsap
        .timeline({
          scrollTrigger: {
            trigger: panelEl,
            start: "top bottom",
            end: "center center",
            scrub: 1,
            // markers: true,
          },
        })
        .to(
          prevChars,
          {
            yPercent: -100,
            opacity: 0,
            duration: 4,
            stagger: 1,
            ease: "cubic-bezier(0.23, 1, 0.32, 1)",
          },
          0,
        )
        .to(
          nextChars,
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 4,
            stagger: 1,
            ease: "cubic-bezier(0.23, 1, 0.32, 1)",
          },
          0,
        );
    });
  };



  const setupThemeSwitch = () => {
    panelEls.forEach((panelEl) => {
      ScrollTrigger.create({
        trigger: panelEl,
        start: "top center",
        end: "bottom center",
        onEnter: () => setCssVars(getPanelTheme(panelEl), { animate: true }),
        onEnterBack: () =>
          setCssVars(getPanelTheme(panelEl), { animate: true }),
        onLeave: () => setCssVars(getPanelTheme(panelEl), { animate: true }),
        onLeaveBack: () =>
          setCssVars(getPanelTheme(panelEl), { animate: true }),
      });
    });
  };

  initYearChars();
  setupYearSwap();
  setupThemeSwitch();

  // Apply first theme immediately
  setCssVars(getPanelTheme(panelEls[0]), { animate: false });

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

document.addEventListener("DOMContentLoaded", () => {
  initTimeline();
  initRevealAndParallax();
  initYearSwapAndTheme();
});