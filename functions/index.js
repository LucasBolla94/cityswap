/**
 * Exemplo de functions/index.js utilizando Firebase Functions v2.
 * Documentação:
 * - https://firebase.google.com/docs/functions/https-calls
 * - https://firebase.google.com/docs/functions/upgrade-from-v1
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

// Inicializa o Firebase Admin
admin.initializeApp();

// Inicializa o Stripe utilizando a chave secreta
// Utilize process.env.STRIPE_SECRET_KEY para desenvolvimento local,
// ou functions.config().stripe.secret se configurado via CLI (firebase functions:config:set).
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || require("firebase-functions").config().stripe.secret);

/**
 * Função HTTPS Callable para criar uma sessão de checkout do Stripe.
 * Essa função garante que o valor do produto seja buscado do Firestore,
 * evitando alterações pelo frontend.
 */
exports.createCheckoutSession = onCall(async (data, context) => {
  // Valida se o usuário está autenticado
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'Você precisa estar autenticado.');
  }

  // Valida o productId enviado pelo cliente
  const { productId } = data;
  if (!productId) {
    throw new HttpsError('invalid-argument', 'ProductId é obrigatório.');
  }

  // Busca os detalhes do produto no Firestore
  const productRef = admin.firestore().collection('products').doc(productId);
  const productSnap = await productRef.get();
  if (!productSnap.exists) {
    throw new HttpsError('not-found', 'Produto não encontrado.');
  }

  const productData = productSnap.data();
  const priceInCents = productData.price; // Certifique-se que o preço está em centavos
  const productName = productData.name;

  try {
    // Cria a sessão de checkout no Stripe com os links configurados corretamente
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd', // Altere para a moeda desejada
          product_data: {
            name: productName,
          },
          unit_amount: priceInCents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      // Substitua 'seu-dominio.com' pelo seu domínio real ou utilize localhost para desenvolvimento
      success_url: 'https://seu-dominio.com/payments/sucess/{CHECKOUT_SESSION_ID}',
      cancel_url: 'https://seu-dominio.com/payments/cancel',
    });

    // Retorna o ID da sessão para o frontend
    return { sessionId: session.id };
  } catch (error) {
    logger.error("Erro ao criar sessão do Stripe:", error);
    throw new HttpsError('internal', 'Erro ao criar a sessão de pagamento.');
  }
});
