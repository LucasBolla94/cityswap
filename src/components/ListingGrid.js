'use client';

import React from 'react';
import Link from 'next/link';

const ListingGrid = ({ ads }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
      {ads.map(ad => (
        <div
          key={ad.id}
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105 min-w-[200px] min-h-[300px] sm:min-w-[250px] md:min-w-[280px] lg:min-w-[300px] xl:min-w-[330px]"
        >
          <Link href={`/listings/${ad.id}`}>
            {/* Container com a imagem do anúncio */}
            <div className="relative w-full mb-6 h-48 sm:h-60 md:h-72">
              <img
                src={ad.imageUrls && ad.imageUrls[0] ? ad.imageUrls[0] : 'https://via.placeholder.com/600x400'}
                alt={ad.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Título do Anúncio */}
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 truncate">{ad.title}</h3>

            {/* Preço do Anúncio */}
            <p className="text-lg sm:text-xl font-bold text-gray-800">{ad.price ? `$${ad.price}` : 'Preço não disponível'}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ListingGrid;
