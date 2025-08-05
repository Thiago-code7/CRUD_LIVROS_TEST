require('dotenv').config();
const express = require('express');
const { sequelize } = require('./config/configDB');

const livroRoutes = require('./src/modules/livro/routes/livroRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rotas da aplicação
app.use('/livros', livroRoutes);

// Só liga o servidor se este arquivo for executado diretamente
if (require.main === module) {
  sequelize.sync({ force: true }) // Altere para false após os testes, se preferir
    .then(() => {
      console.log('📦 Banco sincronizado com sucesso!');
      app.listen(PORT, () => {
        console.log(`🚀 Aplicação rodando em http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('❌ Erro ao conectar no banco:', error);
    });
}

module.exports = app;

