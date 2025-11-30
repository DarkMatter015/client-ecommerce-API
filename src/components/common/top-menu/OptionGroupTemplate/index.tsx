export const OptionGroupTemplate = (option: any) => {
        return (
            <div style={{ fontWeight: 600, padding: "0.25rem 0.5rem" }}>
                <i className="pi pi-tag" style={{ marginRight: "0.5rem" }}></i>
                {option.label}
            </div>
        );
    };