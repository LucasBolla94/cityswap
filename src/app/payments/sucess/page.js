'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id'); // Obtém o session_id da query string
  const [loading, setLoading] = useState(true);
  const [receiptData, setReceiptData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setError(true);
      setLoading(false);
      return;
    }

    const fetchReceiptData = async () => {
      try {
        console.log(`🔍 Buscando dados da sessão: ${sessionId}`);

        const res = await fetch(`/api/checkoutsession?session_id=${sessionId}`);
        if (!res.ok) {
          throw new Error('Erro ao carregar os dados da sessão');
        }

        const data = await res.json();
        setReceiptData(data);
      } catch (error) {
        console.error('❌ Erro ao buscar os dados do pagamento:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReceiptData();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Carregando detalhes do pagamento...</p>
      </div>
    );
  }

  if (error || !receiptData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <p className="text-red-600 text-lg font-semibold">
          Erro ao carregar os dados da compra. <br />
          Tente novamente mais tarde ou entre em contato com o suporte.
        </p>
      </div>
    );
  }

  const { productTitle, sellerName, amountPaid, purchaseDate } = receiptData;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-green-600">
        ✅ Pagamento Confirmado!
      </h1>
      
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4">Recibo de Pagamento</h2>
        <p className="mb-2"><strong>Produto:</strong> {productTitle || 'Produto Desconhecido'}</p>
        <p className="mb-2"><strong>Vendedor:</strong> {sellerName || 'Vendedor Desconhecido'}</p>
        <p className="mb-2"><strong>Valor Pago (£):</strong> {amountPaid || 'N/A'}</p>
        <p className="mb-2"><strong>Data da Compra:</strong> {purchaseDate || 'Data não disponível'}</p>
      </div>
      
      <Link href="/dashboard">
        <button className="mt-6 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all">
          Ir para o Dashboard
        </button>
      </Link>
    </div>
  );
}
