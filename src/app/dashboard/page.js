'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Home from './components/Home';
import Account from './components/Account';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeComponent, setActiveComponent] = useState("home");
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/auth/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Barra Lateral */}
      <aside className="w-1/4 bg-white shadow-lg h-screen p-6">
        <h2 className="text-xl font-semibold mb-6">
          Bem-vindo, {user.displayName || user.email}
        </h2>
        <nav className="space-y-4">
          <button
            onClick={() => setActiveComponent("account")}
            className="block text-gray-700 hover:text-gray-900 cursor-pointer text-left w-full"
          >
            Resumo da Conta
          </button>
          <button
            onClick={() => setActiveComponent("home")}
            className="block text-gray-700 hover:text-gray-900 cursor-pointer text-left w-full"
          >
            Home
          </button>
          <Link href="/dashboard/my-listings" className="block text-gray-700 hover:text-gray-900">
            Meus Anúncios
          </Link>
          <Link href="/dashboard/orders" className="block text-gray-700 hover:text-gray-900">
            Meus Pedidos
          </Link>
          <Link href="/dashboard/settings" className="block text-gray-700 hover:text-gray-900">
            Configurações de Conta
          </Link>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        {activeComponent === "home" && <Home user={user} />}
        {activeComponent === "account" && <Account />}
      </main>
    </div>
  );
};

export default DashboardPage;
