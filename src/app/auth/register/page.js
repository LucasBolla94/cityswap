"use client";

import React, { useState } from "react";
import { signUp } from "../../../lib/auth";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [accountType, setAccountType] = useState("private");

  // Campos para conta Private
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Campos para conta Business
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessRegistered, setBusinessRegistered] = useState("");

  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (accountType === "private") {
        await signUp({
          firstName,
          lastName,
          email,
          password,
          accountType,
        });
      } else {
        await signUp({
          businessName,
          businessEmail,
          password,
          accountType,
          businessRegistered,
          email: businessEmail, // Utiliza o email do negócio para validação e cadastro
        });
      }
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Erro ao criar a conta. Tente novamente.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Registrar</h2>

      {/* Switch personalizado para alternar entre Private e Business */}
      <div className="relative w-full mb-6">
        <div
          className="w-full flex bg-gray-300 rounded-full p-1 cursor-pointer relative"
          onClick={() => setAccountType(accountType === "private" ? "business" : "private")}
        >
          {/* Botão deslizante */}
          <div
            className={`absolute top-0 left-0 h-full w-1/2 bg-blue-500 rounded-full transition-transform duration-300 ${
              accountType === "business" ? "translate-x-full" : "translate-x-0"
            }`}
          ></div>

          {/* Texto dentro do botão */}
          <div className="relative w-1/2 text-center text-sm font-medium z-10 text-white">
            Private
          </div>
          <div className="relative w-1/2 text-center text-sm font-medium z-10 text-white">
            Business
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <form onSubmit={handleSubmit}>
        {accountType === "private" ? (
          <>
            {/* Campos para conta Private */}
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Sobrenome
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
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
            <div className="mb-4">
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
            <p className="text-xs text-gray-600 mb-4">
              We'll regularly send you emails with offers regarding our services. You can unsubscribe at any time.
              <br />
              By selecting Create personal account, you agree to our User Agreement and acknowledge reading our User Privacy Notice.
            </p>
          </>
        ) : (
          <>
            {/* Campos para conta Business */}
            <div className="mb-4">
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                Business Name
              </label>
              <input
                type="text"
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700">
                Business Email
              </label>
              <input
                type="email"
                id="businessEmail"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* Campo de senha para conta Business */}
            <div className="mb-4">
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
            <div className="mb-4">
              <label htmlFor="businessRegistered" className="block text-sm font-medium text-gray-700">
                Business Registered Where
              </label>
              <input
                type="text"
                id="businessRegistered"
                value={businessRegistered}
                onChange={(e) => setBusinessRegistered(e.target.value)}
                className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <p className="text-xs text-gray-600 mb-4">
              If your business isn't registered, select your country of residence.
              <br />
              We'll regularly send you emails with offers regarding our services. You can unsubscribe at any time.
              <br />
              By selecting Create business account, you agree to our User Agreement and acknowledge reading our User Privacy Notice.
            </p>
          </>
        )}

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {accountType === "private" ? "Create personal account" : "Create business account"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
