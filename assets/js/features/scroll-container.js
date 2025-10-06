class ScrollContainer {
  constructor(container) {
    this.container = container;
    this.isDown = false;
    this.startX = 0;
    this.scrollLeft = 0;
    this.velocity = 0;
    this.lastX = 0;
    this.animationId = null;

    this.init();
  }

  init() {
    this.container.style.cursor = 'grab';
    this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.container.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    this.container.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.container.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });

    this.setupTouchEvents();
  }

  handleMouseDown(e) {
    this.isDown = true;
    this.container.style.cursor = 'grabbing';
    this.container.style.userSelect = 'none';
    
    this.startX = e.pageX - this.container.offsetLeft;
    this.scrollLeft = this.container.scrollLeft;
    this.lastX = e.pageX;
    this.velocity = 0;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  handleMouseLeave() {
    if (this.isDown) {
      this.isDown = false;
      this.container.style.cursor = 'grab';
      this.container.style.userSelect = '';
      this.applyInertia();
    }
  }

  handleMouseUp() {
    if (this.isDown) {
      this.isDown = false;
      this.container.style.cursor = 'grab';
      this.container.style.userSelect = '';
      this.applyInertia();
    }
  }

  handleMouseMove(e) {
    if (!this.isDown) return;
    
    e.preventDefault();
    
    const x = e.pageX - this.container.offsetLeft;
    const walk = (x - this.startX) * 2; 
    
    this.container.scrollLeft = this.scrollLeft - walk;
    this.velocity = e.pageX - this.lastX;
    this.lastX = e.pageX;
  }

  applyInertia() {
    const friction = 0.95; 
    
    const animate = () => {
      if (Math.abs(this.velocity) > 0.5) {
        this.container.scrollLeft -= this.velocity;
        this.velocity *= friction;
        this.animationId = requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  setupTouchEvents() {
    let touchStartX = 0;
    let touchScrollLeft = 0;

    this.container.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].pageX - this.container.offsetLeft;
      touchScrollLeft = this.container.scrollLeft;
    }, { passive: true });

    this.container.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX - this.container.offsetLeft;
      const walk = (x - touchStartX) * 2;
      this.container.scrollLeft = touchScrollLeft - walk;
    }, { passive: true });
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.container.style.cursor = '';
    this.container.style.userSelect = '';
  }
}


class ScrollContainerManager {
  constructor() {
    this.instances = [];
    this.init();
  }

  init() {
    // Sélectionner tous les conteneurs avec la classe .scroll-container
    const containers = document.querySelectorAll('.scroll-container');
    
    containers.forEach(container => {
      const instance = new ScrollContainer(container);
      this.instances.push(instance);
    });

    if (containers.length > 0) {
      console.log(`✅ ${containers.length} scroll container(s) initialisé(s)`);
    }
  }

  // Ajouter un conteneur dynamiquement
  addContainer(selector) {
    const container = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector;

    if (container) {
      const instance = new ScrollContainer(container);
      this.instances.push(instance);
      return instance;
    }
    
    console.warn('Container not found:', selector);
    return null;
  }

  // Détruire toutes les instances
  destroyAll() {
    this.instances.forEach(instance => instance.destroy());
    this.instances = [];
  }
}

// ============================================
// EXPORTS
// ============================================

export function initScrollContainers() {
  document.addEventListener('DOMContentLoaded', () => {
    window.scrollContainerManager = new ScrollContainerManager();
  });
}

export function addScrollContainer(selector) {
  if (window.scrollContainerManager) {
    return window.scrollContainerManager.addContainer(selector);
  }
  console.warn('ScrollContainerManager not initialized');
  return null;
}

// Auto-initialisation
if (document.readyState === 'loading') {
  initScrollContainers();
} else {
  window.scrollContainerManager = new ScrollContainerManager();
}