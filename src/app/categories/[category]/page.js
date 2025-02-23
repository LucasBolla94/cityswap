'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Alterado de next/router para next/navigation
import { db } from '../../../firebase'; // Certifique-se de importar a configuração correta
import { collection, query, where, getDocs } from 'firebase/firestore';

const CategoryPage = () => {
  const router = useRouter();
  const { category } = router.query; // Obtém o parâmetro da URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar anúncios da categoria
  const fetchProducts = async () => {
    if (!category) return; // Aguarda até que o parâmetro da categoria esteja disponível
    try {
      const q = query(
        collection(db, 'products'), // Supondo que os produtos estão na coleção 'products'
        where('category', '==', category) // Filtra os produtos pela categoria
      );
      const querySnapshot = await getDocs(q);
      const productsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsList);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); // Chama a função quando a página for carregada ou a categoria for alterada
  }, [category]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Produtos em "{category}"</h1>
      
      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.length > 0 ? (
            products.map(product => (
              <div
                key={product.id}
                className="product-card bg-white shadow-lg rounded-lg p-4 hover:shadow-xl cursor-pointer"
              >
                <img
                  src={product.imageUrl} // Supondo que o produto tem uma imagem
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-semibold">${product.price}</span>
                  <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">Comprar</button>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum produto encontrado nesta categoria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
