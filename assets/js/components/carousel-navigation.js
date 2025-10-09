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

    this.scrollAmount = 260; 
    
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
    prevBtn.addEventListener('click', () => {
      this.scroll(container, -this.scrollAmount);
    });

    nextBtn.addEventListener('click', () => {
      this.scroll(container, this.scrollAmount);
    });

    this.updateButtonsVisibility(carousel);
    
    container.addEventListener('scroll', () => {
      this.updateButtonsVisibility(carousel);
    }, { passive: true });
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
    if (container.scrollLeft <= 10) {
      prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
      prevBtn.disabled = true;
    } else {
      prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      prevBtn.disabled = false;
    }
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

export function initCarouselNavigation() {
  document.addEventListener('DOMContentLoaded', () => {
    new CarouselNavigation();
  });
}

if (document.readyState === 'loading') {
  initCarouselNavigation();
} else {
  new CarouselNavigation();
}