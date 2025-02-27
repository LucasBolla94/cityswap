'use client';

import React, { useState, useEffect } from 'react';
import { db, rtdb } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ref, onValue } from 'firebase/database';

const SuporteMsg = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = "user123"; // Substituir pelo ID real do usuário autenticado

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesRef = collection(db, 'conversations');
        const q = query(messagesRef, where('participants', 'array-contains', userId));
        const querySnapshot = await getDocs(q);
        
        const conversations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(conversations);
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Inbox</h2>
      {loading ? (
        <p>Carregando mensagens...</p>
      ) : (
        <ul className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <li key={message.id} className="p-4 border rounded-lg shadow-md bg-white">
                <p className="font-semibold">Última mensagem: {message.lastMessage}</p>
                <p className="text-sm text-gray-500">{new Date(message.lastMessageTimestamp?.seconds * 1000).toLocaleString()}</p>
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

export default SuporteMsg;
