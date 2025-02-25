'use client';

import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const Settings = ({ user }) => {
  const [settings, setSettings] = useState({ businessName: '', businessEmail: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.uid) {
      const fetchSettings = async () => {
        try {
          const docRef = doc(db, 'business-users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setSettings(docSnap.data());
          }
        } catch (error) {
          console.error('Erro ao buscar configurações:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSettings();
    }
  }, [user]);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (user && user.uid) {
      try {
        const docRef = doc(db, 'business-users', user.uid);
        await updateDoc(docRef, settings);
        alert('Configurações atualizadas com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar configurações:', error);
      }
    }
  };

  if (loading) return <div>Carregando configurações...</div>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Configurações da Conta</h2>
      <div className="space-y-4">
        <div>
          <label className="font-semibold">Nome do Negócio</label>
          <input
            type="text"
            name="businessName"
            value={settings.businessName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="font-semibold">Email</label>
          <input
            type="email"
            name="businessEmail"
            value={settings.businessEmail}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default Settings;
