let todosProdutos = [];
let produtosFiltrados = [];
let categoriaAtual = 'All';
let precoMinimo = '';
let precoMaximo = '';
let opcaoOrdenacao = 'relevance';

async function carregarProdutos() {
    const elementoCarregando = document.getElementById('loading');
    const elementoErro = document.getElementById('error');
    const elementoProdutos = document.getElementById('products-container');

    elementoCarregando.style.display = 'block';
    elementoErro.style.display = 'none';
    elementoProdutos.style.display = 'none';

    try {
        todosProdutos = await buscarProdutos();
        
        if (!Array.isArray(todosProdutos)) {
            todosProdutos = [];
        }
        
        filtrarPorCategoria();
        aplicarFiltros();
        atualizarExibicao();

    } catch (erro) {
        elementoCarregando.style.display = 'none';
        elementoProdutos.style.display = 'none';
        elementoErro.style.display = 'block';
        
        let mensagemErro = 'Erro ao carregar produtos. Verifique se a API está online.';
        
        if (erro.message.includes('Failed to fetch')) {
            mensagemErro = 'Não foi possível conectar à API. Verifique se o servidor está rodando.';
        }
        
        document.getElementById('error-message').textContent = mensagemErro;
        console.error('Erro ao carregar produtos:', erro);
    }
}

function filtrarPorCategoria() {
    const parametrosURL = new URLSearchParams(window.location.search);
    const categoria = parametrosURL.get('category') || 'All';
    categoriaAtual = categoria;
    
    const mapaCategorias = {
        'Men': 'Masculino',
        'Women': 'Feminino',
        'Accessories': 'Acessórios',
        'All': 'Todos os Produtos'
    };
    
    document.getElementById('category-title').textContent = mapaCategorias[categoria] || categoria;
}

function aplicarFiltros() {
    produtosFiltrados = [...todosProdutos];

    if (categoriaAtual !== 'All') {
        produtosFiltrados = produtosFiltrados.filter(produto => {
            const categoria = produto.categoria_nome || produto.categoria_id || '';
            const categoriaLower = categoria.toString().toLowerCase();
            
            const mapeamentoCategorias = {
                'Men': ['masculino', 'men', 'homem'],
                'Women': ['feminino', 'women', 'mulher'],
                'Accessories': ['acessório', 'accessories', 'acessorios']
            };
            
            const termosBusca = mapeamentoCategorias[categoriaAtual] || [categoriaAtual.toLowerCase()];
            return termosBusca.some(termo => categoriaLower.includes(termo));
        });
    }

    if (precoMinimo) {
        produtosFiltrados = produtosFiltrados.filter(p => parseFloat(p.preco) >= parseFloat(precoMinimo));
    }
    
    if (precoMaximo) {
        produtosFiltrados = produtosFiltrados.filter(p => parseFloat(p.preco) <= parseFloat(precoMaximo));
    }

    ordenarProdutos();
    
    const elementoContador = document.getElementById('products-count');
    if (elementoContador) {
        elementoContador.textContent = `${produtosFiltrados.length} produto(s) encontrado(s)`;
    }
}

function ordenarProdutos() {
    switch (opcaoOrdenacao) {
        case 'price-asc':
            produtosFiltrados.sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco));
            break;
        case 'price-desc':
            produtosFiltrados.sort((a, b) => parseFloat(b.preco) - parseFloat(a.preco));
            break;
        case 'name-asc':
            produtosFiltrados.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
            break;
        case 'name-desc':
            produtosFiltrados.sort((a, b) => (b.nome || '').localeCompare(a.nome || ''));
            break;
        case 'relevance':
        default:
            break;
    }
}

function exibirProdutosFiltrados() {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = '';

    if (!produtosFiltrados || produtosFiltrados.length === 0) {
        if (todosProdutos.length === 0) {
            container.innerHTML = '<p class="no-products">Nenhum produto no banco de dados. O catálogo está vazio.</p>';
        } else {
            container.innerHTML = '<p class="no-products">Nenhum produto encontrado com os filtros selecionados.</p>';
        }
        return;
    }

    exibirProdutos(produtosFiltrados, 'products-container', false);
}

function atualizarExibicao() {
    const elementoCarregando = document.getElementById('loading');
    const elementoErro = document.getElementById('error');
    const elementoProdutos = document.getElementById('products-container');
    
    elementoCarregando.style.display = 'none';
    elementoErro.style.display = 'none';
    elementoProdutos.style.display = 'grid';
    
    exibirProdutosFiltrados();
}

document.addEventListener('DOMContentLoaded', function() {
    filtrarPorCategoria();

    document.getElementById('price-min').addEventListener('input', (e) => {
        precoMinimo = e.target.value;
        aplicarFiltros();
        atualizarExibicao();
    });

    document.getElementById('price-max').addEventListener('input', (e) => {
        precoMaximo = e.target.value;
        aplicarFiltros();
        atualizarExibicao();
    });

    document.getElementById('sort-select').addEventListener('change', (e) => {
        opcaoOrdenacao = e.target.value;
        aplicarFiltros();
        atualizarExibicao();
    });

    document.getElementById('clear-filters-btn').addEventListener('click', () => {
        document.getElementById('price-min').value = '';
        document.getElementById('price-max').value = '';
        precoMinimo = '';
        precoMaximo = '';
        aplicarFiltros();
        atualizarExibicao();
    });

    carregarProdutos();
});
