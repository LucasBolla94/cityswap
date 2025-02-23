'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import { db, storage } from '../../lib/firebase';
import Navbar from '../../components/NavBar';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const CreateListingPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Estados já existentes
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Novos estados para os campos adicionados
  const [specs, setSpecs] = useState('');
  const [condition, setCondition] = useState('');
  const [priceBid, setPriceBid] = useState(false); // false = preço fixo, true = leilão
  const [quantity, setQuantity] = useState('');
  const [video, setVideo] = useState(null);

  // Estados para opções de frete e pagamento
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('');
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('');
  
  // Estado para política de devolução
  const [returnPolicy, setReturnPolicy] = useState('');

  // Buscar categorias do Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, 'categories');
        const snapshot = await getDocs(categoriesCollection);
        const categoryList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoryList);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        setError('Erro ao carregar categorias. Tente novamente.');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Buscar opções de frete da coleção 'delivery_prov'
  useEffect(() => {
    const fetchDeliveryOptions = async () => {
      try {
        const deliveryCollection = collection(db, 'delivery_prov');
        const snapshot = await getDocs(deliveryCollection);
        const options = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDeliveryOptions(options);
      } catch (error) {
        console.error("Erro ao buscar opções de frete:", error);
      }
    };
    fetchDeliveryOptions();
  }, []);

  // Buscar opções de pagamento da coleção 'payment_options'
  useEffect(() => {
    const fetchPaymentOptions = async () => {
      try {
        const paymentCollection = collection(db, 'payment_options');
        const snapshot = await getDocs(paymentCollection);
        const options = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPaymentOptions(options);
      } catch (error) {
        console.error("Erro ao buscar opções de pagamento:", error);
      }
    };
    fetchPaymentOptions();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (!user) {
    router.push('/auth/login');
    return null;
  }

  // Função para upload de vídeo (similar ao de imagem)
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `videos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        // Opcional: implementar progresso do vídeo, se necessário
      },
      (error) => {
        setError('Erro ao fazer upload do vídeo. Tente novamente.');
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setVideo(downloadURL);
        } catch (error) {
          setError('Erro ao obter o link do vídeo. Tente novamente.');
        }
      }
    );
  };

  // Função para upload de imagem (modificada para múltiplos arquivos)
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files); // Converte FileList para array
    setLoadingImage(true);

    // Itera por cada arquivo e faz o upload
    for (const file of files) {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed', 
          (snapshot) => {
            const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(prog);
          },
          (error) => {
            setError('Erro ao fazer upload da imagem. Tente novamente.');
            setLoadingImage(false);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setImages((prevImages) => [...prevImages, downloadURL]);
              setProgress(0);
              resolve();
            } catch (error) {
              setError('Erro ao obter o link da imagem. Tente novamente.');
              reject(error);
            }
          }
        );
      });
    }
    setLoadingImage(false);
  };

  // Função para remover uma imagem
  const handleRemoveImage = (imageUrl) => {
    setImages(images.filter((image) => image !== imageUrl));
  };

  // Função para enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
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
      // Enviando o anúncio com todos os campos para o Firestore
      await addDoc(collection(db, 'ads'), {
        title,
        description,
        price,
        category,
        imageUrls: images,
        specs,
        condition,
        price_bid: priceBid,
        quantity,
        video: video || null,
        delivery: selectedDeliveryOption,
        return: returnPolicy,
        payment: selectedPaymentOption,
        userId: user.uid,
        createdAt: new Date(),
      });

      router.push('/dashboard/my-listings');
    } catch (error) {
      setError('Erro ao criar o anúncio. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Criar Anúncio</h1>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {loadingCategories ? (
          <p>Carregando categorias...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-lg font-medium text-gray-700">
                Título do Produto
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

            {/* Categoria */}
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
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fotos e Vídeos */}
            <div>
              <label htmlFor="images" className="block text-lg font-medium text-gray-700">
                Fotos do Produto (mínimo de 3)
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
              {/* Aqui adicionamos o atributo 'multiple' para permitir selecionar várias imagens */}
              <input
                type="file"
                id="image"
                accept="image/*"
                multiple
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

              {/* Vídeo do Produto */}
              <div className="mt-4">
                <label htmlFor="video" className="block text-lg font-medium text-gray-700">
                  Vídeo do Produto (opcional)
                </label>
                {video ? (
                  <div className="relative">
                    <video src={video} controls className="w-full rounded-md" />
                    <button
                      type="button"
                      onClick={() => setVideo(null)}
                      className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md"
                    >
                      Remover Vídeo
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="video"
                    className="w-24 h-24 border-dashed border-2 border-gray-300 flex items-center justify-center cursor-pointer"
                  >
                    <span className="text-2xl text-gray-500">+</span>
                  </label>
                )}
                <input
                  type="file"
                  id="video"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Especificações do Item */}
            <div>
              <label htmlFor="specs" className="block text-lg font-medium text-gray-700">
                Especificações do Item
              </label>
              <textarea
                id="specs"
                value={specs}
                onChange={(e) => setSpecs(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Informe detalhes como marca, modelo, tamanho, cor, etc."
                rows="3"
              />
            </div>

            {/* Condição do Produto */}
            <div>
              <label htmlFor="condition" className="block text-lg font-medium text-gray-700">
                Condição do Produto
              </label>
              <select
                id="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma condição</option>
                <option value="novo">Novo</option>
                <option value="usado">Usado</option>
                <option value="recondicionado">Recondicionado</option>
              </select>
            </div>

            {/* Preço e Formato de Venda */}
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
              <label className="block text-lg font-medium text-gray-700">Formato de Venda</label>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="precoFixo"
                  name="saleFormat"
                  checked={!priceBid}
                  onChange={() => setPriceBid(false)}
                  className="mr-2"
                />
                <label htmlFor="precoFixo" className="mr-6">Preço Fixo</label>
                <input
                  type="radio"
                  id="leilao"
                  name="saleFormat"
                  checked={priceBid}
                  onChange={() => setPriceBid(true)}
                  className="mr-2"
                />
                <label htmlFor="leilao">Leilão</label>
              </div>
            </div>

            {/* Quantidade Disponível */}
            <div>
              <label htmlFor="quantity" className="block text-lg font-medium text-gray-700">
                Quantidade Disponível
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Informe o número de unidades"
              />
            </div>

            {/* Opções de Frete */}
            <div>
              <label htmlFor="delivery" className="block text-lg font-medium text-gray-700">
                Opções de Frete
              </label>
              <select
                id="delivery"
                value={selectedDeliveryOption}
                onChange={(e) => setSelectedDeliveryOption(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o método de frete</option>
                {deliveryOptions.map((option) => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Política de Devolução */}
            <div>
              <label htmlFor="returnPolicy" className="block text-lg font-medium text-gray-700">
                Política de Devolução
              </label>
              <textarea
                id="returnPolicy"
                value={returnPolicy}
                onChange={(e) => setReturnPolicy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Informe as condições para devolução, prazos e requisitos"
                rows="3"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-lg font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Put Description of your product here"
                rows="3"
              />
            </div>

            {/* Informações de Pagamento */}
            <div>
              <label htmlFor="payment" className="block text-lg font-medium text-gray-700">
                Informações de Pagamento
              </label>
              <select
                id="payment"
                value={selectedPaymentOption}
                onChange={(e) => setSelectedPaymentOption(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione a forma de pagamento</option>
                {paymentOptions.map((option) => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
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
        )}
      </div>
    </div>
  );
};

export default CreateListingPage;
