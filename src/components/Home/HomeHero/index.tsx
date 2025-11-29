import { scrollIntoView } from "@/utils/Utils";

import "./home-hero.style.css";
import type React from "react";
import { SecondaryButton } from "@/components/Buttons/SecondaryButton";
import { SocialMediaButtons } from "@/components/Buttons/SocialMediaButtons";

export const HomeHero: React.FC = () => {
    return (
        <section id="home" className="section hero-section">
            <div className="hero-content">
                <h1 className="hero-title">
                    <span className="hero-line">O Som Que Te</span>
                    <span className="hero-accent">Inspira</span>
                </h1>
                <p className="section-subtitle hero-subtitle">
                    Instrumentos musicais de qualidade para músicos apaixonados.
                    Encontre o seu som na RiffHouse.
                </p>
                <div className="hero-actions">
                    <SecondaryButton onClick={() => scrollIntoView("products")}>
                        Ver Produtos
                    </SecondaryButton>
                    <SecondaryButton onClick={() => scrollIntoView("about")}>
                        Sobre Nós
                    </SecondaryButton>
                </div>
                <SocialMediaButtons />
            </div>
            <div className="hero-visual">
                <img
                    src="/assets/images/home/fundo1.svg"
                    alt="Pessoa escutando música"
                    loading="lazy"
                />
            </div>
        </section>
    );
};
