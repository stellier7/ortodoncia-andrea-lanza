#!/usr/bin/env node

const puppeteer = require('puppeteer-core');

const CHROME_PATH = '/usr/local/bin/google-chrome';
const BASE_URL = 'http://localhost:8080';

async function diagnose() {
  console.log('🔍 Diagnosing page load...\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Capture ALL console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    const icon = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : '💬';
    console.log(`${icon} [${type}] ${text}`);
  });

  // Capture page errors
  page.on('pageerror', err => {
    console.log(`❌ [page-error] ${err.message}`);
    console.log(err.stack);
  });

  console.log(`Loading: ${BASE_URL}\n`);
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  } catch (err) {
    console.error('Failed to load page:', err.message);
    await browser.close();
    process.exit(1);
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('\n✓ Page loaded, check console output above for errors\n');

  await browser.close();
}

diagnose().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
