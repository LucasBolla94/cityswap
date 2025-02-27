'use client';
import React, { useEffect, useState } from 'react';
import { db } from '../../../../lib/firebase';
import { ref, onValue, push, set } from 'firebase/database';

const ChatPage = ({ params }) => {
  const { id } = params; // 'id' representa o ID do chat
  const [chatData, setChatData] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  // Escuta as atualizações do chat no Realtime Database
  useEffect(() => {
    // Utilize a variável "db" que foi importada para referenciar o banco de dados
    const chatRef = ref(db, `chats/${id}`);
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      setChatData(data);
    });

    // Limpeza do listener quando o componente desmontar
    return () => unsubscribe();
  }, [id]);

  // Função para enviar mensagem para o Realtime Database
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    try {
      // Referência para a lista de mensagens dentro do chat
      const messagesRef = ref(db, `chats/${id}/messages`);
      // Cria uma nova entrada de mensagem (push gera um novo ID)
      const newMessageRef = push(messagesRef);
      // Define os dados da mensagem
      await set(newMessageRef, {
        sender: "User", // Aqui você pode substituir por dados do usuário autenticado
        text: newMessage,
        timestamp: Date.now(),
      });
      setNewMessage('');
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar com a lista de conversas */}
      <aside className="w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Conversas</h2>
        <ul>
          <li className="mb-2 cursor-pointer hover:text-blue-600">Chat 1</li>
          <li className="mb-2 cursor-pointer hover:text-blue-600">Chat 2</li>
          <li className="mb-2 cursor-pointer hover:text-blue-600">Chat 3</li>
        </ul>
      </aside>

      {/* Área principal do chat */}
      <main className="flex-1 p-4 flex flex-col">
        <header className="mb-4 border-b pb-2">
          <h1 className="text-2xl font-bold">Chat com ID: {id}</h1>
        </header>
        
        {/* Área onde as mensagens serão exibidas */}
        <section className="flex-1 overflow-y-auto mb-4">
          {chatData ? (
            // Mapeia as mensagens (assumindo que estão armazenadas como objeto)
            Object.entries(chatData.messages || {}).map(([key, message]) => (
              <div key={key} className="mb-2">
                <strong>{message.sender}:</strong> {message.text}
              </div>
            ))
          ) : (
            <p>Carregando mensagens...</p>
          )}
        </section>
        
        {/* Campo de input para digitar novas mensagens */}
        <footer className="flex gap-2">
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-blue-600 text-white rounded"
          >
            Enviar
          </button>
        </footer>
      </main>
    </div>
  );
};

export default ChatPage;
