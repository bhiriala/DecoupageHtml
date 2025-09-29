class HeroCard extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute("src") || "";
    const alt = this.getAttribute("alt") || "";
    const width = this.getAttribute("width") || "400";
    const height = this.getAttribute("height") || "56";
    const mdHeight = this.getAttribute("md-height") || height;
    
    this.className = `relative rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 h-${height} md:h-${mdHeight}`;
    this.style.width = `${width}px`;

    this.innerHTML = `
      <img src="${src}" alt="${alt}" class="w-full h-full object-cover"/>
    `;
  }
}

customElements.define("hero-card", HeroCard);