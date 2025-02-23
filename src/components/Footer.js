// /src/components/Footer.js

const Footer = () => {
  const currentYear = new Date().getFullYear();  // Definindo o ano atual em uma variável

  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {currentYear} CitySwapUk.com . All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
