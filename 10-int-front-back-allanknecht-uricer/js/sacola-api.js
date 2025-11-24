const SACOLA_API_BASE_URL = 'http://localhost:3002';

function obterToken() {
    return localStorage.getItem('authToken');
}

function verificarAutenticacao() {
    const token = obterToken();
    if (!token) {
        throw new Error('Usuário não autenticado. Faça login primeiro.');
    }
    return token;
}

function criarHeaders() {
    const token = obterToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

async function buscarSacola() {
    try {
        const resposta = await fetch(`${SACOLA_API_BASE_URL}/sacola`, {
            method: 'GET',
            headers: criarHeaders()
        });

        if (!resposta.ok) {
            if (resposta.status === 401) {
                throw new Error('Token inválido ou expirado. Faça login novamente.');
            }
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        return await resposta.json();
    } catch (erro) {
        console.error('Erro ao buscar sacola:', erro);
        throw erro;
    }
}

async function adicionarItemSacola(item) {
    try {
        verificarAutenticacao();

        const body = {
            productId: item.productId,
            name: item.name,
            price: item.price,
            qty: item.qty || 1,
            image: item.image || ''
        };

        const headers = criarHeaders();

        const resposta = await fetch(`${SACOLA_API_BASE_URL}/sacola/items`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => ({ error: 'Erro desconhecido' }));
            if (resposta.status === 401) {
                throw new Error('Token inválido ou expirado. Faça login novamente.');
            }
            throw new Error(erro.error || `Erro HTTP: ${resposta.status}`);
        }

        return await resposta.json();
    } catch (erro) {
        console.error('Erro ao adicionar item à sacola:', erro);
        throw erro;
    }
}

async function atualizarQuantidadeItem(productId, qty) {
    try {
        verificarAutenticacao();

        const resposta = await fetch(`${SACOLA_API_BASE_URL}/sacola/items/${encodeURIComponent(productId)}`, {
            method: 'PUT',
            headers: criarHeaders(),
            body: JSON.stringify({ qty })
        });

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => ({ error: 'Erro desconhecido' }));
            if (resposta.status === 401) {
                throw new Error('Token inválido ou expirado. Faça login novamente.');
            }
            if (resposta.status === 404) {
                throw new Error('Item não encontrado na sacola.');
            }
            throw new Error(erro.error || `Erro HTTP: ${resposta.status}`);
        }

        return await resposta.json();
    } catch (erro) {
        console.error('Erro ao atualizar quantidade do item:', erro);
        throw erro;
    }
}

async function removerItemSacola(productId) {
    try {
        verificarAutenticacao();

        const headers = criarHeaders();
        const url = `${SACOLA_API_BASE_URL}/sacola/items/${encodeURIComponent(productId)}`;

        const resposta = await fetch(url, {
            method: 'DELETE',
            headers: headers
        });

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => ({ error: 'Erro desconhecido' }));
            if (resposta.status === 401) {
                throw new Error('Token inválido ou expirado. Faça login novamente.');
            }
            if (resposta.status === 404) {
                throw new Error('Item não encontrado na sacola.');
            }
            throw new Error(erro.error || `Erro HTTP: ${resposta.status}`);
        }

        return;
    } catch (erro) {
        console.error('Erro ao remover item da sacola:', erro);
        throw erro;
    }
}

async function aplicarCupom(code) {
    try {
        verificarAutenticacao();

        const resposta = await fetch(`${SACOLA_API_BASE_URL}/sacola/cupom`, {
            method: 'POST',
            headers: criarHeaders(),
            body: JSON.stringify({ code })
        });

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => ({ error: 'Erro desconhecido' }));
            if (resposta.status === 401) {
                throw new Error('Token inválido ou expirado. Faça login novamente.');
            }
            if (resposta.status === 404) {
                throw new Error('Sacola não encontrada.');
            }
            throw new Error(erro.error || `Erro HTTP: ${resposta.status}`);
        }

        return await resposta.json();
    } catch (erro) {
        console.error('Erro ao aplicar cupom:', erro);
        throw erro;
    }
}

async function limparSacola() {
    try {
        verificarAutenticacao();

        const resposta = await fetch(`${SACOLA_API_BASE_URL}/sacola`, {
            method: 'DELETE',
            headers: criarHeaders()
        });

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => ({ error: 'Erro desconhecido' }));
            if (resposta.status === 401) {
                throw new Error('Token inválido ou expirado. Faça login novamente.');
            }
            if (resposta.status === 404) {
                throw new Error('Sacola não encontrada.');
            }
            throw new Error(erro.error || `Erro HTTP: ${resposta.status}`);
        }

        return await resposta.json();
    } catch (erro) {
        console.error('Erro ao limpar sacola:', erro);
        throw erro;
    }
}

if (typeof window !== 'undefined') {
    window.buscarSacola = buscarSacola;
    window.adicionarItemSacola = adicionarItemSacola;
    window.atualizarQuantidadeItem = atualizarQuantidadeItem;
    window.removerItemSacola = removerItemSacola;
    window.aplicarCupom = aplicarCupom;
    window.limparSacola = limparSacola;
}
