/**
 * Verifies the gallery Embla carousel loops with neighbors visible and forward motion.
 * Run: npm test
 */
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const http = require("http");

const PORT = 8766;
const BASE = `http://127.0.0.1:${PORT}`;

function waitForServer(url, timeoutMs = 10000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      http
        .get(url, (res) => {
          res.resume();
          resolve();
        })
        .on("error", () => {
          if (Date.now() - start > timeoutMs) reject(new Error("Server did not start"));
          else setTimeout(tick, 100);
        });
    };
    tick();
  });
}

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

async function getSlideSnapshot(page) {
  return page.evaluate(() => {
    const viewport = document.querySelector("[data-gallery-viewport]");
    const track = document.querySelector("[data-gallery-track]");
    if (!viewport || !track) return null;

    const viewportRect = viewport.getBoundingClientRect();
    const viewportCenter = viewportRect.left + viewportRect.width / 2;
    const cards = [...track.querySelectorAll(".gallery__item")];

    const visible = cards
      .map((card, index) => {
        const rect = card.getBoundingClientRect();
        const overlap = Math.max(
          0,
          Math.min(rect.right, viewportRect.right) - Math.max(rect.left, viewportRect.left)
        );
        return {
          index,
          overlap,
          centerDist: Math.abs(rect.left + rect.width / 2 - viewportCenter),
        };
      })
      .filter((entry) => entry.overlap > 16)
      .sort((a, b) => a.centerDist - b.centerDist);

    const leftPeek = cards.some((card) => {
      const rect = card.getBoundingClientRect();
      return rect.right > viewportRect.left + 8 && rect.left < viewportRect.left + 48;
    });

    const rightPeek = cards.some((card) => {
      const rect = card.getBoundingClientRect();
      return rect.left < viewportRect.right - 8 && rect.right > viewportRect.right - 48;
    });

    const api = viewport._galleryEmblaApi;

    return {
      centeredIndex: visible[0]?.index ?? -1,
      leftPeek,
      rightPeek,
      loopActive: viewport.dataset.emblaLoop === "true",
      selectedIndex: api?.selectedScrollSnap() ?? -1,
      slideCount: cards.length,
    };
  });
}

async function mountGalleryCarousel(page, images) {
  const { trackItems, carouselStartIndex } = buildLoopCarouselTrack(images);

  await page.evaluate(
    ({ trackItems, carouselStartIndex }) => {
      const track = document.querySelector("[data-gallery-track]");
      const viewport = document.querySelector("[data-gallery-viewport]");
      const carousel = document.querySelector("[data-gallery-carousel]");
      if (!track || !viewport || !carousel) return;

      carousel.classList.add("gallery__carousel--active");
      viewport.setAttribute("data-embla", "");
      track.innerHTML = trackItems
        .map(
          (src, i) =>
            `<figure class="gallery__item"><img src="${src}" alt="Gallery ${i + 1}" /></figure>`
        )
        .join("");

      viewport.dataset.carouselStartIndex = String(carouselStartIndex);
      viewport._galleryEmblaApi?.destroy?.();

      const { embla, autoplay, loopActive } = window.CarouselsEmbla.initLoopCarousel(viewport, {
        delay: 3000,
        startIndex: carouselStartIndex,
        slideSelector: ".gallery__item",
        label: "Gallery carousel",
      });

      viewport._galleryEmblaApi = embla;
      viewport.dataset.emblaLoop = loopActive ? "true" : "false";
      embla.scrollTo(carouselStartIndex, true);
      autoplay?.play();
    },
    { trackItems, carouselStartIndex }
  );

  await page.locator('[data-section="gallery"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  return { trackItems, carouselStartIndex };
}

async function assertGalleryLoop(page, images, viewportWidth) {
  const { trackItems, carouselStartIndex } = await mountGalleryCarousel(page, images);

  const initial = await getSlideSnapshot(page);
  if (!initial?.loopActive) {
    throw new Error(`Gallery loop inactive for ${images.length} images at ${viewportWidth}px`);
  }
  if (initial.selectedIndex !== carouselStartIndex) {
    throw new Error(
      `Expected gallery start index ${carouselStartIndex} at ${viewportWidth}px, got ${initial.selectedIndex}`
    );
  }
  if (!initial.leftPeek || !initial.rightPeek) {
    throw new Error(
      `Expected gallery neighbors initially for ${images.length} images at ${viewportWidth}px`
    );
  }

  for (let step = 0; step < trackItems.length; step += 1) {
    await page.evaluate(() => {
      document.querySelector("[data-gallery-viewport]")?._galleryEmblaApi?.scrollNext();
    });
    await page.waitForTimeout(600);

    const snap = await getSlideSnapshot(page);
    if (!snap) throw new Error("Gallery carousel missing during loop test");
    if (!snap.leftPeek || !snap.rightPeek) {
      throw new Error(
        `Gallery missing neighbors at step ${step + 1} for ${images.length} images at ${viewportWidth}px`
      );
    }
  }
}

async function assertGalleryLightbox(page) {
  const lightbox = page.locator("[data-gallery-lightbox]");
  await expectHidden(lightbox);

  const thirdItem = page.locator("[data-gallery-track] .gallery__item").nth(2);
  await thirdItem.click();

  await expectVisible(lightbox);
  const imageSrc = await lightbox.locator("[data-gallery-lightbox-image]").getAttribute("src");
  if (!imageSrc?.includes("smile-03.jpg")) {
    throw new Error(`Expected lightbox to open on smile-03.jpg, got ${imageSrc}`);
  }

  await lightbox.locator("[data-gallery-lightbox-next]").click();
  const nextSrc = await lightbox.locator("[data-gallery-lightbox-image]").getAttribute("src");
  if (!nextSrc?.includes("smile-04.jpg")) {
    throw new Error(`Expected lightbox next image smile-04.jpg, got ${nextSrc}`);
  }

  await page.keyboard.press("ArrowLeft");
  const prevSrc = await lightbox.locator("[data-gallery-lightbox-image]").getAttribute("src");
  if (!prevSrc?.includes("smile-03.jpg")) {
    throw new Error(`Expected lightbox previous image smile-03.jpg, got ${prevSrc}`);
  }

  await page.keyboard.press("Escape");
  await expectHidden(lightbox);
}

async function expectHidden(locator) {
  const hidden = await locator.evaluate((node) => node.hidden);
  if (!hidden) {
    throw new Error("Expected element to be hidden");
  }
}

async function expectVisible(locator) {
  const hidden = await locator.evaluate((node) => node.hidden);
  if (hidden) {
    throw new Error("Expected element to be visible");
  }
}

async function run() {
  const server = spawn("python3", ["-m", "http.server", String(PORT)], {
    cwd: process.cwd(),
    stdio: "ignore",
  });

  try {
    await waitForServer(BASE);
    const browser = await chromium.launch({ headless: true });

    const demoImages = [
      "assets/images/gallery/smile-01.jpg",
      "assets/images/gallery/smile-02.jpg",
      "assets/images/gallery/smile-03.jpg",
      "assets/images/gallery/smile-04.jpg",
      "assets/images/gallery/smile-05.jpg",
    ];

    for (const viewport of [
      { width: 390, height: 844 },
      { width: 1280, height: 800 },
    ]) {
      const page = await browser.newPage({ viewport });
      await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
      await page.locator('[data-section="gallery"]').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);

      const slideCount = await page.evaluate(
        () => document.querySelectorAll("[data-gallery-track] .gallery__item").length
      );
      if (slideCount !== 5) {
        throw new Error(`Expected 5 native gallery slides for demo config, got ${slideCount}`);
      }

      const live = await getSlideSnapshot(page);
      if (!live?.loopActive) {
        throw new Error(`Live gallery loop inactive at ${viewport.width}px`);
      }
      if (!live.leftPeek || !live.rightPeek) {
        throw new Error(`Live gallery missing neighbors at ${viewport.width}px`);
      }

      if (viewport.width === 1280) {
        await assertGalleryLightbox(page);
      }

      await assertGalleryLoop(page, demoImages, viewport.width);

      for (const images of [demoImages.slice(0, 2), demoImages.slice(0, 3)]) {
        await assertGalleryLoop(page, images, viewport.width);
      }

      await page.evaluate(() => {
        document.querySelector("[data-gallery-viewport]")?._galleryEmblaApi?.plugins?.().autoplay?.play();
      });

      const beforeAutoplayIndex = await page.evaluate(
        () => document.querySelector("[data-gallery-viewport]")?._galleryEmblaApi?.selectedScrollSnap() ?? -1
      );
      await page.waitForTimeout(3500);
      const afterAutoplayIndex = await page.evaluate(
        () => document.querySelector("[data-gallery-viewport]")?._galleryEmblaApi?.selectedScrollSnap() ?? -1
      );
      if (beforeAutoplayIndex === afterAutoplayIndex) {
        throw new Error(`Gallery autoplay did not advance at ${viewport.width}px`);
      }

      await page.close();
    }

    await browser.close();
    console.log("PASS: gallery Embla carousel shows neighbors and loops forward.");
    console.log("PASS: gallery lightbox opens, navigates, and closes.");
  } finally {
    server.kill("SIGTERM");
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
