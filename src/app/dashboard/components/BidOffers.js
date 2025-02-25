'use client';
import React from 'react';
import Link from 'next/link';

const BidOffers = ({ bids }) => {
  // Se não receber dados via props, definimos uma lista de exemplo
  const bidItems = bids || [
    {
      id: 1,
      title: "Produto Exemplo 1",
      imageUrl: "https://via.placeholder.com/250x200",
      currentBid: "$100"
    },
    {
      id: 2,
      title: "Produto Exemplo 2",
      imageUrl: "https://via.placeholder.com/250x200",
      currentBid: "$150"
    },
    {
      id: 3,
      title: "Produto Exemplo 3",
      imageUrl: "https://via.placeholder.com/250x200",
      currentBid: "$200"
    },
    {
      id: 4,
      title: "Produto Exemplo 4",
      imageUrl: "https://via.placeholder.com/250x200",
      currentBid: "$250"
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Bids & Offers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {bidItems.map(item => (
          <Link key={item.id} href={`/product/${item.id}`}>
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-40 object-cover rounded-md mb-2" 
              />
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-md text-gray-700">Current Bid: {item.currentBid}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BidOffers;
