const { Router } = require('express');
const LivroController = require('../controllers/livroController');

const router = Router();

// Rota de busca por título (a mais específica) VEM PRIMEIRO.
router.get('/busca', LivroController.buscarLivroPorTitulo);

// Rotas genéricas e com parâmetros vêm DEPOIS.
router.get('/', LivroController.listarLivros);
router.get('/:id', LivroController.buscarLivroPorId);

// Rotas de criação e alteração
router.post('/', LivroController.criarLivro);
router.put('/:id', LivroController.atualizarLivro);
router.delete('/:id', LivroController.deletarLivro);

module.exports = router;

