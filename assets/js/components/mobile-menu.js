import { initFullscreenModal } from '../utils/modal-utils.js';

class MobileMenu {
  constructor() {
    this.menuButton = document.getElementById('mobile-menu-button');
    this.menuModal = document.getElementById('mobile-menu-modal');
    
    if (!this.menuButton || !this.menuModal) {
      console.warn('Mobile menu elements not found');
      return;
    }

    initFullscreenModal(this.menuModal, this.menuButton);
  }
}

export function initMobileMenu() {
  document.addEventListener('DOMContentLoaded', () => {
    new MobileMenu();
  });
}

if (document.readyState === 'loading') {
  initMobileMenu();
} else {
  new MobileMenu();
}