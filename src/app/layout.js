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
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar /> {/* Barra de navegação aqui */}
        {children}
      </body>
    </html>
  );
}
