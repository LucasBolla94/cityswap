'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { rtdb } from '../../../../lib/firebase';
import { ref, onValue, get as rtdbGet, set as rtdbSet, push, update } from 'firebase/database';
import { useAuth } from '../../../../lib/auth';

const ChatPage = () => {
  const { id } = useParams(); // Aqui, "id" é o token do chat
  const { user: currentUser, loading: authLoading } = useAuth();

  const [chatData, setChatData] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [authError, setAuthError] = useState('');
  const [localLoading, setLocalLoading] = useState(true);
  const [chatKey, setChatKey] = useState(null);

  const messagesEndRef = useRef(null);

  // Função para obter a foto do usuário (usa uma imagem padrão se não houver)
  const getUserPhoto = (senderId) => {
    if (currentUser && senderId === currentUser.uid) {
      return currentUser.photoURL ? currentUser.photoURL : '/img/chat/userchat.png';
    }
    return '/img/chat/userchat.png';
  };

  // Renderiza o conteúdo da mensagem, detectando um possível placeholder de imagem
  const renderMessageContent = (message) => {
    const pattern = /\{img=([^}]+)\}/;
    const match = message.text.match(pattern);
    if (match) {
      const url = match[1];
      const textWithoutImage = message.text.replace(pattern, '').trim();
      return (
        <>
          {textWithoutImage && (
            <p className="text-sm text-gray-800 break-words">{textWithoutImage}</p>
          )}
          <img
            src={url}
            alt="Miniatura"
            className="mt-2 rounded max-w-full object-contain"
            style={{ maxHeight: '150px' }}
          />
        </>
      );
    } else {
      return <p className="text-sm text-gray-800 break-words">{message.text}</p>;
    }
  };

  useEffect(() => {
    if (!id) return;
    if (authLoading) return;
    if (!currentUser) {
      setAuthError("Você precisa estar logado para acessar este chat.");
      setLocalLoading(false);
      return;
    }

    // Busca o chat pelo token recebido na URL
    const chatsRef = ref(rtdb, 'chats');
    let unsubscribeChats = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      let foundChatKey = null;
      if (data) {
        Object.keys(data).forEach((key) => {
          if (data[key].token === id) {
            foundChatKey = key;
          }
        });
      }
      if (!foundChatKey) {
        setAuthError("Chat não encontrado.");
        setLocalLoading(false);
        return;
      }
      setChatKey(foundChatKey);
      // Agora, configura o listener para os dados do chat encontrado
      const chatRef = ref(rtdb, `chats/${foundChatKey}`);
      let unsubscribeChat = onValue(chatRef, (snapshot) => {
        const chatData = snapshot.val();
        setChatData(chatData);
        setLocalLoading(false);
      });
      return () => unsubscribeChat();
    }, (error) => {
      console.error("Erro ao buscar chat:", error);
      setAuthError("Erro ao acessar o chat.");
      setLocalLoading(false);
    });

    return () => {
      unsubscribeChats();
    };
  }, [id, authLoading, currentUser]);

  // Marca as mensagens como lidas para o destinatário
  useEffect(() => {
    if (!currentUser) return;
    if (chatData && chatData.messages) {
      Object.entries(chatData.messages).forEach(([key, message]) => {
        if (message.sender !== currentUser.uid && !message.read) {
          const msgRef = ref(rtdb, `chats/${chatKey}/messages/${key}`);
          update(msgRef, { read: true });
        }
      });
    }
  }, [chatData, currentUser, chatKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatData]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    try {
      const messagesRef = ref(rtdb, `chats/${chatKey}/messages`);
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
    return (
      <p className="flex h-screen justify-center items-center text-xl text-gray-500">
        Carregando...
      </p>
    );
  }

  if (authError) {
    return (
      <div className="flex h-screen justify-center items-center">
        <p className="text-red-600 text-xl">{authError}</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-screen bg-gray-50 overflow-hidden">
      <header className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-4 text-center font-semibold text-lg z-10">
        Chat
      </header>
      <main className="flex-1 p-4 mt-16 mb-20 overflow-y-auto space-y-4">
        {chatData && chatData.messages ? (
          Object.entries(chatData.messages)
            .sort(([, a], [, b]) => a.timestamp - b.timestamp)
            .map(([key, message]) => (
              <div
                key={key}
                className={`flex items-start gap-2 ${message.sender === currentUser.uid ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender !== currentUser.uid && (
                  <img
                    src={getUserPhoto(message.sender)}
                    alt="Foto do remetente"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div
                  className={`p-3 rounded-lg shadow break-words ${message.sender === currentUser.uid ? 'bg-blue-100' : 'bg-gray-200'} max-w-[80%]`}
                >
                  {renderMessageContent(message)}
                  <span className="block mt-1 text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                    {message.sender === currentUser.uid && message.read && (
                      <span className="ml-2 text-green-500">Lido</span>
                    )}
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
      <footer className="fixed bottom-0 left-0 right-0 p-4 border-t bg-white z-10">
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
