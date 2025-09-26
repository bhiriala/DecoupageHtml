class HeroCard extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute("src") || "";
    const alt = this.getAttribute("alt") || "";
    const colSpan = this.getAttribute("col-span") || "4";
    const height = this.getAttribute("height") || "56";
    const mdHeight = this.getAttribute("md-height") || height;
    this.className = `relative lg:col-span-${colSpan} rounded-xl overflow-hidden bg-gray-100 h-${height} md:h-${mdHeight}`;

    this.innerHTML = `
      <img src="${src}" alt="${alt}" class="w-full h-full object-cover"/>
    `;
  }
}

customElements.define("hero-card", HeroCard);