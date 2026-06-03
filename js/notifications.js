// notifications.js - всплывающие уведомления

function showNotification(message, showCartButton = false, productName = '') {
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    const notification = document.createElement('div');
    notification.className = 'notification';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'notification-content';

    const messageSpan = document.createElement('span');
    messageSpan.className = 'notification-message';
    messageSpan.textContent = message;
    contentDiv.appendChild(messageSpan);

    if (showCartButton) {
        const cartLink = document.createElement('a');
        cartLink.href = 'cart.html';
        cartLink.className = 'notification-cart-link';
        cartLink.textContent = 'Перейти в корзину';
        contentDiv.appendChild(cartLink);
    }

    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    };

    notification.appendChild(contentDiv);
    notification.appendChild(closeBtn);
    container.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}