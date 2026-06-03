// cart.js - корзина 

const STORAGE_CART = 'cart';
const STORAGE_ORDERS = 'orders';

function getCart() {
    return JSON.parse(localStorage.getItem(STORAGE_CART)) || [];
}
function saveCart(cart) {
    localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
}
function clearCart() {
    localStorage.removeItem(STORAGE_CART);
}
function getOrders() {
    return JSON.parse(localStorage.getItem(STORAGE_ORDERS)) || [];
}
function saveOrder(order) {
    const orders = getOrders();
    orders.unshift(order);
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
}
function generateOrderId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
}

// Рендер корзины
function renderCart() {
    const container = document.getElementById('cart-content');
    const totalBlock = document.getElementById('cart-total-block');
    const totalSpan = document.getElementById('total-sum');
    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Ваша корзина пуста. Самое время выбрать букет!</p>
                <a href="catalog.html" class="btn">Перейти в каталог</a>
            </div>
        `;
        if (totalBlock) totalBlock.style.display = 'none';
        return;
    }

    if (totalBlock) totalBlock.style.display = 'block';

    let total = 0;
    let itemsHtml = '';
    cart.forEach((item, idx) => {
        const qty = item.quantity || 1;
        const itemTotal = item.price * qty;
        total += itemTotal;
        itemsHtml += `
            <div class="cart-item" data-index="${idx}">
                <img src="${item.img}" alt="${item.name}" class="cart-item__img">
                <div class="cart-item__info">
                    <div class="cart-item__name">${escapeHtml(item.name)}</div>
                    <div class="cart-item__price">${itemTotal.toLocaleString()} ₽</div>
                    <button class="cart-item__remove" data-index="${idx}">Удалить</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = itemsHtml;
    if (totalSpan) totalSpan.innerText = total.toLocaleString();

    // Обработчики удаления
    document.querySelectorAll('.cart-item__remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.getAttribute('data-index'));
            removeFromCart(idx);
        });
    });
}

function removeFromCart(index) {
    const cart = getCart();
    if (index >= 0 && index < cart.length) {
        const removed = cart[index];
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
        if (typeof showNotification === 'function') {
            showNotification('Товар "' + removed.name + '" удалён из корзины');
        }
    }
}

// Оформление заказа
function submitOrder(event) {
    event.preventDefault();
    const cart = getCart();
    if (cart.length === 0) {
        showNotification('Корзина пуста. Добавьте товары для заказа.');
        return;
    }

    const name = document.getElementById('custName')?.value.trim();
    const phone = document.getElementById('custPhone')?.value.trim();
    const address = document.getElementById('custAddress')?.value.trim();
    const deliveryTime = document.getElementById('deliveryTime')?.value.trim() || '';
    const comment = document.getElementById('custComment')?.value.trim() || '';

    if (!name || !phone || !address) {
        showNotification('Пожалуйста, заполните имя, телефон и адрес доставки.');
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += (item.price * (item.quantity || 1));
    });

    const order = {
        id: generateOrderId(),
        date: new Date().toLocaleString(),
        customer: { name, phone, address, deliveryTime, comment },
        items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1,
            img: item.img
        })),
        total: total,
        status: 'Принят'
    };

    saveOrder(order);
    clearCart();
    showNotification('Заказ #' + order.id + ' оформлен! Сумма: ' + total.toLocaleString() + ' ₽');
    // Перенаправление на страницу заказов
    setTimeout(() => {
        window.location.href = 'orders.html';
    }, 2000);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    const form = document.getElementById('order-form');
    if (form) {
        form.addEventListener('submit', submitOrder);
    }
});