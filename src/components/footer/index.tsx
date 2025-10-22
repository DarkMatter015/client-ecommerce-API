import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="footer-container">
      {/* <img className="w-full mb-5" src="/assets/images/footer/wave.svg" alt="Imagem de onda" /> */}

      <div className="mt-5 flex flex-column lg:flex-row align-items-center lg:align-items-start text-center lg:text-left p-3 justify-content-center lg:justify-content-around gap-2">
        <div>
          <a href="/#home" onClick={(e) => { e.preventDefault(); navigate('/#home'); }}>
            <img src="/assets/images/logo/logo_riffhouse_white.png" alt="Logo RiffHouse" className="logo-footer" />
          </a>
        </div>

        <div className="flex flex-column">
          <p className="font-bold">Institucional</p>
          <p>CNPJ: 97.375.551/0001-71</p>
          <p>Inscrição Estadual: 271.55296-30</p>
        </div>

        <div className="flex flex-column">
          <p className="font-bold">Fale Conosco</p>
          <a href="mailto:example@riffhouse.com" className="no-underline">
            <p>example@riffhouse.com</p>
          </a>
          <p>(99) 9999-9999</p>
        </div>

        <div className="flex flex-column">
          <p className="font-bold">Sobre nós</p>
          <p>Rua Exemplo, 123 - Bairro Exemplo</p>
          <p>São Paulo - SP</p>
          <p>CEP: 12345-678</p>
        </div>

        <div className="flex flex-column">
          <p className="font-bold">Ajuda</p>
          <a href="#" className="no-underline">
            <p>Política de Privacidade e Segurança</p>
          </a>
          <a href="#" className="no-underline">
            <p>Troca e Devoluções</p>
          </a>
        </div>

        <div className="flex flex-column">
          <p className="font-bold">Métodos de Pagamento</p>
          <div className="pagamentos flex align-items-center lg:align-items-start justify-content-center lg:justify-content-start">
            <img src="/assets/images/footer/visa.png" width="30" alt="Cartão visa" title="Cartão visa" />
            <img src="/assets/images/footer/mastercard.png" width="30" alt="Cartão mastercard" title="Cartão mastercard" />
            <img src="/assets/images/footer/pix.png" width="30" alt="Pix" title="Pix" />
            <img src="/assets/images/footer/boleto.png" width="30" alt="Boleto" title="Boleto" />
          </div>
          <div className="mt-2">
            <p className="font-bold">Redes Sociais</p>
            <div className="social-media-buttons flex align-items-center lg:align-items-start justify-content-center lg:justify-content-start">
              <a href="#" title="Facebook" aria-label="Facebook" className="no-underline">
                <i className="pi pi-facebook"></i>
              </a>
              <a href="#" title="Instagram" aria-label="Instagram" className="no-underline">
                <i className="pi pi-instagram"></i>
              </a>
              <a href="#" title="Whatsapp" aria-label="Whatsapp" className="no-underline">
                <i className="pi pi-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
