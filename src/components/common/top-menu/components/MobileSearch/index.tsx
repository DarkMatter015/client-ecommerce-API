import React from "react";
import { AutoComplete } from "primereact/autocomplete";
import type { IProduct } from "@/commons/types/types";
import { DropDownItemTemplate } from "../../DropdownItemTemplate";
import { SelectedItemTemplate } from "../../SelectedtemTemplate";
import { PanelFooterTemplate } from "../../PanelFooterTemplate";
import { OptionGroupTemplate } from "../../OptionGroupTemplate";

interface ProductGroup {
    label: string;
    items: IProduct[];
}

interface MobileSearchProps {
    filteredProducts: ProductGroup[];
    selectedProduct: IProduct | null;
    onProductSelect: (product: IProduct | null) => void;
    onSearch: (event: any) => void;
}

export const MobileSearch: React.FC<MobileSearchProps> = ({
    filteredProducts,
    selectedProduct,
    onProductSelect,
    onSearch,
}) => {
    return (
        <div className="mobile-search">
            <AutoComplete
                field="name"
                value={selectedProduct}
                suggestions={filteredProducts as any}
                completeMethod={onSearch}
                onChange={(e: any) => onProductSelect(e.value)}
                itemTemplate={DropDownItemTemplate}
                selectedItemTemplate={SelectedItemTemplate}
                panelFooterTemplate={() => PanelFooterTemplate(filteredProducts)}
                optionGroupLabel="label"
                optionGroupChildren="items"
                optionGroupTemplate={OptionGroupTemplate as any}
                placeholder="Buscar produtos..."
                showEmptyMessage={true}
                emptyMessage="Nenhum produto encontrado"
                loadingIcon="pi pi-spin pi-spinner"
                className="w-full"
            />
        </div>
    );
};
