// ============================================
// CART MODAL - Gestion du panier
// ============================================

import { initMultiTriggerModal } from '../utils/modal-utils.js';

class CartModal {
  constructor() {
    this.modal = document.getElementById('cartModal');
    this.closeBtn = document.getElementById('closeCartModal');
    this.emptyState = document.getElementById('emptyCartState');
    this.itemsList = document.getElementById('cartItemsList');
    this.footer = document.getElementById('cartFooter');
    this.cartButtons = document.querySelectorAll('a[href*="cart"]');
    
    if (!this.modal) {
      console.warn('Cart modal element not found');
      return;
    }

    this.init();
  }

  init() {
    // Initialiser le modal avec multi-triggers (desktop + mobile)
    initMultiTriggerModal(
      this.modal,
      'a[href*="cart"]',
      {
        closeOnEscape: true,
        closeOnOutsideClick: true,
        closeOnScroll: true,
        repositionOnResize: true,
        onOpen: () => this.render()
      }
    );

    // Bouton de fermeture manuel
    this.closeBtn?.addEventListener('click', () => {
      this.modal.classList.add('hidden');
    });

    // Écouter les mises à jour du panier
    window.addEventListener('cartUpdated', () => {
      if (!this.modal.classList.contains('hidden')) {
        this.render();
      }
    });

    // Exposer les fonctions globalement pour les boutons inline
    window.updateCartQuantity = this.updateQuantity.bind(this);
    window.removeFromCart = this.removeItem.bind(this);
  }

  render() {
    const cart = this.getCart();
    const totalItems = this.getTotalItems();
    const totalPrice = this.getTotalPrice();

    if (cart.length === 0) {
      this.showEmptyState();
    } else {
      this.showCartItems(cart, totalPrice);
    }
  }

  showEmptyState() {
    this.emptyState?.classList.remove('hidden');
    this.itemsList?.classList.add('hidden');
    this.footer?.classList.add('hidden');
  }

  showCartItems(cart, totalPrice) {
    this.emptyState?.classList.add('hidden');
    this.itemsList?.classList.remove('hidden');
    this.footer?.classList.remove('hidden');

    if (this.itemsList) {
      this.itemsList.innerHTML = cart.map(item => this.renderCartItem(item)).join('');
    }

    // Mettre à jour les totaux
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    
    if (subtotalEl) subtotalEl.textContent = `$${totalPrice}`;
    if (totalEl) totalEl.textContent = `$${totalPrice}`;
  }

  renderCartItem(item) {
    return `
      <div class="flex gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
        <img 
          src="${item.imgSrc}" 
          alt="${item.title}" 
          class="w-16 h-16 md:w-18 md:h-18 object-cover rounded-xl flex-shrink-0" 
        />
        
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between mb-1.5">
            <h4 class="font-montserrat font-semibold text-sm text-[#0D0C0D] pr-2 line-clamp-2">
              ${item.title}
            </h4>
            <button 
              onclick="removeFromCart('${item.id}')"
              class="flex-shrink-0 p-1 rounded-full hover:bg-red-50 focus:outline-none transition-colors"
              aria-label="Supprimer ${item.title}"
            >
              <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
          
          <p class="font-inter text-xs text-gray-500 mb-2">
            ${item.priceUnit || item.price}
          </p>
          
          <div class="flex items-center justify-between">
            ${this.renderQuantityControls(item)}
            
            <span class="font-montserrat font-bold text-sm text-[#B6349A]">
              ${item.price}
            </span>
          </div>
        </div>
      </div>
    `;
  }

  renderQuantityControls(item) {
    return `
      <div class="flex items-center gap-1.5 bg-white rounded-full px-1 py-1 border border-gray-200">
        <button 
          onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})"
          class="w-6 h-6 rounded-full hover:bg-gray-50 flex items-center justify-center focus:outline-none transition-colors"
          aria-label="Diminuer la quantité"
          ${item.quantity <= 1 ? 'disabled' : ''}
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
          </svg>
        </button>
        
        <span class="font-montserrat font-semibold text-sm w-6 text-center">
          ${item.quantity}
        </span>
        
        <button 
          onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})"
          class="w-6 h-6 rounded-full hover:bg-gray-50 flex items-center justify-center focus:outline-none transition-colors"
          aria-label="Augmenter la quantité"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
        </button>
      </div>
    `;
  }

  // ============================================
  // ACTIONS DU PANIER
  // ============================================

  updateQuantity(productId, newQuantity) {
    if (window.cartManager) {
      window.cartManager.updateQuantity(productId, newQuantity);
    }
  }

  removeItem(productId) {
    if (window.cartManager) {
      window.cartManager.removeFromCart(productId);
    }
  }

  // ============================================
  // GETTERS (délégation au cartManager)
  // ============================================

  getCart() {
    return window.cartManager ? window.cartManager.getCart() : [];
  }

  getTotalItems() {
    return window.cartManager ? window.cartManager.getTotalItems() : 0;
  }

  getTotalPrice() {
    return window.cartManager ? window.cartManager.getTotalPrice() : '0.00';
  }
}

// ============================================
// INITIALISATION
// ============================================

export function initCartModal() {
  document.addEventListener('DOMContentLoaded', () => {
    new CartModal();
  });
}

// Auto-initialisation si importé directement
if (document.readyState === 'loading') {
  initCartModal();
} else {
  new CartModal();
}