"use client";  // Importante para marcar esse componente como cliente

import React, { useState } from "react";
import { signUp } from "../../../lib/auth"; // Importa a função de signUp do Firebase
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "../../../lib/auth"; // Função para login com Google

const RegisterPage = () => {
  const [name, setName] = useState("");  // Estado para o nome
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");  // Estado para confirmar a senha
  const [agreeTerms, setAgreeTerms] = useState(false);  // Estado para o checkbox "Agree Terms"
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se as senhas coincidem
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    // Verifica se o usuário aceitou os termos e condições
    if (!agreeTerms) {
      setError("Você precisa aceitar os termos e condições.");
      return;
    }

    try {
      // Chama a função de signUp e passa o nome, email e senha
      await signUp(name, email, password);
      router.push("/dashboard"); // Redireciona para o painel após registro
    } catch (err) {
      setError("Erro ao criar a conta. Tente novamente.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle(); // Chama a função de login com Google
      router.push("/dashboard"); // Redireciona para o painel após login
    } catch (err) {
      setError("Erro ao fazer login com Google. Tente novamente.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Registrar</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Campo para o nome */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Campo para o email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Campo para a senha */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Campo para confirmar a senha */}
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Repetir Senha
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Checkbox para aceitar os termos e condições */}
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="agreeTerms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="agreeTerms" className="text-sm text-gray-600">
            Eu aceito os <a href="/terms" className="text-blue-500 hover:underline">termos e condições</a>
          </label>
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Registrar
        </button>
      </form>

      {/* Botão para registrar com o Google */}
      <div className="mt-4 space-y-2">
        <button
          onClick={handleGoogleLogin}
          className="w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Registrar com Google
        </button>
      </div>

      <p className="mt-4 text-sm text-center">
        Já tem uma conta?{" "}
        <a href="/auth/login" className="text-blue-500 hover:underline">
          Faça login
        </a>
      </p>
    </div>
  );
};

export default RegisterPage;
