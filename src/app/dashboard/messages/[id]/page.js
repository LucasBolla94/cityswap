'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { rtdb } from '../../../../lib/firebase';
import { ref, onValue, get as rtdbGet, set as rtdbSet, push, update } from 'firebase/database';
import { useAuth } from '../../../../lib/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

const ChatPage = () => {
  const { id } = useParams(); // id em Base64 (possivelmente URL-encoded)
  const { user: currentUser, loading: authLoading } = useAuth();

  const [chatData, setChatData] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [authError, setAuthError] = useState('');
  const [localLoading, setLocalLoading] = useState(true);
  const [product, setProduct] = useState(null); // Detalhes do anúncio
  const [chatProductId, setChatProductId] = useState(null); // productId extraído da RTDB

  const messagesEndRef = useRef(null);

  // Função para decodificar o chatId
  const decodeChatId = (encodedId) => {
    try {
      const decodedURI = decodeURIComponent(encodedId);
      return atob(decodedURI);
    } catch (err) {
      return null;
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

    const composite = decodeChatId(id);
    if (!composite) {
      setAuthError("Formato de chat inválido.");
      setLocalLoading(false);
      return;
    }

    const parts = composite.split('_');
    if (parts.length < 4 || parts[2] !== 'ads') {
      setAuthError("Formato de chat inválido.");
      setLocalLoading(false);
      return;
    }
    const uid1 = parts[0];
    const uid2 = parts[1];
    // OBS.: O productId ainda é extraído da URL para criação inicial, mas não é usado para exibição
    const productIdFromUrl = parts.slice(3).join('_');

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
          // Ao criar o chat, salvamos o productId obtido da URL
          const conversationData = {
            participants: { user1: uid1, user2: uid2 },
            createdAt: Date.now(),
            messages: {},
            productId: productIdFromUrl,
          };
          return rtdbSet(chatRef, conversationData);
        }
      })
      .then(() => {
        unsubscribe = onValue(chatRef, (snapshot) => {
          const data = snapshot.val();
          setChatData(data);
          // Extrai o productId salvo na RTDB e atualiza o estado
          if (data && data.productId) {
            setChatProductId(data.productId);
          }
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

  // Busca os detalhes do produto (anúncio) usando o chatProductId extraído da RTDB
  useEffect(() => {
    const fetchProduct = async (prodId) => {
      try {
        const docRef = doc(db, 'ads', prodId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Erro ao buscar produto:", err);
      }
    };

    if (chatProductId) {
      fetchProduct(chatProductId);
    }
  }, [chatProductId]);

  // Marca as mensagens como lidas
  useEffect(() => {
    if (!currentUser) return;
    if (chatData && chatData.messages) {
      Object.entries(chatData.messages).forEach(([key, message]) => {
        if (message.sender !== currentUser.uid && !message.read) {
          const msgRef = ref(rtdb, `chats/${id}/messages/${key}`);
          update(msgRef, { read: true });
        }
      });
    }
  }, [chatData, currentUser, id]);

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
    // Container principal ocupando 100% da tela com box-border para incluir padding na largura
    <div className="flex flex-col min-h-screen w-full bg-gray-50 overflow-x-hidden box-border">
      <div className="flex flex-col flex-1 w-full">
        {/* Seção de informações do anúncio */}
        <div className="p-4 bg-blue-600 text-white flex items-center gap-4">
          <img
            src={
              product && product.imageUrls && product.imageUrls.length > 0 
                ? product.imageUrls[0] 
                : 'https://via.placeholder.com/40'
            }
            alt="Produto"
            className="w-10 h-10 rounded object-cover"
          />
          <div className="flex flex-col">
            <span className="font-semibold">
              {product ? product.title : `Anúncio ${chatProductId}`}
            </span>
            <span className="text-sm">
              {product ? `£${product.price}` : 'Informações não disponíveis'}
            </span>
          </div>
        </div>

        {/* Área das mensagens - ocupa o espaço restante */}
        <main className="flex-1 p-4 overflow-y-auto min-h-0">
          {chatData && chatData.messages && Object.keys(chatData.messages).length > 0 ? (
            Object.entries(chatData.messages)
              .sort(([, a], [, b]) => a.timestamp - b.timestamp)
              .map(([key, message]) => (
                <div
                  key={key}
                  className={`flex items-start gap-2 ${
                    message.sender === currentUser.uid ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender !== currentUser.uid && (
                    <img
                      src="/img/chat/userchat.png"
                      alt="Foto do remetente"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div
                    className={`p-3 rounded-lg shadow break-words ${
                      message.sender === currentUser.uid ? 'bg-blue-100' : 'bg-gray-200'
                    } max-w-full`}
                  >
                    <p className="text-sm text-gray-800 break-words">{message.text}</p>
                    <span className="block mt-1 text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                      {message.sender === currentUser.uid && message.read && (
                        <span className="ml-2 text-green-500">Lido</span>
                      )}
                    </span>
                  </div>
                  {message.sender === currentUser.uid && (
                    <img
                      src="/img/chat/userchat.png"
                      alt="Sua foto"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                </div>
              ))
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-gray-500">Sem mensagens ainda.</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Área de envio de mensagem - sempre fixa na parte inferior do container */}
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
    </div>
  );
};

export default ChatPage;
