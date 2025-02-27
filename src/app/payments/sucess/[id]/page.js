'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SuccessPage({ params }) {
  const { id } = params; // "id" é o session_id vindo da URL
  const [loading, setLoading] = useState(true);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    // Função para buscar os detalhes da sessão de checkout a partir do backend
    const fetchReceiptData = async () => {
      try {
        // Exemplo: chamada para uma API que retorna os dados do recibo com base no session_id
        const res = await fetch(`/api/checkout-session?session_id=${id}`);
        if (!res.ok) {
          throw new Error('Erro ao carregar os dados da sessão');
        }
        const data = await res.json();
        setReceiptData(data);
      } catch (error) {
        console.error('Erro:', error);
        // Para fins de teste, você pode definir dados simulados
        setReceiptData({
          productTitle: 'Title Ads',
          sellerName: 'Vendedor Name',
          amountPaid: '99.99',
          purchaseDate: new Date().toLocaleString(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReceiptData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando recibo...</p>
      </div>
    );
  }

  if (!receiptData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Erro ao carregar os dados da compra.</p>
      </div>
    );
  }

  const { productTitle, sellerName, amountPaid, purchaseDate } = receiptData;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-green-600">
        Pagamento Realizado com Sucesso!
      </h1>
      
      <div className="bg-white shadow-md rounded-md p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Recibo</h2>
        <p className="mb-2">
          <strong>Name of Product bought:</strong> {productTitle}
        </p>
        <p className="mb-2">
          <strong>Seller:</strong> {sellerName}
        </p>
        <p className="mb-2">
          <strong>Amount £:</strong> {amountPaid}
        </p>
        <p className="mb-2">
          <strong>Date:</strong> {purchaseDate}
        </p>
      </div>
      
      <Link href="/dashboard">
        <button className="mt-6 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all">
          Continue
        </button>
      </Link>
    </div>
  );
}
