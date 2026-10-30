/**
 * Verifies the floating WhatsApp button sits in the bottom-right corner,
 * pulses, and opens the practice chat link in the active language.
 * Run: node tests/whatsapp-float.test.js
 */
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const http = require("http");

const PORT = 8767;
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

function startServer() {
  const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], {
    cwd: require("path").join(__dirname, ".."),
    stdio: "ignore",
  });
  return server;
}

async function buttonMetrics(page) {
  return page.locator("[data-whatsapp-float]").evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const before = getComputedStyle(el, "::before");
    return {
      hidden: el.hidden,
      href: el.href,
      label: el.getAttribute("aria-label"),
      position: style.position,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      animationName: before.animationName,
      animationDuration: before.animationDuration,
    };
  });
}

async function run() {
  const server = startServer();
  try {
    await waitForServer(`${BASE}/`);
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.addInitScript(() => localStorage.setItem("dental-site-lang", "es"));
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

    const button = page.locator("[data-whatsapp-float]");
    await button.waitFor({ state: "visible" });

    const spanish = await buttonMetrics(page);
    if (spanish.hidden) throw new Error("WhatsApp button stayed hidden");
    if (spanish.position !== "fixed") throw new Error(`Expected fixed positioning, got ${spanish.position}`);
    if (spanish.viewportWidth - spanish.right > 40) {
      throw new Error(`Button is not in the right corner (right edge ${spanish.right}, viewport ${spanish.viewportWidth})`);
    }
    if (spanish.viewportHeight - spanish.bottom > 40) {
      throw new Error(`Button is not in the bottom corner (bottom edge ${spanish.bottom}, viewport ${spanish.viewportHeight})`);
    }
    if (spanish.width < 44 || spanish.height < 44) {
      throw new Error(`Touch target too small: ${spanish.width}x${spanish.height}`);
    }
    if (!spanish.href.includes("wa.me/50495660020")) {
      throw new Error(`Unexpected WhatsApp href: ${spanish.href}`);
    }
    if (!decodeURIComponent(spanish.href).includes("Hola, me gustaría agendar una cita")) {
      throw new Error(`Spanish greeting missing from ${spanish.href}`);
    }
    if (spanish.label !== "Escríbenos por WhatsApp") {
      throw new Error(`Unexpected Spanish label: ${spanish.label}`);
    }
    if (spanish.animationName !== "whatsapp-pulse") {
      throw new Error(`Pulse animation missing, got ${spanish.animationName}`);
    }
    if (spanish.animationDuration === "0s") {
      throw new Error("Pulse animation duration is 0s");
    }

    const scaleAtStart = await button.evaluate((el) => getComputedStyle(el, "::before").transform);
    await page.waitForTimeout(400);
    const scaleLater = await button.evaluate((el) => getComputedStyle(el, "::before").transform);
    if (scaleAtStart === scaleLater) {
      throw new Error(`Pulse ring did not change scale (${scaleAtStart})`);
    }

    // The language control is present in the header markup. Invoke it directly
    // so this check does not depend on whether the toggle is shown at this width.
    await page.locator('[data-lang="en"]').evaluate((el) => el.click());
    const english = await buttonMetrics(page);
    if (english.label !== "Chat on WhatsApp") {
      throw new Error(`Unexpected English label: ${english.label}`);
    }
    if (!decodeURIComponent(english.href).includes("Hello, I would like to book an appointment")) {
      throw new Error(`English greeting missing from ${english.href}`);
    }

    const popupPromise = page.waitForEvent("popup");
    await button.click();
    const popup = await popupPromise;
    const opened = popup.url();
    await popup.close();
    if (!opened.includes("50495660020")) {
      throw new Error(`Click did not open WhatsApp: ${opened}`);
    }

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobile.addInitScript(() => localStorage.setItem("dental-site-lang", "es"));
    await mobile.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    const mobileMetrics = await buttonMetrics(mobile);
    if (mobileMetrics.viewportWidth - mobileMetrics.right > 36) {
      throw new Error("Button is not in the right corner on mobile");
    }
    if (mobileMetrics.viewportHeight - mobileMetrics.bottom > 36) {
      throw new Error("Button is not in the bottom corner on mobile");
    }

    await browser.close();
    console.log("PASS: WhatsApp float is bottom-right, pulsing, and links to the practice chat.");
  } finally {
    server.kill("SIGTERM");
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
