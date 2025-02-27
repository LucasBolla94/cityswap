// /src/app/payments/cancel/page.js

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Pagamento Cancelado</h1>
      <p className="text-lg mb-4">
        Seu pagamento foi cancelado. Caso deseje, tente novamente.
      </p>
      <a 
        href="/" 
        className="text-blue-500 underline"
      >
        Voltar para a página inicial
      </a>
    </div>
  );
}
