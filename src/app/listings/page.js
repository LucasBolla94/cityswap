'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { db } from '../../lib/firebase'; // Importando o db corretamente
import { collection, getDocs } from 'firebase/firestore'; // Para acessar os documentos da coleção
import Link from 'next/link'; // Para navegação entre páginas

// Componente para exibir cada anúncio individualmente
const ListingCard = ({ listing }) => (
  <div key={listing.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer">
    <Link href={`/listings/${listing.id}`}>
      {/* Exibindo a imagem principal */}
      <img
        src={listing.imageUrls[0] || 'https://via.placeholder.com/300x200'}
        alt={listing.title}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold text-gray-800">{listing.title}</h3>
      <p className="text-gray-600 mt-2">{listing.price ? `$${listing.price}` : 'Preço não disponível'}</p>
      {/* Exibindo a categoria */}
      <p className="text-gray-500 text-sm">{listing.category}</p>
    </Link>
  </div>
);

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [cities, setCities] = useState([]); // Estado para as cidades
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Função para carregar os anúncios
  const fetchListings = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'ads'));
      const listingsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListings(listingsList);
    } catch (error) {
      setError('Erro ao carregar anúncios.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para carregar as cidades da coleção 'ads-city'
  const fetchCities = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'ads-city'));
      // Mapeia os documentos para extrair o campo 'name'
      const citiesList = querySnapshot.docs.map(doc => doc.data().name);
      setCities(citiesList);
    } catch (error) {
      console.error('Erro ao carregar cidades', error);
    }
  }, []);

  useEffect(() => {
    fetchListings();
    fetchCities();
  }, [fetchListings, fetchCities]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Anúncios</h1>

        {/* Campo para seleção da cidade */}
        <div className="flex justify-center mb-6">
          <select className="p-2 border rounded">
            <option value="">Selecione uma cidade</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-center">Carregando anúncios...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingsPage;
