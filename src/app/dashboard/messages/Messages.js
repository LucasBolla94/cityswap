'use client';
import React, { useState } from 'react';

// Componentes internos para cada categoria de mensagem

const Inbox = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Inbox</h2>
    <p>Aqui você verá todas as mensagens recebidas.</p>
    {/* Aqui você pode mapear os emails, por exemplo, utilizando uma lista de objetos */}
  </div>
);

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
  // Estado que controla a aba ativa
  const [activeComponent, setActiveComponent] = useState("inbox");

  // Array com os itens do menu
  const menuItems = [
    { name: "Inbox", key: "inbox" },
    { name: "From Members", key: "fromMembers" },
    { name: "From CitySwapUk", key: "fromCitySwapUk" },
    { name: "Sent", key: "sent" },
    { name: "Deleted", key: "deleted" }
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
        {activeComponent === "fromMembers" && <FromMembers />}
        {activeComponent === "fromCitySwapUk" && <FromCitySwapUk />}
        {activeComponent === "sent" && <Sent />}
        {activeComponent === "deleted" && <Deleted />}
      </main>
    </div>
  );
};

export default Messages;
