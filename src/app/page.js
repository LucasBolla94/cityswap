'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import ListingGrid from '../components/ListingGrid';

const HomePage = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

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

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ads-city'));
        const citiesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCities(citiesList);
      } catch (error) {
        console.error('Erro ao carregar cidades:', error);
      }
    };

    fetchCities();
  }, []);

  const filterAds = () => {
    return ads.filter(ad => {
      const matchesCategory = selectedCategory ? ad.category === selectedCategory : true;
      const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity ? ad.city === selectedCity : true;
      return matchesCategory && matchesSearch && matchesCity;
    });
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
          >
            Search
          </button>
        </div>
      </div>

      <Banner />

      <div className="w-screen min-h-screen flex flex-col px-4 py-8 flex-grow">
        <main className="w-full flex-grow flex flex-col">
          {loading ? (
            <p className="text-center text-xl text-gray-500">Carregando anúncios...</p>
          ) : error ? (
            <p className="text-center text-xl text-red-600">{error}</p>
          ) : (
            <ListingGrid ads={filterAds()} />
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
