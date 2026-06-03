// product.js - карточка товара 

let currentProduct = null;
let currentMultiplier = 1;
let basePrice = 0;

function getProductFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id !== null && window.products && window.products[id]) {
        return { product: window.products[id], index: parseInt(id) };
    }
    return null;
}

function renderProduct(productData) {
    const { product, index } = productData;
    if (!product) return false;

    currentProduct = product;
    basePrice = product.price;

    document.getElementById('productTitle').innerText = product.name;
    document.getElementById('productImage').src = product.img;
    document.getElementById('productDesc').innerHTML = `<p>${product.desc || 'Нежный букет, созданный с любовью.'}</p>`;
    document.getElementById('productCategory').innerText = product.category || 'Авторские букеты';
    document.getElementById('productSku').innerText = 'LVF-' + (1000 + index);

    updatePriceDisplay();
    return true;
}

function updatePriceDisplay() {
    if (currentProduct) {
        const newPrice = Math.round(basePrice * currentMultiplier);
        document.getElementById('productPrice').innerText = newPrice.toLocaleString() + ' ₽';
    }
}

function initSizeButtons() {
    const btns = document.querySelectorAll('.product-options__btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const multiplier = parseFloat(btn.getAttribute('data-multiplier'));
            currentMultiplier = isNaN(multiplier) ? 1 : multiplier;
            updatePriceDisplay();
        });
    });
}

function initQuantity() {
    const input = document.getElementById('quantityInput');
    const decr = document.getElementById('decrQty');
    const incr = document.getElementById('incrQty');

    decr.addEventListener('click', () => {
        let val = parseInt(input.value) || 1;
        if (val > 1) input.value = val - 1;
    });
    incr.addEventListener('click', () => {
        let val = parseInt(input.value) || 1;
        input.value = val + 1;
    });
    input.addEventListener('change', () => {
        let val = parseInt(input.value);
        if (isNaN(val) || val < 1) input.value = 1;
    });
}

function addToCart(product, quantity, size, multiplier) {
    if (!product) return;
    const finalPrice = Math.round(product.price * multiplier);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemName = `${product.name} (${size})`;
    const existing = cart.find(item => item.name === itemName);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            name: itemName,
            price: finalPrice,
            img: product.img,
            quantity: quantity,
            size: size
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    if (typeof showNotification === 'function') {
        showNotification(`Букет "${product.name}" (${size}) добавлен в корзину`, true);
    } else {
        alert(`Букет "${product.name}" добавлен в корзину!`);
    }
}

function renderRecommendations(currentProductId) {
    const grid = document.getElementById('recommendationsGrid');
    if (!grid || !window.products) return;

    let others = window.products.filter((_, idx) => idx != currentProductId);
    if (others.length > 4) {
        for (let i = others.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [others[i], others[j]] = [others[j], others[i]];
        }
        others = others.slice(0, 4);
    }

    grid.innerHTML = others.map(p => {
        const originalIndex = window.products.findIndex(prod => prod.name === p.name);
        return `
            <a href="product.html?id=${originalIndex}" class="recommendation-card">
                <img src="${p.img}" alt="${p.name}" class="recommendation-card__img">
                <h3 class="recommendation-card__title">${p.name}</h3>
                <p class="recommendation-card__price">${p.price.toLocaleString()} ₽</p>
            </a>
        `;
    }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const productData = getProductFromUrl();
    if (productData && renderProduct(productData)) {
        initSizeButtons();
        initQuantity();

        const addBtn = document.getElementById('addToCartBtn');
        addBtn.addEventListener('click', () => {
            const quantity = parseInt(document.getElementById('quantityInput').value) || 1;
            const activeSizeBtn = document.querySelector('.product-options__btn.active');
            const size = activeSizeBtn ? activeSizeBtn.getAttribute('data-size') : 'Стандарт';
            addToCart(currentProduct, quantity, size, currentMultiplier);
        });

        renderRecommendations(productData.index);
    } else {
        window.location.href = 'catalog.html';
    }
});