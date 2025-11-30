export const PanelFooterTemplate = (filteredProducts: any[]) => {
        const total = filteredProducts.reduce(
            (sum, g) => sum + g.items.length,
            0
        );
        if (!total) return null;
        return <div className="py-2 px-3">{total} resultados encontrados</div>;
    };