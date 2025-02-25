'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const Ads = ({ user }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.uid) {
      const fetchAds = async () => {
        try {
          const adsQuery = query(collection(db, 'ads'), where('ownerId', '==', user.uid));
          const adsSnapshot = await getDocs(adsQuery);
          const adsList = adsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setAds(adsList);
        } catch (error) {
          console.error('Erro ao buscar anúncios:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchAds();
    }
  }, [user]);

  if (loading) return <div>Carregando anúncios...</div>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Meus Anúncios</h2>
      {ads.length > 0 ? (
        <ul className="space-y-4">
          {ads.map(ad => (
            <li key={ad.id} className="p-4 border rounded-md shadow-sm">
              <h3 className="font-semibold">{ad.title}</h3>
              <p>{ad.description}</p>
              <span className="text-sm text-gray-600">Preço: ${ad.price}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Você ainda não publicou nenhum anúncio.</p>
      )}
    </div>
  );
};

export default Ads;
