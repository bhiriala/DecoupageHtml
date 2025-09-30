class ProductCard extends HTMLElement {
  connectedCallback() {
    const imgSrc = this.getAttribute("img-src") || "assets/images/image-vide.png";
    const imgAlt = this.getAttribute("img-alt") || "Product";
    const title = this.getAttribute("title") || "This is product a";
    const priceUnit = this.getAttribute("price-unit") || "$2.71/lb";
    const price = this.getAttribute("price") || "$99.99";
    const oldPrice = this.getAttribute("old-price") || "$99.99";
    const stockLeft = this.getAttribute("stock-left") || "12";
    const stockTotal = this.getAttribute("stock-total") || "12";
    const productId = this.getAttribute("product-id") || "1";

    this.className = "flex-shrink-0 w-[220px] md:w-[240px]";

    this.innerHTML = `
      <article class="bg-[#FAF9FA] rounded-2xl p-4 hover:shadow-lg transition-shadow duration-300">
        <!-- Image Container -->
        <div class="relative bg-white rounded-xl mb-3 overflow-hidden h-[180px] md:h-[200px] flex items-center justify-center">
          <img 
            src="${imgSrc}" 
            alt="${imgAlt}" 
            class="w-full h-full object-contain p-4"
            loading="lazy"
          />
        </div>

        <!-- Product Info -->
        <div class="space-y-2">
          <!-- Title -->
          <h3 class="font-montserrat font-medium text-sm text-[#0D0C0D] line-clamp-2 min-h-[40px]">
            ${title}
          </h3>

          <!-- Price Unit -->
          <p class="font-inter text-xs text-gray-500">
            ${priceUnit}
          </p>

          <!-- Prices -->
          <div class="flex items-center gap-2">
            <span class="font-montserrat font-bold text-lg text-[#0D0C0D]">
              ${price}
            </span>
            <span class="font-inter text-sm text-gray-400 line-through">
              ${oldPrice}
            </span>
          </div>

          <!-- Stock Info -->
          <div class="flex items-center gap-2">
            <span class="font-inter font-semibold text-xs text-[#E91E63]">
              ${stockLeft} Left
            </span>
            <span class="font-inter text-xs text-gray-500">
              ${stockTotal} Left
            </span>
          </div>
        </div>
      </article>
    `;
  }
}

customElements.define("product-card", ProductCard);