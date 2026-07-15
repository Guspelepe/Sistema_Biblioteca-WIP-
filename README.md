# 📚 Sistema de Biblioteca - Gerenciamento de Aluguéis

[![Status](https://img.shields.io/badge/status-concluído-brightgreen)]()
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Dexie.js](https://img.shields.io/badge/Dexie.js-IndexedDB-orange)](https://dexie.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Sistema web para gerenciamento de biblioteca desenvolvido em equipe como projeto da disciplina **DevOps**.

Permite cadastrar clientes, realizar aluguéis de livros, controlar devoluções e visualizar o histórico de empréstimos.

---

## ✨ Funcionalidades

- **🔐 Login de Bibliotecário** (autenticação simples com usuários pré-cadastrados)
- **👤 Cadastro de Clientes** (nome, CPF e data de nascimento)
- **📖 Aluguel de Livros**
  - Busca inteligente por títulos populares
  - Sugestão automática de data de devolução (7 dias)
  - Visualização de capa e informações do livro
- **📥 Devolução de Livros**
- **📋 Histórico Completo** de aluguéis (ativos e devolvidos)
- **💾 Persistência Local** usando IndexedDB (Dexie.js) — não requer servidor ou banco externo

---

## 🛠️ Tecnologias Utilizadas

- **HTML5**, **CSS3** e **JavaScript** (Vanilla)
- **Dexie.js** — Biblioteca para IndexedDB
- Design responsivo com tema literário (tons terrosos e bege)
- Imagens de capas dos livros incluídas

---

## 📁 Estrutura do Projeto

```bash
sistema-biblioteca-grupo/
├── templates/
│   └── index.html          # Página principal (single page)
├── static/
│   ├── styles.css          # Estilos e layout
│   └── script.js           # Lógica completa da aplicação
├── src/
│   ├── fundo.jpg
│   └── *.jpg               # Capas dos livros
└── README.md
```

---

## 🚀 Como Executar

1. Clone o repositório:

```bash
git clone https://github.com/ronaldokaras/sistema-biblioteca-grupo.git
```

2. Abra o arquivo `templates/index.html` diretamente no navegador (ou sirva com qualquer servidor local).

### 👥 Usuários de teste

| Usuário | Senha |
|---------|-------|
| `ana`   | `ana123` |
| `carlos`| `carlos456` |

---

## 📸 Preview

- Interface moderna e intuitiva
- Busca em tempo real de livros
- Capa flutuante do livro selecionado
- Totalmente funcional offline

---

## 👥 Equipe

- **Ronaldokaras** — Organização e estrutura
- **Guspelepe** — Desenvolvimento frontend
- **Douglas Becker** — Login e melhorias

Projeto desenvolvido em equipe para a disciplina de **DevOps**.

---

## 📄 Licença

Este projeto foi criado para fins acadêmicos. Sinta‑se à vontade para estudar, modificar e utilizar como base para outros projetos.

---

Feito com ❤️ e muito café para a disciplina de DevOps.
```