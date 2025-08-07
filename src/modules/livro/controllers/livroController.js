const LivroModel = require('../models/livroModel');
const { Op, QueryTypes } = require('sequelize');
const { sequelize } = require('../../../../config/configDB'); 

class LivroController {

    // ... As outras funções (criar, listar, buscar por id) permanecem idênticas ...
    static async criarLivro(req, res) {
        try {
            const { titulo, autor, ano_publicacao, genero, preco } = req.body;

            if (!titulo || !autor || !ano_publicacao || !genero || preco === undefined) {
                return res.status(400).json({ msg: 'Todos os campos são obrigatórios' });
            }

            const injectionRegex = /('|--|;|\/\*|\*\/|drop|select|insert|delete|update)/i;
            if (injectionRegex.test(titulo)) {
                return res.status(400).json({ msg: 'Título inválido' });
            }
            if (injectionRegex.test(autor)) {
                return res.status(400).json({ msg: 'Autor inválido' });
            }

            if (typeof preco !== 'number' || isNaN(preco)) {
                return res.status(400).json({ msg: 'Preço deve ser um número' });
            }

            if (preco <= 0) {
                return res.status(400).json({ msg: 'Preço deve ser maior que zero' });
            }

            if (typeof ano_publicacao !== 'number' || isNaN(ano_publicacao)) {
                return res.status(400).json({ msg: 'Ano de publicação deve ser um número' });
            }

            if (titulo.length < 2) {
                return res.status(400).json({ msg: 'Título deve ter pelo menos 2 caracteres' });
            }

            const generosValidos = ['Aventura', 'Romance', 'Terror', 'Fantasia', 'Suspense', 'Drama'];
            if (!generosValidos.includes(genero)) {
                return res.status(400).json({ msg: 'Gênero inválido' });
            }

            const livroExistente = await LivroModel.findOne({ where: { titulo } });
            if (livroExistente) {
                return res.status(400).json({ msg: 'Livro com esse título já cadastrado' });
            }

            const livro = await LivroModel.create({ titulo, autor, ano_publicacao, genero, preco });

            return res.status(201).json({
                livro: livro.dataValues,
                msg: 'Livro criado com sucesso'
            });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }

    static async listarLivros(req, res) {
        try {
            const livros = await LivroModel.findAll();
            return res.status(200).json(livros);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }

    static async buscarLivroPorId(req, res) {
        try {
            const { id } = req.params;
            const livro = await LivroModel.findByPk(id);

            if (!livro) {
                return res.status(404).json({ msg: 'Livro não encontrado' });
            }

            return res.status(200).json({ livro: livro.dataValues, msg: 'Livro encontrado' });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }

    /**
     * ABORDAGEM FINAL E MAIS ROBUSTA
     */
    static async buscarLivroPorTitulo(req, res) {
        try {
            const { titulo } = req.query;
    
            if (!titulo) {
                return res.status(400).json({ msg: 'Parâmetro "titulo" é obrigatório' });
            }
    
            // 1. Obter o nome da tabela dinamicamente a partir do modelo.
            //    Isso garante que estamos usando o nome de tabela correto.
            const tableName = LivroModel.getTableName();
    
            // 2. Executar a consulta SQL pura usando o nome da tabela obtido.
            //    As aspas duplas em `"${tableName}"` garantem que funcione com qualquer nome de tabela.
            const livros = await sequelize.query(
                `SELECT * FROM "${tableName}" WHERE "titulo" ILIKE :titulo`,
                {
                    replacements: { titulo: `%${titulo}%` },
                    type: QueryTypes.SELECT
                }
            );
    
            if (!livros || livros.length === 0) {
                return res.status(404).json({ msg: 'Livro não encontrado' });
            }
    
            return res.status(200).json({ livro: livros[0], msg: 'Livro encontrado' });
    
        } catch (error) {
            // 3. Se um erro ocorrer, logá-lo e ENVIAR A MENSAGEM DE ERRO NA RESPOSTA.
            //    Isso nos dirá exatamente o que o banco de dados está reclamando.
            console.error('ERRO DETALHADO EM BUSCARLIVROPORTITULO:', error);
            return res.status(500).json({ 
                msg: 'Erro interno no servidor.',
                error_details: error.message,
                error_name: error.name
            });
        }
    }

    // ... As outras funções (deletar, atualizar) permanecem idênticas ...
    static async deletarLivro(req, res) {
        try {
            const { id } = req.params;
            const livro = await LivroModel.findByPk(id);

            if (!livro) {
                return res.status(404).json({ msg: 'Livro não encontrado' });
            }

            await LivroModel.destroy({ where: { id } });

            return res.status(204).send();

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }

    static async atualizarLivro(req, res) {
        try {
            const { id } = req.params;
            const { titulo, autor, ano_publicacao, genero, preco } = req.body;

            if (!titulo || !autor || !ano_publicacao || !genero || preco === undefined) {
                return res.status(400).json({ msg: 'Dados inválidos para atualização' });
            }

            const injectionRegex = /('|--|;|\/\*|\*\/|drop|select|insert|delete|update)/i;
            if (injectionRegex.test(titulo)) {
                return res.status(400).json({ msg: 'Título inválido' });
            }
            if (injectionRegex.test(autor)) {
                return res.status(400).json({ msg: 'Autor inválido' });
            }

            if (typeof preco !== 'number' || preco <= 0 || isNaN(preco)) {
                return res.status(400).json({ msg: 'Preço deve ser maior que zero' });
            }

            if (typeof ano_publicacao !== 'number' || isNaN(ano_publicacao)) {
                return res.status(400).json({ msg: 'Ano de publicação deve ser um número' });
            }

            if (titulo.length < 2) {
                return res.status(400).json({ msg: 'Título deve ter pelo menos 2 caracteres' });
            }

            const generosValidos = ['Aventura', 'Romance', 'Terror', 'Fantasia', 'Suspense', 'Drama'];
            if (!generosValidos.includes(genero)) {
                return res.status(400).json({ msg: 'Gênero inválido' });
            }

            const livro = await LivroModel.findByPk(id);
            if (!livro) {
                return res.status(404).json({ msg: 'Livro não encontrado' });
            }

            const tituloExistente = await LivroModel.findOne({
                where: {
                    titulo,
                    id: { [Op.ne]: id }
                }
            });

            if (tituloExistente) {
                return res.status(400).json({ msg: 'Título já cadastrado em outro livro' });
            }

            await LivroModel.update({ titulo, autor, ano_publicacao, genero, preco }, { where: { id } });

            const livroAtualizado = await LivroModel.findByPk(id);
            return res.status(200).json({ livro: livroAtualizado.dataValues, msg: 'Livro atualizado com sucesso' });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }
}

module.exports = LivroController;