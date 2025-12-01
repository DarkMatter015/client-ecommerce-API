import type { IProduct } from "@/commons/types/types";
import { AutoComplete } from "primereact/autocomplete";
import { useNavigate } from "react-router-dom";
import { DropDownItemTemplate } from "../DropdownItemTemplate";
import { SelectedItemTemplate } from "../SelectedtemTemplate";
import { PanelFooterTemplate } from "../PanelFooterTemplate";
import { OptionGroupTemplate } from "../OptionGroupTemplate";

interface NavbarSearchDesktopProps {
    selectedProduct: IProduct | null;
    setSelectedProduct: (product: IProduct | null) => void;
    filteredProducts: any[];
    search: (event: any) => void;
}

export const NavbarSearchDesktop: React.FC<NavbarSearchDesktopProps> = ({
    selectedProduct,
    setSelectedProduct,
    filteredProducts,
    search,
}) => {
    const navigate = useNavigate();

    return (
        <form className="navbar-search-desktop">
            <div className="search-container">
                <AutoComplete
                    field="name"
                    value={selectedProduct}
                    suggestions={filteredProducts as any}
                    completeMethod={search}
                    onChange={(e: any) => {
                        setSelectedProduct(e.value);
                        if (e.value && (e.value as IProduct).id) {
                            navigate(`/produto/${(e.value as IProduct).id}`);
                        }
                    }}
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
                    panelStyle={{ position: "fixed", zIndex: 2000 }}
                />
            </div>
        </form>
    );
};
