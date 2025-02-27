'use client';
import React, { useState } from 'react';

// Importando o componente Inbox do arquivo separado
import Inbox from './components/inbox';
import Membermsg from './components/membermsg';
import SuportMsg from './components/suportemsg';
import SentMsg from './components/sentmsg';
import DeletedMsg from './components/deletemsg';

const FromMembers = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">From Members</h2>
    <p>Mensagens enviadas por membros.</p>
  </div>
);

const FromCitySwapUk = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">From CitySwapUk</h2>
    <p>Mensagens enviadas por CitySwapUk.</p>
  </div>
);

const Sent = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Sent</h2>
    <p>Mensagens que você enviou.</p>
  </div>
);

const Deleted = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Deleted</h2>
    <p>Mensagens deletadas.</p>
  </div>
);

const Messages = () => {
  // Estado que controla qual componente (aba) está ativo
  const [activeComponent, setActiveComponent] = useState("inbox");

  // Array com os itens do menu
  const menuItems = [
    { name: "Inbox", key: "inbox" },
    { name: "From Members", key: "membermsg" },
    { name: "From CitySwapUk", key: "suportmsg" },
    { name: "Sent", key: "sentmsg" },
    { name: "Deleted", key: "deletedmsg" }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Menu à esquerda */}
      <aside className="w-1/4 bg-white shadow-lg h-screen p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => (
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

      {/* Área principal à direita com o conteúdo */}
      <main className="flex-1 p-6">
        {activeComponent === "inbox" && <Inbox />}
        {activeComponent === "membermsg" && <Membermsg />}
        {activeComponent === "suportmsg" && <SuportMsg />}
        {activeComponent === "sentmsg" && <SentMsg />}
        {activeComponent === "deletedmsg" && <DeletedMsg />}
      </main>
    </div>
  );
};

export default Messages;
