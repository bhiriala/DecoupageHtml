// ============================================
// CART MANAGEMENT SYSTEM
// Fichier: assets/js/cart.js
// ============================================

class CartManager {
  constructor() {
    this.storageKey = 'cart'; // ← CHANGÉ pour correspondre à product-card.js
    this.init();
  }

  // Initialiser le panier au chargement
  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
    this.updateCartUI();
  }

  // Récupérer le panier depuis localStorage
  getCart() {
    const cart = localStorage.getItem(this.storageKey);
    return cart ? JSON.parse(cart) : [];
  }

  // Sauvegarder le panier dans localStorage
  saveCart(cart) {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    this.updateCartUI();
    this.triggerCartUpdate(cart);
  }

  // Ajouter un produit au panier
  addToCart(product) {
    const cart = this.getCart();
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        priceUnit: product.priceUnit || '',
        imgSrc: product.imgSrc || 'assets/images/image-vide.png',
        quantity: 1
      });
    }

    this.saveCart(cart);
    return true;
  }

  // Retirer un produit du panier
  removeFromCart(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.id !== productId);
    this.saveCart(cart);
  }

  // Mettre à jour la quantité d'un produit
  updateQuantity(productId, quantity) {
    const cart = this.getCart();
    const product = cart.find(item => item.id === productId);

    if (product) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        product.quantity = quantity;
        this.saveCart(cart);
      }
    }
  }

  // Vider le panier
  clearCart() {
    localStorage.setItem(this.storageKey, JSON.stringify([]));
    this.updateCartUI();
    this.triggerCartUpdate([]);
  }

  // Obtenir le nombre total d'articles
  getTotalItems() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Obtenir le prix total
  getTotalPrice() {
    const cart = this.getCart();
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  }

  // Vérifier si un produit est dans le panier
  isInCart(productId) {
    const cart = this.getCart();
    return cart.some(item => item.id === productId);
  }

  // Mettre à jour tous les badges du panier dans l'interface
  updateCartUI() {
    const totalItems = this.getTotalItems();
    
    const cartBadges = document.querySelectorAll('[data-cart-count]');
    
    cartBadges.forEach(badge => {
      badge.textContent = totalItems;
      
      if (totalItems === 0) {
        badge.style.display = 'none';
      } else {
        badge.style.display = 'inline-flex';
      }
    });

    const cartLinks = document.querySelectorAll('a[href*="cart.html"]');
    cartLinks.forEach(link => {
      link.setAttribute('aria-label', `Voir le panier (${totalItems} article${totalItems > 1 ? 's' : ''})`);
    });
  }

  // Déclencher un événement personnalisé
  triggerCartUpdate(cart) {
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { 
        cart,
        totalItems: this.getTotalItems(),
        totalPrice: this.getTotalPrice()
      } 
    }));
  }
}

// Créer une instance globale
const cartManager = new CartManager();
window.cartManager = cartManager;

// Gestion des événements
document.addEventListener('DOMContentLoaded', () => {
  cartManager.updateCartUI();

  // Gérer les clics sur les boutons "Add to Cart"
  document.addEventListener('click', (e) => {
    const addToCartBtn = e.target.closest('.add-to-cart-btn');
    
    if (addToCartBtn) {
      e.preventDefault();
      
      const productId = addToCartBtn.getAttribute('data-product-id');
      const productTitle = addToCartBtn.getAttribute('data-product-title');
      const productPrice = addToCartBtn.getAttribute('data-product-price');
      const productPriceUnit = addToCartBtn.getAttribute('data-product-price-unit') || '';
      const productImgSrc = addToCartBtn.getAttribute('data-product-img') || 'assets/images/image-vide.png';
      
      const isInCart = cartManager.isInCart(productId);
      
      if (!isInCart) {
        cartManager.addToCart({
          id: productId,
          title: productTitle,
          price: productPrice,
          priceUnit: productPriceUnit,
          imgSrc: productImgSrc
        });
        
        addToCartBtn.classList.add('added');
        const iconPlus = addToCartBtn.querySelector('.icon-plus');
        const iconCheck = addToCartBtn.querySelector('.icon-check');
        
        if (iconPlus && iconCheck) {
          iconPlus.classList.add('hidden');
          iconCheck.classList.remove('hidden');
        }
        
        showToast('✓ Product added to cart');
        
      } else {
        cartManager.removeFromCart(productId);
        
        addToCartBtn.classList.remove('added');
        const iconPlus = addToCartBtn.querySelector('.icon-plus');
        const iconCheck = addToCartBtn.querySelector('.icon-check');
        
        if (iconPlus && iconCheck) {
          iconCheck.classList.add('hidden');
          iconPlus.classList.remove('hidden');
        }
        
        showToast('✗ Product removed from cart');
      }
    }
  });
});

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50';
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

window.addEventListener('cartUpdated', (e) => {
  console.log('Cart updated:', e.detail);
});