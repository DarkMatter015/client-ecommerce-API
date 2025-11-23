import { Button } from "primereact/button";

import "./homeTestimonials.style.css";
import type React from "react";

export const HomeTestimonials: React.FC = () => {
    return (
        <section id="testimonials" className="section testimonials-section">
            <div className="testimonials-inner">
                <div className="testimonials-image" aria-hidden>
                    <img src="/assets/images/home/fundo2.svg" alt="Pessoas curtindo a página" />
                </div>

                <div className="testimonials-content">
                    <h2 className="section-title">Avaliações</h2>
                    <p className="section-subtitle">O que nossos clientes acham dos nossos produtos</p>

                    <div className="feedbacks">
                        <article className="card-feedback">
                            <img className="feedback-image" src="/assets/images/home/person1.jfif" alt="Cliente 1" />
                            <div className="feedback-body">
                                <strong>Ricardo da Silva</strong>
                                <div className="rating" aria-hidden>★★★★★</div>
                                <p>Loja muito bem organizada, com ótimos preços e suporte atencioso. Recomendo para todos os músicos!</p>
                            </div>
                        </article>

                        <article className="card-feedback">
                            <img className="feedback-image" src="/assets/images/home/person2.jfif" alt="Cliente 2" />
                            <div className="feedback-body">
                                <strong>Aline Silveira</strong>
                                <div className="rating" aria-hidden>★★★★★</div>
                                <p>Excelente atendimento e variedade incrível de produtos musicais. Comprei minha guitarra e chegou antes do prazo!</p>
                            </div>
                        </article>
                    </div>

                    <div>
                        <Button className="btn-outline mt-3">
                            Ver mais Avaliações
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};