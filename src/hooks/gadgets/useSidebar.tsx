"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type optionTypes =
    "solicitudes" |
    "prestamos" |
    "clientes" |
    "soporte" |
    "comprobantes"

export interface SidebarLayoutProps {
    children: React.ReactNode;
}

export interface SidebarItemProps {
    icon: React.ReactNode;
    text: string;
    isActive?: boolean;
    onClick?: () => void;
}

function useSideBar() {
    const [activePage, setActivePage] = useState<optionTypes>('solicitudes');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const IconSidebarItem: React.FC<{ icon: React.ReactNode, isActive?: boolean, onClick?: () => void }> = ({
        icon,
        isActive = false,
        onClick
    }) => {
        return (
            <div
                className={`flex justify-center p-3 mb-1 rounded-md cursor-pointer ${isActive ? 'bg-gray-200' : 'hover:bg-gray-100'
                    }`}
                onClick={onClick}
            >
                <div className="text-green-600">{icon}</div>
            </div>
        );
    };

    const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, isActive = false, onClick }) => {
        return (
            <div
                className={`flex items-center px-4 py-3 mb-1 rounded-md cursor-pointer ${isActive ? 'bg-gray-200' : 'hover:bg-gray-100'
                    }`}
                onClick={onClick}
            >
                <div className="mr-3 text-green-600">{icon}</div>
                <span className={`${isActive ? 'font-medium' : ''} text-gray-800`}>{text}</span>
            </div>
        );
    };

    // Check if viewport is mobile
    const isMobile = () => {
        return window.innerWidth < 1024; // lg breakpoint in Tailwind
    };

    // Sincronizar estado con la ruta actual
    useEffect(() => {
        if (pathname === "/dashboard") {
            setActivePage('solicitudes');
        } else if (pathname === "/dashboard/active") {
            setActivePage('prestamos');
        } else if (pathname === "/dashboard/clients") {
            setActivePage('clientes');
        } else if (pathname === "/dashboard/soporte") {
            setActivePage('soporte');
        } else if (pathname === "/dashboard/comprobantes") {
            setActivePage('comprobantes')
        } else if (pathname === "/dashboard/soporte/sistema") {
            setActivePage('soporte');
        } else if (pathname === "/dashboard/soporte/error") {
            setActivePage('soporte');
        }

        // Set initial sidebar state based on screen size
        setSidebarOpen(!isMobile());
    }, [pathname]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const selectOption = (option: optionTypes) => {
        setActivePage(option);

        // Close sidebar on mobile when an option is selected
        if (isMobile()) {
            setSidebarOpen(false);
        }

        // Navigate to the selected page
        if (option === "prestamos") {
            router.push("/dashboard/active");
        } else if (option === "clientes") {
            router.push("/dashboard/clients");
        } else if (option === "solicitudes") {
            router.push("/dashboard");
        } else if (option === "soporte") {
            router.push("/dashboard/soporte");
        } else if (option === "comprobantes") {
            router.push("/dashboard/comprobantes");
        }
    }

    // Handle icon sidebar click without expanding
    const handleIconSidebarClick = (option: optionTypes) => {
        selectOption(option);
        // Important: Don't toggle sidebar open on desktop when using the icon sidebar
    };

    return {
        activePage,
        setActivePage,
        sidebarOpen,
        setSidebarOpen,
        router,
        pathname,
        IconSidebarItem,
        SidebarItem,
        toggleSidebar,
        selectOption,
        handleIconSidebarClick
    }
}

export default useSideBar;