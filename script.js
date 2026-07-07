const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const filterButtons = document.querySelectorAll("[data-filter]");
const brandFilterBar = document.querySelector("[data-brand-filters]");
const brandFilterButtons = document.querySelectorAll("[data-brand-filter]");
const productCards = document.querySelectorAll("[data-category]");
const emptyStates = document.querySelectorAll("[data-empty-state]");
const leadForm = document.querySelector("[data-lead-form]");
const formStatus = document.querySelector("[data-form-status]");
const whatsappNumber = "6281339899995";
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

brandFilterButtons.forEach((button) => {
button.classList.toggle("is-active", button.dataset.brandFilter === brand);
});
}

function renderProducts() {
const showBrandFilters = activeCategory === "electronic";
brandFilterBar?.classList.toggle("is-hidden", !showBrandFilters);

productCards.forEach((card) => {
const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
const matchesBrand = !showBrandFilters || card.dataset.brand === activeBrand;
card.classList.toggle("is-hidden", !(matchesCategory && matchesBrand));
});

emptyStates.forEach((state) => {
const shouldShow =
activeCategory === "components" && state.dataset.emptyState === "components" ||
showBrandFilters && activeBrand !== "baretone" && state.dataset.emptyState === activeBrand;
state.classList.toggle("is-hidden", !shouldShow);
});
}

filterButtons.forEach((button) => {
button.addEventListener("click", () => {
activeCategory = button.dataset.filter;
setActiveButton(filterButtons, button);

if (activeCategory === "electronic") {
setActiveBrand("baretone");
}

renderProducts();
});
});

brandFilterButtons.forEach((button) => {
button.addEventListener("click", () => {
setActiveBrand(button.dataset.brandFilter);
renderProducts();
});
});

renderProducts();

leadForm?.addEventListener("submit", (event) => {
event.preventDefault();
const formData = new FormData(leadForm);
const name = String(formData.get("name") || "").trim();
const product = String(formData.get("product") || "").trim();
const message = String(formData.get("message") || "").trim();
const whatsappMessage = [
`Halo King Wijaya Elektronik, saya mau bertanya tentang produk anda.`,
`Nama: ${name}`,
`Produk yang dicari: ${product}`,
message ? `Pesan: ${message}` : ""
].filter(Boolean).join("\n");
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

window.open(whatsappUrl, "_blank", "noopener,noreferrer");
formStatus.textContent = `Terima kasih, ${name}. WhatsApp akan terbuka untuk mengirim pertanyaan tentang ${product}.`;
leadForm.reset();
});
