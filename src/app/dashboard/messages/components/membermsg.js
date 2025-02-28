'use client';

import React, { useState, useEffect } from 'react';
import { rtdb, db } from '../../../../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../../../lib/auth';
import { useRouter } from 'next/navigation';

const Membermsg = () => {
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adsData, setAdsData] = useState({});    // Dados dos produtos
  const [usersData, setUsersData] = useState({});  // Dados dos outros usuários

  useEffect(() => {
    if (authLoading) return;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const userId = currentUser.uid;
    const chatsRef = ref(rtdb, 'chats');

    // Conjuntos para armazenar IDs únicos dos produtos e dos outros usuários
    const productsToFetch = new Set();
    const userIdsToFetch = new Set();

    const unsubscribe = onValue(chatsRef, async (snapshot) => {
      const data = snapshot.val();
      console.log('📌 Dados do Firebase:', data);

      const convs = [];

      if (data) {
        Object.keys(data).forEach((chatId) => {
          const chat = data[chatId];
          if (!chat || !chat.participants) return;

          console.log(`🔍 Chat ID: ${chatId}, Participantes:`, chat.participants);

          // Verifica se o usuário logado está entre os participantes
          if (chat.participants.user1 === userId || chat.participants.user2 === userId) {
            convs.push({ id: chatId, ...chat });
            
            // Se houver um produto vinculado à conversa, adiciona o ID do produto
            if (chat.productId) {
              productsToFetch.add(chat.productId);
            }

            // Identifica o outro usuário (aquele que não é o usuário logado)
            const otherUserId = chat.participants.user1 === userId 
              ? chat.participants.user2 
              : chat.participants.user1;
            userIdsToFetch.add(otherUserId);
          }
        });
      }

      setConversations(convs);
      setLoading(false);

      // Buscar os dados dos produtos no Firestore, se houver
      if (productsToFetch.size > 0) {
        fetchAdsData([...productsToFetch]);
      }
      // Buscar os dados dos outros usuários no Firestore, se houver
      if (userIdsToFetch.size > 0) {
        fetchUsersData([...userIdsToFetch]);
      }
    });

    return () => unsubscribe();
  }, [authLoading, currentUser]);

  // Função para buscar os dados dos produtos no Firestore
  const fetchAdsData = async (productIds) => {
    const productsInfo = { ...adsData };

    for (const productId of productIds) {
      if (!productsInfo[productId]) {
        try {
          const productRef = doc(db, 'ads', productId);
          const productSnap = await getDoc(productRef);
          if (productSnap.exists()) {
            productsInfo[productId] = productSnap.data();
          } else {
            console.warn(`⚠️ Produto ${productId} não encontrado no Firestore`);
          }
        } catch (error) {
          console.error(`Erro ao buscar produto ${productId}:`, error);
        }
      }
    }
    setAdsData(productsInfo);
  };

  // Função para buscar os dados dos outros usuários no Firestore
  const fetchUsersData = async (userIds) => {
    const usersInfo = { ...usersData };

    for (const uId of userIds) {
      if (!usersInfo[uId]) {
        try {
          const userRef = doc(db, 'users', uId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            usersInfo[uId] = userSnap.data();
          } else {
            console.warn(`⚠️ Usuário ${uId} não encontrado no Firestore`);
          }
        } catch (error) {
          console.error(`Erro ao buscar usuário ${uId}:`, error);
        }
      }
    }
    setUsersData(usersInfo);
  };

  // Função para obter a URL da primeira imagem do array "imageUrls"
  const getThumbnailUrl = (product) => {
    if (product && product.imageUrls) {
      if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
        return product.imageUrls[0];
      } else if (typeof product.imageUrls === 'string') {
        return product.imageUrls;
      }
    }
    return 'https://via.placeholder.com/50';
  };

  // Função para formatar o preço no formato "£00.00"
  const formatPrice = (price) => {
    const value = parseFloat(price);
    if (isNaN(value)) return '£00.00';
    return `£${value.toFixed(2)}`;
  };

  if (authLoading) {
    return (
      <p className="flex justify-center items-center h-screen text-xl">
        Carregando autenticação...
      </p>
    );
  }

  if (!currentUser) {
    return (
      <p className="flex justify-center items-center h-screen text-xl text-red-600">
        Você precisa estar logado para ver suas mensagens.
      </p>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Inbox dos Produtos</h2>
      {loading ? (
        <p>Carregando mensagens...</p>
      ) : (
        <div className="space-y-4">
          {conversations.length > 0 ? (
            conversations.map((conversation) => {
              // Obtém o produto relacionado (se houver)
              const product = conversation.productId ? adsData[conversation.productId] : null;
              // Determina o outro usuário da conversa
              const otherUserId = conversation.participants.user1 === currentUser.uid 
                ? conversation.participants.user2 
                : conversation.participants.user1;
              const otherUser = usersData[otherUserId];

              return (
                <div
                  key={conversation.id}
                  className="border rounded-lg shadow-md bg-white cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/messages/${conversation.id}`, {
                      state: { conversation, product, otherUser },
                    })
                  }
                >
                  <div className="p-4 flex items-center gap-4">
                    {product ? (
                      <>
                        <div className="w-12 h-12 flex-shrink-0">
                          <img
                            src={getThumbnailUrl(product)}
                            alt={product.title}
                            className="w-full h-full object-contain rounded"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">
                            📸 {product.title} - 💰 {formatPrice(product.price)}
                          </p>
                        </div>
                      </>
                    ) : (
                      <span>Produto não encontrado</span>
                    )}
                  </div>
                  <div className="px-4 pb-4">
                    {otherUser ? (
                      <p className="text-sm text-gray-600">👤 {otherUser.firstName || otherUser.email || otherUser.userId}</p>
                    ) : (
                      <p className="text-sm text-gray-600">Usuário não encontrado</p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">Nenhuma conversa encontrada.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Membermsg;
