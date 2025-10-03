class HeroCard extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute("src") || "";
    const alt = this.getAttribute("alt") || "";
    const width = this.getAttribute("width") || "400";
    const mobileWidth = this.getAttribute("mobile-width") || "280";
    
    // Utiliser des classes Tailwind standards au lieu de classes dynamiques
    this.className = `relative rounded-2xl lg:rounded-3xl overflow-hidden bg-gray-100 flex-shrink-0`;
    
    // Hauteur responsive avec style inline
    this.style.cssText = `
      width: ${mobileWidth}px;
      height: 160px;
    `;
    
    // Media query pour desktop
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

// Pagination dynamique
document.addEventListener('DOMContentLoaded', function() {
  const scrollContainer = document.querySelector('.scroll-container');
  const paginationContainer = document.getElementById('pagination-dots');
  
  if (!scrollContainer || !paginationContainer) return;
  
  const cards = scrollContainer.querySelectorAll('hero-card');
  const totalCards = cards.length;
  
  // Créer les dots de pagination
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
  
  // Mettre à jour l'indicateur actif
  function updateActiveDot() {
    const scrollLeft = scrollContainer.scrollLeft;
    const containerWidth = scrollContainer.offsetWidth;
    const scrollWidth = scrollContainer.scrollWidth;
    
    // Calculer l'index de la carte visible
    let currentIndex = 0;
    let accumulatedWidth = 0;
    
    cards.forEach((card, index) => {
      const cardWidth = card.offsetWidth + 12; // 12px = gap
      accumulatedWidth += cardWidth;
      
      if (scrollLeft < accumulatedWidth - (containerWidth / 2)) {
        if (currentIndex === 0) {
          currentIndex = index;
        }
      }
    });
    
    // Limiter l'index au nombre total de cards
    currentIndex = Math.min(currentIndex, totalCards - 1);
    
    // Mettre à jour les dots
    const dots = paginationContainer.querySelectorAll('span');
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.className = 'w-8 h-1 bg-[#B6349A] rounded-full transition-all duration-300';
      } else {
        dot.className = 'w-2 h-1 bg-gray-300 rounded-full transition-all duration-300';
      }
    });
  }
  
  // Initialiser
  createDots();
  
  // Écouter le scroll
  let scrollTimeout;
  scrollContainer.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveDot, 50);
  });
  
  // Click sur les dots pour naviguer
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
  
  // Re-créer les dots si la fenêtre est redimensionnée
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