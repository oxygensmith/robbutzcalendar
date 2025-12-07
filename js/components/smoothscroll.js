export class SimpleSmoothScroll {
  constructor(navSelector) {
    this.navLinks = document.querySelectorAll(`${navSelector} a[href^="#"]`);
    this.bindEvents();
  }
  
  bindEvents() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
          // Account for fixed navbar
          const navbarHeight = 72; // Adjust based on your navbar height
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth' // CSS smooth scrolling
          });
        }
      });
    });
  }
}