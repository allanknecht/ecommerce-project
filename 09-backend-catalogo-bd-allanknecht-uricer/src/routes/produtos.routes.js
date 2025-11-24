const express = require('express');
const router = express.Router();
const controller = require('../controllers/produtos.controller');
const { autenticarToken } = require('../middlewares/auth.middleware');

router.get('/', controller.listar);
router.get('/:produtoId', controller.buscarPorId);

router.post('/', autenticarToken, controller.criar);
router.put('/:produtoId', autenticarToken, controller.atualizar);
router.delete('/:produtoId', autenticarToken, controller.excluir);

module.exports = router;
