import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(req, context) {
  try {
    const params = await context.params; // Aguarda os parâmetros serem resolvidos
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'ID do produto não fornecido' }, { status: 400 });
    }

    const docRef = doc(db, 'ads', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    return NextResponse.json(docSnap.data());
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
