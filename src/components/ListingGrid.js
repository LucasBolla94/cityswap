'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const ListingGrid = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdsFromCategories = async () => {
      try {
        // Busca todas as categorias
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesList = categoriesSnapshot.docs.map(doc => doc.data());
        // Extrai o campo "db" de cada categoria (filtrando valores nulos)
        const collectionNames = categoriesList.map(cat => cat.db).filter(Boolean);

        let adsList = [];
        // Para cada coleção encontrada, busca os anúncios
        for (const collName of collectionNames) {
          const adsSnapshot = await getDocs(collection(db, collName));
          const adsFromCollection = adsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          adsList = [...adsList, ...adsFromCollection];
        }
        setAds(adsList);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar anúncios.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdsFromCategories();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-xl text-gray-500">Loading ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Versão Desktop com scroll horizontal */}
    <div className="hidden md:flex overflow-x-auto gap-10 pb-4 w-full">
      {ads.length > 0 ? (
        ads.map(ad => (
          <div
            key={ad.id}
            className="w-full min-w-[200px] bg-white p-4 rounded-xl shadow-lg transition-transform cursor-pointer transform hover:scale-105 h-[250px]"
          >
            <Link href={`/listings/${ad.id}`}>
              <div className="relative w-full h-2/3 mb-2">
                <img
                  src={ad.imageUrls && ad.imageUrls[0] ? ad.imageUrls[0] : 'https://via.placeholder.com/200x200'}
                  alt={ad.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">{ad.title}</h3>
              <p className="text-sm font-bold text-gray-800">
                {ad.price ? `$${ad.price}` : 'Preço não disponível'}
              </p>
            </Link>
          </div>
        ))
      ) : (
        <p className="text-center text-xl text-gray-500 w-full">Nenhum anúncio disponível.</p>
      )}
    </div>

      {/* Versão Mobile: scroll horizontal */}
      <div className="flex md:hidden gap-2 overflow-x-auto snap-x snap-mandatory pb-4">
        {ads.map(ad => (
          <div
            key={ad.id}
            className="bg-white p-4 rounded-xl shadow-lg transition-transform cursor-pointer transform hover:scale-105 flex-shrink-0 snap-start min-w-[250px] max-w-[250px] h-[250px]"
          >
            <Link href={`/listings/${ad.id}`}>
              <div className="relative w-full h-2/3 mb-2">
                <img
                  src={ad.imageUrls && ad.imageUrls[0] ? ad.imageUrls[0] : 'https://via.placeholder.com/250x200'}
                  alt={ad.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">{ad.title}</h3>
              <p className="text-sm font-bold text-gray-800">
                {ad.price ? `$${ad.price}` : 'Preço não disponível'}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListingGrid;
