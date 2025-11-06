import type { IProduct } from "@/commons/types/types"
import type React from "react"

export const ProductDescription: React.FC<{ 
    product: IProduct 
}> =({ 
    product 
}) => {
    return (
      <div className="col-12">
        <h4><strong>Descrição</strong></h4>
        <p>{product.description}</p>
      </div>
    )
  }