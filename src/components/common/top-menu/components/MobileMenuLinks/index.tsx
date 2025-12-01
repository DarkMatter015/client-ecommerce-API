import React from "react";
import { Link } from "react-router-dom";

interface MenuItem {
    label: string;
    path: string;
    hash: string;
    icon: string;
}

interface MobileMenuLinksProps {
    menuItems: MenuItem[];
    onItemClick: (item: MenuItem) => void;
}

export const MobileMenuLinks: React.FC<MobileMenuLinksProps> = ({
    menuItems,
    onItemClick,
}) => {
    return (
        <div className="mobile-menu-section">
            <h3 className="mobile-section-title">Menu</h3>
            <nav className="mobile-nav">
                {menuItems.map((item, index) => (
                    <Link
                        key={index}
                        to={`${item.path}#${item.hash}`}
                        className="mobile-menu-item"
                        onClick={() => onItemClick(item)}
                    >
                        <i className={item.icon}></i>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
};
