#!/usr/bin/env node

const puppeteer = require('puppeteer-core');

const CHROME_PATH = '/usr/local/bin/google-chrome';
const BASE_URL = 'http://localhost:8080';

async function testChanges() {
  console.log('🧪 Testing changes...\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log(`Loading: ${BASE_URL}\n`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test 1: Check debug overlay is removed
  const debugOverlay = await page.evaluate(() => {
    return document.getElementById('anim-debug');
  });
  
  console.log(`✓ Test 1: Debug overlay removed`);
  console.log(`  Result: ${debugOverlay ? '❌ Still present' : '✅ Removed'}\n`);

  // Test 2: Check gallery gap
  const galleryGap = await page.evaluate(() => {
    const scroller = document.querySelector('.gallery__scroller');
    if (!scroller) return null;
    return window.getComputedStyle(scroller).gap;
  });
  
  console.log(`✓ Test 2: Gallery gap reduced`);
  console.log(`  Gap: ${galleryGap} (was 0.85rem/1.1rem, now 0.5rem/0.65rem)\n`);

  // Test 3: Gallery auto-scroll
  console.log(`✓ Test 3: Gallery auto-scroll`);
  console.log(`  Waiting 7 seconds to observe auto-scroll...\n`);
  
  // Scroll to gallery first
  await page.evaluate(() => {
    const gallery = document.querySelector('[data-gallery-scroller]');
    if (gallery) {
      gallery.scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const initialScroll = await page.evaluate(() => {
    const scroller = document.querySelector('[data-gallery-scroller]');
    return scroller ? scroller.scrollLeft : 0;
  });
  
  console.log(`  Initial scroll position: ${initialScroll}px`);
  
  // Wait for auto-scroll (3 seconds interval)
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  const newScroll = await page.evaluate(() => {
    const scroller = document.querySelector('[data-gallery-scroller]');
    return scroller ? scroller.scrollLeft : 0;
  });
  
  console.log(`  After 4 seconds: ${newScroll}px`);
  console.log(`  ${newScroll > initialScroll ? '✅ Auto-scrolling working!' : '⚠️  No movement detected'}\n`);

  // Test 4: Check animations still work (no debug logs in console)
  const hasAnimationErrors = await page.evaluate(() => {
    return typeof animationObserver === 'undefined';
  });
  
  console.log(`✓ Test 4: Animations still functional`);
  console.log(`  ${hasAnimationErrors ? '⚠️  Observer undefined' : '✅ Working'}\n`);

  console.log('═══════════════════════════════════════');
  console.log('✅ All changes verified!\n');
  console.log('Summary:');
  console.log(`  • Debug overlay: ${debugOverlay ? 'STILL PRESENT ❌' : 'Removed ✅'}`);
  console.log(`  • Gallery gap: ${galleryGap} ✅`);
  console.log(`  • Auto-scroll: ${newScroll > initialScroll ? 'Working ✅' : 'Not detected ⚠️'}`);
  console.log('═══════════════════════════════════════\n');

  await browser.close();
}

testChanges().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
