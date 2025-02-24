'use client';

import React from 'react';
import Link from 'next/link';

const Account = () => {
  // Dados fictícios para demonstração
  const recentActivity = [
    { id: 1, description: 'Compra realizada: Smartphone', date: '2025-02-22' },
    { id: 2, description: 'Venda concluída: Notebook', date: '2025-02-20' },
    { id: 3, description: 'Lance efetuado: Relógio', date: '2025-02-18' },
  ];

  const notifications = [
    { id: 1, message: 'Você recebeu uma nova mensagem.' },
    { id: 2, message: 'Atualização de política disponível.' },
  ];

  const currentBalance = {
    credit: 500,
    debit: 100,
  };

  return (
    <>
      {/* Botão "Voltar" fixo no canto superior esquerdo */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          Voltar
        </Link>
      </div>

      {/* Container principal do resumo da conta */}
      <div className="p-6 bg-gray-100 rounded-lg shadow-md w-full mt-16">
        <h2 className="text-2xl font-bold mb-4">Resumo da Conta</h2>

        {/* Atividade Recente */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Atividade Recente</h3>
          <ul className="list-disc list-inside">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="mb-1">
                <span className="font-medium">{activity.description}</span>{' '}
                <span className="text-gray-600 text-sm">- {activity.date}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Saldo Atual */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Saldo Atual</h3>
          <p className="text-lg">
            Crédito disponível:{' '}
            <span className="font-medium text-green-600">R$ {currentBalance.credit}</span>
          </p>
          <p className="text-lg">
            Débito:{' '}
            <span className="font-medium text-red-600">R$ {currentBalance.debit}</span>
          </p>
        </div>

        {/* Notificações */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Notificações</h3>
          <ul className="list-disc list-inside">
            {notifications.map((notification) => (
              <li key={notification.id} className="mb-1">
                {notification.message}
              </li>
            ))}
          </ul>
        </div>

        {/* Acesso Rápido */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Acesso Rápido</h3>
          <div className="flex flex-row gap-4">
            <Link href="/dashboard/history" className="text-blue-500 hover:underline">
              Histórico de Compras
            </Link>
            <Link href="/dashboard/sales" className="text-blue-500 hover:underline">
              Itens à Venda
            </Link>
            <Link href="/dashboard/settings" className="text-blue-500 hover:underline">
              Configurações
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
