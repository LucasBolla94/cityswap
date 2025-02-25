'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Importa os componentes do painel
import BusinessHome from './components/Home';
import BusinessAccount from './components/Account';
import BusinessAds from './components/Ads';
import BusinessOrders from './components/Orders';
import BusinessSettings from './components/Setting';
import BusinessReports from './components/Reports';

const BusinessDashboardPage = () => {
  const [user, setUser] = useState(null);
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeComponent, setActiveComponent] = useState("home");
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Busca o nome do negócio no Firestore
        const userRef = doc(db, 'business-users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setBusinessName(userSnap.data().businessName || 'No Business Name');
        } else {
          setBusinessName('No Business Name');
        }
      } else {
        router.push('/auth/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) return <div className="flex justify-center items-center h-screen text-lg font-semibold">Carregando...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-lg h-screen p-6">
        <h2 className="text-xl font-semibold mb-6">Bem-vindo, {businessName}</h2>
        <nav className="space-y-2">
          {[
            { name: "Home", key: "home" },
            { name: "Minha Conta", key: "account" },
            { name: "Meus Anúncios", key: "ads" },
            { name: "Meus Pedidos", key: "orders" },
            { name: "Configurações", key: "settings" },
            { name: "Relatórios", key: "reports" }
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

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Painel Business</h1>
        {activeComponent === "home" && <BusinessHome user={user} />}
        {activeComponent === "account" && <BusinessAccount user={user} />}
        {activeComponent === "ads" && <BusinessAds user={user} />}
        {activeComponent === "orders" && <BusinessOrders user={user} />}
        {activeComponent === "reports" && <BusinessReports user={user} />}
        {activeComponent === "settings" && <BusinessSettings user={user} />}
      </main>
    </div>
  );
};

export default BusinessDashboardPage;
