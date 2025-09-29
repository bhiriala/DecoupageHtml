class navItemCategory extends HTMLElement {     
    connectedCallback() {
        const href = this.getAttribute("href") || "#";
        const imgSrc = this.getAttribute("img-src") || "";
        const imgAlt = this.getAttribute("img-alt") || "";
        const label = this.getAttribute("label") || "Category";
        this.innerHTML = `
            <li>    
                <a href="${href}" class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 border border-gray-100 shadow-sm text-sm hover:shadow-md focus:outline-none focus:ring-2">
                    <img src="${imgSrc}" alt="${imgAlt}" class="h-6 w-6 rounded-full"/>
                    <span class="font-inter font-semiBold hidden lg:inline text-sm text-[#0D0C0D]" >${label}</span>
                </a>
            </li>
        `;
    }
}
customElements.define("nav-item-category", navItemCategory);