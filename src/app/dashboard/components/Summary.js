'use client';

import React, { useState } from 'react';
import ListingGrid from '../../../components/ListingGrid'; // Importa o componente de listagem

const Summary = ({ orders }) => {
  // Usamos um estado para controlar qual aba está ativa
  const [activeTab, setActiveTab] = useState('All Purchases');

  // Definimos as abas que serão exibidas
  const tabs = [
    'All Purchases',
    'Processing',
    'Return & Cancelled',
    'Awaiting your Feedback',
    'Dispatched'
  ];

  // Filtramos os pedidos conforme a aba ativa.
  // Aqui, assumimos que cada pedido possui uma propriedade "status"
  const filteredOrders = activeTab === 'All Purchases'
    ? orders
    : orders.filter(order => order.status === activeTab);

  return (
    <div className="p-4">
      {/* Cabeçalho da página */}
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      
      {/* Abas para filtro dos pedidos */}
      <div className="flex flex-row gap-4 mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full border transition-colors ${
              activeTab === tab
                ? 'bg-blue-500 text-white'
                : 'bg-white text-blue-500 hover:bg-blue-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Exibe os pedidos filtrados ou uma mensagem se não houver nenhum */}
      <div>
        {filteredOrders && filteredOrders.length > 0 ? (
          <ListingGrid ads={filteredOrders} />
        ) : (
          <p>Nenhum pedido encontrado para a categoria "{activeTab}".</p>
        )}
      </div>
    </div>
  );
};

export default Summary;
