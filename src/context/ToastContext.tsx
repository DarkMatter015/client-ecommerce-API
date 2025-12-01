import { createContext, useRef, type ReactNode } from "react";

import { Toast } from "primereact/toast";

interface ToastContextType {
    showToast: (
        severity: string | undefined,
        summary: string,
        detail: string,
        life?: number
    ) => void;
}

interface ToastProviderProps {
    children: ReactNode;
}

const ToastContext = createContext({} as ToastContextType);

export function ToastProvider({ children }: ToastProviderProps) {
    const toast = useRef<Toast | null>(null);

    const showToast = (
        severity: string | undefined,
        summary: string,
        detail: string,
        life?: number
    ) => {
        toast.current?.show({
            severity: severity as
                | "success"
                | "info"
                | "warn"
                | "error"
                | "secondary"
                | "contrast"
                | undefined,
            summary: summary,
            detail: detail,
            life: life || 3000,
        });
    };

    return (
        <ToastContext
            value={{
                showToast,
            }}
        >
            {children}
            <Toast ref={toast} />
        </ToastContext>
    );
}

export { ToastContext };
