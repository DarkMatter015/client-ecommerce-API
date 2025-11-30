import type { ICategory } from "@/commons/types/types";
import { getAllCategoriesFiltered } from "@/services/category-service";
import { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Paginator, type PaginatorPageChangeEvent } from "primereact/paginator";
import "./category-dropdown.style.css";

interface CategoryDropdownProps {
    value: ICategory | null;
    onChange: (category: ICategory | null) => void;
    placeholder?: string;
    disabled?: boolean;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
    value,
    onChange,
    placeholder = "Selecione uma categoria",
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const ITEMS_PER_PAGE = 10;

    const fetchCategories = async (page: number = 0, search: string = "") => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllCategoriesFiltered(
                page,
                ITEMS_PER_PAGE,
                search
            );
            if (response) {
                setCategories(response.content);
                setTotalRecords(response.totalElements);
                setCurrentPage(page);
            } else {
                setError("Erro ao buscar categorias");
            }
        } catch {
            setError("Erro ao buscar categorias");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(0, "");
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        fetchCategories(0, term);
    };

    const handlePageChange = (event: PaginatorPageChangeEvent) => {
        fetchCategories(event.page, searchTerm);
    };

    const handleSelectCategory = (category: ICategory) => {
        onChange(category);
        setIsOpen(false);
        setSearchTerm("");
        setCurrentPage(0);
    };

    const handleClear = () => {
        onChange(null);
        setSearchTerm("");
        setCurrentPage(0);
        fetchCategories(0, "");
    };

    return (
        <div ref={dropdownRef} className="category-dropdown">
            <div
                className="category-dropdown-trigger"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                role="button"
                tabIndex={0}
            >
                <span className={value ? "selected" : "placeholder"}>
                    {value ? value.name : placeholder}
                </span>
                <div className="dropdown-icons">
                    {value && (
                        <button
                            className="clear-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClear();
                            }}
                            aria-label="Limpar seleção"
                        >
                            ✕
                        </button>
                    )}
                    <i
                        className={`pi ${
                            isOpen ? "pi-chevron-up" : "pi-chevron-down"
                        }`}
                    ></i>
                </div>
            </div>

            {isOpen && !disabled && (
                <div className="category-dropdown-panel">
                    <div className="category-dropdown-search">
                        <InputText
                            placeholder="Pesquisar categoria..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {loading ? (
                        <div className="category-dropdown-loading">
                            <i className="pi pi-spin pi-spinner"></i>{" "}
                            Carregando...
                        </div>
                    ) : error ? (
                        <div className="category-dropdown-error">{error}</div>
                    ) : categories.length === 0 ? (
                        <div className="category-dropdown-empty">
                            Nenhuma categoria encontrada
                        </div>
                    ) : (
                        <>
                            <div className="category-dropdown-list">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className={`category-dropdown-item ${
                                            value?.id === category.id
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleSelectCategory(category)
                                        }
                                        role="option"
                                        aria-selected={
                                            value?.id === category.id
                                        }
                                    >
                                        {category.name}
                                    </div>
                                ))}
                            </div>

                            {totalRecords > ITEMS_PER_PAGE && (
                                <div className="category-dropdown-pagination">
                                    <Paginator
                                        first={currentPage * ITEMS_PER_PAGE}
                                        rows={ITEMS_PER_PAGE}
                                        totalRecords={totalRecords}
                                        onPageChange={handlePageChange}
                                        template="PrevPageLink CurrentPageReport NextPageLink"
                                        currentPageReportTemplate="{currentPage} de {totalPages}"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
