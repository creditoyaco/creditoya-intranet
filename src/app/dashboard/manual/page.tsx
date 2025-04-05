import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";

function DocumentationPage() {
    return (
        <>
            <SidebarLayout>
                <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen overflow-scroll">
                    <header className="mb-8">
                        <h1 className="text-xl sm:text-2xl font-medium text-gray-800">Documentación Técnica</h1>
                        <p className="text-gray-500 text-sm mt-1">Guía de arquitectura, base de datos, integraciones, tecnologías y flujos de trabajo.</p>
                    </header>
                </div>
            </SidebarLayout>
        </>
    )
}

export default DocumentationPage;