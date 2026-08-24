/**
 * Live animation test - Run this in the browser console
 * Or use Node + jsdom/puppeteer
 */

console.log('🎬 Animation Test Starting...');
console.log('═══════════════════════════════════════\n');

// Wait for page to load
setTimeout(() => {
  const tests = [];
  
  // Test 1: Check if hero loaded
  const heroLoaded = document.body.classList.contains('hero-loaded');
  tests.push({
    name: 'Hero entrance triggered',
    pass: heroLoaded,
    detail: heroLoaded ? '✓ body.hero-loaded class applied' : '✗ body.hero-loaded missing'
  });
  
  // Test 2: Check hero content animation
  const heroTitle = document.querySelector('.hero__title');
  if (heroTitle) {
    const titleOpacity = window.getComputedStyle(heroTitle).opacity;
    tests.push({
      name: 'Hero title visible',
      pass: parseFloat(titleOpacity) > 0.5,
      detail: `opacity = ${titleOpacity}`
    });
  }
  
  // Test 3: Check for data-animate attributes
  const animatedElements = document.querySelectorAll('[data-animate]');
  tests.push({
    name: 'Elements have data-animate',
    pass: animatedElements.length > 0,
    detail: `Found ${animatedElements.length} elements`
  });
  
  // Test 4: Check CSS initial state
  const firstAnimEl = document.querySelector('[data-animate]:not(.in-view):not(.animated)');
  if (firstAnimEl) {
    const opacity = window.getComputedStyle(firstAnimEl).opacity;
    tests.push({
      name: 'CSS initial state (hidden)',
      pass: parseFloat(opacity) < 0.5,
      detail: `opacity = ${opacity} (should be 0)`
    });
  }
  
  // Test 5: Check debug overlay
  const debugOverlay = document.getElementById('anim-debug');
  tests.push({
    name: 'Debug overlay present',
    pass: !!debugOverlay,
    detail: debugOverlay ? '✓ #anim-debug exists' : '✗ Debug overlay not found'
  });
  
  // Test 6: Scroll test
  window.scrollTo(0, 800);
  setTimeout(() => {
    const inViewElements = document.querySelectorAll('[data-animate].in-view');
    tests.push({
      name: 'Scroll triggers animations',
      pass: inViewElements.length > 0,
      detail: `${inViewElements.length} elements animated after scroll`
    });
    
    // Print results
    console.log('\n📊 Test Results:\n');
    tests.forEach(test => {
      const icon = test.pass ? '✓' : '✗';
      const color = test.pass ? 'color: #4ade80' : 'color: #f87171';
      console.log(`%c${icon} ${test.name}`, color);
      console.log(`  ${test.detail}\n`);
    });
    
    const passCount = tests.filter(t => t.pass).length;
    const totalCount = tests.length;
    console.log(`\n═══════════════════════════════════════`);
    console.log(`%cResult: ${passCount}/${totalCount} tests passed`, 
      passCount === totalCount ? 'color: #4ade80; font-weight: bold' : 'color: #fbbf24; font-weight: bold');
    console.log('═══════════════════════════════════════\n');
    
    // Scroll back to top
    window.scrollTo(0, 0);
  }, 1500);
}, 500);
