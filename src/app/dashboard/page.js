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
      {/* Cabeçalho */}
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      {/* Seções alinhadas no canto esquerdo */}
      <div className="text-sm text-left mb-6">
        <button onClick={() => setActiveSection('activity')} className="text-blue-500 hover:underline">
          Activity
        </button> 
        | 
        <button onClick={() => setActiveSection('messages')} className="text-blue-500 hover:underline">
          Messages
        </button> 
        | 
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
