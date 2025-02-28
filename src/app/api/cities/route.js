import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Busca os documentos da coleção de cidades (certifique-se que a coleção está correta)
    const querySnapshot = await getDocs(collection(db, "ads-city"));
    const cities = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(cities, { status: 200 });
  } catch (error) {
    console.error("Erro ao carregar cidades:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
