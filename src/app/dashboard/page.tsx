"use client";

import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import Image from "next/image";
import { FiUser, FiCreditCard, FiCalendar, FiCheckCircle } from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import noLoans from "@/assets/ilustrations/no-loans.svg";
import usePending from "@/hooks/dashboard/usePending";

function DashboardPage() {
    const {
        loading,
        error,
        fetchPendingLoans,
        pendingLoans,
        formatCurrency,
        formatBankName,
        router,
        totalLoans,
        totalPages,
        handlePageChange,
        currentPage,
        UpdateIndicator
    } = usePending();
  
    return (
        <SidebarLayout>
            <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen overflow-scroll">
                <div className="flex flex-row justify-between grow">
                    <header className="mb-8">
                        <h1 className="text-xl sm:text-2xl font-medium text-gray-800">Solicitudes entrantes</h1>
                        <p className="text-gray-500 text-sm mt-1">Gestiona las solicitudes que requieren revisión</p>
                    </header>
                    <UpdateIndicator />
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16 bg-white rounded-lg shadow-sm">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-5 bg-white rounded-lg shadow-sm">
                        <div className="text-red-500 text-2xl">⚠️</div>
                        <h2 className="text-lg font-medium text-gray-700">Error al cargar las solicitudes</h2>
                        <p className="text-gray-500 text-center text-sm max-w-sm">{error}</p>
                        <button
                            onClick={fetchPendingLoans}
                            className="px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md text-sm font-medium transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : pendingLoans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-5 bg-white rounded-lg shadow-sm">
                        <Image
                            src={noLoans}
                            alt="No hay solicitudes"
                            width={140}
                            height={140}
                            className="opacity-40"
                        />
                        <h2 className="text-lg font-medium text-gray-700">Sin solicitudes pendientes</h2>
                        <p className="text-gray-500 text-center text-sm max-w-sm">
                            Las nuevas solicitudes de préstamo aparecerán aquí automáticamente.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 mb-6">
                            {pendingLoans.map((item) => {
                                // Get the first document or use a default
                                const document = item.user.Document && item.user.Document.length > 0
                                    ? item.user.Document[0]
                                    : { typeDocument: "N/A", number: "N/A" };

                                return (
                                    <div
                                        key={item.id}
                                        className="p-4 sm:p-5 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                                                {item.user.avatar && item.user.avatar !== "No definido" ? (
                                                    <Image
                                                        src={item.user.avatar}
                                                        alt={item.user.names}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-700">
                                                        <FiUser size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-gray-800 font-medium text-base flex items-center gap-2">
                                                    <FiUser className="text-gray-400" size={16} />
                                                    {`${item.user.names} ${item.user.firstLastName}`}
                                                </h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                    <FiCreditCard className="text-gray-400" size={14} />
                                                    {document.typeDocument} - {document.number}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between w-full sm:w-auto">
                                            <div className="flex flex-row-reverse gap-2">
                                                <p className="font-medium text-green-600 text-2xl">
                                                    {formatCurrency(item.cantity)}
                                                </p>
                                                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1 bg-gray-100 px-2 rounded-md">
                                                    <div className="grid place-content-center">
                                                        <HiOutlineOfficeBuilding className="text-gray-400 drop-shadow-md" size={14} />
                                                    </div>
                                                    <p className="text-xs grid place-content-center text-gray-400">
                                                        {formatBankName(item.entity)}
                                                    </p>
                                                </p>
                                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1 bg-gray-100 px-2 rounded-md">
                                                    <div className="grid place-content-center">
                                                        <FiCalendar size={12} className="drop-shadow-md text-gray-400" />
                                                    </div>
                                                    <p className="text-xs grid place-content-center text-gray-400">
                                                        {new Date(item.created_at).toLocaleDateString()}
                                                    </p>
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => router.push(`/dashboard/loan/${item.id}`)}
                                                className="px-5 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md text-sm font-medium transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                                            >
                                                <FiCheckCircle className="drop-shadow-md" size={16} />
                                                Evaluar
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow-sm">
                                <div className="text-sm text-gray-500">
                                    Mostrando {pendingLoans.length} de {totalLoans} solicitudes
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded-md text-sm ${currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        Anterior
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-1 rounded-md text-sm ${currentPage === page
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded-md text-sm ${currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </SidebarLayout>
    );
}

export default DashboardPage;