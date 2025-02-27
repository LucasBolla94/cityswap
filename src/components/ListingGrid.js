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
    const fetchAds = async () => {
      try {
        // Busca os anúncios diretamente da collection 'ads'
        const adsSnapshot = await getDocs(collection(db, 'ads'));
        const adsList = adsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAds(adsList);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar anúncios.');
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen px-4 py-8">
        <p className="text-center text-xl text-gray-500">Loading ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen px-4 py-8">
        <p className="text-center text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen px-4 py-8">
      {ads.length > 0 ? (
        // Exibe os anúncios lado a lado utilizando flex-wrap
        <div className="flex flex-wrap gap-5">
          {ads.map(ad => (
            <div
              key={ad.id}
              className="bg-white p-4 rounded-xl shadow-lg transition-transform cursor-pointer transform hover:scale-105 w-[200px] h-[250px]"
            >
              <Link href={`/listings/${ad.id}`}>
                <div className="relative w-full h-2/3 mb-2">
                  <img
                    src={
                      ad.imageUrls && ad.imageUrls[0]
                        ? ad.imageUrls[0]
                        : 'https://via.placeholder.com/200x200'
                    }
                    alt={ad.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">
                  {ad.title}
                </h3>
                <p className="text-sm font-bold text-gray-800">
                  {ad.price ? `$${ad.price}` : 'Preço não disponível'}
                </p>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-gray-500 w-full">
          Nenhum anúncio disponível.
        </p>
      )}
    </div>
  );
};

export default ListingGrid;
