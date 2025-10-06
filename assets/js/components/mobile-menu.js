// ============================================
// MOBILE MENU - Gestion du menu mobile
// ============================================

import { initFullscreenModal } from '../utils/modal-utils.js';

class MobileMenu {
  constructor() {
    this.menuButton = document.getElementById('mobile-menu-button');
    this.menuModal = document.getElementById('mobile-menu-modal');
    
    if (!this.menuButton || !this.menuModal) {
      console.warn('Mobile menu elements not found');
      return;
    }

    this.init();
  }

  init() {
    // Initialiser le modal fullscreen
    initFullscreenModal(this.menuModal, this.menuButton, {
      closeOnEscape: true
    });

    // Gérer le badge du panier
    this.updateCartBadge();
    
    // Écouter les changements du panier
    window.addEventListener('cartUpdated', () => {
      this.updateCartBadge();
    });

    // Gérer les sous-menus si nécessaire
    this.setupSubmenuToggles();
  }

  updateCartBadge() {
    const badges = document.querySelectorAll('[data-cart-count]');
    const count = window.cartManager ? window.cartManager.getTotalItems() : 0;
    
    badges.forEach(badge => {
      if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'inline-flex';
      } else {
        badge.style.display = 'none';
      }
    });
  }

  setupSubmenuToggles() {
    // Si vous avez des sous-menus accordéon dans le menu mobile
    const submenuToggles = this.menuModal.querySelectorAll('[data-submenu-toggle]');
    
    submenuToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const submenuId = toggle.getAttribute('data-submenu-toggle');
        const submenu = document.getElementById(submenuId);
        
        if (submenu) {
          submenu.classList.toggle('hidden');
          toggle.classList.toggle('active');
          
          // Rotation de l'icône chevron
          const icon = toggle.querySelector('svg');
          if (icon) {
            icon.classList.toggle('rotate-180');
          }
        }
      });
    });
  }
}

// ============================================
// HELPER: Fonction publique pour mettre à jour le badge
// ============================================

export function updateCartCount(count) {
  const badges = document.querySelectorAll('[data-cart-count]');
  
  badges.forEach(badge => {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  });
}

// ============================================
// INITIALISATION
// ============================================

export function initMobileMenu() {
  document.addEventListener('DOMContentLoaded', () => {
    new MobileMenu();
  });
}

// Auto-initialisation
if (document.readyState === 'loading') {
  initMobileMenu();
} else {
  new MobileMenu();
}