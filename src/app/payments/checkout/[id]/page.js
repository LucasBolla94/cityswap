'use client'; // Diretiva para indicar que este é um componente do cliente

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // Importa useParams do next/navigation
import { loadStripe } from '@stripe/stripe-js';
import Image from 'next/image';

// Carrega o Stripe com a chave pública
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const params = useParams(); // Obtém os parâmetros da URL
  const productId = params?.id; // Acessa diretamente o productId, garantindo que params esteja definido
  const [product, setProduct] = useState(null);
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const [postCode, setPostCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    // Função para buscar os detalhes do produto
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar detalhes do produto');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do produto:', error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handlePay = async (event) => {
    event.preventDefault();

    if (address.trim().length < 5 || postCode.trim().length < 4) {
      alert('Por favor, preencha todos os campos de endereço corretamente.');
      return;
    }

    setLoading(true);
    try {
      console.log('📡 Enviando solicitação para criar checkout session...');

      const response = await fetch('/api/checkoutsession', { // 🔹 Corrigido para corresponder ao backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          address,
          address2,
          postCode,
        }),
      });

      console.log('🔍 Resposta da API:', response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar sessão de checkout');
      }

      const { sessionId } = await response.json();
      console.log('✅ Sessão de checkout criada com sucesso:', sessionId);

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe não foi carregado.');
      }

      console.log('🔄 Redirecionando para Stripe Checkout...');
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('❌ Erro no redirecionamento do Stripe:', error);
        alert('Erro ao redirecionar para o Stripe. Tente novamente.');
      }
    } catch (err) {
      console.error('🔥 Erro ao processar o pagamento:', err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      {product ? (
        <div className="w-full max-w-md bg-white p-6 rounded shadow mb-6">
          <Image
            src={product.image || null}
            alt={product.title}
            width={500}
            height={500}
            className="w-full h-auto object-cover mb-4"
          />
          <h2 className="text-2xl font-semibold mb-2">{product.title}</h2>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-xl font-bold">R$ {typeof product.price === 'number' ? product.price.toFixed(2) : 'Preço indisponível'}</p>
        </div>
      ) : (
        <p>Carregando detalhes do produto...</p>
      )}
      <form onSubmit={handlePay} className="w-full max-w-md bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label htmlFor="address" className="block text-lg font-medium text-gray-700">
            Endereço:
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Digite seu endereço"
            className="mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address2" className="block text-lg font-medium text-gray-700">
            Endereço 2:
          </label>
          <input
            type="text"
            id="address2"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            placeholder="Apto, bloco, etc. (opcional)"
            className="mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="postCode" className="block text-lg font-medium text-gray-700">
            Código Postal:
          </label>
          <input
            type="text"
            id="postCode"
            value={postCode}
            onChange={(e) => setPostCode(e.target.value)}
            placeholder="Digite seu código postal"
            className="mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all shadow-md"
        >
          {loading ? 'Processando...' : 'Pagar'}
        </button>
      </form>
    </div>
  );
}
