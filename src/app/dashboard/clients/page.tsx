"use client";

import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import useClient from "@/hooks/dashboard/useClients";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";

function UserPage() {
    const {
        users,
        searchQuery,
        setSearchQuery,
        router,
        currentPage,
        totalPages,
        prevPage,
        nextPage,
        loading,
        error
    } = useClient({ params: null });

    return (
        <SidebarLayout>
            <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen overflow-scroll">
                <header className="mb-8">
                    <h1 className="text-xl sm:text-2xl font-medium text-gray-800">Gestion de usuarios</h1>
                    <p className="text-gray-500 text-sm mt-1">Investiga datos personales, historial de prestamos, edita su informacion y toma control sobre sus cuentas</p>
                </header>

                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-green-400 focus:border-green-400"
                        placeholder="Busca por Numero de documento / Nombre completo / ID cliente"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-600">Cargando usuarios...</p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : (
                    <>
                        <div className="w-full space-y-4">
                            {users && users.length > 0 ? (
                                users.map((user, index) => (
                                    <div key={user.id || index} className="flex flex-col sm:flex-row w-full border border-gray-100 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center px-4 py-3 rounded-lg w-full">
                                            <Image
                                                src={user.avatar && user.avatar.startsWith("http") ? user.avatar : "/avatar-placeholder.png"}
                                                alt="Avatar"
                                                width={50}
                                                height={50}
                                                className="mr-4 rounded-lg"
                                            />

                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-gray-900">{user.names}</h3>
                                                <p className="text-sm text-gray-600">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap sm:flex-nowrap p-4 gap-3 w-full sm:w-auto">
                                            <button
                                                onClick={() => router.push(`/dashboard/clients/${user.id}`)}
                                                className="min-w-[140px] w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg text-xs shadow hover:bg-blue-600 transition"
                                            >
                                                Visitar Perfil
                                            </button>
                                            <button className="min-w-[140px] w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg text-xs shadow hover:bg-green-600 transition">
                                                Enviar Correo
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex justify-center items-center h-64">
                                    <p className="text-gray-600">No hay usuarios disponibles</p>
                                </div>
                            )}
                        </div>

                        {users && users.length > 0 && (
                            <div className="flex justify-center items-center mt-8 space-x-2">
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                    className={`flex items-center justify-center px-4 py-2 border rounded-md text-sm transition-colors ${
                                        currentPage === 1 
                                        ? "border-gray-200 text-gray-300 cursor-not-allowed" 
                                        : "border-gray-300 text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    Anterior
                                </button>
                                
                                <div className="px-4 py-2 text-sm text-gray-600">
                                    Página {currentPage} de {totalPages}
                                </div>
                                
                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center justify-center px-4 py-2 border rounded-md text-sm transition-colors ${
                                        currentPage === totalPages 
                                        ? "border-gray-200 text-gray-300 cursor-not-allowed" 
                                        : "border-gray-300 text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    Siguiente
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </SidebarLayout>
    );
}

export default UserPage;