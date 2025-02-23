// /src/app/auth/page.js

"use client";  // Marca o componente como cliente

import React from 'react';
import { useRouter } from 'next/navigation';

const AuthPage = () => {
  const router = useRouter();

  const redirectToLogin = () => {
    router.push('/auth/login');
  };

  const redirectToRegister = () => {
    router.push('/auth/register');
  };

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Bem-vindo ao eBay Clone</h2>
      <p className="mb-6 text-center text-gray-600">Por favor, faça login ou crie uma conta para continuar.</p>

      <div className="space-y-4">
        <button
          onClick={redirectToLogin}
          className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Entrar
        </button>
        <button
          onClick={redirectToRegister}
          className="w-full p-3 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Criar Conta
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
