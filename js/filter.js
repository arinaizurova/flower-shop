// filter.js - для главной - фильтрация бестселлеров по эмоциям

(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const products = window.products || [];
        if (products.length === 0) {
            console.warn('Нет данных products. Проверьте data.js');
            return;
        }

        const cards = document.querySelectorAll('.categories__card');
        const grid = document.getElementById('productsGrid');
        const section = document.getElementById('productsSection');

        function renderProducts(emotionKey) {
            if (!grid) return;
            
            // Фильтруем товары по полю emotion
            const filtered = products.filter(p => p.emotion === emotionKey);
            
            if (filtered.length === 0) {
                grid.innerHTML = `<div class="no-products" style="grid-column:1/-1; text-align:center; padding:40px;">В этой категории пока нет товаров</div>`;
                return;
            }
            
            let html = '';
            filtered.forEach((p, idx) => {
                const originalIndex = products.findIndex(prod => prod.name === p.name);
                html += `
                    <article class="product-card">
                        <a href="product.html?id=${originalIndex}" class="product-card__link">
                            <div class="product-card__img-wrapper">
                                <img src="${p.img}" alt="${p.name}" class="product-card__img" onerror="this.src='../img/placeholder.jpg'">
                            </div>
                            <h3 class="product-card__title">${p.name}</h3>
                        </a>
                        <p class="product-card__price">${p.price.toLocaleString()} ₽</p>
                        <button class="product-card__btn" data-name="${p.name}" data-price="${p.price}" data-img="${p.img}">В корзину</button>
                    </article>
                `;
            });
            grid.innerHTML = html;
            
            document.querySelectorAll('.product-card__btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const name = btn.getAttribute('data-name');
                    const price = parseInt(btn.getAttribute('data-price'));
                    const img = btn.getAttribute('data-img');
                    addToCart(name, price, img);
                });
            });
        }
        
        // Функция добавления в корзину с уведомлением
        function addToCart(name, price, img) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existing = cart.find(item => item.name === name);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ name, price, img, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            
            if (typeof showNotification === 'function') {
                showNotification(`Букет "${name}" добавлен в корзину`, true);
            } else {
                alert(`Букет "${name}" добавлен в корзину!`);
            }
        }

        function scrollToProducts() {
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Активация категории и фильтрация
        function setActiveCard(activeCard) {
            cards.forEach(c => c.classList.remove('categories__card_active'));
            activeCard.classList.add('categories__card_active');
            const emotion = activeCard.getAttribute('data-category');
            renderProducts(emotion);
            scrollToProducts();
        }

        cards.forEach(card => {
            card.addEventListener('click', () => setActiveCard(card));
        });

        const defaultActive = document.querySelector('.categories__card_active');
        if (defaultActive) {
            renderProducts(defaultActive.getAttribute('data-category'));
        } else if (cards.length) {
            cards[0].classList.add('categories__card_active');
            renderProducts(cards[0].getAttribute('data-category'));
        }
    });
})();