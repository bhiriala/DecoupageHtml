// ============================================
// CAROUSEL NAVIGATION - Navigation des carousels
// ============================================

class CarouselNavigation {
  constructor() {
    this.carousels = [
      {
        name: 'trending',
        container: document.getElementById('trending-scroll'),
        prevBtn: document.getElementById('prev-btn-trending'),
        nextBtn: document.getElementById('next-btn-trending')
      },
      {
        name: 'bestseller',
        container: document.getElementById('bestseller-scroll'),
        prevBtn: document.getElementById('prev-btn-bestseller'),
        nextBtn: document.getElementById('next-btn-bestseller')
      }
    ];

    this.scrollAmount = 260; // Largeur d'une carte + gap
    
    this.init();
  }

  init() {
    this.carousels.forEach(carousel => {
      if (carousel.container && carousel.prevBtn && carousel.nextBtn) {
        this.setupCarousel(carousel);
      } else {
        console.warn(`Carousel "${carousel.name}" elements not found`);
      }
    });
  }

  setupCarousel(carousel) {
    const { container, prevBtn, nextBtn } = carousel;

    // Navigation avec les boutons
    prevBtn.addEventListener('click', () => {
      this.scroll(container, -this.scrollAmount);
    });

    nextBtn.addEventListener('click', () => {
      this.scroll(container, this.scrollAmount);
    });

    // Mettre à jour la visibilité des boutons selon la position
    this.updateButtonsVisibility(carousel);
    
    container.addEventListener('scroll', () => {
      this.updateButtonsVisibility(carousel);
    }, { passive: true });

    // Support du scroll au toucher (mobile)
    this.setupTouchScroll(container);
  }

  scroll(container, amount) {
    container.scrollBy({
      left: amount,
      behavior: 'smooth'
    });
  }

  updateButtonsVisibility(carousel) {
    const { container, prevBtn, nextBtn } = carousel;
    
    // Désactiver le bouton prev si au début
    if (container.scrollLeft <= 10) {
      prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
      prevBtn.disabled = true;
    } else {
      prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      prevBtn.disabled = false;
    }

    // Désactiver le bouton next si à la fin
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (container.scrollLeft >= maxScroll - 10) {
      nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
      nextBtn.disabled = true;
    } else {
      nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      nextBtn.disabled = false;
    }
  }

  setupTouchScroll(container) {
    let isDragging = false;
    let startX;
    let scrollLeft;

    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    }, { passive: true });

    container.addEventListener('touchend', () => {
      isDragging = false;
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 2; // Vitesse de scroll
      container.scrollLeft = scrollLeft - walk;
    }, { passive: true });
  }
}

// ============================================
// HELPER: Ajouter un carousel dynamiquement
// ============================================

export function addCarousel(name, containerId, prevBtnId, nextBtnId) {
  const container = document.getElementById(containerId);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);

  if (!container || !prevBtn || !nextBtn) {
    console.error(`Cannot add carousel "${name}": elements not found`);
    return;
  }

  const carousel = { name, container, prevBtn, nextBtn };
  const navigation = new CarouselNavigation();
  navigation.setupCarousel(carousel);
}

// ============================================
// HELPER: Scroll programmatique
// ============================================

export function scrollCarousel(containerId, direction = 'next') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const amount = direction === 'next' ? 260 : -260;
  container.scrollBy({
    left: amount,
    behavior: 'smooth'
  });
}

// ============================================
// INITIALISATION
// ============================================

export function initCarouselNavigation() {
  document.addEventListener('DOMContentLoaded', () => {
    new CarouselNavigation();
  });
}

// Auto-initialisation
if (document.readyState === 'loading') {
  initCarouselNavigation();
} else {
  new CarouselNavigation();
}