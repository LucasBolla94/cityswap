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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Menu à esquerda */}
      <aside className="w-1/4 bg-white shadow-lg h-screen p-6">
        <nav className="space-y-2">
          {[
            { name: "Summary", key: "summary" },
            { name: "Recently Viewed", key: "recentlyViewed" },
            { name: "Bids & Offers", key: "bidsOffers" },
            { name: "Purchases", key: "purchases" },
            { name: "Watchlist", key: "watchlist" }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveComponent(item.key)}
              className={`block w-full text-left p-3 rounded-lg text-gray-700 font-medium 
                transition duration-300 hover:bg-gray-200 hover:font-semibold
                ${activeComponent === item.key ? "bg-gray-300 font-bold" : ""}`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Área principal à direita onde o conteúdo é exibido */}
      <main className="flex-1 p-6">
        {activeComponent === "summary" && <Summary />}
        {activeComponent === "recentlyViewed" && <RecentlyViewed />}
        {activeComponent === "bidsOffers" && <BidsOffers />}
        {activeComponent === "purchases" && <Purchases />}
        {activeComponent === "watchlist" && <Watchlist />}
      </main>
    </div>
  );
};

export default ActivityLinks;
