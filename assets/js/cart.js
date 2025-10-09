class CartManager {
  constructor() {
    this.storageKey = 'cart';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
    this.updateCartUI();
  }

  getCart() {
    const cart = localStorage.getItem(this.storageKey);
    return cart ? JSON.parse(cart) : [];
  }

  saveCart(cart) {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    this.updateCartUI();
    this.triggerCartUpdate(cart);
  }

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

  removeFromCart(productId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.id !== productId);
    this.saveCart(cart);
  }

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

 

  getTotalItems() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice() {
    const cart = this.getCart();
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  }

  isInCart(productId) {
    const cart = this.getCart();
    return cart.some(item => item.id === productId);
  }

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
  }

  triggerCartUpdate(cart) {
    window.dispatchEvent(new CustomEvent('cartUpdated', { 
      detail: { 
        cart,
        totalItems: this.getTotalItems(),
        totalPrice: this.getTotalPrice()
      } 
    }));
  }


  setupAddToCartButtons() {
    document.addEventListener('click', (e) => {
      const addToCartBtn = e.target.closest('.add-to-cart-btn');
      
      if (addToCartBtn) {
        e.preventDefault();
        this.handleAddToCartClick(addToCartBtn);
      }
    });
  }

  handleAddToCartClick(button) {
    const productId = button.getAttribute('data-product-id');
    const productTitle = button.getAttribute('data-product-title');
    const productPrice = button.getAttribute('data-product-price');
    const productPriceUnit = button.getAttribute('data-product-price-unit') || '';
    const productImgSrc = button.getAttribute('data-product-img') || 'assets/images/image-vide.png';
    
    const isInCart = this.isInCart(productId);
    
    if (!isInCart) {
      this.addToCart({
        id: productId,
        title: productTitle,
        price: productPrice,
        priceUnit: productPriceUnit,
        imgSrc: productImgSrc
      });
      
      this.toggleButtonState(button, true);
      this.showToast('✓ Product added to cart');
      
    } else {
      this.removeFromCart(productId);
      this.toggleButtonState(button, false);
      this.showToast('✗ Product removed from cart');
    }
  }

  toggleButtonState(button, added) {
    const iconPlus = button.querySelector('.icon-plus');
    const iconCheck = button.querySelector('.icon-check');
    
    if (added) {
      if (iconPlus && iconCheck) {
        iconPlus.classList.add('hidden');
        iconCheck.classList.remove('hidden');
      }
    } else {
      if (iconPlus && iconCheck) {
        iconCheck.classList.add('hidden');
        iconPlus.classList.remove('hidden');
      }
    }
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
}


let cartManagerInstance = null;

export function initCartManager() {
  if (!cartManagerInstance) {
    cartManagerInstance = new CartManager();
    window.cartManager = cartManagerInstance;
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        cartManagerInstance.updateCartUI();
        cartManagerInstance.setupAddToCartButtons();
      });
    } else {
      cartManagerInstance.updateCartUI();
      cartManagerInstance.setupAddToCartButtons();
    }
  }
  
  return cartManagerInstance;
}

export default CartManager;

