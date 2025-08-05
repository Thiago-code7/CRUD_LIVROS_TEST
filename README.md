# 📚 API de Livros - TDD com Node.js, Express, Sequelize e PostgreSQL

## 📌 Descrição

Esta é uma API RESTful para gerenciamento de livros, desenvolvida com **Node.js**, **Express**, **Sequelize** e **PostgreSQL**, seguindo os princípios do **TDD (Desenvolvimento Guiado por Testes)**. A implementação foi feita com base em um arquivo de testes pré-definido (`livroController.test.js`) utilizando **Jest** e **Supertest**.

A API permite:

- 📖 Criar livros
- 🔍 Listar todos os livros
- 🔎 Buscar livros por título (com busca parcial ou completa)
- ✏️ Atualizar livros
- ❌ Remover livros

---

## 🛠️ Tecnologias Utilizadas

- Node.js
- Express
- Sequelize (ORM)
- PostgreSQL
- Jest (Testes)
- Supertest (Testes HTTP)

---

## ⚙️ Pré-requisitos

Antes de iniciar, verifique se você possui instalado:

- Node.js (v14+)
- PostgreSQL
- npm ou yarn
- Sequelize CLI (`npm install -g sequelize-cli`)

---

## 🚀 Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/api-livros-tdd.git
cd api-livros-tdd
