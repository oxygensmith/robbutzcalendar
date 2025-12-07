/**
 * Enhanced navbar shrink with CSS transitions
 * @returns {Function} The update function for manual triggering if needed
 */
export function setupNavbarShrink() {
  const navbarCollapsible = document.body.querySelector('#mainNav');
  if (!navbarCollapsible) return () => {};

  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateNavbar = () => {
    const currentScrollY = window.scrollY;
    const shouldShrink = currentScrollY > 0;
    const shouldShowName = currentScrollY < 800;
    
    // Use CSS transitions for navbar transformation
    if (shouldShrink && !navbarCollapsible.classList.contains('navbar-shrink')) {
      navbarCollapsible.classList.add('navbar-shrink');
    } else if (!shouldShrink && navbarCollapsible.classList.contains('navbar-shrink')) {
      navbarCollapsible.classList.remove('navbar-shrink');
    }
    
    // Handle name visibility
    if (shouldShowName !== navbarCollapsible.classList.contains('show-name')) {
      if (shouldShowName) {
        navbarCollapsible.classList.add('show-name');
      } else {
        navbarCollapsible.classList.remove('show-name');
      }
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  };

  // Initial call
  updateNavbar();
  
  // Scroll listener with throttling
  document.addEventListener('scroll', requestTick);
  
  return updateNavbar;
}