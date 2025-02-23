"use client"; // Marca esse componente como cliente

import { useAuth, logout } from "../lib/auth"; // Importa o hook de autenticação e a função de logout
import Link from 'next/link';

const Navbar = ({ isScrolled }) => {
  const { user, loading } = useAuth(); // Pega o estado do usuário e o estado de carregamento

  const handleLogout = async () => {
    try {
      await logout(); // Chama a função de logout do Firebase
      // Aqui, você pode redirecionar o usuário para a página inicial após o logout, se necessário
      window.location.href = '/'; // Redireciona para a página inicial após logout
    } catch (err) {
      console.error("Erro ao fazer logout", err);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-transparent" : "bg-white shadow-md"}`}
      style={{ opacity: isScrolled ? 0.7 : 1 }}
    >
      {/* Div que agora ocupa toda a largura da tela */}
      <div className="w-full px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          eBay Clone
        </Link>
        <div className="space-x-4">
          <Link href="/listings" className="text-gray-600 hover:text-gray-800">
            Anúncios
          </Link>
          <Link href="/categories" className="text-gray-600 hover:text-gray-800">
            Categorias
          </Link>
          {loading ? (
            <span className="text-gray-600">Carregando...</span> // Caso esteja carregando
          ) : user ? (
            <>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
                Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-800">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
