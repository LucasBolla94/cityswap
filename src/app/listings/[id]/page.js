'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useParams } from 'next/navigation';

const ListingDetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        // Busca o anúncio diretamente na collection 'ads'
        const docRef = doc(db, 'ads', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() });
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

  useEffect(() => {
    if (!listing || !listing.userId) return;

    const fetchSeller = async () => {
      try {
        let sellerRef = doc(db, 'users', listing.userId);
        let sellerSnap = await getDoc(sellerRef);
        if (!sellerSnap.exists()) {
          sellerRef = doc(db, 'business-users', listing.userId);
          sellerSnap = await getDoc(sellerRef);
        }
        if (sellerSnap.exists()) {
          setSeller(sellerSnap.data());
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSeller();
  }, [listing]);

  const handleNextImage = () => {
    if (listing?.imageUrls && listing.imageUrls.length > 0) {
      setCurrentImageIndex(prevIndex =>
        prevIndex === listing.imageUrls.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (listing?.imageUrls && listing.imageUrls.length > 0) {
      setCurrentImageIndex(prevIndex =>
        prevIndex === 0 ? listing.imageUrls.length - 1 : prevIndex - 1
      );
    }
  };

  const handleImageClick = (idx = currentImageIndex) => {
    setCurrentImageIndex(idx);
    setIsImageModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsImageModalOpen(false);
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
            {/* Lado Esquerdo: Foto */}
            <div className="relative md:w-7/12 w-full">
              {/* Versão Desktop: exibe a imagem com botões de navegação */}
              <div className="hidden md:block">
                {listing.imageUrls && listing.imageUrls.length > 0 ? (
                  <img
                    src={listing.imageUrls[currentImageIndex]}
                    alt={`Imagem ${currentImageIndex + 1}`}
                    className="w-full object-cover rounded-md shadow-lg cursor-pointer"
                    onClick={handleImageClick}
                    style={{ maxHeight: '550px' }}
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/600x300"
                    alt="Imagem do produto"
                    className="w-full object-cover rounded-md shadow-lg cursor-pointer"
                    onClick={handleImageClick}
                    style={{ minHeight: '300px' }}
                  />
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
              {/* Versão Mobile: exibe uma foto por vez com scroll horizontal */}
              <div className="block md:hidden overflow-x-auto snap-x snap-mandatory flex">
                {listing.imageUrls && listing.imageUrls.length > 0 ? (
                  listing.imageUrls.map((url, idx) => (
                    <div key={idx} className="flex-shrink-0 w-full snap-center">
                      <img
                        src={url}
                        alt={`Imagem ${idx + 1}`}
                        className="w-full object-cover rounded-md shadow-lg cursor-pointer"
                        style={{ maxHeight: '350px' }}
                        onClick={() => handleImageClick(idx)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex-shrink-0 w-full snap-center">
                    <img
                      src="https://via.placeholder.com/600x300"
                      alt="Imagem do produto"
                      className="w-full object-cover rounded-md shadow-lg cursor-pointer"
                      style={{ minHeight: '300px' }}
                      onClick={handleImageClick}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Lado Direito: Detalhes */}
            <div className="flex flex-col justify-between md:w-5/12 w-full">
              <div>
                <div className="flex flex-col md:flex-row md:items-baseline gap-2">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {listing.title}
                  </h1>
                  {listing.subtitle && (
                    <p className="text-lg text-gray-600 opacity-60">
                      {listing.subtitle}
                    </p>
                  )}
                </div>
                <hr className="my-4 border-gray-300" />
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Especifications:
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">
                    {listing.specifications || 'N/A'}
                  </p>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Description:
                  </h3>
                  <p className="text-lg text-gray-600">{listing.description}</p>
                </div>
                <hr className="my-4 border-gray-300" />
                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={
                        seller && seller.photo
                          ? seller.photo
                          : 'https://via.placeholder.com/64'
                      }
                      alt="Vendor"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-md text-gray-700">
                      <strong>Vendedor:</strong> {seller ? seller.name : 'Não disponível'}
                    </p>
                    <p className="text-md text-gray-700">
                      <strong>Nível:</strong> {seller ? seller.nivel : 'Não disponível'}
                    </p>
                    {seller && seller.store && (
                      <p className="text-md text-gray-700">
                        <strong>Store:</strong> {seller.store}
                      </p>
                    )}
                  </div>
                </div>
                <hr className="my-4 border-gray-300" />
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all shadow-md"
                  onClick={() => alert('Processando a compra')}
                >
                  Buy
                </button>
                <button
                  className="w-full py-3 bg-gray-300 text-black font-semibold rounded-md hover:bg-gray-400 transition-all shadow-md"
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

      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="w-screen h-screen flex items-center justify-center bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={listing.imageUrls[currentImageIndex]}
              alt={`Imagem em tamanho real ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white bg-red-600 p-2 rounded-sm hover:bg-red-700"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetailPage;
