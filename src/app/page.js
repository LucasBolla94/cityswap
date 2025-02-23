'use client';
import AdComponent from '../components/AdComponent';
import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase'; // Importando o db corretamente
import { collection, getDocs } from 'firebase/firestore'; // Para acessar os documentos da coleção
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import CategoryMenu from '../components/CategoryMenu';
import ListingGrid from '../components/ListingGrid';

const HomePage = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]); // Para armazenar as categorias
  const [selectedCategory, setSelectedCategory] = useState(''); // Para armazenar a categoria selecionada
  const [searchQuery, setSearchQuery] = useState(''); // Para armazenar a busca por palavras-chave

  // Buscar todos os anúncios do Firestore
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ads'));
        const adsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAds(adsList);
      } catch (error) {
        setError('Erro ao carregar os anúncios.');
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  // Buscar categorias da DB
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categoriesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesList);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    fetchCategories();
  }, []);

  // Função para filtrar os anúncios baseado na categoria e na busca
  const filterAds = () => {
    return ads.filter(ad => {
      const matchesCategory = selectedCategory ? ad.category === selectedCategory : true;
      const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Barra de Navegação */}
      <Navbar />

      {/* Barra de Pesquisa com Seleção de Categoria e Botão de Pesquisa */}
      <div className="bg-white shadow-md px-4 py-4 flex justify-center items-center">
        <div className="w-full max-w-3xl flex items-center space-x-2"> {/* Barra menor e centralizada */}
          {/* Campo de Busca */}
          <input
            type="text"
            className="w-full p-3 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell what you looking for..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* Seletor de Categorias */}
          <select
            className="p-3 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {/* Botão de Pesquisa */}
          <button
            className="p-3 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {}} // Aqui você pode adicionar uma função para tratar o clique no botão
          >
            Search
          </button>
        </div>
      </div>

      {/* Banner Principal */}
      <Banner />

      {/* Banner ADS */}
      <AdComponent />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu de Categorias */}

          {/* Listagem de Produtos */}
          <main className="w-full lg:w-3/4">
            {/* Exibição de Anúncios */}
            {loading ? (
              <p className="text-center text-xl text-gray-500">Carregando anúncios...</p>
            ) : error ? (
              <p className="text-center text-xl text-red-600">{error}</p>
            ) : (
              <ListingGrid ads={filterAds()} />
            )}
          </main>
        </div>
      </div>

      {/* Rodapé */}
      <Footer />
    </div>
  );
};

export default HomePage;
