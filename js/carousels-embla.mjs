import EmblaCarousel from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";

/**
 * @param {HTMLElement} viewport
 * @param {{
 *   slideSelector?: string,
 *   delay?: number,
 *   reducedMotion?: boolean,
 *   startIndex?: number,
 *   label?: string,
 * }} [options]
 */
export function initLoopCarousel(viewport, options = {}) {
  const slideSelector = options.slideSelector ?? ".embla__slide";
  const delay = options.delay ?? 5000;
  const reducedMotion = options.reducedMotion ?? false;
  const startIndex = options.startIndex ?? 0;
  const label = options.label ?? "Carousel";

  const plugins = reducedMotion
    ? []
    : [
        Autoplay({
          delay,
          playOnInit: false,
          stopOnInteraction: false,
          stopOnMouseEnter: false,
          stopOnFocusIn: false,
        }),
      ];

  const embla = EmblaCarousel(
    viewport,
    {
      loop: true,
      align: "center",
      containScroll: false,
      skipSnaps: false,
      startIndex,
      slides: slideSelector,
    },
    plugins
  );

  if (!embla.internalEngine().options.loop) {
    console.warn(
      `${label}: Embla loop was disabled because slides are too wide. Neighbors and seamless wrap require narrower slides.`
    );
  }

  const autoplay = plugins[0] ?? null;

  return { embla, autoplay, loopActive: embla.internalEngine().options.loop };
}
