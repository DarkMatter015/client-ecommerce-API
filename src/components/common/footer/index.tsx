import React from 'react';
import { useNavigate } from 'react-router-dom';
import './footer.style.css';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  const footerSections = {
    institutional: {
      title: "Institucional",
      items: [
        { label: "CNPJ: 97.375.551/0001-71" },
        { label: "Inscrição Estadual: 271.55296-30" }
      ]
    },
    contact: {
      title: "Fale Conosco",
      items: [
        { label: "example@riffhouse.com", href: "mailto:example@riffhouse.com", icon: "pi-envelope" },
        { label: "(99) 9999-9999", href: "tel:+5599999999999", icon: "pi-phone" }
      ]
    },
    about: {
      title: "Localização",
      items: [
        { label: "Rua Exemplo, 123 - Bairro Exemplo" },
        { label: "São Paulo - SP" },
        { label: "CEP: 12345-678" }
      ]
    },
    help: {
      title: "Ajuda",
      items: [
        { label: "Política de Privacidade", href: "#" },
        { label: "Troca e Devoluções", href: "#" },
        { label: "Termos de Uso", href: "#" }
      ]
    }
  };

  const paymentMethods = [
    { src: "/assets/images/footer/visa.png", alt: "Visa" },
    { src: "/assets/images/footer/mastercard.png", alt: "Mastercard" },
    { src: "/assets/images/footer/pix.png", alt: "Pix" },
    { src: "/assets/images/footer/boleto.png", alt: "Boleto" }
  ];

  const socialMedia = [
    { icon: "pi-facebook", label: "Facebook", href: "#" },
    { icon: "pi-instagram", label: "Instagram", href: "#" },
    { icon: "pi-whatsapp", label: "WhatsApp", href: "#" }
  ];

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Logo */}
        <div className="footer-logo-section">
          <a
            href="/#home"
            onClick={(e) => {
              e.preventDefault();
              navigate('/#home');
            }}
            className="footer-logo-link"
          >
            <img
              src="/assets/images/logo/logo_riffhouse_white.png"
              alt="RiffHouse"
              className="footer-logo"
            />
          </a>
          <p className="footer-tagline">
            Instrumentos musicais de qualidade para músicos exigentes
          </p>
        </div>

        {/* Footer Grid */}
        <div className="footer-grid">
          {/* Institucional */}
          <div className="footer-column">
            <h3 className="footer-title">{footerSections.institutional.title}</h3>
            <ul className="footer-list">
              {footerSections.institutional.items.map((item, index) => (
                <li key={index}>{item.label}</li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div className="footer-column">
            <h3 className="footer-title">{footerSections.contact.title}</h3>
            <ul className="footer-list">
              {footerSections.contact.items.map((item, index) => (
                <li key={index}>
                  {item.href ? (
                    <a href={item.href} className="footer-link">
                      {item.icon && <i className={`pi ${item.icon}`}></i>}
                      {item.label}
                    </a>
                  ) : (
                    item.label
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Localização */}
          <div className="footer-column">
            <h3 className="footer-title">{footerSections.about.title}</h3>
            <ul className="footer-list">
              {footerSections.about.items.map((item, index) => (
                <li key={index}>{item.label}</li>
              ))}
            </ul>
          </div>

          {/* Ajuda */}
          <div className="footer-column">
            <h3 className="footer-title">{footerSections.help.title}</h3>
            <ul className="footer-list">
              {footerSections.help.items.map((item, index) => (
                <li key={index}>
                  <a href={item.href} className="footer-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Pagamento e Redes Sociais */}
          <div className="footer-column">
            <div className="footer-payments">
              <h3 className="footer-title">Pagamentos</h3>
              <div className="payment-methods">
                {paymentMethods.map((method, index) => (
                  <img
                    key={index}
                    src={method.src}
                    alt={method.alt}
                    title={method.alt}
                    className="payment-icon"
                  />
                ))}
              </div>
            </div>

            <div className="footer-social">
              <h3 className="footer-title">Redes Sociais</h3>
              <div className="social-links">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    title={social.label}
                    aria-label={social.label}
                    className="social-link"
                  >
                    <i className={`pi ${social.icon}`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} RiffHouse. Todos os direitos reservados.
          </p>
          <p className="footer-credits">
            Desenvolvido com <i className="pi pi-heart"></i> pela equipe RiffHouse
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
