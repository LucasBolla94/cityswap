"use client";

import React, { useState } from "react";
import { login } from "../../../lib/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Realiza o login e obtém o usuário autenticado
      const user = await login(email, password);

      // Verifica se o usuário existe na coleção "business-users"
      const businessDocRef = doc(db, "business-users", user.uid);
      const businessDocSnap = await getDoc(businessDocRef);

      if (businessDocSnap.exists()) {
        // Se existir, o usuário é um Business e será redirecionado para a dashboard Business
        router.push("/dashbusiness");
      } else {
        // Caso contrário, é um usuário Private e vai para a dashboard padrão
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao fazer login. Tente novamente.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Entrar
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Não tem uma conta?{" "}
        <a href="/auth/register" className="text-blue-500 hover:underline">
          Registre-se
        </a>
      </p>
    </div>
  );
};

export default LoginPage;
