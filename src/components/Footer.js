// /src/components/Footer.js

const Footer = () => {
  const currentYear = new Date().getFullYear();  // Definindo o ano atual em uma variável

  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {currentYear} eBay Clone. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
