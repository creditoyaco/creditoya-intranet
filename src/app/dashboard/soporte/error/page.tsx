"use client";

import { useState } from "react";
import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import { IoBugOutline } from "react-icons/io5";

function ErrorsAppsPage() {
    const [activeTab, setActiveTab] = useState<"activos" | "historial">("activos");

    return (
        <SidebarLayout>
            <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen overflow-scroll">
                <header className="mb-8">
                    <h1 className="text-xl sm:text-2xl font-medium text-gray-800">Gestión de errores</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Informa cualquier fallo detectado en las aplicaciones para poder resolverlo rápidamente.
                    </p>
                </header>

                <div className="flex justify-between items-center mb-6">
                    <div
                        className="flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 transition-colors px-4 py-2 rounded-md cursor-pointer"
                        onClick={() => alert("BlockScrum en mantenimiento, pronto estaremos de regreso...")}
                    >
                        <IoBugOutline className="text-indigo-600" />
                        <span className="text-sm text-indigo-700 font-medium">Nuevo reporte</span>
                    </div>

                    <div className="flex flex-row gap-2 bg-white border rounded-md overflow-hidden">
                        <button
                            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "activos"
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                            onClick={() => setActiveTab("activos")}
                        >
                            Activos
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "historial"
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                            onClick={() => setActiveTab("historial")}
                        >
                            Historial
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    {activeTab === "activos" ? (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Reportes activos</h2>
                            <p className="text-sm text-gray-500">Aquí se muestran los reportes de errores que aún no han sido resueltos.</p>
                            {/* Puedes mapear aquí los reportes activos */}
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Historial de reportes</h2>
                            <p className="text-sm text-gray-500">Lista de errores ya solucionados o cerrados.</p>
                            {/* Puedes mapear aquí el historial de reportes */}
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}

export default ErrorsAppsPage;
