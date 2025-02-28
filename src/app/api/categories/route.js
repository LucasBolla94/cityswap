import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Busca as categorias no Firestore
    const querySnapshot = await getDocs(collection(db, "categories"));
    const categories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Erro ao carregar categorias:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
