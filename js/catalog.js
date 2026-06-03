// catalog.js - каталог товаров

const grid = document.getElementById('catalog-grid');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const applyBtn = document.getElementById('applyFilters');
const resetBtn = document.getElementById('resetFilters');

function render(items) {
    if (!grid) return;
    if (!items || items.length === 0) {
        grid.innerHTML = '<div class="catalog-empty">К сожалению, ничего не найдено. Попробуйте изменить фильтры.</div>';
        return;
    }
    grid.innerHTML = items.map((item, idx) => {
        const originalIndex = window.products ? window.products.findIndex(p => p.name === item.name) : idx;
        return `
            <article class="product-card">
                <a href="product.html?id=${originalIndex}" class="product-card__link">
                    <div class="product-card__img-wrapper">
                        <img src="${item.img}" alt="${item.name}" class="product-card__img" loading="lazy">
                    </div>
                    <h3 class="product-card__title">${item.name}</h3>
                </a>
                <p class="product-card__price">${item.price.toLocaleString()} ₽</p>
                <button class="product-card__btn" data-name="${item.name}" data-price="${item.price}" data-img="${item.img}">В корзину</button>
            </article>
        `;
    }).join('');
    document.querySelectorAll('.product-card__btn').forEach(btn => {
        btn.removeEventListener('click', handleAddToCart);
        btn.addEventListener('click', handleAddToCart);
    });
}

function handleAddToCart(e) {
    const btn = e.currentTarget;
    const name = btn.getAttribute('data-name');
    const price = parseInt(btn.getAttribute('data-price'));
    const img = btn.getAttribute('data-img');
    addToCart(name, price, img);
}

function addToCart(name, price, img) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, img, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification('Букет "' + name + '" добавлен в корзину', true, name);
}

function filterProducts() {
    if (!window.products) return [];
    const activeCategories = Array.from(document.querySelectorAll('.filter-category:checked'))
        .map(cb => cb.value);
    const maxPrice = priceRange ? parseInt(priceRange.value) : 6000;
    const filtered = window.products.filter(product => {
        const matchCat = activeCategories.length === 0 || activeCategories.includes(product.category);
        const matchPrice = product.price <= maxPrice;
        return matchCat && matchPrice;
    });
    return filtered;
}

if (priceRange) {
    priceRange.addEventListener('input', () => {
        if (priceValue) priceValue.innerText = priceRange.value + ' ₽';
    });
}
if (applyBtn) {
    applyBtn.addEventListener('click', () => {
        const filtered = filterProducts();
        render(filtered);
    });
}
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        document.querySelectorAll('.filter-category:checked').forEach(cb => cb.checked = false);
        if (priceRange) priceRange.value = '6000';
        if (priceValue) priceValue.innerText = '6000 ₽';
        render(window.products);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    if (window.products && window.products.length) {
        render(window.products);
    } else {
        console.warn('Массив products не найден. Проверьте data.js');
        if (grid) grid.innerHTML = '<div class="catalog-empty">Загрузка товаров...</div>';
    }
});