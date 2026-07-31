const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const filterButtons = document.querySelectorAll("[data-filter]");
const brandFilterBar = document.querySelector("[data-brand-filters]");
const productGrid = document.querySelector("[data-product-grid]");
const emptyState = document.querySelector("[data-empty-state]");
const emptyTitle = document.querySelector("[data-empty-title]");
const emptyMessage = document.querySelector("[data-empty-message]");
const leadForm = document.querySelector("[data-lead-form]");
const formStatus = document.querySelector("[data-form-status]");
const whatsappNumber = "6281339899995";

let catalog = {
  categories: [],
  brands: [],
  products: []
};
let activeCategory = "all";
let activeBrand = "baretone";

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("is-menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    document.body.classList.remove("is-menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

function setActiveButton(buttons, activeButton) {
  buttons.forEach((item) => item.classList.toggle("is-active", item === activeButton));
}

function setActiveBrand(brand) {
  activeBrand = brand;

  brandFilterBar?.querySelectorAll("[data-brand-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.brandFilter === brand);
  });
}

function createBrandFilters() {
  if (!brandFilterBar) return;

  brandFilterBar.textContent = "";

  catalog.brands.forEach((brand, index) => {
    const button = document.createElement("button");
    button.className = `chip brand-chip${index === 0 ? " is-active" : ""}`;
    button.type = "button";
    button.dataset.brandFilter = brand.id;
    button.textContent = brand.name;
    button.addEventListener("click", () => {
      setActiveBrand(brand.id);
      renderProducts();
    });

    brandFilterBar.append(button);
  });

  activeBrand = catalog.brands[0]?.id || "baretone";
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.category = product.category;
  card.dataset.brand = product.brand;

  const photoWrap = document.createElement("div");
  photoWrap.className = "product-photo-wrap";

  const image = document.createElement("img");
  image.className = "product-photo";
  image.src = product.image;
  image.alt = product.alt || product.name;
  image.loading = "lazy";

  const info = document.createElement("div");
  info.className = "product-info";

  const brand = document.createElement("span");
  brand.textContent = product.brandName;

  const title = document.createElement("h3");
  title.textContent = product.name;

  photoWrap.append(image);
  info.append(brand, title);
  card.append(photoWrap, info);

  return card;
}

function showEmptyState(title, message) {
  if (!emptyState) return;

  emptyTitle.textContent = title;
  emptyMessage.textContent = message;
  emptyState.classList.remove("is-hidden");
}

function hideEmptyState() {
  emptyState?.classList.add("is-hidden");
}

function getEmptyCopy() {
  if (activeCategory === "components") {
    const components = catalog.categories.find((category) => category.id === "components");
    return {
      title: components?.emptyTitle || "Components",
      message: components?.emptyMessage || "Produk akan ditambahkan."
    };
  }

  if (activeCategory === "electronic") {
    const brand = catalog.brands.find((item) => item.id === activeBrand);
    return {
      title: brand?.name || "Electronic",
      message: `Produk ${brand?.name || "brand ini"} akan ditambahkan.`
    };
  }

  return {
    title: "Produk akan ditambahkan.",
    message: "Silakan pilih kategori atau brand lain."
  };
}

function renderProducts() {
  if (!productGrid) return;

  const showBrandFilters = activeCategory === "electronic";
  brandFilterBar?.classList.toggle("is-hidden", !showBrandFilters);
  productGrid.textContent = "";

  const visibleProducts = catalog.products.filter((product) => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const matchesBrand = !showBrandFilters || product.brand === activeBrand;
    return matchesCategory && matchesBrand;
  });

  visibleProducts.forEach((product) => {
    productGrid.append(createProductCard(product));
  });

  if (visibleProducts.length) {
    hideEmptyState();
    return;
  }

  const emptyCopy = getEmptyCopy();
  showEmptyState(emptyCopy.title, emptyCopy.message);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.filter;
    setActiveButton(filterButtons, button);

    if (activeCategory === "electronic") {
      setActiveBrand(catalog.brands[0]?.id || "baretone");
    }

    renderProducts();
  });
});

async function loadCatalog() {
  try {
    const response = await fetch("data/products.json");

    if (!response.ok) {
      throw new Error("Product data failed to load.");
    }

    catalog = await response.json();
    createBrandFilters();
    renderProducts();
  } catch {
    showEmptyState("Produk belum tersedia.", "Data produk belum berhasil dimuat.");
  }
}

loadCatalog();

leadForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(leadForm);
  const name = String(formData.get("name") || "").trim();
  const product = String(formData.get("product") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const whatsappMessage = [
    "Halo King Wijaya Elektronik, saya mau bertanya tentang produk anda.",
    `Nama: ${name}`,
    `Produk yang dicari: ${product}`,
    message ? `Pesan: ${message}` : ""
  ].filter(Boolean).join("\n");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  formStatus.textContent = `Terima kasih, ${name}. WhatsApp akan terbuka untuk mengirim pertanyaan tentang ${product}.`;
  leadForm.reset();
});
