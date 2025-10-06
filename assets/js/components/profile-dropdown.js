// ============================================
// PROFILE DROPDOWN - Gestion du menu utilisateur
// ============================================

import { ModalManager } from '../utils/modal-utils.js';

class ProfileDropdown {
  constructor() {
    this.dropdown = document.getElementById('profileDropdown');
    this.loginButton = document.querySelector('a[href*="login"]');
    
    if (!this.dropdown || !this.loginButton) {
      console.warn('Profile dropdown elements not found');
      return;
    }

    this.init();
  }

  init() {
    // Initialiser avec ModalManager
    this.manager = new ModalManager(
      this.dropdown,
      this.loginButton,
      {
        closeOnEscape: true,
        closeOnOutsideClick: true,
        closeOnScroll: true,
        repositionOnResize: true
      }
    );

    // Gestion des liens dans le dropdown
    this.setupDropdownLinks();
  }

  setupDropdownLinks() {
    const links = this.dropdown.querySelectorAll('a');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        // Si c'est un lien de déconnexion, gérer ici
        if (link.href.includes('logout')) {
          e.preventDefault();
          this.handleLogout();
        }
        
        // Fermer le dropdown après le clic
        this.manager.close();
      });
    });
  }

  handleLogout() {
    // Logique de déconnexion
    console.log('Déconnexion...');
    
    // Exemple: Appeler une API
    // fetch('/api/logout', { method: 'POST' })
    //   .then(() => window.location.href = '/login')
    
    // Ou simplement rediriger
    // window.location.href = '/login';
  }
}

// ============================================
// INITIALISATION
// ============================================

export function initProfileDropdown() {
  document.addEventListener('DOMContentLoaded', () => {
    new ProfileDropdown();
  });
}

// Auto-initialisation
if (document.readyState === 'loading') {
  initProfileDropdown();
} else {
  new ProfileDropdown();
}