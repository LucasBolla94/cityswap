"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Banner from '../../components/Banner'; // Ajuste o caminho conforme necessário

const AuthPage = () => {
  const router = useRouter();

  const redirectToLogin = () => {
    router.push('/auth/login');
  };

  const redirectToRegister = () => {
    router.push('/auth/register');
  };

  return (
    <div className="flex max-w-4xl mx-auto mt-20 bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Área do formulário */}
      <div className="w-1/2 p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Bem-vindo ao eBay Clone</h2>
        <p className="mb-6 text-center text-gray-600">
          Por favor, faça login ou crie uma conta para continuar.
        </p>
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

      {/* Área do Banner */}
      <div className="w-1/2">
        <Banner />
      </div>
    </div>
  );
};

export default AuthPage;
