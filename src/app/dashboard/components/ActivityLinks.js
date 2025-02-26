'use client';
import React, { useState } from 'react';

// Importação dos componentes que serão renderizados conforme o menu selecionado
import Summary from './Summary';
import RecentlyViewed from './RecentlyViewed';
import BidsOffers from './BidOffers';
import Purchases from './Purchases';
import Watchlist from './Watchlist';

const ActivityLinks = () => {
  // Estado que controla qual componente está ativo
  const [activeComponent, setActiveComponent] = useState("summary");

  // Função para lidar com a mudança de seleção
  const handleSelectChange = (e) => {
    setActiveComponent(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Campo de seleção com bordas arredondadas */}
      <div className="p-6">
        <select
          value={activeComponent}
          onChange={handleSelectChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="summary">Summary</option>
          <option value="recentlyViewed">Recently Viewed</option>
          <option value="bidsOffers">Bids & Offers</option>
          <option value="purchases">Purchases</option>
          <option value="watchlist">Watchlist</option>
        </select>
      </div>

      {/* Área principal onde o conteúdo é exibido */}
      <div className="flex-1 p-6">
        {activeComponent === "summary" && <Summary />}
        {activeComponent === "recentlyViewed" && <RecentlyViewed />}
        {activeComponent === "bidsOffers" && <BidsOffers />}
        {activeComponent === "purchases" && <Purchases />}
        {activeComponent === "watchlist" && <Watchlist />}
      </div>
    </div>
  );
};

export default ActivityLinks;
