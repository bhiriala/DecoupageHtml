export class ModalManager {
  constructor(modalElement, triggerElement, options = {}) {
    this.modal = modalElement;
    this.trigger = triggerElement;
    this.options = {
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
    if (this.trigger) {
      this.trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
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
    if (this.options.onOpen) {
      this.options.onOpen();
    }
  }

  close() {
    this.modal.classList.add('hidden');
    this.isOpen = false;
    if (this.options.onClose) {
      this.options.onClose();
    }
  }

  position() {
    if (!this.trigger) return;

    const rect = this.trigger.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const top = rect.bottom + scrollTop + this.options.gap;

    if (window.innerWidth >= this.options.mobileBreakpoint) {
      const right = window.innerWidth - rect.right;
      this.modal.style.top = `${top}px`;
      this.modal.style.right = `${right}px`;
      this.modal.style.left = 'auto';
      this.modal.style.transform = 'none';
    } else {
      this.modal.style.top = `${top}px`;
      this.modal.style.left = '50%';
      this.modal.style.right = 'auto';
      this.modal.style.transform = 'translateX(-50%)';
    }
  }
}


export function initMultiTriggerModal(modalElement, triggerSelectors, options = {}) {
  const triggers = document.querySelectorAll(triggerSelectors);
  let currentTrigger = null;
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      currentTrigger = trigger;
      
      const manager = new ModalManager(modalElement, trigger, {
        ...options,
      });
      
      manager.open();
    });
  });

}


export function initFullscreenModal(modalElement, triggerElement) {
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

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('modal-hidden');
      trigger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  
}