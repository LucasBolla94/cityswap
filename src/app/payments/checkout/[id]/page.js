'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { loadStripe } from '@stripe/stripe-js';
import { app } from '@/lib/firebase';

// Carrega o Stripe com a chave pública (definida em NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no .env.local)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  // Renomeando a propriedade "id" para "productId" para maior clareza
  const { id: productId } = useParams();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePay = async (event) => {
    event.preventDefault();

    // Validação do endereço
    if (address.trim().length < 10) {
      alert('Por favor, insira um endereço válido.');
      return;
    }

    // Verifica se o productId foi passado via URL
    if (!productId) {
      console.error("Product ID não foi encontrado na URL.");
      return;
    }

    setLoading(true);
    try {
      // Configura as funções indicando a região (ex.: "us-central1")
      const functions = getFunctions(app, "us-central1");
      const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
      
      // Chama a função passando o productId
      const { data } = await createCheckoutSession({ productId });
      if (!data || !data.sessionId) {
        throw new Error("Session ID não retornado.");
      }

      // Aguarda o carregamento do Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe não foi carregado.");
      }

      // Redireciona para a página de checkout do Stripe
      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (error) {
        console.error("Erro no redirecionamento do Stripe:", error);
      }
    } catch (err) {
      console.error("Erro ao criar sessão de checkout:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handlePay} className="w-full max-w-md bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label htmlFor="address" className="block text-lg font-medium text-gray-700">
            Endereço para entrega:
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
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all shadow-md"
        >
          {loading ? 'Processando...' : 'Pay'}
        </button>
      </form>
    </div>
  );
}
