// ============================================
// MODAL UTILITIES - Logique réutilisable
// ============================================

export class ModalManager {
  constructor(modalElement, triggerElement, options = {}) {
    this.modal = modalElement;
    this.trigger = triggerElement;
    this.options = {
      closeOnEscape: true,
      closeOnOutsideClick: true,
      closeOnScroll: true,
      repositionOnResize: true,
      mobileBreakpoint: 768,
      gap: 8,
      ...options
    };
    
    this.isOpen = false;
    this.resizeTimeout = null;
    
    this.init();
  }

  init() {
    // Event listeners
    if (this.trigger) {
      this.trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    }

    if (this.options.closeOnEscape) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }

    if (this.options.closeOnOutsideClick) {
      document.addEventListener('click', (e) => {
        const isClickInside = this.modal.contains(e.target);
        const isClickOnTrigger = this.trigger?.contains(e.target);
        
        if (!isClickInside && !isClickOnTrigger && this.isOpen) {
          this.close();
        }
      });
    }

    if (this.options.closeOnScroll) {
      window.addEventListener('scroll', () => {
        if (this.isOpen) this.close();
      }, { passive: true });
    }

    if (this.options.repositionOnResize) {
      window.addEventListener('resize', () => {
        if (this.isOpen) {
          clearTimeout(this.resizeTimeout);
          this.resizeTimeout = setTimeout(() => {
            this.position();
          }, 100);
        }
      });
    }
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.position();
    this.modal.classList.remove('hidden');
    this.isOpen = true;
    
    // Callback personnalisé
    if (this.options.onOpen) {
      this.options.onOpen();
    }
  }

  close() {
    this.modal.classList.add('hidden');
    this.isOpen = false;
    
    // Callback personnalisé
    if (this.options.onClose) {
      this.options.onClose();
    }
  }

  position() {
    if (!this.trigger) return;

    const rect = this.trigger.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const top = rect.bottom + scrollTop + this.options.gap;

    // Responsive positioning
    if (window.innerWidth >= this.options.mobileBreakpoint) {
      // Desktop: align right
      const right = window.innerWidth - rect.right;
      this.modal.style.top = `${top}px`;
      this.modal.style.right = `${right}px`;
      this.modal.style.left = 'auto';
      this.modal.style.transform = 'none';
    } else {
      // Mobile: center
      this.modal.style.top = `${top}px`;
      this.modal.style.left = '50%';
      this.modal.style.right = 'auto';
      this.modal.style.transform = 'translateX(-50%)';
    }
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Gère plusieurs triggers pour un même modal
 */
export function initMultiTriggerModal(modalElement, triggerSelectors, options = {}) {
  const triggers = document.querySelectorAll(triggerSelectors);
  let currentTrigger = null;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      currentTrigger = trigger;
      
      const manager = new ModalManager(modalElement, trigger, {
        ...options,
        closeOnOutsideClick: false // Géré manuellement ci-dessous
      });
      
      manager.open();
    });
  });

  // Gestion du clic extérieur pour multi-triggers
  if (options.closeOnOutsideClick !== false) {
    document.addEventListener('click', (e) => {
      const isClickInside = modalElement.contains(e.target);
      const isClickOnAnyTrigger = Array.from(triggers).some(t => t.contains(e.target));
      const isOpen = !modalElement.classList.contains('hidden');
      
      if (!isClickInside && !isClickOnAnyTrigger && isOpen) {
        modalElement.classList.add('hidden');
      }
    });
  }
}

/**
 * Gère les modals fullscreen (comme le menu mobile)
 */
export function initFullscreenModal(modalElement, triggerElement, options = {}) {
  const trigger = triggerElement;
  const modal = modalElement;
  
  trigger.addEventListener('click', () => {
    const isOpen = !modal.classList.contains('modal-hidden');
    
    if (isOpen) {
      modal.classList.add('modal-hidden');
      trigger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      modal.classList.remove('modal-hidden');
      trigger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  });

  // Fermer en cliquant sur l'overlay
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('modal-hidden');
      trigger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Fermer avec Escape
  if (options.closeOnEscape !== false) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('modal-hidden')) {
        modal.classList.add('modal-hidden');
        trigger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
}