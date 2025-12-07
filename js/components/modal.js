/**
 * SimpleModal - A lightweight modal implementation using CSS transitions
 */
export class SimpleModal {
  /**
   * Create a modal instance
   * @param {string} modalId - The ID selector of the modal element
   */
  constructor(modalId) {
    // Main elements
    this.modal = document.querySelector(modalId);
    this.modalDialog = this.modal.querySelector('.modal-dialog');
    this.backdrop = null;
    this.isOpen = false;
    
    // Create backdrop element
    this.createBackdrop();
    
    // Bind event listeners
    this.bindEvents();
  }
  
  /**
   * Create the modal backdrop element
   */
  createBackdrop() {
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'modal-backdrop';
    this.backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1040;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(this.backdrop);
  }
  
  /**
   * Set up event listeners for the modal
   */
  bindEvents() {
    // Close button click handlers
    const closeButtons = this.modal.querySelectorAll('[data-bs-dismiss="modal"]');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => this.hide());
    });
    
    // Backdrop click handler
    this.backdrop.addEventListener('click', () => this.hide());
    
    // Escape key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.hide();
      }
    });
  }
  
  /**
   * Show the modal
   */
  show() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    
    // Ensure backdrop is in the DOM
    if (!document.body.contains(this.backdrop)) {
      document.body.appendChild(this.backdrop);
    }
    
    // Prevent page scrolling
    document.body.style.overflow = 'hidden';
    
    // Set up the modal
    this.modal.style.display = 'block';
    this.modal.style.position = 'fixed';
    this.modal.style.top = '0';
    this.modal.style.left = '0';
    this.modal.style.width = '100%';
    this.modal.style.height = '100%';
    this.modal.style.overflow = 'auto';
    this.modal.style.zIndex = '1050';
    
    // Trigger animations after a small delay to ensure elements are ready
    setTimeout(() => {
      // Show backdrop with fade
      this.backdrop.style.visibility = 'visible';
      this.backdrop.style.opacity = '1';
      
      // Show and animate the modal
      this.modal.classList.add('show');
      
      // Use a callback to apply transition to modal dialog after display is set
      this.animateIn();
    }, 10); // Short delay to ensure CSS transitions work
  }
  
  /**
   * Hide the modal
   */
  hide() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    
    // Animate out
    this.backdrop.style.opacity = '0';
    this.modal.classList.remove('show');
    
    // Use a callback for dialog animation
    this.animateOut();
    
    // Wait for animations to finish before cleanup
    setTimeout(() => {
      // Reset modal and backdrop styles
      this.modal.style.display = 'none';
      this.backdrop.style.visibility = 'hidden';
      
      // Restore page scrolling
      document.body.style.overflow = '';
    }, 300); // Match this to your transition duration
  }
  
  /**
   * Animate the modal in
   */
  animateIn() {
    // Reset the dialog style for entrance animation
    this.modalDialog.style.opacity = '0';
    this.modalDialog.style.transform = 'scale(0.8) translateY(-40px)';
    
    // Trigger transition after a tiny delay
    setTimeout(() => {
      this.modalDialog.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      this.modalDialog.style.opacity = '1';
      this.modalDialog.style.transform = 'scale(1) translateY(0)';
    }, 10);
  }
  
  /**
   * Animate the modal out
   */
  animateOut() {
    // Set transition for exit animation
    this.modalDialog.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    this.modalDialog.style.opacity = '0';
    this.modalDialog.style.transform = 'scale(0.9) translateY(-20px)';
  }
}