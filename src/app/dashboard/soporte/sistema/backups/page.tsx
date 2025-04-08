import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import useBackup from "@/hooks/dashboard/useBackup";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";

function BackupsComponent() {
    const {
        
    } = useBackup();
   
    return (
        <SidebarLayout>
            <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen overflow-scroll">
                <header className="mb-8">
                    <h1 className="text-xl sm:text-2xl font-medium text-gray-800">Puntos de recuperacion</h1>
                    <p className="text-gray-500 text-sm mt-1">Gestiona los puntos de recuperacion de la base de datos en caso de perdidas futuras</p>
                </header>

                <div className="flex flex-row justify-between bg-gray-100 p-4">
                    <div>
                        <h3 className="text-1xl font-medium text-gray-800">Ultimo punto de respaldo</h3>
                        <p className="text-xs text-gray-500">Abril 08 del 2025</p>
                    </div>
                    <div className="grid place-content-center">
                        <div className="px-3 py-1 flex flex-row gap-1 hover:text-black text-gray-500 cursor-pointer border border-transparent hover:border-gray-300 rounded-md">
                            <div className="grid place-content-center">
                                <MdOutlineSettingsBackupRestore className="drop-shadow-md" />
                            </div>
                            <p className="text-sm pb-0.5">Crear respaldo</p>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    )
}

export default BackupsComponent;