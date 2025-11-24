const repository = require('../repositories/produtos.repository');

async function listar(page, limit, busca, categoria) {
  if (page < 1) page = 1;
  if (limit < 0) limit = 10;
  
  return await repository.listar(page, limit, busca, categoria);
}

async function buscarPorId(id) {
  const produto = await repository.buscarPorId(id);
  if (!produto) throw new Error('Produto não encontrado');
  return produto;
}

async function criar(dados) {
  if (!dados.nome || !dados.preco) {
    throw new Error('Nome e preço são obrigatórios');
  }
  
  if (dados.preco < 0) {
    throw new Error('Preço não pode ser negativo');
  }
  
  if (dados.estoque && dados.estoque < 0) {
    throw new Error('Estoque não pode ser negativo');
  }
  
  return await repository.criar(dados);
}

async function excluir(id) {
  const ok = await repository.excluir(id);
  if (!ok) throw new Error('Produto não encontrado');
}

async function atualizar(id, dados) {
  if (dados.preco !== undefined && dados.preco < 0) {
    throw new Error('Preço não pode ser negativo');
  }
  
  if (dados.estoque !== undefined && dados.estoque < 0) {
    throw new Error('Estoque não pode ser negativo');
  }
  
  const produto = await repository.atualizar(id, dados);
  if (!produto) throw new Error('Produto não encontrado');
  return produto;
}

module.exports = { listar, buscarPorId, criar, excluir, atualizar };
