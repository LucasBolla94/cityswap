// /src/app/payments/details/[id]/page.js
'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db, rtdb } from '../../../../lib/firebase';
import { ref, get as rtdbGet, set as rtdbSet, push } from 'firebase/database';
import { auth, useAuth } from '/src/lib/auth';

// Função auxiliar para gerar um token seguro
const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
};

const DetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user: currentUser, loading: authLoading } = useAuth();

  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Carrega os detalhes do anúncio
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

  // Carrega os dados do vendedor
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

  // Função para iniciar o chat e enviar a mensagem automática
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

    // Gera uma chave composta para o chat e define a ordem dos UIDs
    const uid1 = currentUser.uid < listing.userId ? currentUser.uid : listing.userId;
    const uid2 = currentUser.uid < listing.userId ? listing.userId : currentUser.uid;
    const chatId = `${uid1}_${uid2}_ads_${listing.id}`;
    const chatRef = ref(rtdb, `chats/${chatId}`);

    try {
      const snapshot = await rtdbGet(chatRef);
      let token;
      if (!snapshot.exists()) {
        token = generateToken(); // Gera o token seguro
        const conversationData = {
          participants: { user1: uid1, user2: uid2 },
          createdAt: Date.now(),
          messages: {},
          productId: listing.id,
          token, // Armazena o token
        };
        await rtdbSet(chatRef, conversationData);

        // Envia a mensagem inicial do "Sistema"
        const messagesRef = ref(rtdb, `chats/${chatId}/messages`);
        const initialMessage = {
          sender: "system",
          text: `{img=${listing.imageUrls && listing.imageUrls.length > 0 ? listing.imageUrls[0] : 'N/A'}} | Title: ${listing.title} | Price: £${listing.price}\nProduto: ${listing.title} | SubTitle: ${listing.subtitle || 'N/A'}`,
          timestamp: Date.now(),
        };
        const newMessageRef = push(messagesRef);
        await rtdbSet(newMessageRef, initialMessage);
      } else {
        // Se o chat já existir, utiliza o token salvo
        token = snapshot.val().token;
      }
      // Redireciona usando o token na URL
      router.push(`/dashboard/messages/${token}`);
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
      {/* Detalhes do anúncio */}
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

      {/* Informações do vendedor e botão para enviar mensagem */}
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
