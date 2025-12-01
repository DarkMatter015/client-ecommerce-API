import React, { useEffect, useMemo, useState } from "react";
import { ProductThumbnail } from "../ProductThumbnail";
import type { IProduct } from "@/commons/types/types";
import { Dialog } from "primereact/dialog";

import "./container-product-image.style.css";

export const ContainerProductImage: React.FC<{
    produto: IProduct;
}> = ({ produto }) => {
    const [zoomVisible, setZoomVisible] = useState(false);
    const [mainImage, setMainImage] = useState<string>(produto.urlImage);

    useEffect(() => {
        setMainImage(produto.urlImage);
    }, [produto.urlImage]);

    // thumbnails: ensure we always pass an array of image urls
    const thumbnails = useMemo(() => {
        const arr: string[] = [];
        if (produto.urlImage) arr.push(produto.urlImage);
        // if future data has an array field like 'miniaturas', include them
        const mini = (produto as any).miniaturas;
        if (Array.isArray(mini)) arr.push(...mini);
        return arr;
    }, [produto]);

    const handleThumbnailKey = (e: React.KeyboardEvent, src: string) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setMainImage(src);
        }
    };

    return (
        <div className="col-12 lg:col-6 flex flex-column align-items-center">
            <div
                className="product-image border"
                role="img"
                aria-label={`Imagem do produto ${produto.name}`}
                onClick={() => setZoomVisible(true)}
            >
                <img id="main-image" src={mainImage} alt={produto.name} />
            </div>

            <div
                className="thumbnails"
                role="list"
                aria-label="Miniaturas do produto"
            >
                {thumbnails.map((src, idx) => (
                    <ProductThumbnail
                        setMainImage={setMainImage}
                        handleThumbnailKey={handleThumbnailKey}
                        idx={idx}
                        isActive={src === mainImage}
                        key={idx}
                        src={src}
                        product={produto}
                    />
                ))}
            </div>

            <Dialog
                header={produto.name}
                visible={zoomVisible}
                style={{ width: "90vw", maxWidth: "800px" }}
                onHide={() => setZoomVisible(false)}
            >
                <div style={{ textAlign: "center" }}>
                    <img
                        src={mainImage}
                        alt={produto.name}
                        style={{ maxWidth: "100%", height: "auto" }}
                    />
                </div>
            </Dialog>
        </div>
    );
};
