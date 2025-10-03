class navItemCategory extends HTMLElement {     
  connectedCallback() {
    const href = this.getAttribute("href") || "#";
    const imgSrc = this.getAttribute("img-src") || "";
    const imgAlt = this.getAttribute("img-alt") || "";
    const label = this.getAttribute("label") || "Category";
    
    this.innerHTML = `
      <li>
        <a 
          href="${href}" 
          class="lg:hidden flex flex-col items-center gap-2 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-lg"
        >
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center shadow-sm">
            <img src="${imgSrc}" alt="${imgAlt}" class="h-5 w-5"/>
          </div>
          <span class="font-montserrat font-medium text-sm text-[#0D0C0D]">${label}</span>
        </a>
      </li>
    `;
  }
}

customElements.define("nav-item-category", navItemCategory);