import Link from 'next/link';

const listings = [
  {
    id: 1,
    title: 'Produto 1',
    price: 'R$ 100,00',
    imageUrl: '/path/to/image1.jpg',
  },
  {
    id: 2,
    title: 'Produto 2',
    price: 'R$ 200,00',
    imageUrl: '/path/to/image2.jpg',
  },
  // Adicione mais produtos conforme necessário
];

const ListingGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <div key={listing.id} className="bg-white shadow p-4">
          <img src={listing.imageUrl} alt={listing.title} className="mb-4" />
          <h3 className="text-lg font-bold mb-2">{listing.title}</h3>
          <p className="text-gray-800 mb-2">{listing.price}</p>
          <Link
            href={`/listings/${listing.id}`}
            className="text-blue-500 hover:underline"
          >
            Ver detalhes
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ListingGrid;
