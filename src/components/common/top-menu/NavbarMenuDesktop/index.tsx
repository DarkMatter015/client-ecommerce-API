import { scrollIntoView } from "@/utils/Utils";
import { Link } from "react-router-dom";

export const NavbarMenuDesktop = ({ menuItems }: any) => {
    return (
        <div className="navbar-menu-desktop">
            <ul className="menu-list">
                {menuItems.map((item: any, index: number) => (
                    <li key={index}>
                        <Link
                            to={`${item.path}#${item.hash}`}
                            className="menu-link"
                            onClick={(e) => {
                                if (location.pathname === item.path) {
                                    e.preventDefault();
                                    scrollIntoView(item.hash);
                                }
                            }}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};
