/**
 * =============================================================================
 * app.js — renders the entire site from window.SITE_CONFIG
 * No hardcoded client content. All copy/images come from config.js.
 * =============================================================================
 */

(function () {
  "use strict";

  const cfg = window.SITE_CONFIG;
  if (!cfg) {
    console.error("SITE_CONFIG missing — ensure config.js loads before app.js");
    return;
  }

  const LANG_KEY = "dental-site-lang";
  const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const MQ_DESKTOP_SERVICES = window.matchMedia("(min-width: 768px)");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Animation system variables (declared early to avoid TDZ errors)
  const DEBUG_MODE = false; // Set to false to remove debug overlay
  let animationObserver = null;
  let debugLog = [];

  /** @type {"en"|"es"} */
  let lang = getInitialLang();

  // -------------------------------------------------------------------------
  // Boot
  // -------------------------------------------------------------------------
  applyBranding();
  renderAll();
  bindGlobalUI();
  initHeaderScroll();
  initTestimonialsCarousel();
  initDentistsCarousel();
  initGalleryCarousel();
  initGalleryLightbox();
  initVerticalScrollChaining();
  
  // Initialize animations after content renders
  setTimeout(() => {
    initAnimations();
  }, 100);

  // Re-bind accordion behavior when breakpoint flips
  MQ_DESKTOP_SERVICES.addEventListener("change", () => {
    renderServices();
  });

  // -------------------------------------------------------------------------
  // Language helpers
  // -------------------------------------------------------------------------
  function getInitialLang() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "es") return saved;
    return cfg.defaultLanguage === "en" ? "en" : "es";
  }

  function setLanguage(next) {
    if (next !== "en" && next !== "es") return;
    lang = next;
    localStorage.setItem(LANG_KEY, lang);
    renderAll();
  }

  function t(path) {
    const parts = path.split(".");
    let node = cfg.ui[lang];
    for (const part of parts) {
      if (!node || typeof node !== "object") return path;
      node = node[part];
    }
    return typeof node === "string" ? node : path;
  }

  function localized(value) {
    if (value == null) return "";
    if (typeof value === "string") return value;
    return value[lang] || value.es || value.en || "";
  }

  // -------------------------------------------------------------------------
  // Branding tokens from config
  // -------------------------------------------------------------------------
  function applyBranding() {
    const root = document.documentElement;
    const b = cfg.branding || {};
    if (b.primaryColor) root.style.setProperty("--color-primary", b.primaryColor);
    if (b.accentColor) root.style.setProperty("--color-accent", b.accentColor);
    if (b.primaryDark) root.style.setProperty("--color-primary-dark", b.primaryDark);
    if (b.softBg) root.style.setProperty("--color-soft-bg", b.softBg);
  }

  // -------------------------------------------------------------------------
  // Full render (used on load + language swap — no page reload)
  // -------------------------------------------------------------------------
  function renderAll() {
    document.documentElement.lang = lang;
    document.title = `${cfg.practice.name} · ${localized(cfg.practice.tagline)}`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      const description = cfg.metadata
        ? localized(cfg.metadata)
        : `${cfg.practice.name} — ${localized(cfg.practice.tagline)}`;
      metaDesc.setAttribute("content", description);
    }

    renderBrand();
    renderNav();
    renderLangToggle();
    renderBookCTAs();
    renderHero();
    renderTrust();
    renderServices();
    renderDentists();
    renderGallery();
    renderTestimonials();
    renderFinancing();
    renderLocation();
    renderFooter();
    renderStickyBar();
    applyStaticI18n();
    updateGalleryLightboxLabels();
    refreshAnimations();
  }

  function applyStaticI18n() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
  }

  // -------------------------------------------------------------------------
  // Brand / Nav / CTAs
  // -------------------------------------------------------------------------
  function renderBrand() {
    const brand = document.querySelector("[data-brand]");
    if (!brand) return;

    const logoUrl = cfg.branding.logoUrl;
    const initials = cfg.practice.name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0] || "")
      .join("")
      .toUpperCase();

    brand.innerHTML = logoUrl
      ? `<img class="brand__logo" src="${escapeAttr(logoUrl)}" alt="${escapeAttr(cfg.practice.name)} logo" />
         <span class="brand__name">${escapeHtml(cfg.practice.name)}</span>`
      : `<span class="brand__mark" aria-hidden="true">${escapeHtml(initials)}</span>
         <span class="brand__name">${escapeHtml(cfg.practice.name)}</span>`;
  }

  function renderNav() {
    const list = document.querySelector("[data-nav-list]");
    if (!list) return;

    const items = [
      { href: "#services", key: "nav.services", section: "services" },
      { href: "#dentists", key: "nav.dentists", section: "dentists" },
      { href: "#gallery", key: "nav.gallery", section: "gallery" },
      { href: "#testimonials", key: "nav.testimonials", section: "testimonials" },
      { href: "#financing", key: "nav.financing", section: "financing" },
      { href: "#location", key: "nav.location", section: "location" },
    ].filter((item) => isSectionVisible(item.section));

    list.innerHTML = items
      .map(
        (item) =>
          `<li><a class="nav__link" href="${item.href}">${escapeHtml(t(item.key))}</a></li>`
      )
      .join("");

    // Close mobile nav when a link is tapped
    list.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", closeNav);
    });

    const toggle = document.querySelector("[data-nav-toggle]");
    if (toggle) {
      toggle.setAttribute("aria-label", t("nav.openMenu"));
    }
  }

  function renderLangToggle() {
    document.querySelectorAll("[data-lang-toggle] .lang-toggle__btn").forEach((btn) => {
      const code = btn.getAttribute("data-lang");
      btn.textContent = code === "en" ? t("langToggle.en") : t("langToggle.es");
      btn.setAttribute("aria-pressed", code === lang ? "true" : "false");
    });

    const group = document.querySelector("[data-lang-toggle]");
    if (group) group.setAttribute("aria-label", t("langToggle.label"));
  }

  function whatsappHref(message = "") {
    const digits = (cfg.practice.phoneTel || cfg.practice.phone || "").replace(/\D/g, "");
    if (!digits) return "#";
    
    // WhatsApp link format: https://wa.me/1234567890?text=Message
    const baseUrl = `https://wa.me/${digits}`;
    if (message) {
      const encodedMessage = encodeURIComponent(message);
      return `${baseUrl}?text=${encodedMessage}`;
    }
    return baseUrl;
  }

  function renderBookCTAs() {
    const bookMessage = lang === "es" 
      ? "Hola, me gustaría agendar una cita" 
      : "Hello, I would like to book an appointment";
    
    document.querySelectorAll("[data-book-cta]").forEach((el) => {
      el.href = whatsappHref(bookMessage);
      el.target = "_blank";
      el.rel = "noopener noreferrer";
      
      // Sticky / header / hero share the book label
      if (el.closest("[data-sticky-bar]")) {
        el.textContent = t("stickyBar.cta");
      } else if (el.classList.contains("btn--header-cta")) {
        el.textContent = t("nav.book");
      } else {
        el.textContent = t("hero.cta");
      }
    });
  }

  function renderStickyBar() {
    const bar = document.querySelector("[data-sticky-bar]");
    if (!bar) return;
    // Always useful when phone exists; hide only if no phone configured
    const hasPhone = Boolean((cfg.practice.phoneTel || cfg.practice.phone || "").replace(/\D/g, ""));
    bar.hidden = !hasPhone;
  }

  // -------------------------------------------------------------------------
  // Hero
  // -------------------------------------------------------------------------
  function renderHero() {
    const nameEl = document.querySelector("[data-practice-name]");
    const taglineEl = document.querySelector("[data-hero-tagline]");
    const badgeEl = document.querySelector("[data-hero-badge]");
    const img = document.querySelector("[data-hero-image]");

    if (nameEl) nameEl.textContent = cfg.practice.name;
    if (taglineEl) taglineEl.textContent = localized(cfg.practice.tagline);
    if (badgeEl) badgeEl.textContent = t("hero.badge");

    if (img) {
      img.src = cfg.branding.heroImageUrl || "";
      img.alt = "";
      img.decoding = "async";
      img.fetchPriority = "high";
    }
  }

  // -------------------------------------------------------------------------
  // Trust bar
  // -------------------------------------------------------------------------
  function renderTrust() {
    const section = document.querySelector('[data-section="trust"]');
    const list = document.querySelector("[data-trust-list]");
    if (!section || !list) return;

    const items = [];
    if (cfg.practice.yearsInPractice) {
      items.push({
        icon: iconYears(),
        value: cfg.practice.yearsInPractice,
        label: t("trust.years"),
      });
    }
    if (cfg.practice.patientRating) {
      items.push({
        icon: iconStar(),
        value: cfg.practice.patientRating,
        label: t("trust.rating"),
      });
    }
    // Always show licensed when trust bar has anything else
    if (items.length) {
      items.push({
        icon: iconBadge(),
        value: t("trust.licensed"),
        label: "",
      });
    }

    if (!items.length) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    list.innerHTML = items
      .map(
        (item) => `
      <li class="trust__item">
        <span class="trust__icon" aria-hidden="true">${item.icon}</span>
        <span class="trust__text">
          <span class="trust__value">${escapeHtml(item.value)}</span>
          ${item.label ? `<span class="trust__label">${escapeHtml(item.label)}</span>` : ""}
        </span>
      </li>`
      )
      .join("");
  }

  // -------------------------------------------------------------------------
  // Services
  // -------------------------------------------------------------------------
  function renderServices() {
    const section = document.querySelector('[data-section="services"]');
    const grid = document.querySelector("[data-services-grid]");
    if (!section || !grid) return;

    const services = Array.isArray(cfg.services) ? cfg.services : [];
    if (!services.length) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    const desktop = MQ_DESKTOP_SERVICES.matches;

    grid.innerHTML = services
      .map((service, index) => {
        const title = localized(service.name);
        const desc = localized(service.description);
        const icon = serviceIcon(service.icon);
        const id = `service-panel-${index}`;

        return `
        <article class="service-card" data-service-card>
          <button
            type="button"
            class="service-card__trigger"
            aria-expanded="false"
            aria-controls="${id}"
            ${desktop ? 'tabindex="-1"' : ""}
          >
            <span class="service-card__icon" aria-hidden="true">${icon}</span>
            <h3 class="service-card__title">${escapeHtml(title)}</h3>
            <span class="service-card__chevron" aria-hidden="true">${iconChevron()}</span>
          </button>
          <div class="service-card__panel" id="${id}" ${desktop ? "" : 'role="region"'}>
            <div class="service-card__panel-inner">
              <p class="service-card__desc">${escapeHtml(desc)}</p>
            </div>
          </div>
        </article>`;
      })
      .join("");

    if (!desktop) bindServicesAccordion(grid);
  }

  function bindServicesAccordion(grid) {
    const cards = Array.from(grid.querySelectorAll("[data-service-card]"));

    cards.forEach((card) => {
      const trigger = card.querySelector(".service-card__trigger");
      if (!trigger) return;

      trigger.addEventListener("click", () => {
        const willOpen = !card.classList.contains("is-open");

        // Single-open pattern
        cards.forEach((other) => {
          other.classList.remove("is-open");
          const btn = other.querySelector(".service-card__trigger");
          if (btn) btn.setAttribute("aria-expanded", "false");
        });

        if (willOpen) {
          card.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");

          // Auto-scroll expanded card toward top of viewport (account for sticky header)
          requestAnimationFrame(() => {
            const headerOffset = document.querySelector(".site-header")?.offsetHeight || 64;
            const top = card.getBoundingClientRect().top + window.scrollY - headerOffset - 12;
            window.scrollTo({
              top,
              behavior: prefersReducedMotion.matches ? "auto" : "smooth",
            });
          });
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // Dentists
  // -------------------------------------------------------------------------
  /**
   * Build carousel slide order for Embla loop + neighbor peeks.
   * - 1 item: static (no carousel)
   * - 2 items: sandwich six slides [B, A, B, A, B, A], start on A (first in config)
   * - 3–4 items: repeat roster to 6 slides, start on A
   * - 5+ items: one slide per item (5 slides loops reliably at gallery width)
   */
  function buildLoopCarouselTrack(items) {
    if (items.length <= 1) {
      return { trackItems: items, carouselStartIndex: 0 };
    }

    if (items.length === 2) {
      return {
        trackItems: Array.from({ length: 6 }, (_, index) => items[(index + 1) % 2]),
        carouselStartIndex: 1,
      };
    }

    if (items.length >= 3 && items.length <= 4) {
      return {
        trackItems: Array.from({ length: 6 }, (_, index) => items[index % items.length]),
        carouselStartIndex: 0,
      };
    }

    return { trackItems: items, carouselStartIndex: 0 };
  }

  function buildDentistsCarouselTrack(dentists) {
    const { trackItems, carouselStartIndex } = buildLoopCarouselTrack(dentists);
    return { trackDentists: trackItems, carouselStartIndex };
  }

  function buildGalleryCarouselTrack(images) {
    const { trackItems, carouselStartIndex } = buildLoopCarouselTrack(images);
    return { trackImages: trackItems, carouselStartIndex };
  }

  function initLoopEmblaSection({
    viewport,
    section,
    startIndex,
    delay,
    slideSelector,
    label,
    apiKey,
    nav,
  }) {
    if (!window.CarouselsEmbla?.initLoopCarousel) {
      console.error("CarouselsEmbla bundle missing — run npm run build:carousels-embla");
      return null;
    }

    const { embla, autoplay, loopActive } = window.CarouselsEmbla.initLoopCarousel(viewport, {
      delay,
      reducedMotion: prefersReducedMotion.matches,
      startIndex,
      slideSelector,
      label,
    });

    viewport.dataset.emblaLoop = loopActive ? "true" : "false";

    const refreshLoop = () => {
      if (!embla.internalEngine().options.loop) return;
      embla.internalEngine().slideLooper.loop();
    };

    const settleToStart = () => {
      refreshLoop();
      embla.scrollTo(startIndex, true);
    };

    embla.on("init", settleToStart);
    embla.on("reInit", settleToStart);
    embla.on("scroll", refreshLoop);
    embla.on("settle", refreshLoop);
    requestAnimationFrame(settleToStart);

    if (document.readyState === "complete") {
      requestAnimationFrame(settleToStart);
    } else {
      window.addEventListener("load", () => requestAnimationFrame(settleToStart), { once: true });
    }

    viewport[apiKey] = embla;

    let sectionVisible = false;

    const resumeAutoplay = () => {
      if (!sectionVisible || !autoplay || prefersReducedMotion.matches) return;
      autoplay.play();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          sectionVisible = entry.isIntersecting;
          if (sectionVisible) {
            resumeAutoplay();
          } else {
            autoplay?.stop();
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(section);

    embla.on("pointerUp", resumeAutoplay);
    embla.on("reInit", resumeAutoplay);
    viewport.addEventListener("touchend", resumeAutoplay, { passive: true });
    viewport.addEventListener("touchcancel", resumeAutoplay, { passive: true });

    if (nav?.prevBtn && nav?.nextBtn) {
      nav.prevBtn.addEventListener("click", () => {
        embla.scrollPrev();
        resumeAutoplay();
      });
      nav.nextBtn.addEventListener("click", () => {
        embla.scrollNext();
        resumeAutoplay();
      });
    }

    window.addEventListener("resize", () => embla.reInit(), { passive: true });

    return embla;
  }

  function renderDentists() {
    const section = document.querySelector('[data-section="dentists"]');
    const carousel = document.querySelector("[data-dentists-carousel]");
    const viewport = document.querySelector("[data-dentists-viewport]");
    const track = document.querySelector("[data-dentists-grid]");
    if (!section || !carousel || !viewport || !track) return;

    const dentists = Array.isArray(cfg.dentists) ? cfg.dentists : [];
    if (!dentists.length) {
      section.hidden = true;
      return;
    }

    section.hidden = false;

    const isCarousel = dentists.length > 1;
    carousel.classList.toggle("dentists__carousel--active", isCarousel);
    viewport.toggleAttribute("data-embla", isCarousel);
    viewport.removeAttribute("data-vertical-scroll-chain");

    // Build track order for Embla loop + neighbor peeks (see buildDentistsCarouselTrack).
    const { trackDentists, carouselStartIndex } = isCarousel
      ? buildDentistsCarouselTrack(dentists)
      : { trackDentists: dentists, carouselStartIndex: 0 };

    viewport.dataset.carouselStartIndex = String(carouselStartIndex);

    track.innerHTML = trackDentists
      .map((d) => {
        const initials = (d.name || "")
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((w) => w[0])
          .join("")
          .toUpperCase();

        const photo = d.photoUrl
          ? `<img src="${escapeAttr(d.photoUrl)}" alt="${escapeAttr(d.name)}" loading="lazy" decoding="async" />`
          : `<div class="dentist-card__placeholder" aria-hidden="true">${escapeHtml(initials)}</div>`;

        return `
        <article class="dentist-card">
          <div class="dentist-card__photo">${photo}</div>
          <div class="dentist-card__body">
            <h3>${escapeHtml(d.name)}</h3>
            <p class="dentist-card__title">${escapeHtml(localized(d.title))}</p>
            <p class="dentist-card__bio">${escapeHtml(localized(d.bio))}</p>
          </div>
        </article>`;
      })
      .join("");
  }

  // -------------------------------------------------------------------------
  // Dentists Carousel (Embla — loop + autoplay)
  // -------------------------------------------------------------------------
  function initDentistsCarousel() {
    const viewport = document.querySelector("[data-dentists-viewport]");
    if (!viewport || !viewport.hasAttribute("data-embla")) return;

    const section = document.querySelector('[data-section="dentists"]');
    if (!section) return;

    const startIndex = Number(viewport.dataset.carouselStartIndex || "0");

    initLoopEmblaSection({
      viewport,
      section,
      startIndex,
      delay: 5000,
      slideSelector: ".dentist-card",
      label: "Dentists carousel",
      apiKey: "_dentistsEmblaApi",
    });
  }

  // -------------------------------------------------------------------------
  // Gallery
  // -------------------------------------------------------------------------
  function renderGallery() {
    closeGalleryLightbox();

    const section = document.querySelector('[data-section="gallery"]');
    const carousel = document.querySelector("[data-gallery-carousel]");
    const viewport = document.querySelector("[data-gallery-viewport]");
    const track = document.querySelector("[data-gallery-track]");
    const nav = document.querySelector("[data-gallery-nav]");
    if (!section || !carousel || !viewport || !track) return;

    const images = Array.isArray(cfg.gallery) ? cfg.gallery.filter(Boolean) : [];
    if (!images.length) {
      section.hidden = true;
      return;
    }

    section.hidden = false;

    const isCarousel = images.length > 1;
    carousel.classList.toggle("gallery__carousel--active", isCarousel);
    viewport.toggleAttribute("data-embla", isCarousel);
    viewport.removeAttribute("data-vertical-scroll-chain");
    if (nav) nav.hidden = !isCarousel;

    const { trackImages, carouselStartIndex } = isCarousel
      ? buildGalleryCarouselTrack(images)
      : { trackImages: images, carouselStartIndex: 0 };

    viewport.dataset.carouselStartIndex = String(carouselStartIndex);

    const imageIndexBySrc = new Map(images.map((src, index) => [src, index]));

    track.innerHTML = trackImages
      .map((src) => {
        const imageIndex = imageIndexBySrc.get(src) ?? 0;
        const viewLabel = t("gallery.viewImage");
        return `
      <figure
        class="gallery__item"
        data-gallery-index="${imageIndex}"
        role="button"
        tabindex="0"
        aria-label="${escapeAttr(`${viewLabel} ${imageIndex + 1}`)}"
      >
        <img src="${escapeAttr(src)}" alt="${escapeAttr(
          `${cfg.practice.name} — ${imageIndex + 1}`
        )}" loading="lazy" decoding="async" />
      </figure>`;
      })
      .join("");
  }

  let galleryLightboxIndex = 0;
  let galleryLightboxOpener = null;
  let galleryLightboxImages = [];
  let galleryPress = null;

  function getGalleryImages() {
    return Array.isArray(cfg.gallery) ? cfg.gallery.filter(Boolean) : [];
  }

  function initGalleryLightbox() {
    const lightbox = document.querySelector("[data-gallery-lightbox]");
    const carousel = document.querySelector("[data-gallery-carousel]");
    if (!lightbox || !carousel || lightbox.dataset.bound === "true") return;

    lightbox.dataset.bound = "true";

    carousel.addEventListener("pointerdown", (event) => {
      const item = event.target.closest(".gallery__item");
      if (!item || !carousel.contains(item)) return;

      galleryPress = {
        x: event.clientX,
        y: event.clientY,
        item,
        pointerId: event.pointerId,
      };
    });

    carousel.addEventListener("pointerup", (event) => {
      if (!galleryPress || event.pointerId !== galleryPress.pointerId) return;

      const { x, y, item } = galleryPress;
      galleryPress = null;

      const dx = Math.abs(event.clientX - x);
      const dy = Math.abs(event.clientY - y);
      if (dx > 12 || dy > 12) return;

      const index = Number(item.dataset.galleryIndex);
      if (Number.isNaN(index)) return;

      openGalleryLightbox(index, item);
    });

    carousel.addEventListener("pointercancel", () => {
      galleryPress = null;
    });

    carousel.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      const item = event.target.closest(".gallery__item");
      if (!item || !carousel.contains(item)) return;

      event.preventDefault();
      const index = Number(item.dataset.galleryIndex);
      if (Number.isNaN(index)) return;

      openGalleryLightbox(index, item);
    });

    lightbox.querySelectorAll("[data-gallery-lightbox-close]").forEach((button) => {
      button.addEventListener("click", closeGalleryLightbox);
    });

    lightbox
      .querySelector("[data-gallery-lightbox-prev]")
      ?.addEventListener("click", () => stepGalleryLightbox(-1));
    lightbox
      .querySelector("[data-gallery-lightbox-next]")
      ?.addEventListener("click", () => stepGalleryLightbox(1));

    document.addEventListener("keydown", onGalleryLightboxKeydown);
    updateGalleryLightboxLabels();
  }

  function openGalleryLightbox(index, opener) {
    galleryLightboxImages = getGalleryImages();
    if (!galleryLightboxImages.length) return;

    galleryLightboxIndex = Math.max(0, Math.min(index, galleryLightboxImages.length - 1));
    galleryLightboxOpener = opener ?? null;

    const lightbox = document.querySelector("[data-gallery-lightbox]");
    if (!lightbox) return;

    updateGalleryLightboxSlide();
    updateGalleryLightboxLabels();

    lightbox.hidden = false;
    document.body.classList.add("gallery-lightbox-open");

    document.querySelector("[data-gallery-viewport]")?._galleryEmblaApi?.plugins?.()?.autoplay?.stop();

    lightbox.querySelector(".gallery-lightbox__close")?.focus();
  }

  function closeGalleryLightbox() {
    const lightbox = document.querySelector("[data-gallery-lightbox]");
    if (!lightbox || lightbox.hidden) return;

    lightbox.hidden = true;
    document.body.classList.remove("gallery-lightbox-open");

    galleryLightboxOpener?.focus?.();
    galleryLightboxOpener = null;

    if (!prefersReducedMotion.matches) {
      document.querySelector("[data-gallery-viewport]")?._galleryEmblaApi?.plugins?.()?.autoplay?.play();
    }
  }

  function stepGalleryLightbox(delta) {
    const total = galleryLightboxImages.length;
    if (total <= 1) return;

    galleryLightboxIndex = (galleryLightboxIndex + delta + total) % total;
    updateGalleryLightboxSlide();
  }

  function updateGalleryLightboxSlide() {
    const lightbox = document.querySelector("[data-gallery-lightbox]");
    if (!lightbox) return;

    const image = lightbox.querySelector("[data-gallery-lightbox-image]");
    const counter = lightbox.querySelector("[data-gallery-lightbox-counter]");
    const prevBtn = lightbox.querySelector("[data-gallery-lightbox-prev]");
    const nextBtn = lightbox.querySelector("[data-gallery-lightbox-next]");
    const src = galleryLightboxImages[galleryLightboxIndex];
    const total = galleryLightboxImages.length;

    if (image && src) {
      image.src = src;
      image.alt = `${cfg.practice.name} — ${galleryLightboxIndex + 1}`;
    }

    if (counter) {
      counter.textContent = total > 1 ? `${galleryLightboxIndex + 1} / ${total}` : "";
    }

    const showNav = total > 1;
    if (prevBtn) prevBtn.hidden = !showNav;
    if (nextBtn) nextBtn.hidden = !showNav;
  }

  function updateGalleryLightboxLabels() {
    const lightbox = document.querySelector("[data-gallery-lightbox]");
    if (!lightbox) return;

    lightbox
      .querySelector("[data-gallery-lightbox-dialog]")
      ?.setAttribute("aria-label", t("gallery.preview"));
    lightbox
      .querySelector(".gallery-lightbox__close")
      ?.setAttribute("aria-label", t("gallery.close"));
    lightbox
      .querySelector("[data-gallery-lightbox-prev]")
      ?.setAttribute("aria-label", t("gallery.previous"));
    lightbox
      .querySelector("[data-gallery-lightbox-next]")
      ?.setAttribute("aria-label", t("gallery.next"));
  }

  function onGalleryLightboxKeydown(event) {
    const lightbox = document.querySelector("[data-gallery-lightbox]");
    if (!lightbox || lightbox.hidden) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeGalleryLightbox();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepGalleryLightbox(-1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepGalleryLightbox(1);
    }
  }

  function initGalleryCarousel() {
    const viewport = document.querySelector("[data-gallery-viewport]");
    if (!viewport || !viewport.hasAttribute("data-embla")) return;

    const section = document.querySelector('[data-section="gallery"]');
    if (!section) return;

    const startIndex = Number(viewport.dataset.carouselStartIndex || "0");
    const prevBtn = document.querySelector("[data-gallery-prev]");
    const nextBtn = document.querySelector("[data-gallery-next]");

    initLoopEmblaSection({
      viewport,
      section,
      startIndex,
      delay: 3000,
      slideSelector: ".gallery__item",
      label: "Gallery carousel",
      apiKey: "_galleryEmblaApi",
      nav: prevBtn && nextBtn ? { prevBtn, nextBtn } : null,
    });
  }

  // -------------------------------------------------------------------------
  // Testimonials
  // -------------------------------------------------------------------------
  function renderTestimonials() {
    const section = document.querySelector('[data-section="testimonials"]');
    const track = document.querySelector("[data-testimonials-track]");
    const dots = document.querySelector("[data-testimonials-dots]");
    if (!section || !track || !dots) return;

    const items = Array.isArray(cfg.testimonials) ? cfg.testimonials : [];
    if (!items.length) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    track.innerHTML = items
      .map((item) => {
        const stars = Math.max(0, Math.min(5, Number(item.rating) || 0));
        return `
        <article class="testimonial-card">
          <div class="testimonial-card__stars" aria-label="${stars} / 5">
            ${Array.from({ length: 5 }, (_, i) => starSvg(i < stars)).join("")}
          </div>
          <p class="testimonial-card__quote">“${escapeHtml(localized(item.quote))}”</p>
          <p class="testimonial-card__author">${escapeHtml(item.author || "")}</p>
        </article>`;
      })
      .join("");

    dots.innerHTML = items
      .map(
        (_, i) =>
          `<button type="button" class="testimonials__dot" data-dot-index="${i}" aria-label="${
            i + 1
          }" ${i === 0 ? 'aria-current="true"' : ""}><span></span></button>`
      )
      .join("");

    // Dots click handlers
    dots.querySelectorAll("[data-dot-index]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number(btn.getAttribute("data-dot-index"));
        const card = track.children[index];
        if (card) {
          const left = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
          track.scrollTo({
            left: Math.max(0, left),
            behavior: prefersReducedMotion.matches ? "auto" : "smooth",
          });
        }
      });
    });
  }

  function initTestimonialsCarousel() {
    const track = document.querySelector("[data-testimonials-track]");
    const dots = document.querySelector("[data-testimonials-dots]");
    const section = document.querySelector('[data-section="testimonials"]');
    if (!track || !dots) return;

    const getActiveIndex = () => {
      const cards = Array.from(track.children);
      if (!cards.length) return 0;

      const center = track.scrollLeft + track.clientWidth / 2;
      let active = 0;
      let best = Infinity;

      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(cardCenter - center);
        if (dist < best) {
          best = dist;
          active = i;
        }
      });

      return active;
    };

    const syncDots = () => {
      const active = getActiveIndex();
      dots.querySelectorAll(".testimonials__dot").forEach((dot, i) => {
        if (i === active) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    };

    let ticking = false;
    track.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          syncDots();
          ticking = false;
        });
      },
      { passive: true }
    );

    initTestimonialsAutoScroll(track, section, getActiveIndex, syncDots);
  }

  // -------------------------------------------------------------------------
  // TESTIMONIALS AUTO-SCROLL
  // -------------------------------------------------------------------------
  function initTestimonialsAutoScroll(track, section, getActiveIndex, syncDots) {
    if (!track || prefersReducedMotion.matches) return;

    const cards = track.querySelectorAll(".testimonial-card");
    if (cards.length <= 1) return;

    let autoScrollInterval = null;
    let resumeTimeout = null;
    let isPaused = false;
    let isAutoScrolling = false;
    let currentIndex = 0;
    let sectionVisible = false;

    function scrollToCard(index, behavior = "smooth") {
      const card = cards[index];
      if (!card) return;

      isAutoScrolling = true;
      const left = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
      track.scrollTo({
        left: Math.max(0, left),
        behavior: prefersReducedMotion.matches ? "auto" : behavior,
      });

      window.setTimeout(() => {
        isAutoScrolling = false;
      }, prefersReducedMotion.matches ? 0 : 650);
    }

    function stopAutoScroll() {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    }

    function startAutoScroll() {
      if (isPaused || !sectionVisible || autoScrollInterval) return;

      autoScrollInterval = setInterval(() => {
        if (isPaused || !sectionVisible) return;
        currentIndex = (currentIndex + 1) % cards.length;
        scrollToCard(currentIndex);
      }, 3500);
    }

    function pauseAutoScroll() {
      isPaused = true;
      stopAutoScroll();
    }

    function resumeAutoScrollSoon(delay = 6000) {
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        currentIndex = getActiveIndex();
        isPaused = false;
        startAutoScroll();
      }, delay);
    }

    track.addEventListener("mouseenter", pauseAutoScroll);
    track.addEventListener("mouseleave", () => {
      if (!sectionVisible) return;
      isPaused = false;
      startAutoScroll();
    });

    track.addEventListener(
      "touchstart",
      () => {
        pauseAutoScroll();
        clearTimeout(resumeTimeout);
      },
      { passive: true }
    );

    track.addEventListener(
      "touchend",
      () => {
        currentIndex = getActiveIndex();
        resumeAutoScrollSoon();
      },
      { passive: true }
    );

    track.addEventListener(
      "touchcancel",
      () => {
        currentIndex = getActiveIndex();
        resumeAutoScrollSoon();
      },
      { passive: true }
    );

    track.addEventListener(
      "scroll",
      () => {
        if (isAutoScrolling) return;

        pauseAutoScroll();
        clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(() => {
          currentIndex = getActiveIndex();
          syncDots();
          isPaused = false;
          startAutoScroll();
        }, 6000);
      },
      { passive: true }
    );

    if (section) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            sectionVisible = entry.isIntersecting;
            if (sectionVisible) {
              currentIndex = getActiveIndex();
              isPaused = false;
              startAutoScroll();
            } else {
              pauseAutoScroll();
            }
          });
        },
        { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
      );
      observer.observe(section);
    } else {
      sectionVisible = true;
      startAutoScroll();
    }
  }

  // -------------------------------------------------------------------------
  // Financing
  // -------------------------------------------------------------------------
  function renderFinancing() {
    const section = document.querySelector('[data-section="financing"]');
    const grid = document.querySelector("[data-financing-grid]");
    if (!section || !grid) return;

    const images = Array.isArray(cfg.financingImages) ? cfg.financingImages.filter(Boolean) : [];
    if (!images.length) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    grid.innerHTML = images
      .map((image) => {
        const src = typeof image === "string" ? image : image.src;
        if (!src) return "";
        const alt =
          typeof image === "string"
            ? t("sections.financing")
            : localized(image.alt) || t("sections.financing");
        return `
        <figure class="financing__item">
          <img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" loading="lazy" decoding="async" />
        </figure>`;
      })
      .join("");
  }

  // -------------------------------------------------------------------------
  // Location
  // -------------------------------------------------------------------------
  function renderLocation() {
    const section = document.querySelector('[data-section="location"]');
    const card = document.querySelector("[data-location-card]");
    if (!section || !card) return;

    const addr = cfg.practice.address || {};
    const fullAddress = [addr.street, addr.city, addr.state, addr.zip].filter(Boolean).join(", ");
    if (!fullAddress && !cfg.practice.phone) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    const query = encodeURIComponent(addr.mapsQuery || fullAddress);
    const mapsEmbed = `https://www.google.com/maps?q=${query}&hl=${lang}&z=17&output=embed`;
    const mapsLink =
      addr.mapsUrl ||
      addr.mapsLink ||
      `https://www.google.com/maps/dir/?api=1&destination=${query}`;

    const hoursRows = DAY_ORDER.map((day) => {
      const value = cfg.practice.hours?.[day];
      const label = t(`location.days.${day}`);
      const display = value ? value : t("location.closed");
      // Skip days with empty string AND we still show closed — task says empty to omit;
      // interpret empty as omit from list for cleaner UX
      if (!value) return "";
      return `<li><span>${escapeHtml(label)}</span><span>${escapeHtml(display)}</span></li>`;
    }).join("");

    card.innerHTML = `
      <div class="location__map">
        <button
          type="button"
          class="location__map-shield"
          aria-label="${escapeAttr(t("location.mapInteract"))}"
        ></button>
        <iframe
          title="${escapeAttr(cfg.practice.name)}"
          src="${escapeAttr(mapsEmbed)}"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>
      </div>
      <div class="location__details">
        <address class="location__address">${escapeHtml(fullAddress)}</address>
        <h3 class="location__hours-title">${escapeHtml(t("location.hours"))}</h3>
        <ul class="location__hours">${hoursRows}</ul>
        <div class="location__actions">
          <a class="btn btn--primary" href="${whatsappHref(lang === 'es' ? 'Hola, tengo una pregunta' : 'Hello, I have a question')}" target="_blank" rel="noopener noreferrer">${escapeHtml(t("location.call"))}</a>
          <a class="btn btn--secondary" href="${escapeAttr(mapsLink)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
            t("location.directions")
          )}</a>
        </div>
      </div>`;

    bindMapScrollShield(card.querySelector(".location__map"));
  }

  // -------------------------------------------------------------------------
  // Footer
  // -------------------------------------------------------------------------
  function renderFooter() {
    const footer = document.querySelector("[data-footer]");
    if (!footer) return;

    const addr = cfg.practice.address || {};
    const fullAddress = [addr.street, addr.city, addr.state, addr.zip].filter(Boolean).join(", ");
    const year = new Date().getFullYear();

    const hoursRows = DAY_ORDER.map((day) => {
      const value = cfg.practice.hours?.[day];
      if (!value) return "";
      return `<li><span>${escapeHtml(t(`location.days.${day}`))}</span>: ${escapeHtml(value)}</li>`;
    }).join("");

    const socials = cfg.socials || {};
    const socialLinks = [
      socials.instagram
        ? `<a href="${escapeAttr(socials.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${iconInstagram()}</a>`
        : "",
      socials.facebook
        ? `<a href="${escapeAttr(socials.facebook)}" target="_blank" rel="noopener noreferrer" aria-label="Facebook">${iconFacebook()}</a>`
        : "",
    ]
      .filter(Boolean)
      .join("");

    footer.innerHTML = `
      <div class="site-footer__inner">
        <div>
          <p class="site-footer__brand">${escapeHtml(cfg.practice.name)}</p>
          <p class="site-footer__tagline">${escapeHtml(localized(cfg.practice.tagline))}</p>
        </div>
        <div class="site-footer__cols">
          <div>
            <h3>${escapeHtml(t("footer.contact"))}</h3>
            <ul class="site-footer__list">
              <li><a href="${whatsappHref()}" target="_blank" rel="noopener noreferrer">${escapeHtml(cfg.practice.phone || "")}</a></li>
              ${
                cfg.practice.email
                  ? `<li><a href="mailto:${escapeAttr(cfg.practice.email)}">${escapeHtml(
                      cfg.practice.email
                    )}</a></li>`
                  : ""
              }
              <li>${escapeHtml(fullAddress)}</li>
            </ul>
          </div>
          <div>
            <h3>${escapeHtml(t("footer.hours"))}</h3>
            <ul class="site-footer__list">${hoursRows}</ul>
          </div>
          <div>
            ${
              socialLinks
                ? `<h3>${escapeHtml(t("footer.follow"))}</h3>
                   <div class="site-footer__socials">${socialLinks}</div>`
                : ""
            }
          </div>
        </div>
        <div class="site-footer__bottom">
          © ${year} ${escapeHtml(cfg.practice.name)}. ${escapeHtml(t("footer.rights"))}
        </div>
        <p class="site-footer__credit">
          ${escapeHtml(t("footer.developedBy"))}
          <a href="https://iagodigital.vercel.app" target="_blank" rel="noopener">IAGO Digital</a>
        </p>
      </div>`;
  }

  // -------------------------------------------------------------------------
  // Section visibility helpers (for empty arrays)
  // -------------------------------------------------------------------------
  function isSectionVisible(key) {
    switch (key) {
      case "services":
        return Array.isArray(cfg.services) && cfg.services.length > 0;
      case "dentists":
        return Array.isArray(cfg.dentists) && cfg.dentists.length > 0;
      case "gallery":
        return Array.isArray(cfg.gallery) && cfg.gallery.length > 0;
      case "testimonials":
        return Array.isArray(cfg.testimonials) && cfg.testimonials.length > 0;
      case "financing":
        return Array.isArray(cfg.financingImages) && cfg.financingImages.length > 0;
      case "location":
        return Boolean(cfg.practice.address?.street || cfg.practice.phone);
      default:
        return true;
    }
  }

  // -------------------------------------------------------------------------
  // Global UI: nav toggle, language, etc.
  // -------------------------------------------------------------------------
  function bindGlobalUI() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.getElementById("primary-nav");

    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = !nav.classList.contains("is-open");
        if (open) openNav();
        else closeNav();
      });
    }

    document.querySelectorAll("[data-lang-toggle] .lang-toggle__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        setLanguage(btn.getAttribute("data-lang"));
      });
    });

    // Close nav on resize to desktop
    window.matchMedia("(min-width: 900px)").addEventListener("change", (e) => {
      if (e.matches) closeNav();
    });
  }

  function openNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", t("nav.closeMenu"));
    document.body.classList.add("nav-open");
  }

  function closeNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", t("nav.openMenu"));
    document.body.classList.remove("nav-open");
  }

  // -------------------------------------------------------------------------
  // Scroll chaining — prioritize vertical page scroll on pointer devices
  // -------------------------------------------------------------------------
  function initVerticalScrollChaining() {
    document.addEventListener(
      "wheel",
      (event) => {
        const chainTarget = event.target.closest("[data-vertical-scroll-chain]");
        if (!chainTarget) return;

        const { deltaX, deltaY } = event;
        if (deltaY === 0 || Math.abs(deltaX) > Math.abs(deltaY)) return;

        window.scrollBy({
          top: deltaY,
          left: 0,
          behavior: "auto",
        });
        event.preventDefault();
      },
      { capture: true, passive: false }
    );

    initTouchScrollPriority();
  }

  function initTouchScrollPriority() {
    const getChainContainer = (target) => {
      if (!(target instanceof Element)) return null;
      const container = target.closest("[data-vertical-scroll-chain]");
      if (!container || container.hasAttribute("data-embla")) return null;
      return container;
    };

    document.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches.length !== 1) return;

        const container = getChainContainer(event.target);
        if (!container) return;

        container._touchScroll = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
          left: container.scrollLeft,
          axis: null,
        };
      },
      { capture: true, passive: true }
    );

    document.addEventListener(
      "touchmove",
      (event) => {
        const container = getChainContainer(event.target);
        const touchScroll = container?._touchScroll;
        if (!container || !touchScroll || event.touches.length !== 1) return;

        const dx = event.touches[0].clientX - touchScroll.x;
        const dy = event.touches[0].clientY - touchScroll.y;

        if (!touchScroll.axis) {
          if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
          touchScroll.axis = Math.abs(dy) >= Math.abs(dx) ? "y" : "x";
        }

        if (touchScroll.axis === "y") {
          container.scrollLeft = touchScroll.left;
        }
      },
      { capture: true, passive: true }
    );

    const clearTouchScroll = (event) => {
      const container = getChainContainer(event.target);
      if (container?._touchScroll) {
        delete container._touchScroll;
      }
    };

    document.addEventListener("touchend", clearTouchScroll, { capture: true, passive: true });
    document.addEventListener("touchcancel", clearTouchScroll, { capture: true, passive: true });
  }

  function bindMapScrollShield(map) {
    if (!map) return;

    const shield = map.querySelector(".location__map-shield");
    if (!shield) return;

    shield.addEventListener(
      "wheel",
      (event) => {
        const { deltaX, deltaY } = event;
        if (deltaY === 0 || Math.abs(deltaX) > Math.abs(deltaY)) return;

        window.scrollBy({
          top: deltaY,
          left: 0,
          behavior: "auto",
        });
        event.preventDefault();
      },
      { passive: false }
    );

    shield.addEventListener("click", () => {
      map.classList.add("is-interactive");
    });

    if (!bindMapScrollShield.outsideBound) {
      bindMapScrollShield.outsideBound = true;
      document.addEventListener("click", (event) => {
        document.querySelectorAll(".location__map.is-interactive").forEach((activeMap) => {
          if (!activeMap.contains(event.target)) {
            activeMap.classList.remove("is-interactive");
          }
        });
      });
    }
  }
  bindMapScrollShield.outsideBound = false;

  // -------------------------------------------------------------------------
  // Header — hide on scroll down, show on scroll up (iOS-friendly)
  // -------------------------------------------------------------------------
  function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    let lastY = window.scrollY || 0;
    let ticking = false;
    const showAtTop = 24;
    const deltaMin = 8;

    function update() {
      ticking = false;
      const y = window.scrollY || 0;
      const delta = y - lastY;

      header.classList.toggle("is-scrolled", y > showAtTop);

      // Always show near the top of the page, or when the mobile nav is open
      if (y <= showAtTop || document.body.classList.contains("nav-open")) {
        header.classList.remove("is-hidden");
        lastY = y;
        return;
      }

      if (prefersReducedMotion.matches) {
        header.classList.remove("is-hidden");
        lastY = y;
        return;
      }

      if (Math.abs(delta) < deltaMin) return;

      if (delta > 0) {
        // Scrolling down — tuck the header away
        header.classList.add("is-hidden");
        closeNav();
      } else {
        // Scrolling up — bring it back
        header.classList.remove("is-hidden");
      }

      lastY = y;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
  }

  // -------------------------------------------------------------------------
  // Parallax — transform-based (iOS Safari friendly)
  // -------------------------------------------------------------------------
  // Handled by initHeroParallax() and initSectionParallax() in the animation system

  // =========================================================================
  // SCROLL ANIMATIONS & EFFECTS
  // =========================================================================

  function initAnimations() {
    if (prefersReducedMotion.matches) {
      console.log('[Animations] Respecting prefers-reduced-motion');
      document.body.classList.add('hero-loaded');
      return;
    }

    logDebug('Animation system initializing...');
    
    // 1. Hero entrance animation (on load, not scroll-triggered)
    initHeroEntrance();
    
    // 2. Hero parallax — media, veil, and content depth layers
    initHeroParallax();
    
    // 3. Section background parallax on scroll
    initSectionParallax();
    
    // 4. Scroll-triggered animations for all sections
    initScrollAnimations();
    
    // 6. Show debug overlay if enabled
    if (DEBUG_MODE) {
      createDebugOverlay();
    }
    
    logDebug('✓ Animation system ready');
  }

  // -------------------------------------------------------------------------
  // HERO - Fixed background + slide-in entrance
  // -------------------------------------------------------------------------
  function initHeroEntrance() {
    // Trigger hero content slide-in from left
    setTimeout(() => {
      document.body.classList.add('hero-loaded');
      logDebug('hero-content: slide-left FIRED');
    }, 150);
  }

  function initHeroParallax() {
    const hero = document.querySelector('[data-hero]');
    const media = document.querySelector('[data-hero-media]');
    const veil = document.querySelector('.hero__veil');
    const content = document.querySelector('.hero__content');

    if (!hero || !media) return;

    let ticking = false;
    let active = true;

    const io = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (!active) {
          media.style.transform = 'translate3d(0, 0, 0) scale(1)';
          if (veil) veil.style.setProperty('--hero-veil-y', '0px');
          if (content) content.style.setProperty('--hero-content-y', '0px');
        }
      },
      { rootMargin: '50% 0px' }
    );
    io.observe(hero);

    function updateHeroParallax() {
      ticking = false;
      if (!active || prefersReducedMotion.matches) {
        media.style.transform = 'translate3d(0, 0, 0) scale(1)';
        if (veil) veil.style.setProperty('--hero-veil-y', '0px');
        if (content) content.style.setProperty('--hero-content-y', '0px');
        return;
      }

      const rect = hero.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const heroHeight = Math.max(rect.height, 1);
      const progress = Math.min(scrolled / heroHeight, 1);

      // Background moves slower than scroll — classic parallax
      const mediaOffset = scrolled * 0.45;
      const scale = 1 + progress * 0.08;
      media.style.transform = `translate3d(0, ${mediaOffset.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;

      // Veil drifts gently for layered depth
      if (veil) {
        veil.style.setProperty('--hero-veil-y', `${(scrolled * 0.2).toFixed(2)}px`);
      }

      // Foreground text moves slightly faster than the image
      if (content) {
        content.style.setProperty('--hero-content-y', `${(scrolled * 0.28).toFixed(2)}px`);
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateHeroParallax);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateHeroParallax();
  }

  function initSectionParallax() {
    const parallaxSections = document.querySelectorAll(
      '[data-section], [data-section="trust"], .trust'
    );

    if (!parallaxSections.length) return;

    const speeds = {
      trust: 0.05,
      services: 0.1,
      dentists: 0.08,
      gallery: 0.11,
      testimonials: 0,
      financing: 0.07,
      location: 0.08,
    };

    let ticking = false;

    function updateSectionParallax() {
      ticking = false;
      if (prefersReducedMotion.matches) {
        parallaxSections.forEach((section) => section.style.removeProperty('--parallax-y'));
        return;
      }

      const viewportCenter = window.innerHeight * 0.5;

      parallaxSections.forEach((section) => {
        const key = section.getAttribute('data-section') || 'trust';
        const speed = speeds[key] ?? 0.08;
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height * 0.5;
        const distance = sectionCenter - viewportCenter;
        const offset = distance * speed * -0.35;
        section.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateSectionParallax);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateSectionParallax();
  }

  // -------------------------------------------------------------------------
  // SCROLL-TRIGGERED ANIMATIONS
  // -------------------------------------------------------------------------
  function initScrollAnimations() {
    animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.classList.contains('in-view')) {
            const animType = entry.target.getAttribute('data-animate') || 'unknown';
            const label = entry.target.getAttribute('data-anim-label') || animType;
            
            entry.target.classList.add('in-view');
            logDebug(`${label}: FIRED`);
            
            // Remove will-change after animation completes
            setTimeout(() => {
              entry.target.classList.add('animated');
            }, 700);

            // Unobserve after animating (one-time animation)
            animationObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    // Set up all scroll animations
    setupTrustBarAnimations();
    setupServicesAnimations();
    setupDentistsAnimations();
    setupGalleryAnimations();
    setupTestimonialsAnimations();
    setupFinancingAnimations();
    setupLocationAnimations();
    setupSectionHeaders();
    setupFooterAnimations();
  }

  // TRUST BAR - Staggered fade up
  function setupTrustBarAnimations() {
    const trustItems = document.querySelectorAll('.trust__list .trust__item');
    trustItems.forEach((item, i) => {
      item.setAttribute('data-animate', 'slide-up');
      item.setAttribute('data-anim-label', `trust-item-${i + 1}`);
      item.style.transitionDelay = `${i * 80}ms`;
      animationObserver.observe(item);
    });
  }

  // SERVICES - Alternating left/right with stagger
  function setupServicesAnimations() {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, i) => {
      const direction = i % 2 === 0 ? 'slide-left' : 'slide-right';
      card.setAttribute('data-animate', direction);
      card.setAttribute('data-anim-label', `service-card-${i + 1}-${direction}`);
      card.style.transitionDelay = `${i * 100}ms`;
      animationObserver.observe(card);
    });
  }

  // DENTISTS - Entire card slides in (static grid only; carousel uses Embla transforms)
  function setupDentistsAnimations() {
    const dentistCards = document.querySelectorAll(".dentist-card:not([data-clone])");
    dentistCards.forEach((card, i) => {
      if (card.closest(".dentists__carousel--active")) return;

      const direction = i % 2 === 0 ? "slide-left" : "slide-right";
      card.setAttribute("data-animate", direction);
      card.setAttribute("data-anim-label", `dentist-card-${i + 1}`);
      animationObserver.observe(card);
    });
  }

  // GALLERY - Scale + fade with stagger (static layouts only; carousel uses Embla transforms)
  function setupGalleryAnimations() {
    const galleryItems = document.querySelectorAll(".gallery__item:not([data-clone])");
    galleryItems.forEach((item, i) => {
      if (item.closest(".gallery__carousel--active")) return;

      item.setAttribute("data-animate", "fade-scale");
      item.setAttribute("data-anim-label", `gallery-item-${i + 1}`);
      item.style.transitionDelay = `${Math.min(i * 60, 400)}ms`;
      animationObserver.observe(item);
    });
  }

  // TESTIMONIALS - Fade the block once (cards sit in a horizontal track)
  function setupTestimonialsAnimations() {
    const wrap = document.querySelector(".testimonials__wrap");
    if (!wrap) return;

    wrap.setAttribute("data-animate", "fade");
    wrap.setAttribute("data-anim-label", "testimonials-wrap");
    animationObserver.observe(wrap);
  }

  // FINANCING - Staggered scale fade per image
  function setupFinancingAnimations() {
    const items = document.querySelectorAll('.financing__item');
    items.forEach((item, i) => {
      item.setAttribute('data-animate', 'fade-scale');
      item.setAttribute('data-anim-label', `financing-image-${i + 1}`);
      item.style.transitionDelay = `${i * 120}ms`;
      animationObserver.observe(item);
    });
  }

  // LOCATION - Fade up
  function setupLocationAnimations() {
    const locationCard = document.querySelector('.location__card');
    if (locationCard) {
      locationCard.setAttribute('data-animate', 'slide-up');
      locationCard.setAttribute('data-anim-label', 'location-card');
      animationObserver.observe(locationCard);
    }
  }

  // SECTION HEADERS - Fade up
  function setupSectionHeaders() {
    const headers = document.querySelectorAll('.section__header');
    headers.forEach((header, i) => {
      const section = header.closest('[data-section]');
      const sectionName = section ? section.getAttribute('data-section') : `section-${i}`;
      header.setAttribute('data-animate', 'slide-up');
      header.setAttribute('data-anim-label', `${sectionName}-header`);
      animationObserver.observe(header);
    });
  }

  // FOOTER - Fade up on scroll
  function setupFooterAnimations() {
    const footerInner = document.querySelector('.site-footer__inner');
    if (footerInner) {
      footerInner.setAttribute('data-animate', 'slide-up');
      footerInner.setAttribute('data-anim-label', 'footer');
      animationObserver.observe(footerInner);
    }
  }

  // Re-initialize animations after content changes (language swap)
  function refreshAnimations() {
    if (!animationObserver || prefersReducedMotion.matches) return;
    
    // Clear previous animations
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.classList.remove('in-view', 'animated');
      el.style.transitionDelay = '';
    });
    
    // Re-setup
    setupTrustBarAnimations();
    setupServicesAnimations();
    setupDentistsAnimations();
    setupGalleryAnimations();
    setupTestimonialsAnimations();
    setupFinancingAnimations();
    setupLocationAnimations();
    setupSectionHeaders();
    setupFooterAnimations();
  }
  // -------------------------------------------------------------------------
  function logDebug(message) {
    console.log(`[Animations] ${message}`);
    if (DEBUG_MODE) {
      debugLog.push({
        message,
        time: Date.now(),
        isFired: message.includes('FIRED')
      });
      updateDebugOverlay();
    }
  }

  function createDebugOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'anim-debug';
    overlay.innerHTML = `
      <div class="debug-title">🎬 Animation Debug</div>
      <div class="debug-content"></div>
    `;
    document.body.appendChild(overlay);
    
    // Instructions
    console.log('%c═══════════════════════════════════════', 'color: #fbbf24');
    console.log('%c🎬 ANIMATION DEBUG MODE ACTIVE', 'color: #4ade80; font-weight: bold; font-size: 14px');
    console.log('%cTo disable: Open js/app.js and set DEBUG_MODE = false', 'color: #60a5fa');
    console.log('%c═══════════════════════════════════════', 'color: #fbbf24');
  }

  function updateDebugOverlay() {
    const content = document.querySelector('#anim-debug .debug-content');
    if (!content) return;
    
    // Show last 12 entries
    const recent = debugLog.slice(-12);
    content.innerHTML = recent
      .map(entry => {
        const className = entry.isFired ? 'debug-log fired' : 'debug-log';
        return `<div class="${className}">→ ${entry.message}</div>`;
      })
      .join('');
  }

  // -------------------------------------------------------------------------
  // Icons (inline SVG — no icon font dependency)
  // -------------------------------------------------------------------------
  function serviceIcon(key) {
    switch (key) {
      case "cleaning":
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 3c2 3 2 5 2 7a2 2 0 1 1-4 0c0-2 0-4 2-7z"/><path d="M8 14c.8 2.2 2.2 4 4 6 1.8-2 3.2-3.8 4-6"/><path d="M7 17h10"/></svg>`;
      case "whitening":
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 3l1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3z"/><path d="M18 13l.8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13z"/></svg>`;
      case "aligners":
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 10c2-3 5-4 8-4s6 1 8 4"/><path d="M4 14c2 3 5 4 8 4s6-1 8-4"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg>`;
      case "emergency":
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 3v18"/><path d="M5 10h14"/><circle cx="12" cy="12" r="9"/></svg>`;
      case "implants":
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 3v8"/><path d="M9 7h6"/><path d="M10 11h4l-1 10h-2l-1-10z"/></svg>`;
      case "pediatric":
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="8" r="3.5"/><path d="M6 19c1.5-3 4-4.5 6-4.5S16.5 16 18 19"/><path d="M9.5 9.5c.5.8 1.4 1.3 2.5 1.3s2-.5 2.5-1.3"/></svg>`;
      case "cosmetic":
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 21c4-3.5 7-6.8 7-11a7 7 0 1 0-14 0c0 4.2 3 7.5 7 11z"/></svg>`;
      default:
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 3c2.5 3.5 3 6 3 8a3 3 0 1 1-6 0c0-2 .5-4.5 3-8z"/><path d="M7 15c1.2 2.5 2.8 4 5 5 2.2-1 3.8-2.5 5-5"/></svg>`;
    }
  }

  function iconChevron() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>`;
  }

  function iconYears() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 2.5"/></svg>`;
  }

  function iconStar() {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.5l2.7 5.5 6 .9-4.4 4.2 1 5.9L12 17.3 6.7 20l1-5.9L3.3 9.9l6-.9L12 3.5z"/></svg>`;
  }

  function iconShield() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>`;
  }

  function iconBadge() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="9" r="4"/><path d="M7 20l1.5-4.5M17 20l-1.5-4.5M9.5 14.5L8 20h8l-1.5-5.5"/></svg>`;
  }

  function starSvg(filled) {
    if (filled) {
      return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.5l2.7 5.5 6 .9-4.4 4.2 1 5.9L12 17.3 6.7 20l1-5.9L3.3 9.9l6-.9L12 3.5z"/></svg>`;
    }
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 3.5l2.7 5.5 6 .9-4.4 4.2 1 5.9L12 17.3 6.7 20l1-5.9L3.3 9.9l6-.9L12 3.5z"/></svg>`;
  }

  function iconInstagram() {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`;
  }

  function iconFacebook() {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg>`;
  }

  // -------------------------------------------------------------------------
  // Escaping
  // -------------------------------------------------------------------------
  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }
})();
