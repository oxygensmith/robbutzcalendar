// Intersection Observer ScrollSpy
export class ScrollSpy {
  constructor(targetSelector, navSelector, options = {}) {
    this.sections = document.querySelectorAll(targetSelector);
    this.navLinks = document.querySelectorAll(`${navSelector} .nav-link`);
    this.currentActive = null;
    
    this.options = {
      rootMargin: options.rootMargin || '-40% 0px -40% 0px',
      threshold: 0,
      ...options
    };
    
    this.init();
  }
  
  init() {
    if (!this.sections.length || !this.navLinks.length) return;
    
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      this.options
    );
    
    this.sections.forEach(section => {
      this.observer.observe(section);
    });
    
    // Set initial active state
    this.setInitialActive();
  }
  
  setInitialActive() {
    // Find which section is currently in view
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    for (let i = this.sections.length - 1; i >= 0; i--) {
      const section = this.sections[i];
      if (section.offsetTop <= scrollPosition) {
        this.setActiveLink(section.id);
        break;
      }
    }
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.setActiveLink(entry.target.id);
      }
    });
  }
  
  setActiveLink(sectionId) {
    // Remove current active
    if (this.currentActive) {
      this.currentActive.classList.remove('active');
    }
    
    // Find and set new active
    const activeLink = Array.from(this.navLinks).find(link => 
      link.getAttribute('href') === `#${sectionId}`
    );
    
    if (activeLink) {
      activeLink.classList.add('active');
      this.currentActive = activeLink;
    }
  }
  
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}