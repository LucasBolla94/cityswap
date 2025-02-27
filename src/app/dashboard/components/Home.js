'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { db } from '@/lib/firebase'; // Ajuste o caminho conforme a estrutura do seu projeto
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

// Container do saldo com estilos personalizados
const WalletContainer = styled.div`
  background-color: #f0f4f8;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 20px;
`;

// Texto do saldo com estilos personalizados
const BalanceText = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const Home = ({ user }) => {
  // Inicializa os estados para saldo, notificações e dados do gráfico
  const [balance, setBalance] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (!user) return; // Se não houver usuário, não faz nada
    const userId = user.uid;

    // Função para obter o saldo do usuário
    const fetchBalance = async () => {
      // Referência correta ao documento do usuário
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const fetchedBalance = userSnap.data().balance;
        // Converte o saldo para número e, se não existir ou for 0, define como 0
        setBalance(Number(fetchedBalance) || 0);
      }
    };

    // Função para obter as últimas notificações do usuário
    const fetchNotifications = async () => {
      const notificationsRef = collection(db, 'user_notification');
      const q = query(
        notificationsRef,
        where('uid', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const notificationsList = querySnapshot.docs.map((doc) => doc.data());
      setNotifications(notificationsList);
    };

    // Função para obter os dados de cliques e vendas para o gráfico
    const fetchChartData = async () => {
      const adsId = 'ad123'; // Substitua pelo ID real do anúncio
      const adsRef = doc(db, 'ads_analytics', adsId);
      const adsSnap = await getDoc(adsRef);
      if (adsSnap.exists()) {
        const data = adsSnap.data();
        setChartData({
          labels: data.dates,
          datasets: [
            {
              label: 'Cliques',
              data: data.clicks,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            },
            {
              label: 'Vendas',
              data: data.sales,
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              fill: true,
            },
          ],
        });
      }
    };

    // Chama as funções para buscar os dados assim que o componente é montado
    fetchBalance();
    fetchNotifications();
    fetchChartData();
  }, [user]);

  // Se balance for diferente de 0, mostra o valor com duas casas decimais; caso contrário, exibe "00.00"
  const displayBalance = balance !== 0 ? balance.toFixed(2) : '00.00';

  return (
    <>
      <div className="p-6 bg-gray-100 rounded-lg shadow-md w-full mt-16">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <WalletContainer>
          <h3 className="text-xl font-semibold mb-2">Saldo</h3>
          <BalanceText>£ {displayBalance}</BalanceText>
        </WalletContainer>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Últimas Notificações</h3>
          <ul className="list-disc list-inside">
            {notifications.map((notification, index) => (
              <li key={index} className="mb-1">
                <span className="font-medium">{notification.name}</span>{' '}
                <span className="text-gray-600 text-sm">- {notification.type}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Cliques e Vendas</h3>
          {chartData.labels ? (
            <Line data={chartData} />
          ) : (
            <p>Carregando dados do gráfico...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
