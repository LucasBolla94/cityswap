// /src/lib/listings.js

import { db } from './firebase'; // Importe o objeto db do seu firebase
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

// Função para pegar todos os anúncios de um usuário
export const getUserListings = async (userId) => {
  try {
    const listingsRef = collection(db, 'listings'); // Referência à coleção de listings
    const q = query(listingsRef, where('userId', '==', userId)); // Filtra os anúncios pelo userId

    const querySnapshot = await getDocs(q);
    const listings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return listings;
  } catch (error) {
    console.error('Erro ao buscar anúncios:', error);
    return []; // Retorna um array vazio em caso de erro
  }
};

// Função para adicionar um novo anúncio
export const addListing = async (listingData) => {
  try {
    const listingsRef = collection(db, 'listings'); // Referência à coleção de listings
    
    // Adiciona o novo anúncio na coleção de listings
    const docRef = await addDoc(listingsRef, listingData);

    console.log('Anúncio criado com sucesso!', docRef.id);
    return docRef.id; // Retorna o ID do anúncio criado
  } catch (error) {
    console.error('Erro ao criar anúncio:', error);
    throw new Error('Não foi possível criar o anúncio. Tente novamente.');
  }
};
