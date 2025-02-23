'use client';

import { useEffect } from 'react';

const AdComponent = () => {
  useEffect(() => {
    // Garantir que o Google AdSense esteja carregado
    const loadAdSense = () => {
      if (window.adsbygoogle) {
        try {
          window.adsbygoogle.push({});
        } catch (e) {
          console.error('Erro ao carregar o Google AdSense:', e);
        }
      }
    };

    // Verifica se o AdSense foi carregado e aguarda antes de empurrar os anúncios
    if (typeof window !== "undefined") {
      // Aguardar o carregamento do script do AdSense
      const interval = setInterval(() => {
        if (window.adsbygoogle) {
          loadAdSense();
          clearInterval(interval); // Remove o intervalo quando o AdSense estiver carregado
        }
      }, 500); // Checa a cada 500ms
    }
  }, []); // Executa apenas uma vez, após a renderização inicial

  return (
    <div className="w-full flex justify-center my-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4576510897992414"  // Seu ID do AdSense
        data-ad-slot="3222401032"  // Código do bloco de anúncio
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdComponent;
