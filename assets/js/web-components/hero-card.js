class HeroCard extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute("src") || "";
    const alt = this.getAttribute("alt") || "";
    const width = this.getAttribute("width") || "400";
    const mobileWidth = this.getAttribute("mobile-width") || "280";
  
    this.className = `relative rounded-2xl lg:rounded-3xl overflow-hidden bg-gray-100 flex-shrink-0`;
    this.style.cssText = `
      width: ${mobileWidth}px;
      height: 160px;
    `;
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const updateSize = (e) => {
      if (e.matches) {
        this.style.cssText = `
          width: ${width}px;
          height: 240px;
        `;
      } else {
        this.style.cssText = `
          width: ${mobileWidth}px;
          height: 160px;
        `;
      }
    };
    
    updateSize(mediaQuery);
    mediaQuery.addListener(updateSize);

    this.innerHTML = `
      <img 
        src="${src}" 
        alt="${alt}" 
        class="w-full h-full object-cover"
        loading="lazy"
      />
    `;
  }
}

customElements.define("hero-card", HeroCard);

document.addEventListener('DOMContentLoaded', function() {
  const scrollContainer = document.querySelector('.scroll-container');
  const paginationContainer = document.getElementById('pagination-dots');
  
  if (!scrollContainer || !paginationContainer) return;
  
  const cards = scrollContainer.querySelectorAll('hero-card');
  const totalCards = cards.length;
  
  function createDots() {
    paginationContainer.innerHTML = '';
    for (let i = 0; i < totalCards; i++) {
      const dot = document.createElement('span');
      dot.className = i === 0 
        ? 'w-8 h-1 bg-[#B6349A] rounded-full transition-all duration-300' 
        : 'w-2 h-1 bg-gray-300 rounded-full transition-all duration-300';
      dot.dataset.index = i;
      paginationContainer.appendChild(dot);
    }
  }
  function updateActiveDot() {
    const scrollLeft = scrollContainer.scrollLeft;
    const containerWidth = scrollContainer.offsetWidth;
    const scrollWidth = scrollContainer.scrollWidth;
    
    let currentIndex = 0;
    let accumulatedWidth = 0;
    
    cards.forEach((card, index) => {
      const cardWidth = card.offsetWidth + 12;
      accumulatedWidth += cardWidth;
      
      if (scrollLeft < accumulatedWidth - (containerWidth / 2)) {
        if (currentIndex === 0) {
          currentIndex = index;
        }
      }
    });
    
    currentIndex = Math.min(currentIndex, totalCards - 1);
    
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
  
  let scrollTimeout;
  scrollContainer.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveDot, 50);
  });
  
  paginationContainer.addEventListener('click', function(e) {
    if (e.target.tagName === 'SPAN') {
      const index = parseInt(e.target.dataset.index);
      const card = cards[index];
      
      if (card) {
        card.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest', 
          inline: 'start' 
        });
      }
    }
  });
  
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        updateActiveDot();
      }
    }, 200);
  });
});