import { scrollIntoView } from "@/utils/Utils";
import { Button } from "primereact/button";

import "./homeHero.style.css";
import type React from "react";

export const HomeHero: React.FC = () => {
    return (
        <section id="home" className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="hero-line">O Som Que Te</span>
                        <span className="hero-accent">Inspira</span>
                    </h1>
                    <p className="hero-subtitle">Instrumentos musicais de qualidade para músicos apaixonados. Encontre o seu som na RiffHouse.</p>
                    <div className="hero-actions">
                        <Button className="btn-outline" onClick={() => scrollIntoView('products')}>Ver Produtos</Button>
                        <Button className="btn-outline" onClick={() => scrollIntoView('about')}>Sobre Nós</Button>
                    </div>
                    <div className="social-media-buttons">
                        <a className="p-link" href="#" aria-label="Facebook" title='facebook'><i className="pi pi-facebook" /></a>
                        <a className="p-link" href="#" aria-label="Instagram" title='instagram'><i className="pi pi-instagram" /></a>
                        <a className="p-link" href="#" aria-label="Whatsapp" title='whatsapp'><i className="pi pi-whatsapp" /></a>
                    </div>
                </div>
                <div className="hero-visual">
                    <img src="/assets/images/home/fundo1.svg" alt="Pessoa escutando música" loading="lazy" />
                </div>
        </section>
    );
};