import { CalcFreight } from "@/components/Freight/CalcFreight";
import { ProductInfo } from "../ProductInfo";
import { ProductActions } from "../ProductActions";
import type { IProduct } from "@/commons/types/types";

export const ContainerProductInformations: React.FC<{
    produto: IProduct;
    pricePerUnit: number;
    quantity: number;
    setQuantity: React.Dispatch<React.SetStateAction<number>>;
    cep: string;
    setCep: React.Dispatch<React.SetStateAction<string>>;
}> = ({ produto, pricePerUnit, quantity, setQuantity, cep, setCep }) => {
    return (
        <div className="col-12 lg:col-6 mt-0">
            <ProductInfo
                pricePerUnit={pricePerUnit}
                quantity={quantity}
                setQuantity={setQuantity}
                product={produto}
            />

            <CalcFreight
                cep={cep}
                setCep={setCep}
                produtos={[{ product: produto, quantity: quantity }]}
            />

            <ProductActions produto={produto} quantity={quantity} />
        </div>
    );
};
