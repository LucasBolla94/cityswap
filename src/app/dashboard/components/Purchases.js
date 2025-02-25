'use client';
import React from 'react';
import Link from 'next/link';

const Purchases = ({ purchases }) => {
  // Se o componente não receber dados via props, usamos uma lista de exemplo
  const purchasedItems = purchases || [
    {
      id: 1,
      title: "Produto Comprado 1",
      imageUrl: "https://via.placeholder.com/250x200",
      price: "$100",
      purchaseDate: "2025-01-01"
    },
    {
      id: 2,
      title: "Produto Comprado 2",
      imageUrl: "https://via.placeholder.com/250x200",
      price: "$150",
      purchaseDate: "2025-01-03"
    },
    {
      id: 3,
      title: "Produto Comprado 3",
      imageUrl: "https://via.placeholder.com/250x200",
      price: "$200",
      purchaseDate: "2025-01-05"
    },
    {
      id: 4,
      title: "Produto Comprado 4",
      imageUrl: "https://via.placeholder.com/250x200",
      price: "$250",
      purchaseDate: "2025-01-10"
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Purchases</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {purchasedItems.map(item => (
          <Link key={item.id} href={`/product/${item.id}`}>
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-md text-gray-700">Price: {item.price}</p>
              <p className="text-sm text-gray-500">Purchased on: {item.purchaseDate}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Purchases;
