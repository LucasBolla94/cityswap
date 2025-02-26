'use client';

import { useState } from 'react';
import Link from 'next/link';
import ActivityLinks from './components/ActivityLinks';
import MessagesLinks from './messages/Messages';
import AccountLinks from './components/AccountLinks';

const Account = ({ user }) => {
  const [activeSection, setActiveSection] = useState('activity');

  return (
    <div className="p-4">
      {/* Cabeçalho com título e botão "Sell for Free" alinhados */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Account</h1>
        <Link href="../create-listing/">
          <button className="rounded-full border px-4 py-2 mt-4 sm:mt-0 bg-blue-500">
            Sell for Free
          </button>
        </Link>
      </div>

      {/* Seções alinhadas - empilhadas em mobile e lado a lado em telas maiores */}
      <div className="flex flex-col sm:flex-row text-sm text-left mb-6 space-y-2 sm:space-y-0 sm:space-x-4">
        <button onClick={() => setActiveSection('activity')} className="text-blue-500 hover:underline">
          Activity
        </button>
        <button onClick={() => setActiveSection('messages')} className="text-blue-500 hover:underline">
          Messages
        </button>
        <button onClick={() => setActiveSection('account')} className="text-blue-500 hover:underline">
          Account
        </button>
      </div>

      {/* Exibir seção ativa */}
      <div>
        {activeSection === 'activity' && <ActivityLinks />}
        {activeSection === 'messages' && <MessagesLinks />}
        {activeSection === 'account' && <AccountLinks />}
      </div>
    </div>
  );
};

export default Account;
