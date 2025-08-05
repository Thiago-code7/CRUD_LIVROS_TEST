const express = require('express');
const LivroController = require('../controllers/livroController');

const router = express.Router();

// Rotas principais de Livro
router.post('/', LivroController.criarLivro);
router.get('/', LivroController.listarLivros);
router.get('/buscar', LivroController.buscarLivroPorTitulo); // Ex: /livros/buscar?titulo=harry
router.get('/:id', LivroController.buscarLivroPorId);
router.put('/:id', LivroController.atualizarLivro);
router.delete('/:id', LivroController.deletarLivro);

module.exports = router;

