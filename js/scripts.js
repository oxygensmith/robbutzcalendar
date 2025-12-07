// Main scripts.js - Coordinate both animation and component files
import {
  NavbarToggle,
  setupNavbarShrink,
  ScrollSpy,
  ContactFormValidator,
  SimpleSmoothScroll,
} from "./components";

// Simple form success animation function
function simpleFormSuccess(element) {
  // Reset any previous animations
  element.style.transition = "none";
  element.style.opacity = "0";
  element.style.transform = "translateY(20px) scale(0.95)";

  // Force reflow
  element.offsetHeight;

  // Apply transitions
  element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  element.style.opacity = "1";
  element.style.transform = "translateY(0) scale(1)";
}

// Main initialization function
function initializeApp() {
  // Initialize CSS-transition-powered components
  const smoothScroll = new SimpleSmoothScroll("#mainNav");
  const navbarShrink = setupNavbarShrink();

  // Initialize lightweight components
  const navToggle = new NavbarToggle(".navbar-toggler", "#navbarResponsive");
  const scrollSpy = new ScrollSpy("section[id]", "#mainNav", {
    rootMargin: "-40% 0px -40% 0px",
  });
  const formValidator = new ContactFormValidator("#contact");

  // Make animation functions available globally for form success
  window.animateFormSuccess = simpleFormSuccess; // Updated to CSS-based version

  // Store component instances globally for access from other functions
  window.appComponents = {
    smoothScroll,
    navToggle,
    scrollSpy,
    formValidator,
    navbarShrink,
  };

  console.log("App initialized with lightweight components");
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp);
