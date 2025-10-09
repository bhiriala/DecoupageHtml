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
      <article class="rounded-2xl pr-2 pt-4 pl-2 pb-4 hover:shadow-lg transition-shadow duration-300">
        <div class="relative rounded-[30px] mb-4 mt-4 overflow-hidden">
          <img 
            src="${imgSrc}" 
            alt="${imgAlt}" 
            class="w-full h-full rounded-[32px]" 
            loading="lazy"
          />
          <button 
            class="add-to-cart-btn absolute top-3 right-3 w-6 h-6 bg-[#B6349A] rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none"
            data-product-id="${productId}"
            data-product-title="${title}"
            data-product-price="${price}"
            data-product-price-unit="${priceUnit}"
            data-product-img="${imgSrc}"
            aria-label="Ajouter ${title} au panier"
          >
            <img src="assets/images/icon-plus.svg" alt="" aria-hidden="true" class="h-4 w-4 icon-plus" />
            <img src="assets/images/icon-check.svg" alt="" aria-hidden="true" class="h-3 w-3 icon-check hidden" />
          </button>
        </div>

        <div class="space-y-2">
          <h3 class="font-montserrat font-medium text-xs lg:text-sm">
            ${title}
          </h3>

          <p class="font-montserrat font-medium text-xs">
            ${priceUnit}
          </p>

          <div class="flex items-center gap-2">
            <span class="font-montserrat font-semibold text-sm text-[#117E11] lg:text-sm lg:text-[#0D0C0D]">
              ${price}
            </span>
            <span class="font-montserrat font-medium text-xs lg:text-sm text-[#00000099] line-through">
              ${oldPrice}
            </span>
          </div>

          <div class="hidden lg:flex items-center gap-2">
            <span class="font-inter font-medium lg:text-sm text-[#B6349A]">
              ${stockLeft} Left
            </span>
            <span class="font-inter font-medium lg:text-sm">
              ${stockTotal} Left
            </span>
          </div>
        </div>
      </article>
    `;

  }
 
}

customElements.define("product-card", ProductCard);