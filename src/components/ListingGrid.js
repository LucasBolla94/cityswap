'use client';
import React from 'react';
import Link from 'next/link';

const ListingGrid = ({ ads }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4">
        {ads.map(ad => (
          <div
            key={ad.id}
            className="bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-transform cursor-pointer transform hover:scale-105 flex-shrink-0 snap-start min-w-[250px] max-w-[250px] h-[300px]"
          >
            <Link href={`/listings/${ad.id}`}>
              {/* Container com a imagem do anúncio */}
              <div className="relative w-full h-2/3 mb-2">
                <img
                  src={ad.imageUrls && ad.imageUrls[0] ? ad.imageUrls[0] : 'https://via.placeholder.com/250x200'}
                  alt={ad.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              {/* Título do anúncio */}
              <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">
                {ad.title}
              </h3>
              {/* Preço do anúncio */}
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
