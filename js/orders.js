// orders.js - мои заказы

const STORAGE_ORDERS = 'orders';

function getOrders() {
    return JSON.parse(localStorage.getItem(STORAGE_ORDERS)) || [];
}

function renderOrders() {
    const container = document.getElementById('orders-list');
    if (!container) return;

    const orders = getOrders();

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-orders">
                <i class="fas fa-box-open"></i>
                <p>У вас пока нет заказов.</p>
                <a href="catalog.html" class="btn">Перейти в каталог</a>
            </div>
        `;
        return;
    }

    let html = '';
    orders.forEach(order => {
        const itemsHtml = order.items.map(item => `
            <li>
                <span>${escapeHtml(item.name)} x ${item.quantity}</span>
                <span>${(item.price * item.quantity).toLocaleString()} ₽</span>
            </li>
        `).join('');

        html += `
            <div class="order-card">
                <div class="order-card__header">
                    <span class="order-id">Заказ #${order.id}</span>
                    <span class="order-date">${order.date}</span>
                    <span class="order-status">${order.status}</span>
                </div>
                <div class="order-details">
                    <div class="order-items">
                        <p>Состав заказа:</p>
                        <ul>${itemsHtml}</ul>
                    </div>
                    <div class="order-customer">
                        <p><strong>${escapeHtml(order.customer.name)}</strong></p>
                        <p>${escapeHtml(order.customer.phone)}</p>
                        <p>${escapeHtml(order.customer.address)}</p>
                        ${order.customer.deliveryTime ? `<p>Доставка: ${escapeHtml(order.customer.deliveryTime)}</p>` : ''}
                        ${order.customer.comment ? `<p>Комментарий: ${escapeHtml(order.customer.comment)}</p>` : ''}
                    </div>
                </div>
                <div class="order-total">
                    Итого: ${order.total.toLocaleString()} ₽
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
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
    renderOrders();
});