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

  // Estados iniciais e de controle de etapa
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

  // Estados para navegação entre etapas
  const [step, setStep] = useState('selectCategory'); // "selectCategory" ou "completeForm"

  // Outros estados do formulário
  const [specs, setSpecs] = useState('');
  const [condition, setCondition] = useState('');
  const [acceptBids, setAcceptBids] = useState(false);
  const [sellByGrooby, setSellByGrooby] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('');
  const [returnPolicy, setReturnPolicy] = useState('');

  // Estados para o campo "City"
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

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

  // Buscar opções de cidades da coleção 'ads-city'
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesCollection = collection(db, 'ads-city');
        const snapshot = await getDocs(citiesCollection);
        const citiesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCities(citiesList);
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
      }
    };
    fetchCities();
  }, []);

  if (loading) return <div className="p-4">Carregando...</div>;
  if (!user) {
    router.push('/auth/login');
    return null;
  }

  // Função para upload de imagens (suporta múltiplos arquivos)
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setLoadingImage(true);

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

  // Função para remover imagem
  const handleRemoveImage = (imageUrl) => {
    setImages(images.filter((image) => image !== imageUrl));
  };

  // Avançar da etapa de seleção de categoria para o formulário completo
  const handleCategoryNext = () => {
    if (!category) {
      setError('A categoria é obrigatória!');
      return;
    }
    setError('');
    setStep('completeForm');
  };

  // Função para enviar o formulário completo
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
    if (!selectedCity) {
      setError('A cidade é obrigatória!');
      return;
    }
    if (images.length < 3) {
      setError('Você precisa adicionar pelo menos 3 fotos.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // Salvar anúncio na coleção "ads" incluindo o campo "city" e definindo "status-ads" como false
      await addDoc(collection(db, 'ads'), {
        title,
        description,
        price,
        category, // Categoria selecionada
        city: selectedCity, // Cidade selecionada
        imageUrls: images,
        specs,
        condition,
        bid: acceptBids,
        gbyseller: sellByGrooby,
        quantity,
        ...(sellByGrooby && { delivery: selectedDeliveryOption }),
        return: returnPolicy,
        userId: user.uid,
        createdAt: new Date(),
        "status-ads": false
      });

      router.push('/dashboard/my-listings');
    } catch (error) {
      setError('Erro ao criar o anúncio. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para tratar a entrada no campo "Preço"
  const handlePriceChange = (e) => {
    const rawDigits = e.target.value.replace(/\D/g, '');
    const num = parseInt(rawDigits || '0', 10);
    const formatted = (num / 100).toFixed(2);
    setPrice(formatted);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl w-full mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Criar Anúncio</h1>
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

        {step === 'selectCategory' && (
          <div className="px-4 sm:px-6">
            {loadingCategories ? (
              <p className="text-center">Carregando categorias...</p>
            ) : (
              <div className="space-y-6">
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
                <button
                  type="button"
                  onClick={handleCategoryNext}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Próximo
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'completeForm' && (
          <form onSubmit={handleSubmit} className="space-y-6 px-4 sm:px-6">
            {/* Campo "City" */}
            <div>
              <label htmlFor="city" className="block text-lg font-medium text-gray-700">
                City
              </label>
              <select
                id="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma cidade</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

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

            {/* Campo Preço */}
            <div>
              <label htmlFor="price" className="block text-lg font-medium text-gray-700">
                Preço
              </label>
              <input
                type="text"
                id="price"
                value={price}
                onChange={handlePriceChange}
                placeholder="£0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Switch para "Accept Bids" */}
            <div className="flex items-center">
              <label htmlFor="acceptBids" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="acceptBids"
                    className="sr-only"
                    checked={acceptBids}
                    onChange={() => setAcceptBids(!acceptBids)}
                  />
                  <div
                    className={`w-10 h-4 rounded-full border shadow ${acceptBids ? 'bg-black' : 'bg-neutral-200'}`}
                  ></div>
                  <div
                    className={`dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition-transform ${
                      acceptBids ? 'transform translate-x-full' : ''
                    }`}
                  ></div>
                </div>
                <span className="ml-3 text-lg font-medium text-gray-700">Accept Bids</span>
              </label>
            </div>

            {/* Switch para "Sell by Grooby" (desativado) */}
            <div className="flex items-center">
              <label htmlFor="sellByGrooby" className="flex items-center cursor-not-allowed">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="sellByGrooby"
                    className="sr-only"
                    checked={sellByGrooby}
                    onChange={() => {}}
                    disabled
                  />
                  <div
                    className={`w-10 h-4 rounded-full border shadow ${sellByGrooby ? 'bg-black' : 'bg-neutral-200'}`}
                  ></div>
                  <div
                    className={`dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition-transform ${
                      sellByGrooby ? 'transform translate-x-full' : ''
                    }`}
                  ></div>
                </div>
                <span className="ml-3 text-lg font-medium text-gray-700">Sell by Grooby</span>
              </label>
            </div>

            {/* Opções de Frete */}
            {sellByGrooby && (
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
            )}

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

            {/* Fotos */}
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
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
                </div>
              )}
              {loadingImage && <p className="mt-2 text-gray-600">Carregando imagem...</p>}
            </div>

            {/* Especificações, condição, quantidade e política de devolução */}
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

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard/my-listings')}
                className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
