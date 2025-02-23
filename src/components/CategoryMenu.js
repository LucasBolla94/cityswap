// /src/components/CategoryMenu.js

import Link from 'next/link';

const categories = [
  { name: 'Eletrônicos', slug: 'eletronicos' },
  { name: 'Moda', slug: 'moda' },
  { name: 'Imóveis', slug: 'imoveis' },
  // Adicione mais categorias conforme necessário
];

const CategoryMenu = () => {
  return (
    <div className="bg-white shadow p-4">
      <h2 className="text-xl font-bold mb-4">Categorias</h2>
      <ul>
        {categories.map((category) => (
          <li key={category.slug} className="mb-2">
            <Link href={`/categories/${category.slug}`}>
              <span className="text-gray-600 hover:text-gray-800 cursor-pointer">
                {category.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryMenu;
