import { ModalManager } from '../utils/modal-utils.js';

class ProfileDropdown {
  constructor() {
    this.dropdown = document.getElementById('profileDropdown');
    this.loginButton = document.querySelector('a[href*="login"]');
    
    if (!this.dropdown || !this.loginButton) {
      return;
    }
    this.init();
  }

  init() {
    this.manager = new ModalManager(
      this.dropdown,
      this.loginButton,
      {
        closeOnScroll: true,
        repositionOnResize: true
      }
    );
  }
}


export function initProfileDropdown() {
  document.addEventListener('DOMContentLoaded', () => {
    new ProfileDropdown();
  });
}

if (document.readyState === 'loading') {
  initProfileDropdown();
} else {
  new ProfileDropdown();
}