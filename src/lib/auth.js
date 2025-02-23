import { useState, useEffect } from 'react';
import { auth, db } from './firebase'; // Acesso ao serviço de autenticação e Firestore
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Hook para autenticação
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Atualiza o usuário no estado
      setLoading(false); // Finaliza o carregamento
    });

    // Limpeza do efeito (desinscreve-se do listener)
    return () => unsubscribe();
  }, []);

  return { user, loading };
};

// Função de cadastro (sign up) com email e senha
export const signUp = async (name, email, password) => {
  // Verifica se o email é válido
  if (!email || !email.includes('@') || !email.includes('.')) {
    throw new Error('Email inválido');
  }

  // Verifica se a senha tem pelo menos 6 caracteres
  if (password.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Registrar o usuário na coleção "users" no Firestore com o nome
    await setDoc(doc(db, 'users', user.uid), {
      name: name,  // Salva o nome do usuário
      email: user.email,
      uid: user.uid,
      createdAt: new Date(),
    });

    return user;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw new Error(error.message); // Garante que a mensagem de erro seja retornada
  }
};

// Função de login (sign in) com email e senha
export const login = async (email, password) => {
  // Verifica se o email é válido
  if (!email || !email.includes('@') || !email.includes('.')) {
    throw new Error('Email inválido');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw new Error(error.message); // Garante que a mensagem de erro seja retornada
  }
};

// Função de logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw new Error(error.message); // Garante que a mensagem de erro seja retornada
  }
};

// Função de login com Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Verifica se o usuário já existe na coleção "users"
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    // Se o usuário não existe, cria um novo documento para ele
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        name: user.displayName,  // Pega o nome do Google
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
      });
    }

    return user;
  } catch (error) {
    console.error("Erro ao fazer login com Google:", error);
    throw new Error(error.message); // Garante que a mensagem de erro seja retornada
  }
};
