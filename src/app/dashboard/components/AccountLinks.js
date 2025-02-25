'use client';
import React, { useState } from 'react';

// Componentes para cada opção do menu
const PersonalInformation = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
    <p>Aqui você pode configurar seus dados pessoais.</p>
  </div>
);

const Address = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Address</h2>
    <p>Gerencie seus endereços de entrega.</p>
  </div>
);

const Payments = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Payments</h2>
    <p>Revise e atualize seus métodos de pagamento.</p>
  </div>
);

const Feedback = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Feedback</h2>
    <p>Visualize e envie feedback sobre suas experiências.</p>
  </div>
);

const SellerDashboard = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Seller Dashboard</h2>
    <p>Acesse métricas e desempenho do seu negócio.</p>
  </div>
);

const SellerAccount = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Seller Account</h2>
    <p>Gerencie as configurações da sua conta de vendedor.</p>
  </div>
);

const Subscriptions = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Subscriptions</h2>
    <p>Revise e gerencie suas assinaturas.</p>
  </div>
);

const Permissions = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Permissions</h2>
    <p>Controle as permissões da sua conta.</p>
  </div>
);

const AdvertisementPreferences = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Advertisement Preferences</h2>
    <p>Defina suas preferências para anúncios.</p>
  </div>
);

const CommunicationPreference = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Communication Preference</h2>
    <p>Gerencie como você deseja receber comunicações.</p>
  </div>
);

const CloseAccount = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Close Account</h2>
    <p>Se desejar, você pode fechar sua conta aqui.</p>
  </div>
);

const AccountsLinks = () => {
  // Estado que controla qual opção está ativa
  const [activeComponent, setActiveComponent] = useState("personalInformation");

  // Lista de itens do menu com nome e chave
  const menuItems = [
    { name: "Personal Information", key: "personalInformation" },
    { name: "Address", key: "address" },
    { name: "Payments", key: "payments" },
    { name: "Feedback", key: "feedback" },
    { name: "Seller Dashboard", key: "sellerDashboard" },
    { name: "Seller Account", key: "sellerAccount" },
    { name: "Subscriptions", key: "subscriptions" },
    { name: "Permissions", key: "permissions" },
    { name: "Advertisement Preferences", key: "advertisementPreferences" },
    { name: "Communication Preference", key: "communicationPreference" },
    { name: "Close Account", key: "closeAccount" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Menu lateral à esquerda */}
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
        {activeComponent === "personalInformation" && <PersonalInformation />}
        {activeComponent === "address" && <Address />}
        {activeComponent === "payments" && <Payments />}
        {activeComponent === "feedback" && <Feedback />}
        {activeComponent === "sellerDashboard" && <SellerDashboard />}
        {activeComponent === "sellerAccount" && <SellerAccount />}
        {activeComponent === "subscriptions" && <Subscriptions />}
        {activeComponent === "permissions" && <Permissions />}
        {activeComponent === "advertisementPreferences" && <AdvertisementPreferences />}
        {activeComponent === "communicationPreference" && <CommunicationPreference />}
        {activeComponent === "closeAccount" && <CloseAccount />}
      </main>
    </div>
  );
};

export default AccountsLinks;
