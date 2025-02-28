import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Cria uma query para buscar os 20 anúncios mais recentes
    const listingsQuery = query(
      collection(db, "ads"), // Coleção no Firestore
      orderBy("createdAt", "desc"), // Ordena pelo mais novo
      limit(20) // Limita para 20 resultados
    );

    // Executa a query
    const querySnapshot = await getDocs(listingsQuery);

    // Converte os dados para um array de objetos
    const listings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Retorna os anúncios em formato JSON
    return NextResponse.json({ success: true, data: listings }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar anúncios:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
