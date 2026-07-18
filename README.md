# 📚 Sistema de Biblioteca - Gerenciamento de Aluguéis

![GitHub repo size](https://img.shields.io/github/repo-size/ronaldokaras/sistema-biblioteca-grupo)
![GitHub language count](https://img.shields.io/github/languages/count/ronaldokaras/sistema-biblioteca-grupo)
![GitHub top language](https://img.shields.io/github/languages/top/ronaldokaras/sistema-biblioteca-grupo)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Demo-brightgreen)](https://ronaldokaras.github.io/sistema-biblioteca-grupo/)

**Sistema web completo para gerenciamento de biblioteca** desenvolvido em equipe como projeto da disciplina **DevOps**.

Permite cadastrar clientes, realizar aluguéis de livros, controlar devoluções e visualizar histórico de empréstimos.

---

## ✨ Funcionalidades

- 🔐 **Login de Bibliotecário** (autenticação simples)
- 👤 **Cadastro de Clientes** (nome, CPF e data de nascimento)
- 📖 **Aluguel de Livros** com busca inteligente e sugestão automática de devolução (7 dias)
- 📥 **Devolução de Livros**
- 📋 **Histórico completo** de empréstimos (ativos e finalizados)
- 💾 **Persistência local** com IndexedDB via **Dexie.js** (funciona offline)

---

## 🚀 Demonstração

**[Acessar o sistema online →](https://ronaldokaras.github.io/sistema-biblioteca-grupo/)**

---

## 🛠️ Tecnologias Utilizadas

- **HTML5**, **CSS3** e **JavaScript** (Vanilla)
- **Dexie.js** — Wrapper moderno para IndexedDB
- Design responsivo com tema literário (tons terrosos e bege)

---

## 📁 Estrutura do Projeto

```bash
sistema-biblioteca-grupo/
├── index.html          # Página principal
├── admin.html          # Painel administrativo
├── user.html           # Interface do usuário
├── static/
│   ├── css/            # Estilos
│   ├── js/             # Scripts da aplicação
│   └── src/            # Imagens (fundo e capas dos livros)
└── README.md
```

---

## 🚀 Como Executar Localmente

1. Clone o repositório:

```bash
git clone https://github.com/ronaldokaras/sistema-biblioteca-grupo.git
```

2. Abra o arquivo `index.html` diretamente no navegador ou use um servidor local (Live Server do VS Code, Python, etc.).

---

## 👥 Usuários de teste

| Usuário | Senha |
|---------|-------|
| `ana`   | `ana123` |
| `carlos`| `carlos456` |

---

## 📸 Preview

(Adicione aqui imagens/screenshots do sistema)

---

## 👥 Equipe

- **Ronaldokaras** — Organização e estrutura do projeto
- **Guspelepe** — Desenvolvimento frontend
- **Douglas Becker** — Login e melhorias

Projeto desenvolvido em equipe para a disciplina de **DevOps**.

---

## 📄 Licença

Este projeto foi criado para fins acadêmicos. Sinta‑se à vontade para estudar, modificar e utilizar como base para outros projetos.

---

Feito com ❤️ e muito café ☕ para a disciplina de DevOps.
```