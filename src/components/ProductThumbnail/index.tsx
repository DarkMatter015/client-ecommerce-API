import type { IProduct } from "@/commons/types/types";

export const ProductThumbnail: React.FC<{
    product: IProduct,
    isActive: boolean,
    src: string,
    idx: number,
    setMainImage: (src: string) => void,
    handleThumbnailKey: (e: React.KeyboardEvent, src: string) => void
}> = ({
    product,
    isActive,
    src,
    idx,
    setMainImage,
    handleThumbnailKey
}) => {
        return (
            <div
                key={idx}
                role="listitem"
                className={`banner thumbnail-image ${isActive ? 'active' : ''}`}
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`Selecionar urlImage ${idx + 1}`}
                onClick={() => setMainImage(src)}
                onKeyDown={(e) => handleThumbnailKey(e, src)}
            >
                <img src={src} alt={`${product.name} miniatura ${idx + 1}`} title={product.name} />
            </div>
        );
    }