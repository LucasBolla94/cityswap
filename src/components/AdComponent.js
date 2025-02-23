'use client';

import { useEffect } from 'react';

const AdComponent = () => {
  useEffect(() => {
    // Função para carregar o AdSense
    const loadAdSense = () => {
      if (window.adsbygoogle) {
        try {
          // Forçar a atualização do AdSense
          window.adsbygoogle.push({});
        } catch (e) {
          console.error('Erro ao carregar o Google AdSense:', e);
        }
      }
    };

    // Verifica se o AdSense foi carregado
    if (typeof window !== "undefined") {
      // Aguardar o carregamento do script do AdSense
      const interval = setInterval(() => {
        if (window.adsbygoogle) {
          loadAdSense();
          clearInterval(interval); // Remove o intervalo quando o AdSense estiver carregado
        }
      }, 500); // Checa a cada 500ms

      // Limpar o intervalo após um tempo para evitar loops infinitos
      setTimeout(() => clearInterval(interval), 5000); // Limpa após 5 segundos
    }
  }, []); // Executa apenas uma vez, após a renderização inicial

  return (
    <div className="w-full flex justify-center my-4">
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '90%',  // Ajusta para largura total disponível
          minWidth: '300px',  // Largura mínima para garantir que o AdSense tenha espaço
          height: '70px',
        }}
        data-ad-client="ca-pub-4576510897992414"  // Seu ID do AdSense
        data-ad-slot="3222401032"  // Código do bloco de anúncio
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdComponent;
