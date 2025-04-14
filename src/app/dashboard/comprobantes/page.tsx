"use client";

import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import useProof from "@/hooks/dashboard/useProof";
import { ScalarClient } from "@/types/client";
import { ScalarLoanApplication } from "@/types/loan";
import { FaEnvelope, FaFileAlt, FaPhone, FaUserAlt } from "react-icons/fa";
import { IoReload } from "react-icons/io5";

// Define the BatchGenerationDetail type
type BatchGenerationDetail = {
    name: string;
    status: 'success' | 'error';
    error?: string;
};

function ComprobantesPage() {
    const {
        loading,
        error,
        formatDate,
        getFullName,
        pendingDocumentsLoans,
        batchGenerationStatus,
        downloadDocumentById,
        eligibleDocuments,
        paginatedDocuments,
        selectedDocuments,
        expandedResults,
        toggleDocumentSelection,
        handleDownloadSelected,
        handlePageChange,
        currentPage,
        itemsPerPage,
        handleRefresh,
        handleGenerateAll,
        setExpandedResults,
        isDownloaded,
        handleToggleDownload
    } = useProof();

    return (
        <SidebarLayout>
            <div className="pt-20 p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen overflow-scroll">
                <header className="mb-8">
                    <h1 className="text-xl sm:text-2xl font-medium text-gray-800">
                        Documentos Pendientes
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Genera automáticamente los documentos para solicitudes de préstamo pendientes
                    </p>
                </header>

                {/* Sección para Descargar ZIP */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-row justify-between mb-5">
                        <h2 className="font-medium text-gray-700 text-lg mb-4">
                            Documentos Generados Disponibles para Descargar
                        </h2>

                        <p onClick={handleToggleDownload} className="grid place-content-center text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-md text-gray-600">Descargar todos</p>
                    </div>

                    {isDownloaded == false && eligibleDocuments.length === 0 ? (
                        <p className="text-gray-500">No hay documentos generados disponibles.</p>
                    ) : (
                        <>
                            <div className="space-y-2">
                                {paginatedDocuments.map((docWithLoan) => (
                                    <div
                                        key={docWithLoan.document.id}
                                        className="flex items-center justify-between bg-gray-50 p-3 rounded"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {getFullName(docWithLoan.loanApplication.user)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Préstamo ID: {docWithLoan.loanApplication.id}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedDocuments.includes(docWithLoan.document.id)}
                                                onChange={() =>
                                                    toggleDocumentSelection(docWithLoan.document.id)
                                                }
                                                disabled={docWithLoan.downloadCount !== 0} // Deshabilitar si downloadCount > 0
                                                className="form-checkbox h-4 w-4 text-blue-600"
                                            />
                                            <button
                                                onClick={() => downloadDocumentById(docWithLoan.document.id)}
                                                disabled={docWithLoan.downloadCount !== 0} // Deshabilitar si downloadCount > 0
                                                className={`px-3 py-1 text-sm rounded ${docWithLoan.downloadCount === 0
                                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    }`}
                                            >
                                                Descargar ZIP
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Botón para descargar seleccionados */}
                            {selectedDocuments.length > 0 && (
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={handleDownloadSelected}
                                        className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                    >
                                        Descargar Seleccionados ({selectedDocuments.length})
                                    </button>
                                </div>
                            )}

                            {/* Paginación */}
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-l disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    Anterior
                                </button>
                                <span className="px-4 py-2 bg-gray-100 text-gray-700">
                                    Página {currentPage}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage * itemsPerPage >= eligibleDocuments.length}
                                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-r disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </>
                    )}

                    { isDownloaded == true && (
                        <div>hola</div>
                    ) }
                </div>

                {/* Stats and Action Panel */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="font-medium text-gray-700 text-lg">
                                Solicitudes Pendientes de Documentos
                            </h2>
                            <div className="mt-2 flex items-center">
                                <div className="bg-blue-100 text-blue-800 rounded-full h-10 w-10 flex items-center justify-center">
                                    <FaFileAlt className="text-lg" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-2xl font-medium">
                                        {pendingDocumentsLoans?.count || 0}
                                    </p>
                                    <p className="text-sm text-gray-500">solicitudes</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleRefresh}
                                className="flex items-center px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <IoReload className="mr-2" />
                                Actualizar
                            </button>
                            <button
                                onClick={handleGenerateAll}
                                disabled={batchGenerationStatus.inProgress || pendingDocumentsLoans?.count === 0}
                                className={`px-4 py-2 rounded text-white text-sm ${batchGenerationStatus.inProgress || pendingDocumentsLoans?.count === 0
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {batchGenerationStatus.inProgress ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generando...
                                    </span>
                                ) : (
                                    "Generar todos los documentos"
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Batch Generation Results */}
                {batchGenerationStatus.results && (
                    <div className="bg-white rounded-lg shadow p-4 mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium text-gray-800">Resultados de la generación</h3>
                            <button
                                onClick={() => setExpandedResults(!expandedResults)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                {expandedResults ? "Colapsar" : "Ver detalles"}
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-3">
                            <div className="bg-green-50 px-3 py-2 rounded">
                                <p className="text-sm text-gray-600">Procesados:</p>
                                <p className="font-medium text-gray-800">{batchGenerationStatus.results.processed}</p>
                            </div>
                            <div className="bg-green-50 px-3 py-2 rounded">
                                <p className="text-sm text-gray-600">Exitosos:</p>
                                <p className="font-medium text-green-600">{batchGenerationStatus.results.successful}</p>
                            </div>
                            <div className="bg-red-50 px-3 py-2 rounded">
                                <p className="text-sm text-gray-600">Fallidos:</p>
                                <p className="font-medium text-red-600">{batchGenerationStatus.results.failed}</p>
                            </div>
                        </div>

                        {expandedResults && batchGenerationStatus.results.details && batchGenerationStatus.results.details.length > 0 && (
                            <div className="mt-4 border rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {batchGenerationStatus.results.details.map((detail: BatchGenerationDetail, index: number) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{detail.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {detail.status === 'success' ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            Éxito
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                            Error
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {detail.error || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Loading state */}
                {loading && (
                    <div className="p-8 rounded-lg flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
                        <p>{error}</p>
                    </div>
                )}

                {/* Pending Loans List */}
                {!loading && !error && pendingDocumentsLoans?.loans && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-4 border-b">
                            <h2 className="font-medium text-gray-800">
                                Lista de solicitudes pendientes ({pendingDocumentsLoans.loans.length})
                            </h2>
                        </div>

                        {pendingDocumentsLoans.loans.length === 0 ? (
                            <div className="p-8 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No hay solicitudes pendientes</h3>
                                <p className="mt-1 text-gray-500">
                                    Todas las solicitudes de préstamo tienen sus documentos generados.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {pendingDocumentsLoans.loans.map((loan: ScalarLoanApplication) => (
                                            <tr key={loan.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                            {loan.user?.avatar && loan.user.avatar !== "No definido" ? (
                                                                <img
                                                                    src={loan.user.avatar}
                                                                    alt={getFullName(loan.user)}
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <FaUserAlt className="text-gray-500" />
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {getFullName(loan.user as ScalarClient)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 flex items-center">
                                                        <FaEnvelope className="mr-2 text-gray-400" />
                                                        {loan?.user?.email}
                                                    </div>
                                                    {loan?.user?.phone && loan.user.phone !== "No definido" && (
                                                        <div className="text-sm text-gray-500 flex items-center mt-1">
                                                            <FaPhone className="mr-2 text-gray-400" />
                                                            {loan.user.phone}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        ${parseInt(loan.cantity).toLocaleString('es-CO')}
                                                    </div>
                                                    {loan.newCantity && (
                                                        <div className="text-sm text-green-600">
                                                            Aprobado: ${parseInt(loan.newCantity).toLocaleString('es-CO')}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${loan.status === 'Aprobado'
                                                        ? 'bg-green-100 text-green-800'
                                                        : loan.status === 'Aplazado'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {loan.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(String(loan.created_at))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}

export default ComprobantesPage;