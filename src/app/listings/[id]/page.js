'use client';

import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';

const ListingDetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        const docRef = doc(db, 'ads', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setListing(docSnap.data());
        } else {
          setError('Anúncio não encontrado.');
        }
      } catch (error) {
        setError('Erro ao carregar o anúncio.');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleNextImage = () => {
    if (listing.imageUrls && listing.imageUrls.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === listing.imageUrls.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (listing.imageUrls && listing.imageUrls.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? listing.imageUrls.length - 1 : prevIndex - 1
      );
    }
  };

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsImageModalOpen(false);
  };

  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {loading ? (
          <p className="text-center">Carregando detalhes do anúncio...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : listing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-lg shadow-xl max-w-6xl mx-auto">
            {/* Detalhes do Anúncio */}
            <div>
              {/* Galeria de Imagens */}
              <div className="relative mb-6">
                {listing.imageUrls && listing.imageUrls.length > 0 ? (
                  <img
                    src={listing.imageUrls[currentImageIndex]}
                    alt={`Imagem ${currentImageIndex + 1}`}
                    className="w-full h-80 object-cover rounded-md shadow-lg mb-6 cursor-pointer"
                    onClick={handleImageClick}
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/600x400"
                    alt="Imagem do produto"
                    className="w-full h-80 object-cover rounded-md shadow-lg mb-6 cursor-pointer"
                    onClick={handleImageClick}
                  />
                )}

                {/* Botões de navegação das imagens */}
                <button
                  onClick={handlePrevImage}
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md hover:bg-gray-700"
                >
                  &#8592;
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md hover:bg-gray-700"
                >
                  &#8594;
                </button>
              </div>

              {/* Título e Preço */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{listing.title}</h1>
                <p className="text-xl font-semibold text-green-500">{listing.price ? `$${listing.price}` : 'Preço não disponível'}</p>
              </div>

              {/* Descrição */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Descrição:</h3>
                <p className="text-lg text-gray-600 mt-2">{listing.description}</p>
              </div>

              {/* Categoria */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Categoria:</h3>
                <p className="text-gray-600">{listing.category}</p>
              </div>

              {/* Data de Criação */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Publicado em:</h3>
                <p className="text-gray-600">{new Date(listing.createdAt.seconds * 1000).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Informações do Vendedor */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Informações do Vendedor</h3>
              <div className="flex flex-col space-y-4">
                <p className="text-gray-700"><strong>Nome:</strong> {listing.sellerName}</p>
                <p className="text-gray-700"><strong>Avaliação:</strong> {listing.sellerRating}</p>
                <p className="text-gray-700"><strong>Localização:</strong> {listing.sellerLocation}</p>
                <p className="text-gray-700"><strong>Contatos:</strong> {listing.sellerContact}</p>
              </div>
              <button className="mt-4 w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all shadow-md">
                Enviar Mensagem
              </button>
              <button className="mt-4 w-full py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-all shadow-md">
                Details
              </button>
            </div>

            {/* Botão de Buy */}
            <div className="w-full mt-4">
              <button
                className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all shadow-md"
                onClick={() => alert('Processando a compra')}
              >
                Buy
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Anúncio não encontrado.</p>
        )}
      </div>

      {/* Modal de Imagem em Tamanho Real */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-4 rounded-lg max-w-2xl max-h-full overflow-auto"
            onClick={(e) => e.stopPropagation()} // Evita que o modal feche ao clicar na imagem
          >
            <img
              src={listing.imageUrls[currentImageIndex]}
              alt={`Imagem em tamanho real ${currentImageIndex + 1}`}
              className="w-full h-auto object-contain"
            />
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-white bg-red-600 p-2 rounded-full hover:bg-red-700"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetailPage;
