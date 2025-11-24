const API_BASE_URL = 'http://localhost:5732/api/v1';

async function buscarProdutos() {
    try {
        const resposta = await fetch(`${API_BASE_URL}/produtos`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();
        const produtos = dados.data || dados;
        return Array.isArray(produtos) ? produtos : [];
    } catch (erro) {
        console.error('Erro ao buscar produtos:', erro);
        throw erro;
    }
}

async function buscarProdutoPorId(idProduto) {
    try {
        const url = `${API_BASE_URL}/produtos/${encodeURIComponent(idProduto)}`;
        const resposta = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!resposta.ok) {
            if (resposta.status === 404) {
                throw new Error('Produto não encontrado');
            }
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        return await resposta.json();
    } catch (erro) {
        console.error('Erro ao buscar produto:', erro);
        throw erro;
    }
}

function criarCardProduto(produto, isLink = false) {
    const preco = parseFloat(produto.preco || 0).toFixed(2).replace('.', ',');
    const imagem = produto.imagem || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop';
    const imagemPadrao = `https://via.placeholder.com/400x400/E8E8E8/666666?text=${encodeURIComponent(produto.nome?.substring(0, 15) || 'Produto')}`;

    const card = isLink ? document.createElement('a') : document.createElement('div');
    card.className = 'product-card';
    
    if (isLink) {
        card.href = `product-detail.html?id=${encodeURIComponent(produto.id)}`;
    }

    card.innerHTML = `
        <div class="product-image">
            <img src="${imagem}" alt="${produto.nome}" onerror="this.onerror=null; this.src='${imagemPadrao}'">
        </div>
        <div class="product-name">${produto.nome || 'Produto sem nome'}</div>
        <div class="product-price">R$ ${preco}</div>
    `;

    if (!isLink) {
        card.addEventListener('click', () => {
            window.location.href = `product-detail.html?id=${encodeURIComponent(produto.id)}`;
        });
    }

    return card;
}

function exibirProdutos(produtos, containerId, isLink = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (!produtos || produtos.length === 0) {
        container.innerHTML = '<p class="no-products">Nenhum produto encontrado.</p>';
        return;
    }

    produtos.forEach(produto => {
        const card = criarCardProduto(produto, isLink);
        container.appendChild(card);
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_BASE_URL,
        buscarProdutos,
        buscarProdutoPorId,
        criarCardProduto,
        exibirProdutos
    };
}
