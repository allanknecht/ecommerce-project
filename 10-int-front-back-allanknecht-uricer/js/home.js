async function carregarProdutosDestaque() {
    const elementoCarregando = document.getElementById('featured-loading');
    const elementoErro = document.getElementById('featured-error');
    const elementoProdutos = document.getElementById('featured-products');

    elementoCarregando.style.display = 'block';
    elementoErro.style.display = 'none';
    elementoProdutos.style.display = 'none';

    try {
        const produtos = await buscarProdutos();
        const produtosDestaque = produtos.slice(0, 4);
        
        exibirProdutos(produtosDestaque, 'featured-products', true);
        
        elementoCarregando.style.display = 'none';
        elementoErro.style.display = 'none';
        elementoProdutos.style.display = 'grid';

    } catch (erro) {
        elementoCarregando.style.display = 'none';
        elementoProdutos.style.display = 'none';
        elementoErro.style.display = 'block';
        console.error('Erro ao carregar produtos:', erro);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    carregarProdutosDestaque();
});
