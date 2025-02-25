'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const BusinessAccount = ({ user }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.uid) {
      const fetchSales = async () => {
        try {
          const q = query(collection(db, 'sales'), where('sellerId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const salesData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSales(salesData);
        } catch (error) {
          console.error("Erro ao buscar vendas:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchSales();
    }
  }, [user]);

  if (loading) return <div>Carregando vendas...</div>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Minhas Vendas</h2>
      {sales.length === 0 ? (
        <p>Nenhuma venda encontrada.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">Comprador</th>
                <th className="p-3 border">Valor</th>
                <th className="p-3 border">Data</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="text-center border-b">
                  <td className="p-3 border">{sale.buyerEmail || "Desconhecido"}</td>
                  <td className="p-3 border">R$ {sale.amount?.toFixed(2)}</td>
                  <td className="p-3 border">
                    {sale.date
                      ? new Date(sale.date.seconds * 1000).toLocaleDateString()
                      : "Sem data"}
                  </td>
                  <td className="p-3 border">{sale.status || "Pendente"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BusinessAccount;
