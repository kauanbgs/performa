# Performa

Bem-vindo ao Performa! Uma plataforma para criação de imagens fictícias inspiradas em plataformas populares da internet. O sistema permite gerar mockups personalizados de conversas, estatísticas, perfis e métricas para fins criativos, demonstrações, apresentações e entretenimento.

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

O projeto é dividido em duas pastas independentes, `backend/` e `frontend/` — cada uma com seu próprio `package.json`.

### Clone o repositório

```bash
git clone https://github.com/kauanbgs/performa.git
cd performa
```

### Backend

```bash
cd backend
npm install
```

Copie `.env.example` para `.env` e preencha os valores (`DATABASE_URL`, `JWT_SECRET`, etc.):

```bash
cp .env.example .env
```

Execute as migrações e suba o servidor:

```bash
npx prisma migrate dev
npm run dev
```

A API sobe em `http://localhost:3001/performa` (porta configurável via `PORT`).

### Frontend

```bash
cd frontend
npm install
```

Copie `.env.example` para `.env` e ajuste `VITE_API_URL` se sua API não estiver na porta padrão:

```bash
cp .env.example .env
npm run dev
```

### Acesse

```text
http://localhost:5173
```

## 📱 Como Usar

### Criar uma Simulação

1. Escolha um template.
2. Personalize os dados exibidos.
3. Edite textos, números e imagens.
4. Visualize as alterações em tempo real.
5. Exporte o resultado final.

### Templates Disponíveis

* Spotify (post musical)
* Spotify Wrapped
* Letterboxd (review de filme)
* WhatsApp (conversa)
* Instagram (perfil e direct)
* Notas do iPhone (nota de esclarecimento)
* X / Twitter (print de tweet)

Para adicionar um template novo, são cinco pontos: o canvas em
`frontend/src/components/canvas/`, o registro em `frontend/src/constants/modes.ts`
(e `modeIcons.tsx`), o painel de edição em `frontend/src/pages/Editor/`, o
render em `components/canvas/exportTemplate.tsx` e a liberação do `mode` em
`backend/src/utils/projectValidation.js` — este último tem teste que falha se
for esquecido.

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
backend/
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   └── utils/
├── prisma/
│   └── schema.prisma
└── test/

frontend/
└── src/
    ├── components/
    ├── pages/
    ├── services/
    ├── hooks/
    └── utils/
```

## ⚠️ Aviso

O Performa gera conteúdos fictícios e simulados. Todo material produzido pela plataforma deve ser utilizado de forma responsável, respeitando leis, direitos de terceiros e políticas das plataformas envolvidas.

## 👨‍💻 Desenvolvido por

Kauan Borges

Feito com ❤️ utilizando React, Node.js e Tailwind CSS.
