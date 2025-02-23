'use client';

import React from 'react';
import Link from 'next/link';

const ListingGrid = ({ ads }) => {
  return (
    <div className="w-screen flex flex-row gap-8 overflow-x-auto">
      {ads.map(ad => (
        <div
          key={ad.id}
          className="bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105 w-[250px] h-[300px]"
        >
          <Link href={`/listings/${ad.id}`}>
            {/* Container com a imagem do anúncio */}
            <div className="relative w-full h-2/3 mb-4">
              <img
                src={ad.imageUrls && ad.imageUrls[0] ? ad.imageUrls[0] : 'https://via.placeholder.com/250x200'}
                alt={ad.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Título do anúncio */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
              {ad.title}
            </h3>

            {/* Preço do anúncio */}
            <p className="text-md font-bold text-gray-800">
              {ad.price ? `$${ad.price}` : 'Preço não disponível'}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ListingGrid;
