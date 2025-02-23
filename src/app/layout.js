import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '../components/NavBar';  // Adicionando o Navbar aqui

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'CitySwapUk WebSite',
  description: 'Um Marketplace online de compra e venda.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Adicionando o título e meta informações */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar /> {/* Barra de navegação aqui */}
        <div className="pt-16"> {/* Ajuste o valor de pt-16 conforme a altura da sua barra de navegação */}
          {children}
        </div>

        {/* Adicionando o script do Google Ads no final do body */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4576510897992414"
          crossorigin="anonymous"
        ></script>
      </body>
    </html>
  );
}
