'use client';

import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Corrigindo o caminho da coleção 'categories' para o Firebase Firestore normal
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categoriesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesList);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Categorias</h1>
      {loading ? (
        <p>Carregando categorias...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.length > 0 ? (
            categories.map(category => (
              <div
                key={category.id}
                className="category-card bg-white border border-gray-200 rounded-lg p-6 hover:shadow-xl cursor-pointer flex flex-col items-center"
              >
                {/* Exibindo o nome da categoria */}
                <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
                <img
                  src="https://via.placeholder.com/150" // Aqui você pode colocar a URL da imagem da categoria, se tiver
                  alt={category.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            ))
          ) : (
            <p>Nenhuma categoria encontrada.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
