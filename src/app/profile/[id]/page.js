'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const ProfilePage = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchSeller = async () => {
      try {
        let sellerRef = doc(db, 'users', id);
        let sellerSnap = await getDoc(sellerRef);
        if (!sellerSnap.exists()) {
          sellerRef = doc(db, 'business-users', id);
          sellerSnap = await getDoc(sellerRef);
        }
        if (sellerSnap.exists()) {
          setSeller(sellerSnap.data());
        } else {
          setError('Vendedor não encontrado.');
        }
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar o perfil do vendedor.');
      }
    };

    const fetchListings = async () => {
      try {
        const q = query(collection(db, 'ads'), where('userId', '==', id));
        const querySnapshot = await getDocs(q);
        const ads = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setListings(ads);
      } catch (err) {
        console.error(err);
      }
    };

    Promise.all([fetchSeller(), fetchListings()]).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-center text-xl text-gray-500">Carregando perfil...</p>;
  }

  if (error) {
    return <p className="text-center text-xl text-red-600">{error}</p>;
  }

  return (
    <div className="bg-gray-100 py-8 px-4 md:px-8">
      {seller && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex items-center gap-6">
          <img
            src={seller.photo || 'https://via.placeholder.com/150'}
            alt={seller.name}
            className="w-24 h-24 rounded-full object-cover border border-gray-300"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{seller.name}</h1>
            <p className="text-lg text-gray-600">Nota: {seller.rating || 'N/A'}</p>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Anúncios do Vendedor</h2>
      <div className="flex flex-col gap-4">
        {listings.length > 0 ? (
          listings.map(listing => (
            <Link key={listing.id} href={`/listings/${listing.id}`}>
              <div className="flex items-center bg-white p-4 rounded-lg shadow-md cursor-pointer">
                <img
                  src={listing.imageUrls?.[0] || 'https://via.placeholder.com/150'}
                  alt={listing.title}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-gray-800">{listing.title}</h3>
                  <p className="text-sm text-gray-600">{listing.subtitle}</p>
                  <p className="text-md font-semibold text-gray-800">£{listing.price}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-600">Este vendedor ainda não possui anúncios.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
