import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
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
          <Link href="/auth/login" className="text-gray-600 hover:text-gray-800">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
