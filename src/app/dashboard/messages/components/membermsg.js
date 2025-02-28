// /src/app/dashboard/messages/components/membermsg.js
'use client';
import React, { useState, useEffect } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

const Membermsg = () => {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !currentUser) return;
    const userId = currentUser.uid;
    const chatsRef = ref(rtdb, 'chats');
    
    const unsubscribe = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      const convs = [];
      
      if (data) {
        Object.keys(data).forEach((chatId) => {
          const chat = data[chatId];
          // Filtra apenas conversas do tipo 'ads' e que o usuário participa
          if (chatId.includes('_ads_') && chat.participants) {
            if (chat.participants.user1 === userId || chat.participants.user2 === userId) {
              convs.push({ id: chatId, ...chat });
            }
          }
        });
      }
      
      setConversations(convs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authLoading, currentUser]);

  if (authLoading || loading) {
    return <p>Carregando mensagens...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Inbox dos Ads</h2>
      {conversations.length > 0 ? (
        <ul className="space-y-4">
          {conversations.map((conversation) => (
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
          ))}
        </ul>
      ) : (
        <p>Nenhuma mensagem encontrada.</p>
      )}
    </div>
  );
};

export default Membermsg;
