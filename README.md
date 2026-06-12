# Perfoma

Bem-vindo ao Perfoma! Uma plataforma para criação de imagens fictícias inspiradas em plataformas populares da internet. O sistema permite gerar mockups personalizados de conversas, estatísticas, perfis e métricas para fins criativos, demonstrações, apresentações e entretenimento.

## 🚀 Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando:

* React
* Node.js
* Tailwind CSS
* Express.js
* PostgreSQL
* Prisma ORM

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado:

* Node.js (18+)
* PostgreSQL
* Git

## 🔧 Instalação e Configuração

### Clone o repositório

```bash
git clone https://github.com/kauanbgs/perfoma.git
cd perfoma
```

### Instale as dependências

```bash
npm install
```

### Configure o ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/perfoma"
```

### Execute as migrações

```bash
npx prisma migrate dev
```

### Inicie o projeto

```bash
npm run dev
```

### Acesse

```text
http://localhost:3000
```

## 📱 Como Usar

### Criar uma Simulação

1. Escolha um template.
2. Personalize os dados exibidos.
3. Edite textos, números e imagens.
4. Visualize as alterações em tempo real.
5. Exporte o resultado final.

### Templates Disponíveis

* Spotify
* Instagram Direct
* WhatsApp
* Discord
* YouTube
* TikTok
* X (Twitter)

## ✨ Funcionalidades

* Editor visual em tempo real
* Templates inspirados em plataformas populares
* Personalização completa de textos e imagens
* Exportação em PNG
* Histórico de projetos
* Interface responsiva
* Sistema de autenticação

## 📂 Estrutura do Projeto

```text
src/
├── components/
├── pages/
├── services/
├── hooks/
├── utils/

prisma/
└── schema.prisma
```

## ⚠️ Aviso

O Perfoma gera conteúdos fictícios e simulados. Todo material produzido pela plataforma deve ser utilizado de forma responsável, respeitando leis, direitos de terceiros e políticas das plataformas envolvidas.

## 👨‍💻 Desenvolvido por

Kauan Borges

Feito com ❤️ utilizando React, Node.js e Tailwind CSS.
