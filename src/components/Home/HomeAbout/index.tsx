import type React from "react";
import "./homeAbout.style.css"

export const HomeAbout: React.FC = () => (
    <section id="about" className="section about-section">
        <div className="section-inner">
            <div className="about-text">
                <h2 className='section-title'>Sobre a RiffHouse</h2>
                <p>Na RiffHouse, acreditamos que um instrumento musical não é apenas uma ferramenta, mas uma extensão da alma de quem toca. Nascemos da vontade de unir arte, autenticidade e experiência sonora, criando um espaço onde músicos encontram mais do que produtos — encontram identidade.</p>
                <p>Nossa loja é um tributo à expressão criativa. Cada guitarra, violão ou acessório carrega consigo história, estilo e personalidade, pensados nos mínimos detalhes para transformar cada nota tocada em algo memorável.</p>
            </div>
            <div className="about-image">
                <img src="/assets/images/home/fundo_about.png" alt="Interior da loja RiffHouse" loading="lazy" />
            </div>
        </div>
    </section>
);