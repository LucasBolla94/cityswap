// /src/app/page.js

import React from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import CategoryMenu from '../components/CategoryMenu';
import ListingGrid from '../components/ListingGrid';

const HomePage = () => {
  return (
    <div className="bg-gray-100">
      {/* Barra de Navegação */}
      <Navbar />

      {/* Banner Principal */}
      <Banner />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row">
          {/* Menu de Categorias */}
          <aside className="w-full lg:w-1/4 mb-8 lg:mb-0">
            <CategoryMenu />
          </aside>

          {/* Listagem de Produtos */}
          <main className="w-full lg:w-3/4">
            <h2 className="text-2xl font-semibold mb-4">Produtos em Destaque</h2>
            <ListingGrid />
          </main>
        </div>
      </div>

      {/* Rodapé */}
      <Footer />
    </div>
  );
};

export default HomePage;
