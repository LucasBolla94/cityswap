'use client';

import React, { useState, useEffect } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import Link from 'next/link';

const Membermsg = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  // Substitua pelo ID real do usuário autenticado
  const userId = "user123";

  useEffect(() => {
    // Referência para a raiz dos chats no Realtime Database
    const chatsRef = ref(rtdb, 'chats');
    
    // Inscreve-se para receber os dados em tempo real
    const unsubscribe = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      const convs = [];
      
      if (data) {
        Object.keys(data).forEach((chatId) => {
          // Filtra apenas as conversas dos 'ads'
          if (chatId.includes('_ads_')) {
            const chat = data[chatId];
            // Verifica se o usuário participa da conversa
            if (chat.participants && (chat.participants.user1 === userId || chat.participants.user2 === userId)) {
              convs.push({ id: chatId, token: chat.token, ...chat });
            }
          }
        });
      }
      
      setConversations(convs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Inbox dos Ads</h2>
      {loading ? (
        <p>Carregando mensagens...</p>
      ) : (
        <ul className="space-y-4">
          {conversations.length > 0 ? (
            conversations.map((conversation) => (
              <li key={conversation.id} className="p-4 border rounded-lg shadow-md bg-white">
                <Link href={`/dashboard/messages/${conversation.token}`}>
                  <a className="block">
                    <p className="font-semibold">
                      Última mensagem: {conversation.lastMessage || 'Nenhuma mensagem'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {conversation.lastMessageTimestamp &&
                        new Date(conversation.lastMessageTimestamp).toLocaleString()}
                    </p>
                  </a>
                </Link>
              </li>
            ))
          ) : (
            <p>Nenhuma mensagem encontrada.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Membermsg;
