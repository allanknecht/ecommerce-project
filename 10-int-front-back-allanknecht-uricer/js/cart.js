let itensCarrinho = [];
let frete = 0;
let regiao = '';
let cupomAplicado = null;
let desconto = 0;
let subtotal = 0;
let total = 0;

async function atualizarQuantidade(idProduto, novaQuantidade) {
    if (novaQuantidade < 1) return;

    try {
        await atualizarQuantidadeItem(idProduto, novaQuantidade);
        await carregarSacolaDaAPI();
    } catch (erro) {
        console.error('Erro ao atualizar quantidade:', erro);
        alert(erro.message || 'Erro ao atualizar quantidade do item.');
    }
}

async function removerItem(idProduto) {
    try {
        await removerItemSacola(idProduto);
        await carregarSacolaDaAPI();
    } catch (erro) {
        if (erro.message && erro.message.includes('não encontrado')) {
            await carregarSacolaDaAPI();
            return;
        }
        console.error('Erro ao remover item:', erro);
        alert(erro.message || 'Erro ao remover item da sacola.');
    }
}

function calcularSubtotal() {
    return subtotal || itensCarrinho.reduce((total, item) => {
        return total + (item.price * item.qty);
    }, 0);
}

function calcularTotal() {
    return total || (calcularSubtotal() - desconto + frete);
}

function obterChaveCarrinho() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return null;
    return `shoppingCart_${userEmail}`;
}

function salvarNoArmazenamento() {
    try {
        const chaveCarrinho = obterChaveCarrinho();
        if (!chaveCarrinho) return;
        
        const dadosCarrinho = {
            savedPostalCode: document.getElementById('postal-code')?.value || '',
            savedAddress: document.getElementById('region-name')?.textContent || '-'
        };
        localStorage.setItem(chaveCarrinho, JSON.stringify(dadosCarrinho));
    } catch (erro) {
        console.error('Erro ao salvar no localStorage:', erro);
    }
}

async function carregarSacolaDaAPI() {
    try {
        const dadosSacola = await buscarSacola();
        
        itensCarrinho = dadosSacola.items.map(item => ({
            id: item.productId,
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.qty,
            qty: item.qty,
            image: item.image || ''
        }));
        
        subtotal = dadosSacola.subtotal || 0;
        desconto = dadosSacola.discount || 0;
        
        if (dadosSacola.freight !== undefined) {
            const inputCEP = document.getElementById('postal-code');
            if (!inputCEP || !inputCEP.value || inputCEP.value.replace(/\D/g, '').length !== 8) {
                frete = dadosSacola.freight || 0;
            }
        }
        
        total = dadosSacola.total || calcularTotal();
        atualizarExibicao();
    } catch (erro) {
        console.error('Erro ao carregar sacola da API:', erro);
        itensCarrinho = [];
        subtotal = 0;
        desconto = 0;
        total = 0;
        atualizarExibicao();
        
        if (erro.message.includes('autenticado') || erro.message.includes('Token')) {
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = 'login.html';
        }
    }
}

function carregarDoArmazenamento() {
    try {
        const chaveCarrinho = obterChaveCarrinho();
        if (!chaveCarrinho) return;
        
        const carrinhoSalvo = localStorage.getItem(chaveCarrinho);
        if (carrinhoSalvo) {
            const dadosCarrinho = JSON.parse(carrinhoSalvo);
            
            if (dadosCarrinho.savedPostalCode) {
                const inputCEP = document.getElementById('postal-code');
                if (inputCEP) inputCEP.value = dadosCarrinho.savedPostalCode;
            }
            if (dadosCarrinho.savedAddress) {
                const nomeRegiao = document.getElementById('region-name');
                if (nomeRegiao) nomeRegiao.textContent = dadosCarrinho.savedAddress;
            }
        }
    } catch (erro) {
        console.error('Erro ao carregar do localStorage:', erro);
    }
}

function atualizarExibicao() {
    exibirItens();
    atualizarTotais();
}

function exibirItens() {
    const tbody = document.getElementById('items-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (itensCarrinho.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Carrinho vazio</td></tr>';
        return;
    }

    itensCarrinho.forEach(item => {
        const linha = document.createElement('tr');
        const qty = item.qty || item.quantity;
        const itemSubtotal = item.price * qty;
        const productId = item.productId || item.id;
        
        linha.innerHTML = `
            <td>${item.name}</td>
            <td>R$ ${item.price.toFixed(2).replace('.', ',')}</td>
            <td>
                <input type="number" 
                       class="quantity-input" 
                       value="${qty}" 
                       min="1" 
                       data-product-id="${productId}">
            </td>
            <td>R$ ${itemSubtotal.toFixed(2).replace('.', ',')}</td>
            <td>
                <button class="remove-btn" data-product-id="${productId}">
                    Remover
                </button>
            </td>
        `;
        
        tbody.appendChild(linha);
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', async (e) => {
            const idProduto = e.target.dataset.productId;
            const novaQuantidade = parseInt(e.target.value) || 1;
            await atualizarQuantidade(idProduto, novaQuantidade);
        });
    });

    document.querySelectorAll('.remove-btn').forEach(botao => {
        botao.addEventListener('click', async (e) => {
            e.preventDefault();
            const idProduto = e.currentTarget.dataset.productId || e.target.closest('.remove-btn')?.dataset.productId;
            if (idProduto) {
                await removerItem(idProduto);
            }
        });
    });
}

function atualizarTotais() {
    const subtotal = calcularSubtotal();
    const total = calcularTotal();

    const elementoSubtotal = document.getElementById('subtotal-products');
    const elementoFrete = document.getElementById('freight-amount');
    const elementoFreteTotal = document.getElementById('total-freight');
    const elementoTotal = document.getElementById('final-total');

    if (elementoSubtotal) elementoSubtotal.textContent = subtotal.toFixed(2).replace('.', ',');
    if (elementoFrete) elementoFrete.textContent = frete.toFixed(2).replace('.', ',');
    if (elementoFreteTotal) elementoFreteTotal.textContent = frete.toFixed(2).replace('.', ',');
    if (elementoTotal) elementoTotal.textContent = total.toFixed(2).replace('.', ',');

    const linhaDesconto = document.getElementById('discount-line');
    if (linhaDesconto) {
        if (desconto > 0) {
            const elementoDesconto = document.getElementById('discount-amount');
            if (elementoDesconto) elementoDesconto.textContent = desconto.toFixed(2).replace('.', ',');
            linhaDesconto.style.display = 'flex';
        } else {
            linhaDesconto.style.display = 'none';
        }
    }
}

function mostrarStatusCupom(mensagem, sucesso) {
    const elementoStatus = document.getElementById('coupon-status');
    if (!elementoStatus) return;
    
    elementoStatus.textContent = mensagem;
    elementoStatus.style.display = 'block';
    
    if (sucesso) {
        elementoStatus.className = 'coupon-success';
    } else {
        elementoStatus.className = 'coupon-error';
    }
}

const regioes = {
    'NORTE': 39.90,
    'NORDESTE': 29.90,
    'CENTRO-OESTE': 19.90,
    'SUDESTE': 15.90,
    'SUL': 25.90
};

function calcularFretePorCEP(cep) {
    const primeiroDigito = cep.charAt(0);
    
    switch (primeiroDigito) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
            return { region: 'SUDESTE', freight: regioes.SUDESTE };
        case '5':
        case '9':
            return { region: 'SUL', freight: regioes.SUL };
        case '6':
        case '7':
            return { region: 'NORDESTE', freight: regioes.NORDESTE };
        case '8':
            return { region: 'NORTE', freight: regioes.NORTE };
        default:
            return { region: 'CENTRO-OESTE', freight: regioes['CENTRO-OESTE'] };
    }
}

async function buscarEnderecoPorCEP(cep) {
    try {
        const cepLimpo = cep.replace(/\D/g, '');

        if (cepLimpo.length !== 8) {
            throw new Error('CEP inválido. Deve conter 8 dígitos.');
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const resposta = await fetch(`https://brasilapi.com.br/api/cep/v2/${cepLimpo}`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!resposta.ok) {
            if (resposta.status === 404) {
                throw new Error('CEP não encontrado.');
            }
            throw new Error('Erro ao consultar CEP.');
        }

        const dados = await resposta.json();

        return {
            postalCode: cepLimpo,
            street: dados.street || '',
            neighborhood: dados.neighborhood || '',
            city: dados.city || '',
            state: dados.state || ''
        };
    } catch (erro) {
        if (erro.name === 'AbortError') {
            throw new Error('Tempo de espera excedido. Tente novamente.');
        }
        console.error('Erro ao buscar endereço:', erro);
        throw erro;
    }
}

function mostrarStatusEndereco(mensagem, sucesso) {
    let elementoStatus = document.getElementById('address-status');
    
    if (!elementoStatus) {
        elementoStatus = document.createElement('div');
        elementoStatus.id = 'address-status';
        const conteudoFrete = document.querySelector('.freight-content');
        if (conteudoFrete) conteudoFrete.appendChild(elementoStatus);
    }
    
    elementoStatus.textContent = mensagem;
    elementoStatus.style.display = 'block';
    
    if (sucesso) {
        elementoStatus.className = 'address-success';
    } else {
        elementoStatus.className = 'address-error';
    }
}

function esconderStatusEndereco() {
    const elementoStatus = document.getElementById('address-status');
    if (elementoStatus) {
        elementoStatus.style.display = 'none';
    }
}

function verificarLogin() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Por favor, faça login para acessar a sacola de compras.');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    if (!verificarLogin()) return;

    carregarDoArmazenamento();
    carregarSacolaDaAPI();

    const inputCEP = document.getElementById('postal-code');
    const botaoBuscarEndereco = document.getElementById('use-location-btn');
    const botaoAplicarCupom = document.getElementById('apply-coupon-btn');
    const inputCupom = document.getElementById('coupon-code');
    const botaoFinalizar = document.getElementById('checkout-btn');

    if (!inputCEP || !botaoBuscarEndereco || !botaoAplicarCupom || !inputCupom || !botaoFinalizar) {
        console.error('Elementos do DOM não encontrados');
        return;
    }

    inputCEP.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        
        if (valor.length > 8) valor = valor.substring(0, 8);
        
        if (valor.length > 5) valor = valor.replace(/(\d{5})(\d{1,3})/, '$1-$2');
        
        e.target.value = valor;
        
        const valorLimpo = valor.replace('-', '');
        if (valorLimpo.length === 8) {
            const dadosFrete = calcularFretePorCEP(valorLimpo);
            frete = dadosFrete.freight;
            regiao = dadosFrete.region;
            
            const nomeRegiao = document.getElementById('region-name');
            if (nomeRegiao) nomeRegiao.textContent = dadosFrete.region;
            salvarNoArmazenamento();
            total = calcularTotal();
            atualizarTotais();
        } else if (valorLimpo.length === 0) {
            frete = 0;
            regiao = '';
            const nomeRegiao = document.getElementById('region-name');
            if (nomeRegiao) nomeRegiao.textContent = '-';
            salvarNoArmazenamento();
            total = calcularTotal();
            atualizarTotais();
        }
    });

    botaoBuscarEndereco.addEventListener('click', async function() {
        const cep = inputCEP.value.trim();

        if (!cep) {
            mostrarStatusEndereco('Digite um CEP antes de buscar o endereço.', false);
            return;
        }

        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length !== 8) {
            mostrarStatusEndereco('CEP inválido. Digite 8 dígitos.', false);
            return;
        }

        try {
            botaoBuscarEndereco.disabled = true;
            botaoBuscarEndereco.textContent = 'Buscando endereço...';
            
            esconderStatusEndereco();

            const dadosEndereco = await buscarEnderecoPorCEP(cep);

            const textoEndereco = `${dadosEndereco.street}, ${dadosEndereco.neighborhood}, ${dadosEndereco.city} - ${dadosEndereco.state}`;
            const nomeRegiao = document.getElementById('region-name');
            if (nomeRegiao) nomeRegiao.textContent = textoEndereco;

            const dadosFrete = calcularFretePorCEP(dadosEndereco.postalCode);
            frete = dadosFrete.freight;
            regiao = dadosFrete.region;

            salvarNoArmazenamento();
            total = calcularTotal();
            atualizarTotais();

        } catch (erro) {
            let mensagemErro = 'Erro ao buscar endereço. Tente novamente.';
            
            if (erro.message.includes('não encontrado')) {
                mensagemErro = 'CEP não encontrado. Verifique o número digitado.';
            } else if (erro.message.includes('Tempo de espera')) {
                mensagemErro = 'Tempo de espera excedido. Verifique sua conexão.';
            } else if (erro.message.includes('network') || erro.message === 'Failed to fetch') {
                mensagemErro = 'Erro de conexão. Verifique sua internet.';
            }
            
            mostrarStatusEndereco(mensagemErro, false);
            console.error('Erro ao buscar endereço:', erro);
        } finally {
            botaoBuscarEndereco.disabled = false;
            botaoBuscarEndereco.textContent = 'Buscar Endereço';
        }
    });

    botaoAplicarCupom.addEventListener('click', async function() {
        const codigo = inputCupom.value.trim();
        
        if (!codigo) {
            mostrarStatusCupom('Digite um código de cupom.', false);
            return;
        }

        try {
            botaoAplicarCupom.disabled = true;
            botaoAplicarCupom.textContent = 'Aplicando...';
            
            const resultado = await aplicarCupom(codigo.toUpperCase());
            
            cupomAplicado = codigo.toUpperCase();
            
            await carregarSacolaDaAPI();
            
            mostrarStatusCupom(resultado.message || 'Cupom aplicado com sucesso!', true);
            inputCupom.value = '';
            
        } catch (erro) {
            console.error('Erro ao aplicar cupom:', erro);
            mostrarStatusCupom(erro.message || 'Erro ao processar cupom.', false);
        } finally {
            botaoAplicarCupom.disabled = false;
            botaoAplicarCupom.textContent = 'Aplicar Cupom';
        }
    });

    botaoFinalizar.addEventListener('click', async function() {
        if (itensCarrinho.length === 0) {
            alert('Sua sacola está vazia!');
            return;
        }
        
        const totalCalculado = calcularTotal();
        const confirmacao = confirm(`Finalizar compra de R$ ${totalCalculado.toFixed(2).replace('.', ',')}?`);
        
        if (confirmacao) {
            try {
                await limparSacola();
                
                itensCarrinho = [];
                frete = 0;
                regiao = '';
                cupomAplicado = null;
                desconto = 0;
                subtotal = 0;
                total = 0;
                
                salvarNoArmazenamento();
                await carregarSacolaDaAPI();
                
                const nomeRegiao = document.getElementById('region-name');
                if (nomeRegiao) nomeRegiao.textContent = '-';
                if (inputCEP) inputCEP.value = '';
                if (inputCupom) inputCupom.value = '';
                const statusCupom = document.getElementById('coupon-status');
                if (statusCupom) statusCupom.style.display = 'none';
                
                alert('Compra finalizada com sucesso!');
            } catch (erro) {
                console.error('Erro ao finalizar compra:', erro);
                alert('Erro ao finalizar compra. Tente novamente.');
            }
        }
    });

    atualizarExibicao();
    
    if (regiao) {
        const nomeRegiao = document.getElementById('region-name');
        if (nomeRegiao) nomeRegiao.textContent = regiao;
    }
    
    if (cupomAplicado) {
        mostrarStatusCupom(`Cupom ${cupomAplicado} aplicado.`, true);
    }
});
