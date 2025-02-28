'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import ListingGrid from '../components/ListingGrid';

const HomePage = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    // Busca as categorias
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Erro ao carregar categorias');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    // Busca as cidades
    const fetchCities = async () => {
      try {
        const response = await fetch('/api/cities');
        if (!response.ok) throw new Error('Erro ao carregar cidades');
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
    fetchCities();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (selectedCategory.trim()) params.append('category', selectedCategory);
      if (selectedCity.trim()) params.append('city', selectedCity);
      if (searchQuery.trim()) params.append('title', searchQuery.trim());

      const url = `/api/search?${params.toString()}`;
      console.log('Search URL:', url); // Debug
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao buscar anúncios');

      const data = await response.json();
      setAds(data.data);
    } catch (error) {
      setError('Erro ao buscar anúncios.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="bg-white shadow-md px-4 py-4">
        <div className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row items-stretch gap-2">
          <input
            type="text"
            className="w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell what you looking for..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="w-full sm:w-auto p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">City</option>
            {cities.map(city => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          <select
            className="w-full sm:w-auto p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <button
            className="w-full sm:w-auto p-3 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      <Banner />

      <div className="flex-1 overflow-auto px-4 py-8">
        <main className="w-full flex flex-col">
          {loading ? (
            <p className="text-center text-xl text-gray-500">Carregando anúncios...</p>
          ) : error ? (
            <p className="text-center text-xl text-red-600">{error}</p>
          ) : (
            <ListingGrid ads={ads} />
          )}
        </main>
      </div>

      <Footer className="relative z-10" />
    </div>
  );
};

export default HomePage;
