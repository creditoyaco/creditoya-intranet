"use client"

import { useAuth } from '@/context/useAuth';
import useSideBar, { SidebarLayoutProps } from '@/hooks/gadgets/useSidebar';
import React from 'react';
import {
    FiFileText,
    FiUsers,
    FiX,
    FiLogOut,
    FiMenu,
    FiCopy,
    FiChevronLeft
} from 'react-icons/fi';
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia';
import { TbHistory } from 'react-icons/tb';

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
    const {
        activePage,
        sidebarOpen,
        toggleSidebar,
        selectOption,
        handleIconSidebarClick,
        IconSidebarItem,
        SidebarItem
    } = useSideBar();

    const { user, logout } = useAuth();

    return (
        <div className="flex h-screen bg-white relative">
            {/* Mobile toggle button - outside sidebar */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-40 p-2 rounded-md bg-white shadow-md text-gray-700 lg:hidden"
            >
                {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

            {/* Full width sidebar */}
            <div
                className={`${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
                transform transition-all duration-300 ease-in-out fixed z-20 bg-gray-100 border-r border-gray-200 flex flex-col h-full`}
            >
                {/* Toggle button in header - desktop only */}
                <div className="p-4 flex justify-between items-center border-b border-gray-200">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-md text-gray-700 hover:bg-gray-200 hidden lg:block"
                    >
                        <FiChevronLeft size={20} />
                    </button>
                    <div className="w-8 invisible lg:visible"></div> {/* Spacer for alignment */}
                </div>

                {/* Navigation items container with flex-grow */}
                <div className="flex flex-col h-full">
                    {/* Navigation items - with padding-top to avoid overlap with close button on mobile */}
                    <div className="px-2 py-4 pt-8 lg:pt-4 overflow-y-auto flex-grow">
                        <SidebarItem
                            icon={<FiFileText size={20} />}
                            text="Solicitudes"
                            isActive={activePage === 'solicitudes'}
                            onClick={() => selectOption('solicitudes')}
                        />
                        <SidebarItem
                            icon={<FiCopy size={20} />}
                            text="Prestamos"
                            isActive={activePage === 'prestamos'}
                            onClick={() => selectOption('prestamos')}
                        />
                        <SidebarItem
                            icon={<FiUsers size={20} />}
                            text="Clientes"
                            isActive={activePage === 'clientes'}
                            onClick={() => selectOption('clientes')}
                        />
                        <SidebarItem
                            icon={<LiaFileInvoiceDollarSolid size={20} />}
                            text="Comprobantes"
                            isActive={activePage === 'comprobantes'}
                            onClick={() => selectOption('comprobantes')}
                        />
                        <SidebarItem
                            icon={<TbHistory size={20} />}
                            text="Soporte"
                            isActive={activePage === 'soporte'}
                            onClick={() => selectOption('soporte')}
                        />
                    </div>

                    {/* User profile - fixed at bottom */}
                    <div className="p-4 border-t border-gray-200 mt-auto">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white font-bold mr-3">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-800">{user?.name}</div>
                                <div className="text-xs text-gray-600">{user?.rol}</div>
                            </div>
                        </div>

                        {/* Logout button */}
                        <div onClick={logout} className="mt-4 flex items-center text-gray-700 hover:text-red-600 cursor-pointer">
                            <span>Cerrar Session</span>
                            <FiLogOut className="ml-2" size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Icon-only sidebar for desktop when collapsed */}
            <div
                className={`hidden lg:flex ${!sidebarOpen ? 'translate-x-0 opacity-100' : 'opacity-0 -translate-x-full'}
                transform transition-all duration-300 ease-in-out fixed z-20 flex-col h-full bg-gray-100 border-r border-gray-200 w-16`}
            >
                {/* Toggle button */}
                <div className="p-4 flex justify-center items-center border-b border-gray-200">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-md text-gray-700 hover:bg-gray-200"
                    >
                        <FiMenu size={20} />
                    </button>
                </div>

                {/* Flex column container for icon sidebar */}
                <div className="flex flex-col h-full">
                    {/* Icon-only navigation */}
                    <div className="flex-grow px-2 py-4 overflow-y-auto">
                        <IconSidebarItem
                            icon={<FiFileText size={20} />}
                            isActive={activePage === 'solicitudes'}
                            onClick={() => handleIconSidebarClick('solicitudes')}
                        />
                        <IconSidebarItem
                            icon={<FiCopy size={20} />}
                            isActive={activePage === 'prestamos'}
                            onClick={() => handleIconSidebarClick('prestamos')}
                        />
                        <IconSidebarItem
                            icon={<FiUsers size={20} />}
                            isActive={activePage === 'clientes'}
                            onClick={() => handleIconSidebarClick('clientes')}
                        />
                        <IconSidebarItem
                            icon={<LiaFileInvoiceDollarSolid size={20} />}
                            isActive={activePage === 'comprobantes'}
                            onClick={() => selectOption('comprobantes')}
                        />
                        <IconSidebarItem
                            icon={<TbHistory size={20} />}
                            isActive={activePage === 'soporte'}
                            onClick={() => selectOption('soporte')}
                        />
                    </div>

                    {/* User profile icon only - fixed at bottom */}
                    <div className="mt-auto p-4 border-t border-gray-200 flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay to close sidebar on mobile - with blur */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-black/30 z-10 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Main content area */}
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0 lg:ml-16'}`}>
                {children}
            </div>
        </div>
    );
};

export default SidebarLayout;