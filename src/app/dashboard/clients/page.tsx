"use client";

import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import useClient from "@/hooks/dashboard/useClients";
import Image from "next/image";
import { FiSearch, FiUser } from "react-icons/fi";

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
                                    <div
                                        key={user.id || index}
                                        className="bg-white shadow-sm border border-gray-100 rounded-lg hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex flex-col sm:flex-row items-center w-full p-4">
                                            {/* Avatar Section */}
                                            <div className="flex-shrink-0 mb-3 sm:mb-0 w-12 h-12 flex items-center justify-center">
                                                {user.avatar && user.avatar.startsWith("http") ? (
                                                    <Image
                                                        src={user.avatar}
                                                        alt={`${user.names} avatar`}
                                                        width={48}
                                                        height={48}
                                                        className="rounded-full w-12 h-12 object-cover"
                                                        onError={() => {/* This prevents console errors if image fails to load */ }}
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                                        <FiUser size={24} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* User Info Section */}
                                            <div className="flex-1 text-center sm:text-left sm:ml-4">
                                                <h3 className="font-medium text-gray-900 text-base">{user.names}</h3>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0 sm:ml-2">
                                                <button
                                                    onClick={() => router.push(`/dashboard/clients/${user.id}`)}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600 transition-colors"
                                                >
                                                    Perfil
                                                </button>
                                                <button
                                                    className="px-4 py-2 bg-green-500 text-white rounded-md text-xs font-medium hover:bg-green-600 transition-colors"
                                                    onClick={() => router.push(`/dashboard/clients/${user.id}/contacto`)}
                                                >
                                                    Contactar
                                                </button>
                                            </div>
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
                                    className={`flex items-center justify-center px-4 py-2 border rounded-md text-sm transition-colors ${currentPage === 1
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
                                    className={`flex items-center justify-center px-4 py-2 border rounded-md text-sm transition-colors ${currentPage === totalPages
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