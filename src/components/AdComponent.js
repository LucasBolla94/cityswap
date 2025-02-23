'use client';

import { useEffect } from 'react';

const AdComponent = () => {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error('Erro ao carregar o Google AdSense:', e);
    }
  }, []);

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
