This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Estrutura do projeto

```bash
/cityswapuk
│── node_modules/             # Project dependencies
│── public/                   # Public assets and images
│   ├── path/to/image1.jpg    # Imagens de exemplo dos produtos
│   ├── path/to/image2.jpg
│── src/
│   ├── app/                  # App Router (Pages and Routes)
│   │   ├── layout.js         # Main site layout
│   │   ├── globals.css       # Global styles
│   │   ├── page.js           # Homepage
│   │   ├── listings/         # Listings routes
│   │   │   ├── page.js       # Listings page (all ads)
│   │   │   ├── [id]/         # Dynamic route for listing details
│   │   │   │   ├── page.js   # Individual listing page
│   │   ├── categories/       # Categories routes
│   │   │   ├── [category]/   # Dynamic route for category listings
│   │   │   │   ├── page.js   # Listings filtered by category
│   │   ├── search/           # Search page
│   │   │   ├── page.js       # Search interface and results
│   │   ├── auth/             # Authentication pages
│   │   │   ├── login/        # Login page
│   │   │   │   ├── page.js
│   │   │   ├── register/     # Register page
│   │   │   │   ├── page.js
│   │   ├── dashboard/        # User dashboard (Members area)
│   │   │   ├── page.js       # User panel
│   │   │   ├── my-listings/  # User's active listings
│   │   │   │   ├── page.js
│   │   │   ├── profile/      # Profile settings
│   │   │   │   ├── page.js
│   ├── components/           # Reusable components
│   │   ├── Navbar.js         # Navigation bar
│   │   ├── Footer.js         # Footer
│   │   ├── ListingCard.js    # Listing preview card
│   │   ├── CategoryMenu.js   # Category navigation menu
│   │   ├── Banner.js         # Banner principal
│   │   ├── ListingGrid.js    # Grid de anúncios
│   ├── lib/                  # Helper functions
│   │   ├── firebase.js       # Firebase configuration
│   │   ├── auth.js           # Authentication logic
│   │   ├── listings.js       # Fetch and manage listings
│── .env.local                # Environment variables
│── package.json              # Project dependencies
│── tailwind.config.js        # TailwindCSS configuration
│── next.config.js            # Next.js configuration
│── README.md                 # Project documentation


```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

> ## ** Structure Explanation**
>
> ### **🔹 `src/app/` (App Router)**
>
> * **`layout.js`** → Defines the main site layout.
> * **`page.js`** → Homepage, showing recent listings and featured categories.
> * **`/listings/`** → Lists all available ads.
>   * **`[id]/page.js`** → Dynamic page showing listing details.
> * **`/categories/`** → Displays listings filtered by categories.
>   * **`[category]/page.js`** → Shows all ads under a specific category.
> * **`/search/`** → Search functionality for listings.
> * **`/auth/`** → Handles authentication (Login and Register).
> * **`/dashboard/`** → User area where they can manage their listings and profile.
>
> ### **🔹 `src/components/`**
>
> * **`Navbar.js`** → Top navigation bar.
> * **`Footer.js`** → Footer with links and information.
> * **`ListingCard.js`** → Reusable component for displaying ads.
> * **`CategoryMenu.js`** → Sidebar for browsing categories.
>
> ### **🔹 `src/lib/`**
>
> * **`firebase.js`** → Firebase setup and initialization.
> * **`auth.js`** → Handles user authentication with Firebase.
> * **`listings.js`** → Functions to fetch, create, and delete listings.
>
> ---
>
> ## **🔥 Main Features**
>
> ### ✅ **1. Homepage (`page.js`)**
>
> * Shows recent listings.
> * Displays featured categories.
> * Includes a search bar.
>
> ### ✅ **2. Search Page (`/search/page.js`)**
>
> * Allows searching by listing name.
> * Shows real-time results.
>
> ### ✅ **3. Category Pages (`/categories/[category]/page.js`)**
>
> * Lists ads based on selected category.
>
> ### ✅ **4. Listing Details Page (`/listings/[id]/page.js`)**
>
> * Shows listing details, images, price, and seller contact.
>
> ### ✅ **5. User Dashboard (`/dashboard/page.js`)**
>
> * Displays user profile and active listings.
>
> ### ✅ **6. Authentication (`/auth/`)**
>
> * Users can sign up and log in with Firebase Authentication.
>
> ---
>
> ## **🚀 Technologies Used**
>
> * **Next.js (App Router)**
> * **Tailwind CSS** (for styling)
> * **Firebase** (Firestore for database, Storage for images)
> * **React Context API** (for global state management)
> * **Nginx** (if hosted on a VPS)
>
> ---
>
> ## **🎯 Next Steps**
>
> 1. **Set up Firebase** (`firebase.js`)
> 2. **Implement authentication system**
> 3. **Create the CRUD functionality for listings**
> 4. **Develop the UI using Tailwind CSS**
> 5. **Add search and advanced filtering**
> 6. **Deploy the project to a VPS with Nginx**

## Resume

>> **Contexto:**
>> Estou desenvolvendo um **marketplace online** semelhante ao  **eBay** , utilizando **Next.js** com **App Router** e  **Firebase** . O site permitirá que os usuários  **comprem e vendam produtos** , busquem por  **nome e categoria** , e tenham um **painel de controle** para gerenciar suas listagens.
>> Além disso, haverá um **sistema de pagamento com Stripe** para que os usuários possam **comprar créditos** e  **impulsionar anúncios** . Também quero **suporte a cupons de desconto (%)** para depósitos de crédito.
>>
>
> ---
>
> ## **📂 Estrutura do Projeto**
>
> * **Frontend:** Next.js (App Router) + Tailwind CSS para estilização.
> * **Backend & Database:** Firebase Firestore para armazenar usuários, anúncios e transações.
> * **Autenticação:** Firebase Authentication (Google, Email/Senha).
> * **Armazenamento:** Firebase Storage para upload de imagens dos produtos.
> * **Pagamentos:** Stripe + Firebase Functions (Checkout Dinâmico e Recarga de Créditos).
> * **Notificações em Tempo Real:** Firestore com listeners.
> * **Hospedagem:** VPS Linux com Nginx.
>
> ---
>
> ## **⚙️ Funcionalidades Principais**
>
> ### **🔹 1. Página Inicial**
>
> * Exibe os anúncios mais recentes e  **categorias em destaque** .
> * Possui **barra de pesquisa** para encontrar produtos por nome.
>
> ### **🔹 2. Pesquisa de Anúncios**
>
> * Usuário pode buscar por nome do produto.
> * Filtros por  **preço, categoria e localização** .
>
> ### **🔹 3. Categorias**
>
> * Produtos organizados por **categorias** como Eletrônicos, Moda, Imóveis, etc.
>
> ### **🔹 4. Página do Anúncio**
>
> * Exibe detalhes do  **produto** ,  **preço** ,  **descrição** , **imagens** e  **contato do vendedor** .
> * Permite usuários **favoritarem** produtos.
>
> ### **🔹 5. Sistema de Autenticação**
>
> * Usuários podem **criar conta e fazer login** com Google ou Email/Senha.
> * O painel do usuário mostra os  **anúncios ativos e históricos de compras/vendas** .
>
> ### **🔹 6. Dashboard do Usuário**
>
> * Permite  **criar, editar e excluir anúncios** .
> * Gerenciamento de mensagens e contatos de compradores.
> * Seção para **recarga de créditos** via Stripe.
>
> ### **🔹 7. Upload de Imagens**
>
> * Usuários podem adicionar **fotos dos produtos** com Firebase Storage.
>
> ### **🔹 8. Mensagens & Chat**
>
> * Chat entre **comprador e vendedor** diretamente pelo site.
>
> ---
>
> ## **🛒 Sistema de Pagamentos com Stripe**
>
> ✅ **Checkout Dinâmico** via Stripe (Firebase Functions)
> ✅ **Valor baseado no produto ou digitado pelo usuário** (para recarga de créditos)
> ✅ **Histórico de transações no painel do usuário**
> ✅ **Sistema de créditos para impulsionar anúncios**
> ✅ **Cupons de desconto (%) para depósitos de crédito**
> ✅ **Webhook para confirmação automática de pagamentos**
>
> ---
>
> ## **🎯 Como Funciona o Sistema de Créditos?**
>
> 1️⃣ **Usuário acessa o painel e escolhe um valor para recarregar (ex: £10, £20, £50).**
> 2️⃣ **Caso tenha um cupom de desconto, ele pode aplicá-lo no checkout.**
> 3️⃣ **Após pagamento via Stripe, os créditos são adicionados automaticamente.**
> 4️⃣ **O usuário pode gastar os créditos para impulsionar anúncios, destacando-os na página inicial.**
> 5️⃣ **Um histórico de pagamentos é salvo no Firestore.**
>
> ---
>
> ## **🛠️ Stack Tecnológica**
>
> ✅ **Frontend:** Next.js (App Router) + Tailwind CSS
> ✅ **Backend:** Firebase Firestore + Firebase Functions
> ✅ **Armazenamento de Imagens:** Firebase Storage
> ✅ **Pagamentos:** Stripe + Firebase Functions (Checkout)
> ✅ **Mensagens em Tempo Real:** Firebase Firestore
> ✅ **Hospedagem:** VPS Linux + Nginx
>
> ---
>
> ## **🚀 Objetivo do Código**
>
> Quero gerar **código funcional** para este projeto, incluindo:
>
> * **Autenticação de Usuários**
> * **CRUD de Anúncios**
> * **Pesquisa com Filtros**
> * **Área de Membros (Dashboard)**
> * **Chat entre Usuários**
> * **Upload de Imagens para Firebase Storage**
> * **Integração com Stripe via Firebase Functions**
> * **Sistema de Créditos para Impulsionamento de Anúncios**
> * **Aplicação de Cupons de Desconto (%) no Checkout**
> * **Webhook para validação de pagamentos e atualização automática do saldo**
