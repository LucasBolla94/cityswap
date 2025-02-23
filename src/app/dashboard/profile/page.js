'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth'; // Hook de autenticação
import { updateUserProfile } from '../../../lib/auth'; // Função para atualizar o perfil
import { useRouter } from 'next/navigation'; // Alterado de next/router para next/navigation

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile({ displayName: name, email }); // Atualiza o perfil no backend
      router.push('/dashboard'); // Redireciona de volta ao painel
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Carregando...</div>;

  if (!user) {
    router.push('/auth/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Editar Perfil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-lg">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Salvar alterações
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
