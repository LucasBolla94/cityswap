'use client'; // Adicionando a diretiva "use client" para garantir que o componente seja renderizado no lado do cliente

import { useAuth } from '../../lib/auth'; // Certifique-se de que o caminho está correto
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const DashboardPage = () => {
  const { user, loading } = useAuth(); // Pegando usuário autenticado
  const router = useRouter();

  if (loading) return <div>Carregando...</div>;

  if (!user) {
    router.push('/auth/login'); // Redireciona para a página de login caso o usuário não esteja autenticado
    return null; // Não renderiza o restante da página
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Barra Lateral */}
      <aside className="w-1/4 bg-white shadow-lg h-screen p-6">
        <h2 className="text-xl font-semibold mb-6">Bem-vindo, {user.displayName || user.email}</h2>
        <nav className="space-y-4">
          <Link href="/dashboard" className="block text-gray-700 hover:text-gray-900">
            Resumo da Conta
          </Link>
          <Link href="/dashboard/my-listings" className="block text-gray-700 hover:text-gray-900">
            Meus Anúncios
          </Link>
          <Link href="/dashboard/orders" className="block text-gray-700 hover:text-gray-900">
            Meus Pedidos
          </Link>
          <Link href="/dashboard/settings" className="block text-gray-700 hover:text-gray-900">
            Configurações de Conta
          </Link>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Resumo da Conta</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Status:</strong> Ativo</p>
        </div>

        {/* Meus Anúncios */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Meus Anúncios</h2>
          <p>Você ainda não publicou nenhum anúncio. Comece a vender agora!</p>
          <Link href="/create-listing" className="text-blue-500 hover:underline">Criar Novo Anúncio</Link>
        </div>

        {/* Meus Pedidos */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Meus Pedidos</h2>
          <p>Você ainda não tem pedidos.</p>
        </div>

        {/* Configurações */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Configurações de Conta</h2>
          <Link href="/dashboard/settings" className="text-blue-500 hover:underline">
            Editar informações da conta
          </Link>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
