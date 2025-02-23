'use client'; // Indica que este componente é renderizado no cliente

import React, { useState } from 'react';
import { useAuth } from '../../lib/auth'; // Hook de autenticação
import { useRouter } from 'next/navigation';
import { firestore, storage } from '../../lib/firebase'; // A integração com Firebase
import Navbar from '../../components/NavBar'; // Componente Navbar
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Para upload das imagens

const CreateListingPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Estados do formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]); // Armazena as URLs das imagens
  const [loadingImage, setLoadingImage] = useState(false);
  const [progress, setProgress] = useState(0); // Barra de progresso
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verificando se o usuário está carregando ou não está autenticado
  if (loading) return <div>Carregando...</div>;
  if (!user) {
    router.push('/auth/login');
    return null; // Não renderiza o restante da página enquanto não estiver autenticado
  }

  // Função para enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Evita múltiplos envios

    if (!title) {
      setError('O título é obrigatório!');
      return;
    }
    if (!description) {
      setError('A descrição é obrigatória!');
      return;
    }
    if (!price) {
      setError('O preço é obrigatório!');
      return;
    }
    if (!category) {
      setError('A categoria é obrigatória!');
      return;
    }
    if (images.length < 3) {
      setError('Você precisa adicionar pelo menos 3 fotos.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // Adicionando o anúncio ao banco de dados
      await firestore.collection('cityswapuk').doc('ads').add({
        title,
        description,
        price,
        category,
        imageUrls: images, // Armazenando as URLs das imagens
        userId: user.uid,
        createdAt: new Date(),
      });

      // Redireciona para a página de meus anúncios após o sucesso
      router.push('/dashboard/my-listings');
    } catch (error) {
      setError('Erro ao criar o anúncio. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para fazer o upload da imagem para o Firebase Storage
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `images/${file.name}`); // Define o caminho para o arquivo no Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Monitorar o progresso do upload
    uploadTask.on('state_changed', 
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
      },
      (error) => {
        setError('Erro ao fazer upload da imagem. Tente novamente.');
        setLoadingImage(false);
      },
      async () => {
        // Quando o upload é concluído, obtém a URL de download da imagem
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImages((prevImages) => [...prevImages, downloadURL]); // Adiciona o link da imagem ao array
          setLoadingImage(false);
          setProgress(0); // Reseta a barra de progresso
        } catch (error) {
          setError('Erro ao obter o link da imagem. Tente novamente.');
        }
      }
    );

    setLoadingImage(true);
  };

  // Função para remover uma imagem
  const handleRemoveImage = (imageUrl) => {
    setImages(images.filter((image) => image !== imageUrl));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Criar Anúncio</h1>

        {/* Exibição de erro, caso haja */}
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-lg font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o título do anúncio"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-lg font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva o item"
              rows="4"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-lg font-medium text-gray-700">
              Preço
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o preço do item"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-lg font-medium text-gray-700">
              Categoria
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione uma categoria</option>
              <option value="electronics">Eletrônicos</option>
              <option value="fashion">Moda</option>
              <option value="home">Casa</option>
              <option value="toys">Brinquedos</option>
            </select>
          </div>

          <div>
            <label htmlFor="images" className="block text-lg font-medium text-gray-700">
              Imagens (mínimo de 3)
            </label>
            <div className="flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img src={image} alt={`Imagem ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    <span className="text-xs">X</span>
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label
                  htmlFor="image"
                  className="w-24 h-24 border-dashed border-2 border-gray-300 flex items-center justify-center cursor-pointer"
                >
                  <span className="text-2xl text-gray-500">+</span>
                </label>
              )}
            </div>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {loadingImage && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            {loadingImage && <p className="mt-2 text-gray-600">Carregando imagem...</p>}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => router.push('/dashboard/my-listings')}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Criando...' : 'Criar Anúncio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;
