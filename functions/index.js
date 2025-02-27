/**
 * Exemplo de functions/index.js utilizando Firebase Functions v2.
 * Documentação:
 * - https://firebase.google.com/docs/functions/https-calls
 * - https://firebase.google.com/docs/functions/upgrade-from-v1
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

// Inicializa o Firebase Admin para acessar o Firestore, Auth, etc.
admin.initializeApp();

// Inicializa o Stripe utilizando a chave secreta.
// Em desenvolvimento, usamos process.env.STRIPE_SECRET_KEY; em produção, você pode configurar via CLI
// com `firebase functions:config:set stripe.secret="..."`.
const stripeSecret = process.env.STRIPE_SECRET_KEY || require("firebase-functions").config().stripe.secret;
const stripe = require("stripe")(stripeSecret);

// Configuração das URLs de redirecionamento após o pagamento.
const successUrl = process.env.STRIPE_SUCCESS_URL || 'https://cityswapuk.com/payments/sucess/{CHECKOUT_SESSION_ID}';
const cancelUrl = process.env.STRIPE_CANCEL_URL || 'https://cityswapuk.com/payments/cancel';

/**
 * Função HTTPS Callable para criar uma sessão de checkout do Stripe.
 * Essa função busca os dados do produto no Firestore (nome e preço), validando que o preço é um número válido,
 * garantindo que o valor não seja alterado pelo frontend, e cria uma sessão de pagamento no Stripe.
 * Agora utilizando GBP (£) como moeda.
 */
exports.createCheckoutSession = onCall(async (data, context) => {
  // 1. Verifica se o usuário está autenticado.
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'Você precisa estar autenticado.');
  }

  // 2. Extrai o productId enviado pelo cliente e valida sua existência.
  const { productId } = data;
  if (!productId) {
    throw new HttpsError('invalid-argument', 'ProductId é obrigatório.');
  }

  try {
    // 3. Busca os detalhes do produto no Firestore para garantir a segurança dos dados.
    const productRef = admin.firestore().collection('products').doc(productId);
    const productSnap = await productRef.get();
    if (!productSnap.exists) {
      throw new HttpsError('not-found', 'Produto não encontrado.');
    }
    
    const productData = productSnap.data();
    const productName = productData.name;
    // Atenção: o preço deve estar em pence (por exemplo, £10,00 = 1000).
    const priceInPence = productData.price;

    // 4. Validação adicional: garante que o preço é um número válido e maior que zero.
    if (typeof priceInPence !== 'number' || priceInPence <= 0) {
      throw new HttpsError('invalid-argument', 'Preço do produto inválido.');
    }

    // 5. Cria a sessão de checkout no Stripe com a moeda GBP.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'gbp', // Utilizando GBP
          product_data: {
            name: productName,
          },
          unit_amount: priceInPence,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // 6. Retorna o ID da sessão para que o frontend redirecione o usuário para o Stripe Checkout.
    return { sessionId: session.id };
  } catch (error) {
    logger.error("Erro ao criar sessão do Stripe:", error);
    throw new HttpsError('internal', 'Erro ao criar a sessão de pagamento.');
  }
});
