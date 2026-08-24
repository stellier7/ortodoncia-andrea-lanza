#!/usr/bin/env node

/**
 * Comprehensive Animation Test Script
 * Tests all scroll animations and verifies they fire correctly
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = '/usr/local/bin/google-chrome';
const BASE_URL = 'http://localhost:8080';

async function testAnimations() {
  console.log('🎬 Starting Animation Test Suite\n');
  console.log('═══════════════════════════════════════\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Collect console logs and errors
  const logs = [];
  const errors = [];
  
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[Animations]')) {
      logs.push(text);
    }
    if (msg.type() === 'error') {
      errors.push(text);
    }
  });
  
  page.on('pageerror', err => {
    errors.push(`Page Error: ${err.message}`);
  });

  console.log(`📄 Loading page: ${BASE_URL}\n`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });

  // Wait for JS to initialize
  await new Promise(resolve => setTimeout(resolve, 500));

  const results = [];

  // ============================================
  // TEST 1: Hero Load Animation
  // ============================================
  console.log('Test 1: Hero Load Animation');
  
  const heroLoaded = await page.evaluate(() => {
    return document.body.classList.contains('hero-loaded');
  });
  
  const heroOpacity = await page.evaluate(() => {
    const title = document.querySelector('.hero__title');
    return title ? parseFloat(window.getComputedStyle(title).opacity) : 0;
  });

  results.push({
    test: 'Hero Load Animation',
    checks: [
      { name: 'body.hero-loaded class added', pass: heroLoaded },
      { name: 'Hero content visible', pass: heroOpacity > 0.8 }
    ]
  });
  console.log(`  body.hero-loaded: ${heroLoaded ? '✓' : '✗'}`);
  console.log(`  Hero opacity: ${heroOpacity.toFixed(2)} ${heroOpacity > 0.8 ? '✓' : '✗'}\n`);

  // ============================================
  // TEST 2: Animation Attributes Setup
  // ============================================
  console.log('Test 2: Animation Attributes Setup');
  
  const animStats = await page.evaluate(() => {
    const all = document.querySelectorAll('[data-animate]');
    const trust = document.querySelectorAll('.trust__item[data-animate]');
    const services = document.querySelectorAll('.service-card[data-animate]');
    const dentists = document.querySelectorAll('.dentist-card[data-animate]');
    const gallery = document.querySelectorAll('.gallery__item[data-animate]');
    const testimonials = document.querySelectorAll('.testimonial-card[data-animate]');
    const headers = document.querySelectorAll('.section__header[data-animate]');
    
    return {
      total: all.length,
      trust: trust.length,
      services: services.length,
      dentists: dentists.length,
      gallery: gallery.length,
      testimonials: testimonials.length,
      headers: headers.length
    };
  });

  results.push({
    test: 'Animation Attributes Setup',
    checks: [
      { name: 'Total animated elements', pass: animStats.total > 0, detail: `${animStats.total} elements` },
      { name: 'Trust items', pass: animStats.trust > 0, detail: `${animStats.trust} items` },
      { name: 'Service cards', pass: animStats.services > 0, detail: `${animStats.services} cards` },
      { name: 'Gallery items', pass: animStats.gallery > 0, detail: `${animStats.gallery} items` }
    ]
  });
  
  console.log(`  Total: ${animStats.total} elements ✓`);
  console.log(`  Trust: ${animStats.trust} | Services: ${animStats.services} | Gallery: ${animStats.gallery}\n`);

  // ============================================
  // TEST 3: CSS Initial State
  // ============================================
  console.log('Test 3: CSS Initial State (Hidden)');
  
  const hiddenElements = await page.evaluate(() => {
    const elements = document.querySelectorAll('[data-animate]:not(.in-view):not(.animated)');
    let hiddenCount = 0;
    
    elements.forEach(el => {
      const opacity = parseFloat(window.getComputedStyle(el).opacity);
      if (opacity < 0.1) hiddenCount++;
    });
    
    return {
      total: elements.length,
      hidden: hiddenCount
    };
  });

  const hideRatio = hiddenElements.total > 0 ? hiddenElements.hidden / hiddenElements.total : 0;
  results.push({
    test: 'CSS Initial State',
    checks: [
      { name: 'Elements start hidden', pass: hideRatio > 0.8, detail: `${hiddenElements.hidden}/${hiddenElements.total} hidden` }
    ]
  });
  
  console.log(`  ${hiddenElements.hidden}/${hiddenElements.total} elements hidden ${hideRatio > 0.8 ? '✓' : '✗'}\n`);

  // ============================================
  // TEST 4: Debug Overlay
  // ============================================
  console.log('Test 4: Debug Overlay');
  
  const debugOverlay = await page.evaluate(() => {
    const overlay = document.getElementById('anim-debug');
    return !!overlay;
  });

  results.push({
    test: 'Debug Overlay',
    checks: [
      { name: 'Debug overlay visible', pass: debugOverlay }
    ]
  });
  
  console.log(`  #anim-debug present: ${debugOverlay ? '✓' : '✗'}\n`);

  // ============================================
  // TEST 5: Scroll Trigger - Trust Bar
  // ============================================
  console.log('Test 5: Scroll Trigger - Trust Bar');
  await page.evaluate(() => window.scrollTo(0, 400));
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const trustAnimated = await page.evaluate(() => {
    const items = document.querySelectorAll('.trust__item[data-animate]');
    let animated = 0;
    items.forEach(el => {
      if (el.classList.contains('in-view')) animated++;
    });
    return { total: items.length, animated };
  });

  results.push({
    test: 'Trust Bar Animation',
    checks: [
      { name: 'Trust items animated', pass: trustAnimated.animated > 0, detail: `${trustAnimated.animated}/${trustAnimated.total}` }
    ]
  });
  
  console.log(`  ${trustAnimated.animated}/${trustAnimated.total} items animated ${trustAnimated.animated > 0 ? '✓' : '✗'}\n`);

  // ============================================
  // TEST 6: Scroll Trigger - Services
  // ============================================
  console.log('Test 6: Scroll Trigger - Services');
  await page.evaluate(() => window.scrollTo(0, 900));
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const servicesAnimated = await page.evaluate(() => {
    const cards = document.querySelectorAll('.service-card[data-animate]');
    let animated = 0;
    cards.forEach(el => {
      if (el.classList.contains('in-view')) animated++;
    });
    return { total: cards.length, animated };
  });

  results.push({
    test: 'Services Animation',
    checks: [
      { name: 'Service cards animated', pass: servicesAnimated.animated > 0, detail: `${servicesAnimated.animated}/${servicesAnimated.total}` }
    ]
  });
  
  console.log(`  ${servicesAnimated.animated}/${servicesAnimated.total} cards animated ${servicesAnimated.animated > 0 ? '✓' : '✗'}\n`);

  // ============================================
  // TEST 7: Scroll Trigger - Gallery
  // ============================================
  console.log('Test 7: Scroll Trigger - Gallery');
  await page.evaluate(() => window.scrollTo(0, 2400));
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const galleryAnimated = await page.evaluate(() => {
    const items = document.querySelectorAll('.gallery__item[data-animate]');
    let animated = 0;
    items.forEach(el => {
      if (el.classList.contains('in-view')) animated++;
    });
    return { total: items.length, animated };
  });

  results.push({
    test: 'Gallery Animation',
    checks: [
      { name: 'Gallery items animated', pass: galleryAnimated.animated > 0, detail: `${galleryAnimated.animated}/${galleryAnimated.total}` }
    ]
  });
  
  console.log(`  ${galleryAnimated.animated}/${galleryAnimated.total} items animated ${galleryAnimated.animated > 0 ? '✓' : '✗'}\n`);

  // ============================================
  // TEST 8: Scroll Trigger - Testimonials
  // ============================================
  console.log('Test 8: Scroll Trigger - Testimonials');
  await page.evaluate(() => window.scrollTo(0, 3200));
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const testimonialsAnimated = await page.evaluate(() => {
    const cards = document.querySelectorAll('.testimonial-card[data-animate]');
    let animated = 0;
    cards.forEach(el => {
      if (el.classList.contains('in-view')) animated++;
    });
    return { total: cards.length, animated };
  });

  results.push({
    test: 'Testimonials Animation',
    checks: [
      { name: 'Testimonial cards animated', pass: testimonialsAnimated.animated > 0, detail: `${testimonialsAnimated.animated}/${testimonialsAnimated.total}` }
    ]
  });
  
  console.log(`  ${testimonialsAnimated.animated}/${testimonialsAnimated.total} cards animated ${testimonialsAnimated.animated > 0 ? '✓' : '✗'}\n`);

  // ============================================
  // TEST 9: Mobile Viewport
  // ============================================
  console.log('Test 9: Mobile Viewport Test');
  await page.setViewport({ width: 375, height: 667 });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(resolve => setTimeout(resolve, 500));
  
  await page.evaluate(() => window.scrollTo(0, 600));
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const mobileAnimated = await page.evaluate(() => {
    const animated = document.querySelectorAll('[data-animate].in-view');
    return animated.length;
  });

  results.push({
    test: 'Mobile Viewport',
    checks: [
      { name: 'Animations work on mobile', pass: mobileAnimated > 0, detail: `${mobileAnimated} elements animated` }
    ]
  });
  
  console.log(`  ${mobileAnimated} elements animated on mobile ${mobileAnimated > 0 ? '✓' : '✗'}\n`);

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n═══════════════════════════════════════');
  console.log('📊 TEST SUMMARY\n');

  let totalTests = 0;
  let passedTests = 0;

  results.forEach(result => {
    console.log(`${result.test}:`);
    result.checks.forEach(check => {
      totalTests++;
      if (check.pass) passedTests++;
      const icon = check.pass ? '✓' : '✗';
      const detail = check.detail ? ` (${check.detail})` : '';
      console.log(`  ${icon} ${check.name}${detail}`);
    });
    console.log('');
  });

  console.log('═══════════════════════════════════════');
  console.log(`Result: ${passedTests}/${totalTests} tests passed`);
  console.log('═══════════════════════════════════════\n');

  // Save animation logs
  if (logs.length > 0) {
    console.log('💬 Animation Console Logs:');
    logs.slice(0, 20).forEach(log => console.log(`  ${log}`));
    if (logs.length > 20) {
      console.log(`  ... and ${logs.length - 20} more\n`);
    }
  }
  
  // Report errors
  if (errors.length > 0) {
    console.log('\n❌ JavaScript Errors Found:');
    errors.forEach(err => console.log(`  ${err}`));
    console.log('');
  }

  await browser.close();

  return passedTests === totalTests;
}

// Run tests
testAnimations()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('❌ Test error:', err);
    process.exit(1);
  });
