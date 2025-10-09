import { initCartManager } from './cart.js';

import { initCartModal } from './components/cart-modal.js';
import { initProfileDropdown } from './components/profile-dropdown.js';
import { initMobileMenu } from './components/mobile-menu.js';
import { initCategoriesModal } from './components/categories-modal.js';
import { initCarouselNavigation } from './components/carousel-navigation.js';


class App {
  constructor() {
    initCartManager();
  }
}



document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});

export default App;