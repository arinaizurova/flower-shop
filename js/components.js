// component.js - для всего сайта

// header - шапка для всего сайта
const headerHTML = `
    <div class="header__wrapper">
        <nav class="header__nav container">
            <button class="header__burger" id="burgerBtn" aria-label="Меню">
                <span></span><span></span><span></span>
            </button>
            <ul class="header__menu" id="headerMenu">
                <li><a href="index.html">Главная</a></li>
                <li><a href="catalog.html">Каталог</a></li>
                <li><a href="orders.html">Мои заказы</a></li>
                <li><a href="about.html">О нас</a></li>
            </ul>
            <a href="index.html" class="header__logo">La Vie en Fleurs</a>
            <div class="header__icons">
                <div class="header__search-wrapper">
                    <input type="text" id="headerSearchInput" class="header__search-input" placeholder="Поиск...">
                    <div id="headerSearchSuggestions" class="header__search-suggestions"></div>
                    <button class="header__search-btn" aria-label="Поиск">
                        <img src="../img/search heart.png" alt="Поиск">
                    </button>
                </div>
                <a href="cart.html" class="header__cart-icon" aria-label="Корзина">
                    <img src="../img/shopping cart heart.png" alt="Корзина">
                </a>
            </div>
        </nav>
    </div>
`;

// footer - подвал для всего сайта
const footerHTML = `
    <div class="footer__follow container">
        <h2>Жизнь в цветах</h2>
        <div class="footer__insta-grid">
            <img src="../img/f3.jpg" alt="Инстаграм 1">
            <img src="../img/f4.jpg" alt="Инстаграм 2">
            <img src="../img/f6.jpg" alt="Инстаграм 3">
            <img src="../img/f7.jpg" alt="Инстаграм 4">
            <img src="../img/f9.jpg" alt="Инстаграм 5">
        </div>
    </div>
    <div class="footer__main">
        <div class="footer__grid container">
            <div class="footer__col">
                <h4>Контакты</h4>
                <div class="footer_icons">
                    <img src="../img/land location.png" alt="Адрес">
                    <span>ул. Цветочная, 14, Москва</span>
                </div>
                <div class="footer_icons">
                    <img src="../img/email heart.png" alt="Email">
                    <span>hello@lavieenleurs.ru</span>
                </div>
                <div class="footer_icons">
                    <img src="../img/phone call.png" alt="Телефон">
                    <span>+7 (999) 123-45-67</span>
                </div>
            </div>
            <div class="footer__col">
                <h4>Меню</h4>
                <ul>
                    <li><a href="index.html">Главная</a></li>
                    <li><a href="catalog.html">Каталог</a></li>
                    <li><a href="orders.html">Мои заказы</a></li>
                    <li><a href="about.html">О нас</a></li>
                </ul>
            </div>
            <div class="footer__col">
                <h4>Рассылка</h4>
                <p>Подпишитесь на наши новости</p>
                <form class="footer__subscribe" id="subscribeForm">
                    <input type="email" placeholder="Email" required>
                    <button type="submit">ОК</button>
                </form>
            </div>
        </div>
        <div class="footer__bottom container">
            <p>&copy; 2025, La Vie en Fleurs. Все права защищены.</p>
        </div>
    </div>
`;

document.addEventListener("DOMContentLoaded", () => {
    const headerElement = document.querySelector('header');
    const footerElement = document.querySelector('footer');

    if (headerElement) headerElement.innerHTML = headerHTML;
    if (footerElement) footerElement.innerHTML = footerHTML;

    // Бургер-меню
    const burger = document.getElementById('burgerBtn');
    const menu = document.getElementById('headerMenu');
    if (burger && menu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            menu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                menu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Поиск
    const searchInput = document.getElementById('headerSearchInput');
    let suggestionsBox = document.getElementById('headerSearchSuggestions');

    if (searchInput && typeof products !== 'undefined') {
        searchInput.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase().trim();
            if (value.length < 2) {
                if (suggestionsBox) suggestionsBox.style.display = 'none';
                return;
            }
            const matches = products.filter(p => 
                p.name.toLowerCase().includes(value) || 
                (p.category && p.category.toLowerCase().includes(value))
            );
            if (matches.length > 0 && suggestionsBox) {
                suggestionsBox.style.display = 'block';
                suggestionsBox.innerHTML = matches.map(p => {
                    const productId = products.findIndex(item => item.name === p.name);
                    return `
                        <a href="product.html?id=${productId}" class="search-suggestion-item">
                            <img src="${p.img}" alt="${p.name}" class="search-suggestion-img">
                            <div>
                                <div class="search-suggestion-name">${p.name}</div>
                                <div class="search-suggestion-price">${p.price} ₽</div>
                            </div>
                        </a>
                    `;
                }).join('');
            } else {
                if (suggestionsBox) suggestionsBox.style.display = 'none';
            }
        });

        document.addEventListener('click', (e) => {
            if (suggestionsBox && !searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
                suggestionsBox.style.display = 'none';
            }
        });
    }

    // Форма подписки
    const subscribeForm = document.getElementById('subscribeForm');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = subscribeForm.querySelector('input').value;
            if (typeof showNotification === 'function') {
                showNotification(`Спасибо за подписку, ${email}!`);
            } else {
                alert(`Спасибо за подписку, ${email}!`);
            }
            subscribeForm.reset();
        });
    }
});