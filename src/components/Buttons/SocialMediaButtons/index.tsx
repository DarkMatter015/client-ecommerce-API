
import "./social-media-buttons.style.css";

export const SocialMediaButtons = () => {
  return (
    <div className="social-media-buttons">
        <a className="p-link" href="#" aria-label="Facebook" title='facebook'><i className="pi pi-facebook" /></a>
        <a className="p-link" href="#" aria-label="Instagram" title='instagram'><i className="pi pi-instagram" /></a>
        <a className="p-link" href="#" aria-label="Whatsapp" title='whatsapp'><i className="pi pi-whatsapp" /></a>
    </div>
  );
};
