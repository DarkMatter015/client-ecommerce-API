import { Button } from 'primereact/button';
import "@/pages/home/index.css";


export const HomePage = () => {
    return (
        <div className='flex flex-column w-8'>
            <section id="home" className="flex flex-column lg:flex-row align-items-center justify-content-around">
                <div id="cta" className="lg:col-5 xl:col-6 flex flex-column align-items-center lg:align-items-start text-center lg:text-left gap-3">
                    <h1 className="title font-semibold m-0">
                        O Som Que Te
                        <span><br /> Inspira</span>
                    </h1>

                    <p>Instrumentos musicais de qualidade para músicos apaixonados. Encontre o seu som na RiffHouse.</p>

                    <div id="cta_buttons" className="flex gap-3">
                        <a href="#produtos" className="btn-outline" aria-label="Ver produtos">Ver Produtos</a>
                        <a href="#about" className="btn-outline" aria-label="Sobre nós">Sobre Nós</a>
                    </div>

                    <div className="social-media-buttons flex gap-3 mt-3">
                        <a href="#" title="Facebook" aria-label="Facebook" className="p-link">
                            <i className="pi pi-facebook"></i>
                        </a>
                        <a href="#" title="Instagram" aria-label="Instagram" className="p-link">
                            <i className="pi pi-instagram"></i>
                        </a>
                        <a href="#" title="Whatsapp" aria-label="Whatsapp" className="p-link">
                            <i className="pi pi-whatsapp"></i>
                        </a>
                    </div>
                </div>

                <div id="banner" className="hidden lg:flex lg:col-7 xl:col-6 align-items-end justify-content-end">
                    <img src="/assets/images/home/fundo1.svg" alt="Pessoa escutando música" className="w-full" />
                </div>
            </section>

            <section id="produtos" className="px-3 lg:px-6 mb-5">
                <div className="flex flex-column">
                    <h2 className="produtos-title">Produtos</h2>
                    <div className="flex justify-content-between align-items-center">
                        <h3 className="produtos-subtitle mb-3">Os melhores produtos feitos para você!</h3>
                        <div className="relative" id="categorias">
                            <Button label="Categorias" className="p-button-text categoria-link" aria-label="Categorias" />
                            <ul className="shadow-2 surface-card border-round absolute mt-2" id="menu-categorias" style={{listStyle: 'none', padding: '0.5rem 0'}}>
                                <li><a className="categoria-link p-link px-3 py-2 block" href="#" data-categoria="Todos" aria-label="Todos">Todos</a></li>
                                <li><a className="categoria-link p-link px-3 py-2 block" href="#" data-categoria="Guitarras" aria-label="Guitarras">Guitarras</a></li>
                                <li><a className="categoria-link p-link px-3 py-2 block" href="#" data-categoria="Violões" aria-label="Violões">Violões</a></li>
                                <li><a className="categoria-link p-link px-3 py-2 block" href="#" data-categoria="Teclados" aria-label="Teclados">Teclados</a></li>
                                <li><a className="categoria-link p-link px-3 py-2 block" href="#" data-categoria="Percussão" aria-label="Percussão">Percussão</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div id="produtos-container" className="gap-3 mt-4">
                </div>
            </section>

            <section id="testimonials" className="px-3 lg:px-6 mt-5 gap-5">
                <div className="hidden lg:block">
                    <img src="/assets/images/home/fundo2.svg" alt="Pessoas curtindo a página" id="testimonials-background" aria-label="Pessoas curtindo a página" />
                </div>

                <div className="flex flex-column lg:flex-row align-items-center lg:align-items-start gap-5">
                    <div className="flex flex-column gap-3 lg:col-7">
                        <div id="testimonials-content">
                            <h2 className="section-title">Avaliações</h2>
                            <h3 className="section-subtitle">O que nossos clientes acham dos nossos produtos</h3>
                        </div>

                        <div id="feedbacks" className="flex flex-column gap-3">
                            <div className="card-feedback flex lg:flex-row flex-column align-items-center gap-3 surface-card p-3 border-round">
                                <img src="/assets/images/home/person1.jfif" alt="Cliente 1" className="feedback-image" />
                                <div className="feedback-content flex flex-column">
                                    <p className="flex lg:flex-row flex-column justify-content-between align-items-center"><strong className="text-center">Ricardo da Silva</strong>
                                        <span className="text-warning flex justify-content-center gap-1">
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                        </span>
                                    </p>
                                    <p className="text-center lg:text-left">Loja muito bem organizada, com ótimos preços e suporte atencioso. Recomendo para todos os músicos!</p>
                                </div>
                            </div>

                            <div className="card-feedback flex lg:flex-row flex-column align-items-center gap-3 surface-card p-3 border-round">
                                <img src="/assets/images/home/person2.jfif" alt="Cliente 2" className="feedback-image" />
                                <div className="feedback-content flex flex-column">
                                    <p className="flex lg:flex-row flex-column justify-content-between align-items-center"><strong className="text-center">Aline Silveira</strong>
                                        <span className="text-warning flex justify-content-center gap-1">
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                            <i className="fa-solid fa-star"></i>
                                        </span>
                                    </p>
                                    <p className="text-center lg:text-left">Excelente atendimento e variedade incrível de produtos musicais. Comprei minha guitarra e chegou antes do prazo!</p>
                                </div>
                            </div>
                        </div>

                        <Button label="Ver mais Avaliações" className="p-button-outlined mt-3" aria-label="Ver mais Avaliações" />
                    </div>
                </div>
            </section>

            <section id="about" className="px-3 lg:px-6 mt-5 flex flex-column lg:flex-row gap-3 align-items-center">
                <div className="lg:col-8 col-12">
                    <h2>Sobre a RiffHouse</h2>
                    <p>Na RiffHouse, acreditamos que um instrumento musical não é apenas uma ferramenta, mas uma extensão da alma de quem toca. Nascemos da vontade de unir arte, autenticidade e experiência sonora, criando um espaço onde músicos encontram mais do que produtos — encontram identidade.</p>
                    <p>Nossa loja é um tributo à expressão criativa. Cada guitarra, violão ou acessório carrega consigo história, estilo e personalidade, pensados nos mínimos detalhes para transformar cada nota tocada em algo memorável.</p>
                </div>
                <div className="lg:col-4 col-12">
                    <img className="w-full" src="/assets/images/home/fundo_about.png" alt="Imagem da Loja RiffHouse" />
                </div>
            </section>
        </div>
    );
};