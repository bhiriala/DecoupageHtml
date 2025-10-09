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
    this.openBtn.addEventListener('click', () => {
      this.open();
    });

    this.closeBtn.addEventListener('click', () => {
      this.close();
    });


    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });
  }

  open() {
    this.modal.classList.remove('hidden');
    this.modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    
  }

  close() {
    this.modal.classList.add('hidden');
    this.modal.classList.remove('flex');
    document.body.style.overflow = '';
    this.modal.style.opacity = '';
  }


  // setupCategoryFilters() {
  //   const filterTabs = this.modal.querySelectorAll('.filter-tab');
    
  //   if (filterTabs.length === 0) return;

  //   filterTabs.forEach(tab => {
  //     tab.addEventListener('click', () => {
  //       filterTabs.forEach(t => {
  //         t.classList.remove('active', 'border-2', 'border-[#B6349A]');
  //         t.classList.add('border', 'border-gray-200');
  //       });
  //       tab.classList.add('active', 'border-2', 'border-[#B6349A]');
  //       tab.classList.remove('border', 'border-gray-200');

  //     });
  //   });
  // }

}

export function initCategoriesModal() {
  document.addEventListener('DOMContentLoaded', () => {
    new CategoriesModal();
  });
}

if (document.readyState === 'loading') {
  initCategoriesModal();
} else {
  new CategoriesModal();
}