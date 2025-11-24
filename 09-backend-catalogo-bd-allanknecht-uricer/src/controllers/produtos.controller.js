const service = require('../services/produtos.service');

async function listar(req, res) {
  try {
    const { page = 1, limit = 10, busca, categoria } = req.query;
    const resultado = await service.listar(
      Number(page), 
      Number(limit), 
      busca || null, 
      categoria || null
    );
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const produto = await service.buscarPorId(req.params.produtoId);
    res.json(produto);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function criar(req, res) {
  try {
    const novo = await service.criar(req.body);
    res.status(201).json(novo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const produto = await service.atualizar(req.params.produtoId, req.body);
    res.json(produto);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function excluir(req, res) {
  try {
    await service.excluir(req.params.produtoId);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
