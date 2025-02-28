'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { rtdb } from '../../../../lib/firebase';
import { ref, onValue, get as rtdbGet, set as rtdbSet, push } from 'firebase/database';
import { useAuth } from '../../../../lib/auth';

const ChatPage = () => {
  const { id } = useParams(); // chatId no formato "uid1_uid2"
  const { user: currentUser, loading: authLoading } = useAuth();

  const [chatData, setChatData] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [authError, setAuthError] = useState('');
  const [localLoading, setLocalLoading] = useState(true);

  // Referência para rolagem automática das mensagens
  const messagesEndRef = useRef(null);

  // Função para retornar a foto do usuário com base no senderId
  const getUserPhoto = (senderId) => {
    if (senderId === currentUser.uid) {
      return currentUser.photoURL || 'https://via.placeholder.com/40';
    }
    // Para o outro participante, substitua pela URL correta, se disponível, ou mantenha o placeholder
    return 'https://via.placeholder.com/40';
  };

  useEffect(() => {
    if (!id) return;
    
    if (authLoading) return;
    
    if (!currentUser) {
      setAuthError("Você precisa estar logado para acessar este chat.");
      setLocalLoading(false);
      return;
    }

    const [uid1, uid2] = id.split('_');

    if (uid1 === uid2) {
      setAuthError("Você não pode iniciar um chat consigo mesmo.");
      setLocalLoading(false);
      return;
    }

    if (currentUser.uid !== uid1 && currentUser.uid !== uid2) {
      setAuthError("Você não tem permissão para acessar este chat.");
      setLocalLoading(false);
      return;
    }

    const chatRef = ref(rtdb, `chats/${id}`);
    let unsubscribe = () => {};

    rtdbGet(chatRef)
      .then((snapshot) => {
        if (!snapshot.exists()) {
          const conversationData = {
            participants: { user1: uid1, user2: uid2 },
            createdAt: Date.now(),
            messages: {} 
          };
          return rtdbSet(chatRef, conversationData);
        }
      })
      .then(() => {
        unsubscribe = onValue(chatRef, (snapshot) => {
          const data = snapshot.val();
          setChatData(data);
          setLocalLoading(false);
        });
      })
      .catch((err) => {
        console.error("Erro ao acessar o chat:", err);
        setAuthError("Erro ao acessar o chat.");
        setLocalLoading(false);
      });

    return () => {
      unsubscribe();
    };
  }, [id, authLoading, currentUser]);

  // Rolagem automática para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatData]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    
    try {
      const messagesRef = ref(rtdb, `chats/${id}/messages`);
      const newMessageRef = push(messagesRef);
      await rtdbSet(newMessageRef, {
        sender: currentUser.uid,
        text: newMessage,
        timestamp: Date.now(),
      });
      setNewMessage('');
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  if (authLoading || localLoading) {
    return <p className="flex h-screen justify-center items-center text-xl text-gray-500">Carregando...</p>;
  }

  if (authError) {
    return (
      <div className="flex h-screen justify-center items-center">
        <p className="text-red-600 text-xl">{authError}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-blue-600 text-white p-4 text-center font-semibold text-lg">
        Chat
      </header>

      {/* Área de mensagens */}
      <main className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatData && chatData.messages ? (
          Object.entries(chatData.messages)
            .sort(([, a], [, b]) => a.timestamp - b.timestamp)
            .map(([key, message]) => (
              <div key={key} className={`flex items-start gap-2 ${message.sender === currentUser.uid ? 'justify-end' : 'justify-start'}`}>
                {/* Foto do remetente */}
                {message.sender !== currentUser.uid && (
                  <img
                    src={getUserPhoto(message.sender)}
                    alt="Foto do remetente"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div className={`max-w-xs p-3 rounded-lg shadow ${message.sender === currentUser.uid ? 'bg-blue-100' : 'bg-gray-200'}`}>
                  <p className="text-sm text-gray-800">{message.text}</p>
                  <span className="block mt-1 text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {message.sender === currentUser.uid && (
                  <img
                    src={getUserPhoto(message.sender)}
                    alt="Sua foto"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
              </div>
            ))
        ) : (
          <p className="text-center text-gray-500">Sem mensagens ainda.</p>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Campo de entrada e botão de envio */}
      <footer className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-lg px-4 py-3"
          >
            Enviar
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
