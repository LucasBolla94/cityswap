import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { productId, address, address2, postCode, userId } = await req.json();

    // Validação de campos obrigatórios
    if (!productId || !address || !postCode || !userId) {
      return NextResponse.json({ error: 'Dados insuficientes para criar o checkout' }, { status: 400 });
    }

    // Buscar os detalhes do produto da API interna do Next.js
    const productResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productId}`);
    if (!productResponse.ok) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    const product = await productResponse.json();

    // Criação da sessão de checkout no Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: product.title,
              description: product.description,
              images: product.imageUrls || [],
            },
            unit_amount: Math.round(parseFloat(product.price) * 100), // Convertendo para centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payments/cancel`,
      metadata: {
        userId: userId,
        productId: productId,
        productTitle: product.title || "Produto Desconhecido",
        sellerName: "Vendedor Não Informado", // Se não houver sellerName, define um padrão
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('❌ Erro ao criar sessão de checkout:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// 🚀 NOVA FUNÇÃO GET PARA RECUPERAR OS DADOS DO PAGAMENTO PELO session_id
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID não fornecido' }, { status: 400 });
    }

    // Buscar os detalhes da sessão no Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json({ error: 'Sessão não encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      productTitle: session.metadata?.productTitle || 'Produto Desconhecido',
      sellerName: session.metadata?.sellerName || 'Vendedor Desconhecido',
      amountPaid: session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00",
      purchaseDate: session.created ? new Date(session.created * 1000).toLocaleString() : "Data não disponível",
    });
  } catch (error) {
    console.error('❌ Erro ao buscar sessão do Stripe:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
