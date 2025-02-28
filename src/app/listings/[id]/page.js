'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../lib/auth';

const ListingDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user: currentUser, loading: authLoading } = useAuth();
  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🚀 Nova função para buscar o anúncio da API
  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings`);
        if (!response.ok) throw new Error('Erro ao buscar anúncios');
        
        const data = await response.json();
        const foundListing = data.data.find((item) => item.id === id);

        if (foundListing) {
          setListing(foundListing);
        } else {
          setError('Anúncio não encontrado.');
        }
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar o anúncio.');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // Busca informações do vendedor
  useEffect(() => {
    if (!listing || !listing.userId) return;

    const fetchSeller = async () => {
      try {
        const response = await fetch(`/api/users/${listing.userId}`);
        if (!response.ok) throw new Error('Erro ao buscar vendedor');

        const sellerData = await response.json();
        setSeller(sellerData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSeller();
  }, [listing]);

  const handleNextImage = () => {
    if (listing?.imageUrls?.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === listing.imageUrls.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (listing?.imageUrls?.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? listing.imageUrls.length - 1 : prevIndex - 1
      );
    }
  };

  const handleImageClick = (idx = currentImageIndex) => {
    if (!isDesktop) return;
    setCurrentImageIndex(idx);
    setIsImageModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsImageModalOpen(false);
  };

  const handleBuy = () => {
    router.push(`/payments/details/${listing.id}`);
  };

  if (loading) {
    return (
      <div className="w-screen px-4 py-8">
        <p className="text-center text-xl text-gray-500">
          Carregando detalhes do anúncio...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen px-4 py-8">
        <p className="text-center text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-8 overflow-x-hidden">
      <div className="px-4 md:px-8 py-8 max-h-screen overflow-auto">
        {listing ? (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="relative md:w-7/12 w-full">
              <div className="hidden md:block relative">
                {listing.imageUrls?.length > 0 ? (
                  <div className="flex items-center justify-center h-[650px]">
                    <img
                      src={listing.imageUrls[currentImageIndex]}
                      alt={`Imagem ${currentImageIndex + 1}`}
                      className="w-full object-contain rounded-md shadow-lg cursor-pointer"
                      onClick={() => handleImageClick()}
                      style={{ maxHeight: '100%' }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[650px]">
                    <img
                      src="https://via.placeholder.com/600x300"
                      alt="Imagem do produto"
                      className="w-full object-contain rounded-md shadow-lg cursor-pointer"
                      style={{ minHeight: '300px' }}
                    />
                  </div>
                )}
                <button
                  onClick={handlePrevImage}
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-80 text-black w-10 h-10 rounded-full shadow-md hover:bg-gray-200"
                >
                  &#60;
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-80 text-black w-10 h-10 rounded-full shadow-md hover:bg-gray-200"
                >
                  &#62;
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-between md:w-5/12 w-full">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{listing.title}</h1>
                <hr className="my-4 border-gray-300" />
                <p className="text-lg text-gray-600">{listing.description}</p>
                <hr className="my-4 border-gray-300" />
              </div>
              <h2 className="text-5xl text-gray-600">£{listing.price}</h2>
              <div className="flex gap-4 mt-2">
                <button
                  className="w-full py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all shadow-md"
                  onClick={handleBuy}
                >
                  Buy
                </button>
                <button
                  className="w-full py-3 bg-gray-300 text-black font-semibold rounded-full hover:bg-gray-400 transition-all shadow-md"
                  onClick={() => alert('Anúncio salvo')}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Anúncio não encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default ListingDetailPage;
