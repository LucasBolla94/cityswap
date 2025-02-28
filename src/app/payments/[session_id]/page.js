'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const { session_id } = useParams(); // Obtém o session_id da URL
  const [loading, setLoading] = useState(true);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    if (!session_id) return;

    const fetchReceiptData = async () => {
      try {
        const res = await fetch(`/api/checkout-session?session_id=${session_id}`);
        if (!res.ok) {
          throw new Error('Erro ao carregar os dados da sessão');
        }
        const data = await res.json();
        setReceiptData(data);
      } catch (error) {
        console.error('Erro:', error);
        setReceiptData({
          productTitle: 'Produto Desconhecido',
          sellerName: 'Vendedor Desconhecido',
          amountPaid: 'N/A',
          purchaseDate: new Date().toLocaleString(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReceiptData();
  }, [session_id]);

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
        <p className="mb-2"><strong>Produto:</strong> {productTitle}</p>
        <p className="mb-2"><strong>Vendedor:</strong> {sellerName}</p>
        <p className="mb-2"><strong>Valor Pago (£):</strong> {amountPaid}</p>
        <p className="mb-2"><strong>Data da Compra:</strong> {purchaseDate}</p>
      </div>
      
      <Link href="/dashboard">
        <button className="mt-6 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all">
          Continuar
        </button>
      </Link>
    </div>
  );
}
