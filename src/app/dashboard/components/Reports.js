'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const Reports = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.uid) {
      const fetchReports = async () => {
        try {
          const q = query(collection(db, 'reports'), where('businessId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          setReports(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
          console.error("Erro ao buscar relatórios:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchReports();
    }
  }, [user]);

  if (loading) return <div>Carregando relatórios...</div>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Relatórios de Vendas</h2>
      {reports.length > 0 ? (
        <ul>
          {reports.map(report => (
            <li key={report.id} className="border-b py-2">
              {report.title} - {report.date}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum relatório disponível.</p>
      )}
    </div>
  );
};

export default Reports;
