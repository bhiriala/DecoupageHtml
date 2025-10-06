// ============================================
// CATEGORIES MODAL - Modal des catégories
// ============================================

class CategoriesModal {
  constructor() {
    this.modal = document.getElementById('categoriesModal');
    this.openBtn = document.getElementById('openCategoriesModal');
    this.closeBtn = document.getElementById('closeCategoriesModal');
    
    if (!this.modal || !this.openBtn || !this.closeBtn) {
      console.warn('Categories modal elements not found');
      return;
    }

    this.init();
  }

  init() {
    // Ouvrir le modal
    this.openBtn.addEventListener('click', () => {
      this.open();
    });

    // Fermer avec le bouton X
    this.closeBtn.addEventListener('click', () => {
      this.close();
    });

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    // Fermer en cliquant sur l'overlay (optionnel)
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Gérer les filtres de catégories
    this.setupCategoryFilters();
  }

  open() {
    this.modal.classList.remove('hidden');
    this.modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    
    // Animation d'entrée (optionnel)
    requestAnimationFrame(() => {
      this.modal.style.opacity = '1';
    });
  }

  close() {
    this.modal.classList.add('hidden');
    this.modal.classList.remove('flex');
    document.body.style.overflow = '';
    this.modal.style.opacity = '';
  }

  isOpen() {
    return !this.modal.classList.contains('hidden');
  }

  setupCategoryFilters() {
    const filterTabs = this.modal.querySelectorAll('.filter-tab');
    
    if (filterTabs.length === 0) return;

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Retirer l'état actif de tous les tabs
        filterTabs.forEach(t => {
          t.classList.remove('active', 'border-2', 'border-[#B6349A]');
          t.classList.add('border', 'border-gray-200');
        });
        
        // Activer le tab cliqué
        tab.classList.add('active', 'border-2', 'border-[#B6349A]');
        tab.classList.remove('border', 'border-gray-200');
        
        // Récupérer la catégorie sélectionnée
        const category = tab.getAttribute('data-category');
        
        // Filtrer les produits
        this.filterProducts(category);
      });
    });
  }

  filterProducts(category) {
    console.log('Filtrer par catégorie:', category);
    
    // Exemple d'implémentation du filtrage
    const products = document.querySelectorAll('[data-product-category]');
    
    products.forEach(product => {
      const productCategory = product.getAttribute('data-product-category');
      
      if (category === 'all' || productCategory === category) {
        product.style.display = '';
        // Animation fade-in
        product.style.animation = 'fadeIn 0.3s ease-in';
      } else {
        product.style.display = 'none';
      }
    });

    // Dispatcher un event custom pour d'autres composants
    window.dispatchEvent(new CustomEvent('categoryFiltered', {
      detail: { category }
    }));
  }
}

// ============================================
// HELPER: Fonction pour ouvrir programmatiquement
// ============================================

export function openCategoriesModal() {
  const modal = document.getElementById('categoriesModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

export function closeCategoriesModal() {
  const modal = document.getElementById('categoriesModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

// ============================================
// INITIALISATION
// ============================================

export function initCategoriesModal() {
  document.addEventListener('DOMContentLoaded', () => {
    new CategoriesModal();
  });
}

// Auto-initialisation
if (document.readyState === 'loading') {
  initCategoriesModal();
} else {
  new CategoriesModal();
}