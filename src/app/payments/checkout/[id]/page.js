'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { loadStripe } from '@stripe/stripe-js';

// Carrega o Stripe com a chave pública (utilize NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no .env.local)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const { id } = useParams(); // 'id' é o productId vindo da rota dinâmica /payments/checkout/[id]
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePay = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Validação opcional do endereço (ex.: tamanho mínimo)
      if (address.trim().length < 10) {
        alert('Por favor, insira um endereço válido.');
        setLoading(false);
        return;
      }

      // Usa o productId extraído da rota
      const productId = id;
      if (!productId) {
        console.error("Product ID não foi encontrado na URL.");
        setLoading(false);
        return;
      }

      // Chama a função do Firebase que cria a sessão de checkout no Stripe
      const functions = getFunctions();
      const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
      const result = await createCheckoutSession({ productId });
      const { sessionId } = result.data;

      // Redireciona o usuário para a página de pagamento do Stripe
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error("Erro no redirecionamento do Stripe:", error);
      }
    } catch (error) {
      console.error("Erro ao criar sessão de checkout:", error);
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
