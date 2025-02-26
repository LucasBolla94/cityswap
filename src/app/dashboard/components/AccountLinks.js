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
  // Quando activeComponent for null, exibimos o menu; caso contrário, exibimos o conteúdo selecionado.
  const [activeComponent, setActiveComponent] = useState(null);

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

  // Mapeamento de chaves para componentes
  const componentsMap = {
    personalInformation: <PersonalInformation />,
    address: <Address />,
    payments: <Payments />,
    feedback: <Feedback />,
    sellerDashboard: <SellerDashboard />,
    sellerAccount: <SellerAccount />,
    subscriptions: <Subscriptions />,
    permissions: <Permissions />,
    advertisementPreferences: <AdvertisementPreferences />,
    communicationPreference: <CommunicationPreference />,
    closeAccount: <CloseAccount />,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {activeComponent ? (
        // Conteúdo selecionado ocupa toda a tela com um botão de voltar
        <div className="max-w-4xl w-full mx-auto bg-white rounded-lg shadow-lg p-6">
          <button
            onClick={() => setActiveComponent(null)}
            className="mb-4 text-blue-500 hover:underline"
          >
            &larr; Voltar
          </button>
          {componentsMap[activeComponent]}
        </div>
      ) : (
        // Menu de seleção
        <div className="max-w-4xl w-full mx-auto bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Configurações da Conta</h2>
          <nav className="grid grid-cols-1 gap-4">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveComponent(item.key)}
                className="block w-full text-left p-3 rounded-lg text-gray-700 font-medium transition duration-300 hover:bg-gray-200 hover:font-semibold"
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default AccountsLinks;
