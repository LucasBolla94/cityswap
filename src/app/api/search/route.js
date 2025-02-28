import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs, startAfter, limit, doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL); // Configuração do Redis

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const title = searchParams.get("title");
    const pageSize = Number(searchParams.get("limit")) || 10;
    const lastDocId = searchParams.get("lastDocId");

    // Criando chave do cache para evitar buscas repetidas
    const cacheKey = `search:${category}-${city}-${title}-${pageSize}-${lastDocId}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return NextResponse.json({ success: true, data: JSON.parse(cachedData) });
    }

    const filters = [];

    if (category) {
      filters.push(where("category", "==", category));
    }
    if (city) {
      filters.push(where("city", "==", city));
    }
    if (title) {
      filters.push(where("searchKeywords", "array-contains", title.toLowerCase())); 
    }

    let listingsQuery = query(collection(db, "ads"), orderBy("createdAt", "desc"), limit(pageSize));

    if (filters.length > 0) {
      listingsQuery = query(collection(db, "ads"), ...filters, orderBy("createdAt", "desc"), limit(pageSize));
    }

    // Implementando paginação
    if (lastDocId) {
      const lastDoc = await getDoc(doc(db, "ads", lastDocId));
      if (lastDoc.exists()) {
        listingsQuery = query(listingsQuery, startAfter(lastDoc));
      }
    }

    // Executando a query
    const querySnapshot = await getDocs(listingsQuery);
    const listings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Salvando no cache por 5 minutos
    await redis.set(cacheKey, JSON.stringify(listings), "EX", 300);

    return NextResponse.json({ success: true, data: listings }, { status: 200 });
  } catch (error) {
    console.error("Erro na busca:", error);

    let errorMessage = "Erro interno no servidor.";
    if (error.code === "permission-denied") {
      errorMessage = "Acesso negado. Verifique as regras do Firestore.";
    } else if (error.message.includes("index")) {
      errorMessage = "Necessário criar um índice no Firestore.";
    }

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
