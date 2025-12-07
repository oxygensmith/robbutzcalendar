// Form validation (keeping your existing logic)
export class ContactFormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (!this.form) return;
    
    this.submitButton = this.form.querySelector('#submitButton');
    this.successMessage = this.form.querySelector('#submitSuccessMessage');
    this.errorMessage = this.form.querySelector('#submitErrorMessage');
    this.touchedFields = new Set();
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.setInitialState();
  }
  
  bindEvents() {
    // Field blur events
    const formFields = this.form.querySelectorAll('input, textarea');
    formFields.forEach(field => {
      field.addEventListener('blur', () => {
        this.touchedFields.add(field.id || field.name);
        this.validateTouchedFields();
      });
    });
    
    // Checkbox change events
    const checkboxes = this.form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.touchedFields.add('checkboxes');
        this.validateTouchedFields();
      });
    });
    
    // Form submit
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }
  
  setInitialState() {
    this.submitButton.disabled = true;
    this.submitButton.classList.add('disabled');
  }
  
  // Validation methods
  validateCheckboxes() {
    const checkboxes = this.form.querySelectorAll('input[type="checkbox"]');
    return Array.from(checkboxes).some(checkbox => checkbox.checked);
  }
  
  validateName() {
    const name = this.form.querySelector('#yourName').value.trim();
    return name.length >= 2;
  }
  
  validateEmail() {
    const email = this.form.querySelector('#emailAddress').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  validatePhone() {
    const phone = this.form.querySelector('#phoneNumber').value.trim();
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }
  
  validateMessage() {
    const message = this.form.querySelector('#message').value.trim();
    return message.length >= 10;
  }
  
  showFieldError(fieldId, message) {
    const field = this.form.querySelector(fieldId);
    field.classList.add('is-invalid');
    
    const existingError = field.parentNode.querySelector('.custom-error');
    if (existingError) {
      existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback custom-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  }
  
  clearFieldError(fieldId) {
    const field = this.form.querySelector(fieldId);
    field.classList.remove('is-invalid');
    
    const errorMessage = field.parentNode.querySelector('.custom-error');
    if (errorMessage) {
      errorMessage.remove();
    }
  }
  
  clearAllErrors() {
    const fields = ['#yourName', '#emailAddress', '#phoneNumber', '#message'];
    fields.forEach(fieldId => this.clearFieldError(fieldId));
    
    const checkboxContainer = this.form.querySelector('.form-group');
    checkboxContainer.classList.remove('is-invalid');
    const checkboxError = checkboxContainer.querySelector('.custom-error');
    if (checkboxError) {
      checkboxError.remove();
    }
  }
  
  validateTouchedFields() {
    this.clearAllErrors();
    let isValid = true;
    
    if (this.touchedFields.has('checkboxes') && !this.validateCheckboxes()) {
      const checkboxContainer = this.form.querySelector('.form-group');
      checkboxContainer.classList.add('is-invalid');
      const errorDiv = document.createElement('div');
      errorDiv.className = 'invalid-feedback custom-error';
      errorDiv.textContent = 'Please select at least one service.';
      checkboxContainer.appendChild(errorDiv);
      isValid = false;
    }
    
    if (this.touchedFields.has('yourName') && !this.validateName()) {
      this.showFieldError('#yourName', 'Name must be at least 2 characters long.');
      isValid = false;
    }
    
    if (this.touchedFields.has('emailAddress') && !this.validateEmail()) {
      this.showFieldError('#emailAddress', 'Please enter a valid email address.');
      isValid = false;
    }
    
    if (this.touchedFields.has('phoneNumber') && !this.validatePhone()) {
      this.showFieldError('#phoneNumber', 'Please enter a valid phone number.');
      isValid = false;
    }
    
    if (this.touchedFields.has('message') && !this.validateMessage()) {
      this.showFieldError('#message', 'Message must be at least 10 characters long.');
      isValid = false;
    }
    
    // Enable/disable submit button
    const allValid = this.validateCheckboxes() && this.validateName() && 
                     this.validateEmail() && this.validatePhone() && this.validateMessage();
    this.submitButton.disabled = !allValid;
    this.submitButton.classList.toggle('disabled', !allValid);
    
    return isValid;
  }
  
  handleSubmit(e) {
    e.preventDefault();
    
    // Mark all fields as touched
    this.touchedFields.add('checkboxes');
    this.touchedFields.add('yourName');
    this.touchedFields.add('emailAddress');
    this.touchedFields.add('phoneNumber');
    this.touchedFields.add('message');
    
    if (!this.validateTouchedFields()) {
      return;
    }
    
    this.submitForm();
  }
  
  async submitForm() {
    this.successMessage.classList.add('d-none');
    this.errorMessage.classList.add('d-none');
    
    this.submitButton.disabled = true;
    this.submitButton.textContent = 'Sending...';
    
    try {
      const formData = new FormData(this.form);
      
      const response = await fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      });
      
      if (response.ok) {
        this.successMessage.classList.remove('d-none');
        this.form.reset();
        this.clearAllErrors();
        this.touchedFields.clear();
        this.setInitialState();
        
        // Trigger success animation if available
        if (window.animateFormSuccess) {
          window.animateFormSuccess(this.successMessage);
        }
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      this.errorMessage.classList.remove('d-none');
      console.error('Form submission error:', error);
    } finally {
      this.submitButton.disabled = false;
      this.submitButton.textContent = 'Send';
    }
  }
}