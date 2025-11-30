import React from "react";

interface UserMenuItem {
    label: string;
    icon: string;
    command: () => void;
}

interface MobileUserSectionProps {
    authenticated: boolean;
    authenticatedUser: any;
    userMenuItems: UserMenuItem[];
    onActionClick: () => void;
}

export const MobileUserSection: React.FC<MobileUserSectionProps> = ({
    authenticated,
    authenticatedUser,
    userMenuItems,
    onActionClick,
}) => {
    return (
        <div className="mobile-menu-section">
            <h3 className="mobile-section-title">Conta</h3>
            {authenticated ? (
                <>
                    <div className="mobile-user-info">
                        <i className="pi pi-user"></i>
                        <span>{authenticatedUser?.displayName}</span>
                    </div>
                    <nav className="mobile-nav">
                        {userMenuItems.map((item, index) => (
                            <button
                                key={index}
                                className="mobile-menu-item"
                                onClick={() => {
                                    item.command?.();
                                    onActionClick();
                                }}
                            >
                                <i className={item.icon}></i>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </>
            ) : (
                <div className="mobile-auth-prompt">
                    <p>Faça login ou cadastre-se para acessar sua conta</p>
                    <nav className="mobile-nav">
                        {userMenuItems.map((item, index) => (
                            <button
                                key={index}
                                className="mobile-menu-item"
                                onClick={() => {
                                    item.command?.();
                                    onActionClick();
                                }}
                            >
                                <i className={item.icon}></i>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            )}
        </div>
    );
};
