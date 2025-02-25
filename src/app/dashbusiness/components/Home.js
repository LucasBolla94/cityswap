'use client';

import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const BusinessHome = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user && user.uid) {
      const fetchUserData = async () => {
        try {
          // Busca os dados do usuário na coleção "business-users"
          const docRef = doc(db, 'business-users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            // Se não encontrar dados na coleção "business-users", pode optar por usar dados do auth
            setUserData({
              businessName: user.displayName,
              businessEmail: user.email,
              createdAt: new Date(),
            });
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        } finally {
          setLoadingData(false);
        }
      };

      fetchUserData();
    }
  }, [user]);

  if (loadingData) return <div>Carregando informações...</div>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Painel de Informações</h2>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <span className="font-semibold">Nome:</span> {userData.businessName || "Não definido"}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {userData.businessEmail || user.email}
        </div>
        <div>
          <span className="font-semibold">UID:</span> {user.uid}
        </div>
        {userData.businessRegistered && (
          <div>
            <span className="font-semibold">Registrado em:</span> {userData.businessRegistered}
          </div>
        )}
        {userData.createdAt && (
          <div>
            <span className="font-semibold">Data de Criação:</span>{" "}
            {userData.createdAt.seconds
              ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString()
              : new Date(userData.createdAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessHome;
