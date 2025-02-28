'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db, rtdb } from '../../../../lib/firebase';
import { ref, get as rtdbGet, set as rtdbSet, push } from 'firebase/database';
import { auth, useAuth } from '/src/lib/auth';

const DetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user: currentUser, loading: authLoading } = useAuth();

  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Busca os detalhes do anúncio
  useEffect(() => {
    if (!id) return;
    const fetchListing = async () => {
      try {
        const docRef = doc(db, 'ads', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Anúncio não encontrado.');
        }
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar o anúncio.');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  // Busca os dados do vendedor assim que o anúncio for carregado
  useEffect(() => {
    if (!listing?.userId) return;
    const fetchSeller = async () => {
      try {
        let sellerRef = doc(db, 'users', listing.userId);
        let sellerSnap = await getDoc(sellerRef);
        if (!sellerSnap.exists()) {
          sellerRef = doc(db, 'business-users', listing.userId);
          sellerSnap = await getDoc(sellerRef);
        }
        if (sellerSnap.exists()) {
          setSeller(sellerSnap.data());
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSeller();
  }, [listing]);

  // Função para iniciar o chat (sem enviar mensagem automática)
  const handleSendMessage = async () => {
    if (authLoading) return;
    if (!currentUser) {
      setError('Você precisa estar logado para enviar mensagens.');
      router.push('/login');
      return;
    }
    if (!listing?.userId) {
      setError('Dados do anúncio indisponíveis.');
      return;
    }
    if (currentUser.uid === listing.userId) {
      setError('Você não pode iniciar um chat consigo mesmo.');
      return;
    }

    // Ordena os UIDs para criar um chat único
    const uid1 = currentUser.uid < listing.userId ? currentUser.uid : listing.userId;
    const uid2 = currentUser.uid < listing.userId ? listing.userId : currentUser.uid;
    const composite = `${uid1}_${uid2}_ads_${listing.id}`;
    const chatId = btoa(composite); // Gera um ID único em Base64

    const chatRef = ref(rtdb, `chats/${chatId}`);

    try {
      // Cria o chat se ele não existir (messages inicia como objeto vazio)
      const chatSnapshot = await rtdbGet(chatRef);
      if (!chatSnapshot.exists()) {
        const conversationData = {
          participants: { user1: uid1, user2: uid2 },
          createdAt: Date.now(),
          messages: {},
          productId: listing.id,
        };
        await rtdbSet(chatRef, conversationData);
      }

      router.push(`/dashboard/messages/${chatId}`);
    } catch (err) {
      console.error("Erro ao criar ou acessar o chat:", err);
      setError("Houve um erro ao iniciar o chat.");
    }
  };

  if (loading || authLoading) {
    return <p className="text-center text-xl text-gray-500">Carregando...</p>;
  }
  if (error) {
    return <p className="text-center text-xl text-red-600">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{listing.title}</h1>
        {listing.subtitle && <p className="text-lg text-gray-600">{listing.subtitle}</p>}
        <hr className="my-4" />
        <p className="text-md text-gray-700">
          <strong>Specifications:</strong> {listing.specifications || 'N/A'}
        </p>
        <p className="text-md text-gray-700">
          <strong>Description:</strong> {listing.description}
        </p>
        <h2 className="text-4xl text-gray-700 mt-4">£{listing.price}</h2>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-4">
          <img
            src={seller?.photo || 'https://via.placeholder.com/64'}
            alt="Seller"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-semibold">{seller?.name || 'Vendedor Desconhecido'}</p>
            <p className="text-md text-gray-600">City: {seller?.city || 'N/A'}</p>
            <p className="text-md text-gray-600">Phone: {seller?.phone || 'N/A'}</p>
          </div>
        </div>
        <button
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          onClick={handleSendMessage}
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export default DetailsPage;
