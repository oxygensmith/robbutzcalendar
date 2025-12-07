// Lightweight navbar toggle
export class NavbarToggle {
  constructor(toggleSelector, targetSelector) {
    this.toggle = document.querySelector(toggleSelector);
    this.target = document.querySelector(targetSelector);
    this.isOpen = false;
    this.breakpoint = 992; // Define the breakpoint explicitly
    this.isMobile = window.innerWidth < 992 // TODO: see if we can make this not hardcoded
    
    if (!this.toggle || !this.target) return;
    
    this.bindEvents();
    this.initStyles();
  }
  
  initStyles() {
    // Set transition properties
    this.target.style.overflow = "hidden";
    this.target.style.transition = "height 0.35s ease";
    
    // Initial state based on viewport
    if (this.isMobile) {
      this.target.style.height = "0";
      this.isOpen = false;
    } else {
      this.target.style.height = "auto";
    }
  }

  // Add this to your NavbarToggle class
resetToDesktopState() {
  // Clear all inline styles
  this.target.removeAttribute('style');
  
  // Then set only what's needed
  this.target.style.display = "flex";
  
  // Remove all mobile-specific classes
  this.target.classList.remove('show');
  
  // Reset nav items
  const navItems = this.target.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.removeAttribute('style');
  });
  
  this.isOpen = false;
}
  
  bindEvents() {
    this.toggle.addEventListener('click', () => this.toggleMenu());
    
    // Close menu when clicking nav links (mobile)
    const navLinks = this.target.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isOpen && this.isMobile) {
          this.closeMenu();
        }
      });
    });

    
    
    window.addEventListener('resize', () => {
  const wasMobile = this.isMobile;
  this.isMobile = window.innerWidth < 992;
  
  // Desktop to mobile transition
  if (wasMobile && !this.isMobile) {
    // We just switched to desktop
    this.resetToDesktopState();
  } else if (!wasMobile && this.isMobile) {
    // We just switched to mobile
    this.closeMenu();
  }
  
});

    window.addEventListener('load', () => {
      this.isMobile = window.innerWidth < this.breakpoint;
      
      if (this.isMobile) {
        this.closeMenu();
      } else {
        this.target.style.height = 'auto';
      }
    });
  }
  
  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }
  
  openMenu() {
    if (!this.isMobile) return; // Don't toggle on desktop
    
    this.isOpen = true;
    
    // Use CSS transition instead of GSAP
    toggleNavbarMenu(this.target, true);
    
    // GSAP - Get the natural height
    /* this.target.style.height = 'auto';
    const height = this.target.offsetHeight;
    this.target.style.height = '0'; */
    
    // GSAP - Trigger transition
    /* requestAnimationFrame(() => {
      this.target.style.height = height + 'px';
    }); */
    
    this.toggle.setAttribute('aria-expanded', 'true');
  }
  
  closeMenu() {
    if (!this.isMobile) return; // Don't toggle on desktop
    
    this.isOpen = false;
    this.target.style.height = '0';
    this.toggle.setAttribute('aria-expanded', 'false');
  }
}

// Replace animateNavbarMenu with this
function toggleNavbarMenu(target, isOpening) {
  if (isOpening) {
    // Get natural height
    target.style.height = 'auto';
    const height = target.offsetHeight;
    
    // Set to 0 and force reflow
    target.style.height = '0px';
    target.offsetHeight; // Force reflow
    
    // Animate to natural height
    target.style.height = height + 'px';
    target.classList.add('show');
  } else {
    // Get current height
    const height = target.offsetHeight;
    
    // Set explicit height and force reflow
    target.style.height = height + 'px';
    target.offsetHeight; // Force reflow
    
    // Animate to 0
    target.style.height = '0px';
    target.classList.remove('show');
  }
}