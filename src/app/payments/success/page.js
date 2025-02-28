"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula um carregamento por 3 segundos
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading . . .</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Tela Principal</h1>
      <p className="text-gray-600">Este é o conteúdo da tela principal.</p>
      <Link href="/dashboard">
        <button className="mt-6 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all">
          Ir para o Dashboard
        </button>
      </Link>
    </div>
  );
}
