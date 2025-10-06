// ============================================
// MAIN.JS - Point d'entrée principal
// ============================================

// Import du CartManager
import { initCartManager } from './cart.js';

import { initCartModal } from './components/cart-modal.js';
import { initProfileDropdown } from './components/profile-dropdown.js';
import { initMobileMenu } from './components/mobile-menu.js';
import { initCategoriesModal } from './components/categories-modal.js';
import { initCarouselNavigation } from './components/carousel-navigation.js';
import { initScrollContainers } from './features/scroll-container.js';

// ============================================
// HEADER - Gestion du shadow au scroll
// ============================================

class HeaderManager {
  constructor() {
    this.header = document.getElementById('site-header');
    this.scrollThreshold = 20;
    
    if (!this.header) {
      console.warn('Header element not found');
      return;
    }

    this.init();
  }

  init() {
    // État initial
    this.updateHeaderShadow();

    // Écouter le scroll avec throttle pour les performances
    window.addEventListener('scroll', this.throttle(this.updateHeaderShadow.bind(this), 100), { 
      passive: true 
    });
  }

  updateHeaderShadow() {
    if (window.scrollY > this.scrollThreshold) {
      this.header.classList.add('shadow-md');
    } else {
      this.header.classList.remove('shadow-md');
    }
  }

  // Throttle function pour limiter les appels
  throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = new Date().getTime();
      if (now - lastCall < delay) return;
      lastCall = now;
      return func(...args);
    };
  }
}

// ============================================
// INITIALISATION GLOBALE
// ============================================

class App {
  constructor() {
    this.version = '1.0.0';
    this.init();
  }

  init() {
    console.log(`🚀 Application initialisée (v${this.version})`);

    // IMPORTANT: Initialiser le CartManager EN PREMIER
    initCartManager();

    // Initialiser tous les composants
    this.initComponents();

    // Initialiser le header
    new HeaderManager();

    // Setup global utilities
    this.setupGlobalUtilities();

    // Log de confirmation
    this.logInitStatus();
  }

  initComponents() {
    // Les composants s'auto-initialisent via leurs fichiers
    // Cette section est pour la clarté et le contrôle centralisé
    
    // Note: Si besoin de forcer l'initialisation:
    // initCartModal();
    // initProfileDropdown();
    // initMobileMenu();
    // initCategoriesModal();
    // initCarouselNavigation();
    // initScrollContainers();
  }

  setupGlobalUtilities() {
    // Désactiver le comportement par défaut des liens # (pour les modals)
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a[href="#"]');
      if (target) {
        e.preventDefault();
      }
    });

    // Smooth scroll pour les ancres internes
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Détection du mode sombre (si implémenté)
    this.setupDarkModeDetection();

    // Lazy loading des images (si non natif)
    this.setupLazyLoading();
  }

  setupDarkModeDetection() {
    // Détecter la préférence système
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Écouter les changements
    prefersDark.addEventListener('change', (e) => {
      console.log('Mode sombre:', e.matches ? 'activé' : 'désactivé');
      // Ici vous pouvez ajouter la logique de changement de thème
    });
  }

  setupLazyLoading() {
    // Support natif du lazy loading
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        img.src = img.dataset.src;
      });
    } else {
      // Fallback avec Intersection Observer
      const images = document.querySelectorAll('img[data-src]');
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  logInitStatus() {
    const components = [
      'Cart Manager',
      'Cart Modal',
      'Profile Dropdown',
      'Mobile Menu',
      'Categories Modal',
      'Carousel Navigation',
      'Scroll Containers',
      'Header Manager'
    ];

    console.log('📦 Composants chargés:');
    components.forEach(component => {
      console.log(`  ✅ ${component}`);
    });
  }
}

// ============================================
// ERROR HANDLING GLOBAL
// ============================================

window.addEventListener('error', (event) => {
  console.error('❌ Erreur globale:', event.error);
  // Ici vous pouvez logger vers un service d'analytics
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Promise non gérée:', event.reason);
});

// ============================================
// PERFORMANCE MONITORING (optionnel)
// ============================================

if (window.performance && window.performance.timing) {
  window.addEventListener('load', () => {
    const timing = window.performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`⚡ Page chargée en ${loadTime}ms`);
  });
}

// ============================================
// LANCEMENT DE L'APPLICATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});

// Export pour usage externe si nécessaire
export default App;