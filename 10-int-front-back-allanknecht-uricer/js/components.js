function renderHeader() {
    const headerHTML = `
        <header class="header">
            <div class="header-container">
                <a href="index.html" class="logo">The Best Store</a>
                <nav class="nav-menu">
                    <a href="products.html" class="nav-link">Todos os Produtos</a>
                    <a href="products.html?category=Men" class="nav-link">Masculino</a>
                    <a href="products.html?category=Women" class="nav-link">Feminino</a>
                    <a href="products.html?category=Accessories" class="nav-link">Acessórios</a>
                </nav>
                <div class="header-actions">
                    <a href="login.html" id="login-link" class="login-link">Entrar</a>
                    <a href="cart.html" class="cart-icon">🛒</a>
                </div>
            </div>
        </header>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

function renderFooter() {
    const footerHTML = `
        <footer class="footer">
            <div class="footer-content">
                <p>&copy; 2024 The Best Store. Todos os direitos reservados.</p>
            </div>
        </footer>
    `;
    
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

function atualizarLinkLogin() {
    const linkLogin = document.getElementById('login-link');
    if (!linkLogin) return;

    const token = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');
    
    if (token && userEmail) {
        linkLogin.textContent = `Sair (${userEmail})`;
        linkLogin.href = '#';
        linkLogin.onclick = function(e) {
            e.preventDefault();
            fazerLogout();
        };
    } else {
        linkLogin.textContent = 'Entrar';
        linkLogin.href = 'login.html';
        linkLogin.onclick = null;
    }
}

function fazerLogout() {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        const chaveCarrinho = `shoppingCart_${userEmail}`;
        localStorage.removeItem(chaveCarrinho);
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}
