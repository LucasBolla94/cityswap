'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.uid) {
      const fetchOrders = async () => {
        try {
          const ordersQuery = query(collection(db, 'orders'), where('sellerId', '==', user.uid));
          const ordersSnapshot = await getDocs(ordersQuery);
          const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setOrders(ordersList);
        } catch (error) {
          console.error('Erro ao buscar pedidos:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [user]);

  if (loading) return <div>Carregando pedidos...</div>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Pedidos Recebidos</h2>
      {orders.length > 0 ? (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order.id} className="p-4 border rounded-md shadow-sm">
              <h3 className="font-semibold">Pedido #{order.id}</h3>
              <p>Comprador: {order.buyerName}</p>
              <p>Produto: {order.productName}</p>
              <span className="text-sm text-gray-600">Total: ${order.totalPrice}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Você ainda não recebeu nenhum pedido.</p>
      )}
    </div>
  );
};

export default Orders;
