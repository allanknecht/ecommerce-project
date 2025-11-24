const API_BASE_URL = 'http://localhost:5732/api/v1';

document.addEventListener('DOMContentLoaded', function() {
    const formularioLogin = document.getElementById('login-form');
    const botaoLogin = document.getElementById('login-button');
    const mensagemErro = document.getElementById('login-error');

    formularioLogin.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('password').value;

        mensagemErro.style.display = 'none';
        mensagemErro.textContent = '';

        if (!email) {
            mostrarErro('Por favor, informe seu e-mail.');
            return;
        }

        if (!senha) {
            mostrarErro('Por favor, informe sua senha.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            mostrarErro('Por favor, informe um e-mail válido.');
            return;
        }

        botaoLogin.disabled = true;
        botaoLogin.textContent = 'Entrando...';

        try {
            const resposta = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: senha })
            });

            if (!resposta.ok) {
                const dadosErro = await resposta.json().catch(() => ({}));
                throw new Error(dadosErro.error || 'Erro ao fazer login. Verifique seu e-mail.');
            }

            const dados = await resposta.json();
            
            localStorage.setItem('authToken', dados.token);
            localStorage.setItem('userEmail', email);

            botaoLogin.textContent = 'Login realizado com sucesso!';
            botaoLogin.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);

        } catch (erro) {
            let mensagemErroTexto = 'Erro ao fazer login. Tente novamente.';
            
            if (erro.message.includes('Failed to fetch')) {
                mensagemErroTexto = 'Erro de conexão. Verifique se a API está rodando.';
            } else if (erro.message) {
                mensagemErroTexto = erro.message;
            }
            
            mostrarErro(mensagemErroTexto);
        } finally {
            botaoLogin.disabled = false;
            botaoLogin.textContent = 'Entrar';
        }
    });
});

function mostrarErro(mensagem) {
    const elementoErro = document.getElementById('login-error');
    elementoErro.textContent = mensagem;
    elementoErro.style.display = 'block';
}
