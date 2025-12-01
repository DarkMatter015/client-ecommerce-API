import "./home-testimonials.style.css";
import type React from "react";
import { SecondaryButton } from "@/components/Buttons/SecondaryButton";
import { CardFeedback } from "@/components/CardFeedback";

export const HomeTestimonials: React.FC = () => {
    return (
        <section id="testimonials" className="section testimonials-section">
            <div className="testimonials-inner">
                <div className="testimonials-image" aria-hidden>
                    <img
                        src="/assets/images/home/fundo2.svg"
                        alt="Pessoas curtindo a página"
                    />
                </div>

                <div className="testimonials-content">
                    <h2 className="section-title">Avaliações</h2>
                    <p className="section-subtitle">
                        O que nossos clientes acham dos nossos produtos
                    </p>

                    <div className="feedbacks">
                        <CardFeedback
                            image="/assets/images/home/person1.jfif"
                            name="Ricardo da Silva"
                            rating="★★★★★"
                            text="Loja muito bem organizada, com ótimos preços e suporte atencioso. Recomendo para todos os músicos!"
                        />

                        <CardFeedback
                            image="/assets/images/home/person2.jfif"
                            name="Aline Silveira"
                            rating="★★★★★"
                            text="Excelente atendimento e variedade incrível
                                    de produtos musicais. Comprei minha guitarra
                                    e chegou antes do prazo!"
                        />
                    </div>

                    <div>
                        <SecondaryButton>Ver mais Avaliações</SecondaryButton>
                    </div>
                </div>
            </div>
        </section>
    );
};
