import type { IProduct } from "@/commons/types/product"
import { Link } from "react-router-dom"
import "./card-product.style.css"

export const CardProduct: React.FC<{ product: IProduct }> = ({ product }) => {
    return (
        <article key={product.id} className="card-product">
            <Link
                to={`/produto/${product.id}`}
                className="card-image text-center"
                title={product.name}
                data-id={product.id}
            >
                <img src={product.urlImage} className="img-fluid" alt={product.name} />
            </Link>
            <div className="card-body text-center">
                <div className="text-warning">
                    <i className="pi pi-star-fill rating"></i>
                    <i className="pi pi-star-fill rating"></i>
                    <i className="pi pi-star-fill rating"></i>
                    <i className="pi pi-star-fill rating"></i>
                    <i className="pi pi-star-fill rating"></i>
                    <span className="text-sm"> (+500)</span>
                </div>

                <h3 className="card-title">{product.name}</h3>
                <h4 className="mt-1">
                    <span className="text-success">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                    <small>à vista</small>
                </h4>
                <p className="card-text">
                    <small>ou em até<br/>12x sem juros</small>
                </p>
                <Link
                    to={`/produto/${product.id}`}
                    className="btn-gray w-100"
                    data-id={product.id}
                >
                    Ver Produto
                </Link>
                <button
                    className="btn-add-cart w-100"
                    data-id={product.id}
                    onClick={() => { /* TODO: adicionar ao carrinho */ }}
                >
                    <i className="fa-solid fa-cart-plus"></i> Adicionar ao carrinho
                </button>
            </div>
        </article>
    )
}