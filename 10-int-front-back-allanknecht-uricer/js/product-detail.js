let produtoAtual = null;
let tamanhoSelecionado = '';
let corSelecionada = '';
let quantidade = 1;
let estaCarregando = false;

function obterIdProduto() {
    const parametrosURL = new URLSearchParams(window.location.search);
    return parametrosURL.get('id');
}

async function carregarProduto() {
    if (estaCarregando) return;
    
    const idProduto = obterIdProduto();
    
    if (!idProduto) {
        mostrarErro('ID do produto não fornecido na URL.');
        return;
    }

    estaCarregando = true;
    const elementoCarregando = document.getElementById('loading');
    const elementoErro = document.getElementById('error');
    const elementoDetalhes = document.getElementById('product-detail');

    if (elementoCarregando) elementoCarregando.style.display = 'block';
    if (elementoErro) elementoErro.style.display = 'none';
    if (elementoDetalhes) elementoDetalhes.style.display = 'none';

    try {
        produtoAtual = await buscarProdutoPorId(idProduto);
        exibirProduto(produtoAtual);

        if (elementoCarregando) elementoCarregando.style.display = 'none';
        if (elementoErro) elementoErro.style.display = 'none';
        if (elementoDetalhes) elementoDetalhes.style.display = 'block';

    } catch (erro) {
        if (elementoCarregando) elementoCarregando.style.display = 'none';
        if (elementoDetalhes) elementoDetalhes.style.display = 'none';
        if (elementoErro) elementoErro.style.display = 'block';
        
        let mensagemErro = 'Erro ao carregar produto. Verifique se a API está online.';
        
        if (erro.message.includes('Failed to fetch')) {
            mensagemErro = 'Não foi possível conectar à API. Verifique se o servidor está rodando.';
        } else if (erro.message.includes('não encontrado') || erro.message.includes('404')) {
            mensagemErro = 'Produto não encontrado. O produto pode ter sido removido ou o banco de dados foi resetado.';
            
            const botaoRetry = document.getElementById('retry-button');
            if (botaoRetry) {
                botaoRetry.textContent = 'Voltar para Produtos';
                botaoRetry.onclick = function() {
                    window.location.href = 'products.html';
                };
            }
        }
        
        const mensagemErroElemento = document.getElementById('error-message');
        if (mensagemErroElemento) mensagemErroElemento.textContent = mensagemErro;
        console.error('Erro ao carregar produto:', erro);
    } finally {
        estaCarregando = false;
    }
}

function exibirProduto(produto) {
    produtoAtual = produto;

    const imagem = produto.imagem || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop';
    const imagemPadrao = `https://via.placeholder.com/600x600/E8E8E8/666666?text=${encodeURIComponent(produto.nome?.substring(0, 20) || 'Produto')}`;
    const elementoImagem = document.getElementById('product-image');
    if (elementoImagem) {
        elementoImagem.src = imagem;
        elementoImagem.onerror = function() {
            this.onerror = null;
            this.src = imagemPadrao;
        };
    }

    const elementoNome = document.getElementById('product-name');
    if (elementoNome) elementoNome.textContent = produto.nome || 'Produto sem nome';

    const preco = parseFloat(produto.preco || 0).toFixed(2).replace('.', ',');
    const elementoPreco = document.getElementById('product-price');
    if (elementoPreco) elementoPreco.textContent = `R$ ${preco}`;

    const descricao = produto.descricao || 'Descrição não disponível.';
    const elementoDescricao = document.getElementById('product-description');
    if (elementoDescricao) elementoDescricao.textContent = descricao;

    if (produto.tamanho) {
        const selectTamanho = document.getElementById('size-select');
        if (selectTamanho) {
            selectTamanho.value = produto.tamanho;
            tamanhoSelecionado = produto.tamanho;
        }
    }
}

async function adicionarAoCarrinho() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        mostrarMensagem('Por favor, faça login para adicionar produtos à sacola.', false);
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    if (!produtoAtual) {
        mostrarMensagem('Erro: produto não carregado.', false);
        return;
    }

    const tamanho = document.getElementById('size-select')?.value || '';
    const cor = document.getElementById('color-select')?.value || '';
    const quantidadeInput = document.getElementById('quantity-input');
    const quantidade = parseInt(quantidadeInput?.value) || 1;

    if (!tamanho) {
        mostrarMensagem('Por favor, selecione um tamanho.', false);
        return;
    }

    if (!cor) {
        mostrarMensagem('Por favor, selecione uma cor.', false);
        return;
    }

    if (quantidade < 1) {
        mostrarMensagem('Quantidade inválida.', false);
        return;
    }

    try {
        const item = {
            productId: produtoAtual.id,
            name: produtoAtual.nome,
            price: parseFloat(produtoAtual.preco),
            qty: quantidade,
            image: produtoAtual.imagem || ''
        };

        await adicionarItemSacola(item);
        mostrarMensagem('Produto adicionado à sacola com sucesso!', true);

        setTimeout(() => {
            const elementoMensagem = document.getElementById('success-message');
            if (elementoMensagem) elementoMensagem.style.display = 'none';
        }, 3000);
    } catch (erro) {
        console.error('Erro ao adicionar produto à sacola:', erro);
        
        let mensagemErro = 'Erro ao adicionar produto à sacola.';
        if (erro.message.includes('autenticado') || erro.message.includes('Token')) {
            mensagemErro = 'Sessão expirada. Faça login novamente.';
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else if (erro.message) {
            mensagemErro = erro.message;
        }
        
        mostrarMensagem(mensagemErro, false);
    }
}

function mostrarMensagem(mensagem, sucesso) {
    const elementoMensagem = document.getElementById('success-message');
    if (!elementoMensagem) return;
    
    elementoMensagem.textContent = mensagem;
    elementoMensagem.style.display = 'block';
    
    if (sucesso) {
        elementoMensagem.className = 'success-message';
        elementoMensagem.style.backgroundColor = '#d4edda';
        elementoMensagem.style.color = '#155724';
        elementoMensagem.style.borderColor = '#c3e6cb';
    } else {
        elementoMensagem.className = 'success-message';
        elementoMensagem.style.backgroundColor = '#f8d7da';
        elementoMensagem.style.color = '#721c24';
        elementoMensagem.style.borderColor = '#f5c6cb';
    }
}

function mostrarErro(mensagem) {
    const elementoErro = document.getElementById('error');
    const mensagemErro = document.getElementById('error-message');
    if (!elementoErro || !mensagemErro) return;
    
    mensagemErro.textContent = mensagem;
    elementoErro.style.display = 'block';
}

function tentarNovamente() {
    carregarProduto();
}

document.addEventListener('DOMContentLoaded', function() {
    carregarProduto();

    const botaoDiminuir = document.getElementById('decrease-qty');
    const botaoAumentar = document.getElementById('increase-qty');
    const inputQuantidade = document.getElementById('quantity-input');

    if (botaoDiminuir && inputQuantidade) {
        botaoDiminuir.addEventListener('click', () => {
            const valorAtual = parseInt(inputQuantidade.value) || 1;
            if (valorAtual > 1) {
                inputQuantidade.value = valorAtual - 1;
                quantidade = valorAtual - 1;
            }
        });
    }

    if (botaoAumentar && inputQuantidade) {
        botaoAumentar.addEventListener('click', () => {
            const valorAtual = parseInt(inputQuantidade.value) || 1;
            const maximo = parseInt(inputQuantidade.max) || 99;
            if (valorAtual < maximo) {
                inputQuantidade.value = valorAtual + 1;
                quantidade = valorAtual + 1;
            }
        });
    }

    if (inputQuantidade) {
        inputQuantidade.addEventListener('change', (e) => {
            const valor = parseInt(e.target.value) || 1;
            const maximo = parseInt(e.target.max) || 99;
            const minimo = parseInt(e.target.min) || 1;
            
            if (valor < minimo) {
                e.target.value = minimo;
                quantidade = minimo;
            } else if (valor > maximo) {
                e.target.value = maximo;
                quantidade = maximo;
            } else {
                quantidade = valor;
            }
        });
    }

    const selectTamanho = document.getElementById('size-select');
    if (selectTamanho) {
        selectTamanho.addEventListener('change', (e) => {
            tamanhoSelecionado = e.target.value;
        });
    }

    const selectCor = document.getElementById('color-select');
    if (selectCor) {
        selectCor.addEventListener('change', (e) => {
            corSelecionada = e.target.value;
        });
    }

    const botaoAdicionar = document.getElementById('add-to-cart-btn');
    if (botaoAdicionar) {
        botaoAdicionar.addEventListener('click', adicionarAoCarrinho);
    }
});
