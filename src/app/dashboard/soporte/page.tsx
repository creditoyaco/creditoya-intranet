import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";

function SupportPage() {
    return (
        <>
            <SidebarLayout>
                <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen overflow-scroll">
                    <header className="mb-8">
                        <h1 className="text-xl sm:text-2xl font-medium text-gray-800">Soporte Tecnico</h1>
                        <p className="text-gray-500 text-sm mt-1">Registro y seguimiento de errores, respuesta a reportes e implementación de futuras actualizaciones.</p>
                    </header>
                </div>
            </SidebarLayout>
        </>
    )
}

export default SupportPage;