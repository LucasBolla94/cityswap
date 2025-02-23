'use client'; // Indica que este componente é renderizado no cliente

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../lib/auth'; // Hook de autenticação
import { getUserListings } from '../../../lib/listings'; // Função para pegar os anúncios do usuário
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/NavBar'; // Assumindo que você tenha um componente Navbar

const MyListingsPage = () => {
  const { user, loading } = useAuth();
  const [listings, setListings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Pega os anúncios do usuário ao carregar
      getUserListings(user.uid).then(setListings);
    }
  }, [user]);

  if (loading) return <div>Carregando...</div>;

  if (!user) {
    router.push('/auth/login');
    return null; // Não renderiza o resto da página enquanto não estiver autenticado
  }

  return (
    <div>
      {/* Navbar */}
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Meus Anúncios</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.length === 0 ? (
            <div className="text-center col-span-full">
              <p className="text-lg text-gray-500">Você ainda não tem anúncios ativos.</p>
            </div>
          ) : (
            listings.map((listing) => (
              <div key={listing.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <img
                  src={listing.imageUrl || '/placeholder-image.jpg'}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800">{listing.title}</h2>
                  <p className="text-gray-600 mt-2">Preço: <span className="font-semibold text-lg text-green-600">{listing.price}</span></p>
                  <div className="flex justify-between items-center mt-4">
                    <a
                      href={`/listings/${listing.id}`}
                      className="text-blue-500 hover:text-blue-700 font-semibold"
                    >
                      Ver detalhes
                    </a>
                    <button
                      onClick={() => router.push(`/dashboard/edit-listing/${listing.id}`)}
                      className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyListingsPage;
