# RiffHouse Client — E-commerce com React + Vite

Este é o repositório do **front-end** da RiffHouse, uma plataforma de e-commerce de instrumentos musicais. Desenvolvido com **React, TypeScript e Vite**, este projeto consome a [API RESTful RiffHouse](https://github.com/DarkMatter015/server-ecommerce) para fornecer uma experiência de compra completa e interativa.

---

## 🚀 Tecnologias Utilizadas

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-4-purple)
![Axios](https://img.shields.io/badge/Axios-1-yellow)
![React Router](https://img.shields.io/badge/React_Router-6-red)

- **React 19**
- **TypeScript** - Javascript tipado para validação de dados.
- **Vite** - Construção de Build do projeto.
- **Prime React** - Componentes de interface de usuário (UI).
- **Prime Icons** - Biblioteca com conjunto de ícones.
- **Prime Flex** - CSS responsivo.
- **React Hook Form** - Gerenciamento dos formulários da aplicação.
- **React Router Dom** - Biblioteca para gerenciamento de rotas.
- **Axios** - Biblioteca para requisições HTTP.
- **Context API** - para gerenciamento de estado (autenticação e carrinho).

---

## ⚙️ Funcionalidades

✅ **Navegação e Visualização de Produtos:**
  - Página inicial com produtos em destaque.
  - Página de detalhes do produto com descrição, imagens e preço.
  - Listagem e pesquisa de produtos.

✅ **Carrinho de Compras:**
  - Adicionar e remover produtos do carrinho.
  - Visualização do resumo do carrinho.

✅ **Autenticação de Usuários:**
  - Cadastro e login de usuários.
  - Rotas protegidas que exigem autenticação.
  - Gerenciamento de sessão com Context API.

✅ **Checkout e Pedidos:**
  - Finalização de compra com seleção de endereço e método de pagamento.
  - Visualização do histórico de pedidos do usuário.

---

## 📁 Estrutura do Projeto
```
/public
│-- /assets
    │-- /images
/src
│-- /commons
    │-- /types
│-- /components
│-- /context
    │-- /hooks
│-- /lib
│-- /pages
│-- /routes
│-- /services
│-- /styles
│-- /utils
│-- App.tsx
│-- main.tsx
```

📌 **Resumo:**
- `/assets/images` → Imagens públicas do projeto.
- `/commons/types` → Interfaces de tipos comuns (IResponse, IProduct, etc).
- `components/` → Componentes reutilizáveis (cards, listas, sessões etc.).
- `context/` → Gerenciamento de estado global com Context API (AuthContext, CartContext).
- `hooks/` → Hooks customizados (ex: `useAuth`).
- `lib/` → Configuração de instâncias, como o Axios.
- `pages/` → Páginas principais da aplicação (Home, Login, Cart, etc.).
- `routes/` → Configuração das rotas da aplicação.
- `services/` → Funções para interagir com a API backend.
- `styles/` → Estilização compartilhada (Login e Register).
- `utils/` → Funções utilitárias.

---

## ⚡ Como Executar Localmente

### 1️⃣ Clone o repositório:
```bash
git clone https://github.com/DarkMatter015/client-ecommerce.git
cd client-ecommerce
```

### 2️⃣ Instale as dependências:
```bash
npm install
```

### 3️⃣ Execute o projeto:
```bash
npm run dev
```

### 4️⃣ Acesse:
👉 `http://localhost:5173/` (ou a porta indicada no terminal)

---

## 🔗 Integração com o Back-end

Este projeto foi projetado para consumir a **API RiffHouse**, desenvolvida em Java com Spring Boot. Certifique-se de que o servidor do back-end esteja em execução para que todas as funcionalidades operem corretamente.

📦 **Repositório do back-end:** [RiffHouse API (Java/Spring)](https://github.com/DarkMatter015/server-ecommerce)

---

## 🧠 Aprendizados e Desafios Técnicos

Durante o desenvolvimento deste projeto, pude consolidar e aprofundar meus conhecimentos em **desenvolvimento de aplicações web com React e TypeScript**, além de compreender melhor o ciclo completo de uma aplicação **Single Page Application (SPA)**.

### 🔍 Principais aprendizados
- **Arquitetura baseada em componentes com React**: Construção de componentes reutilizáveis como `CardProduct`, `CartSummary` e `TopMenu`, promovendo um desenvolvimento modular e escalável.
- **Gerenciamento de estado com React Context**: Utilização do `AuthContext` e `CartContext` para gerenciar o estado global da aplicação, como autenticação de usuário e itens no carrinho de compras.
- **Roteamento do lado do cliente com React Router**: Definição de rotas da aplicação em `src/routes/app-routes`, incluindo a implementação de rotas protegidas com o componente `RequireAuth`.
- **Consumo de APIs REST com Axios**: Integração com o back-end através de serviços (`src/services`) que utilizam o Axios para realizar requisições HTTP, com uma instância configurada em `src/lib/axios.ts`.
- **Uso de TypeScript para tipagem estática**: Adoção do TypeScript em todo o projeto para garantir a segurança de tipos, resultando em um código mais robusto e com menos erros em tempo de execução.
- **Estilização com CSS Modules**: Organização dos estilos de forma componentizada, evitando conflitos de nomes e garantindo que os estilos de um componente não afetem outros.
- **Setup de projeto moderno com Vite**: Utilização do Vite para um ambiente de desenvolvimento rápido e um processo de build otimizado.

### ⚙️ Desafios técnicos enfrentados
- **Gerenciamento de estado complexo**: Lidar com o estado do carrinho de compras (adicionar, remover, atualizar itens) e o estado de autenticação do usuário de forma consistente.
- **Implementação de rotas protegidas**: Criar um mecanismo (`RequireAuth`) para proteger rotas que exigem que o usuário esteja autenticado, redirecionando para a página de login caso contrário.
- **Tratamento de operações assíncronas**: Lidar com estados de carregamento (loading) e erros ao buscar dados da API, proporcionando um feedback claro para o usuário.
- **Composição de componentes e passagem de props**: Decidir a melhor forma de estruturar os componentes e como eles devem se comunicar, utilizando `props` e `context` de forma eficiente.
- **Estilização e responsividade**: Garantir que a aplicação tenha uma boa aparência e seja funcional em diferentes tamanhos de tela.

---

## 💡 Melhorias Planejadas

- 🔸 Validação de CEP e calculo de frete
- 🔸 Cálculo de frete baseado no endereço
- 🔸 Implementar **refresh token JWT**
- 🔸 Testes unitários e de integração (React Testing Library + Vitest)
- 🔸 Adicionar **Dockerfile** e `docker-compose.yml` para o front-end
- 🔸 Deploy do front-end em **Vercel** ou **Netlify**

---

## 👨‍💻 Autor

**Lucas Matheus de Camargo**  
📎 [LinkedIn](https://www.linkedin.com/in/lucas-matheus-de-camargo-49a315236/)  
💼 Buscando oportunidades como **Desenvolvedor Java/Fullstack Júnior** e **QA Júnior**