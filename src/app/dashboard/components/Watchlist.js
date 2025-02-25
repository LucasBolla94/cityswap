'use client';
import React from 'react';
import Link from 'next/link';

const Watchlist = ({ watchlist }) => {
  // Se não receber a prop 'watchlist', usamos uma lista de exemplo
  const savedItems = watchlist || [
    {
      id: 1,
      title: "Produto Salvo 1",
      imageUrl: "https://via.placeholder.com/250x200",
      description: "Descrição breve do produto 1",
    },
    {
      id: 2,
      title: "Produto Salvo 2",
      imageUrl: "https://via.placeholder.com/250x200",
      description: "Descrição breve do produto 2",
    },
    {
      id: 3,
      title: "Produto Salvo 3",
      imageUrl: "https://via.placeholder.com/250x200",
      description: "Descrição breve do produto 3",
    },
    {
      id: 4,
      title: "Produto Salvo 4",
      imageUrl: "https://via.placeholder.com/250x200",
      description: "Descrição breve do produto 4",
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Watchlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {savedItems.map(item => (
          <Link key={item.id} href={`/product/${item.id}`}>
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-40 object-cover rounded-md mb-2" 
              />
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
