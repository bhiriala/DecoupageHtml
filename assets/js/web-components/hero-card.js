class HeroCard extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute('src') || '';
    const alt = this.getAttribute('alt') || '';

    const baseClasses = [
      'relative',
      'rounded-2xl',
      'lg:rounded-3xl',
      'overflow-hidden',
      'bg-gray-100',
      'flex-shrink-0',
      'w-[280px]',
      'h-[160px]',
      'lg:w-[600px]',
      'lg:h-[240px]'
    ].join(' ');

    this.className = baseClasses;

    this.innerHTML = `
      <img
        src="${src}" 
        alt="${alt}" 
        class="w-full h-full object-cover block"
        loading="lazy"
      />
    `;
  }

  
}
customElements.define('hero-card', HeroCard);

document.addEventListener('DOMContentLoaded', function() {
  const scrollContainer = document.querySelector('.scroll-container');
  const paginationContainer = document.getElementById('pagination-dots');
  
  if (!scrollContainer || !paginationContainer) return;
  
  const cards = scrollContainer.querySelectorAll('hero-card');
  
  function createDots() {
    paginationContainer.innerHTML = '';
    cards.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.className = 'w-2 h-1 bg-gray-300 rounded-full transition-all duration-300';
      dot.dataset.index = index;
      paginationContainer.appendChild(dot);
    });
  }
  
  function updateActiveDot() {
    const scrollPosition = scrollContainer.scrollLeft;
    const cardWidth = cards[0].offsetWidth + 3; // largeur carte + gap
    const currentIndex = Math.round(scrollPosition / cardWidth);
    
    const dots = paginationContainer.querySelectorAll('span');
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.className = 'w-8 h-1 bg-[#B6349A] rounded-full transition-all duration-300';
      } else {
        dot.className = 'w-2 h-1 bg-gray-300 rounded-full transition-all duration-300';
      }
    });
  }
  
  
  createDots();
  updateActiveDot();
 
  scrollContainer.addEventListener('scroll', updateActiveDot);
});