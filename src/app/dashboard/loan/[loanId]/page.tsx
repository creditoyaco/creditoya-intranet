"use client";

import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import {
    IoIosArrowRoundBack,
    IoMdInformationCircleOutline,
    IoMdContact,
    IoMdMail,
    IoMdCall,
    IoMdPin,
    IoMdCash,
    IoMdDocument,
    IoMdDownload,
    IoMdBusiness,
    IoMdCheckmarkCircle,
    IoMdCalendar,
    IoMdFingerPrint,
    IoMdInformationCircle,
    IoMdRefresh,
} from "react-icons/io";
import { FaCheckCircle, FaTimesCircle, FaEdit, FaSpinner } from "react-icons/fa";
import Image from "next/image";
import { GoShieldCheck } from "react-icons/go";
import useLoan from "@/hooks/dashboard/useLoan";
import { use } from "react";
import { stringToPriceCOP } from "@/handlers/StringToCOP";
import { handleKeyToCompany } from "@/handlers/keyToCompany";
import { BankTypes, handleKeyToStringBank } from "@/handlers/typeBank";
import { RiBankFill } from "react-icons/ri";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";

interface LoanDataProps {
    params: Promise<{ loanId: string }>;
}

function LoanData({ params }: LoanDataProps) {
    const resolveParams = use(params)
    const { loanId } = resolveParams;
    const {
        loading,
        error,
        loanApplication,
        client,
        router,
        documents,
        isRejectModalOpen,
        isAdjustModalOpen,
        rejectReason,
        newAmount,
        adjustReason,
        selectedDocument,
        isAccepting,
        isRejecting,
        setSelectedDocument,
        handleAccept,
        setRejectModalOpen,
        setAdjustModalOpen,
        handleReject,
        handleAdjust,
        setRejectReason,
        setNewAmount,
        setAdjustReason,
    } = useLoan({ loanId });

    if (loading) {
        return (
            <SidebarLayout>
                <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <p>Cargando información del préstamo...</p>
                    </div>
                </div>
            </SidebarLayout>
        );
    }

    if (error || !loanApplication || !client) {
        return (
            <SidebarLayout>
                <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-500">{error || "No se pudo cargar la información del préstamo"}</p>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            onClick={() => router.push("/dashboard")}
                        >
                            Volver al panel
                        </button>
                    </div>
                </div>
            </SidebarLayout>
        );
    }

    return (
        <SidebarLayout>
            <div className="p-6 bg-gray-50 min-h-screen overflow-scroll sm:pt-6 pt-20">
                {/* Encabezado */}
                <div
                    className="flex items-center gap-2 text-gray-600 cursor-pointer mb-6 hover:text-gray-800"
                    onClick={() => router.push("/dashboard")}
                >
                    <IoIosArrowRoundBack className="text-xl" />
                    <p className="text-sm font-medium">Volver a todas las solicitudes</p>
                </div>

                {/* Información del préstamo */}
                <div className="flex flex-col md:flex-row flex-wrap gap-6">
                    <div className="w-full md:w-[400px] flex-grow mb-10">
                        <div className="flex flex-col-reverse gap-1 mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Detalles del Préstamo</h2>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <IoMdInformationCircleOutline className="text-sm drop-shadow-md" />
                                <span className="text-xs">ID: {loanApplication.id}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {/* Información Personal */}
                            <div className="flex items-center space-x-2">
                                <IoMdContact className="min-w-8 text-4xl text-gray-500 drop-shadow-md" />
                                <div className="w-full">
                                    <p className="text-sm text-gray-800">Nombre Completo</p>
                                    <p className="font-thin text-gray-600">{client.names} {client.firstLastName} {client.secondLastName}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <IoMdMail className="min-w-8 text-4xl text-gray-500 drop-shadow-md" />
                                <div className="w-full">
                                    <p className="text-sm text-gray-800">Email</p>
                                    <p className="font-thin text-gray-600">{client.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <IoMdCall className="min-w-8 text-4xl text-gray-500 drop-shadow-md" />
                                <div className="w-full">
                                    <p className="text-sm text-gray-800">Teléfono</p>
                                    <p className="font-thin text-gray-600">{client.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <IoMdPin className="min-w-8 text-4xl text-gray-500 drop-shadow-md" />
                                <div className="w-full">
                                    <p className="text-sm text-gray-800">Ciudad</p>
                                    <p className="font-thin text-gray-600">{client.city}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <IoMdBusiness className="min-w-8 text-4xl text-gray-500 drop-shadow-md" />
                                <div className="w-full">
                                    <p className="text-sm text-gray-800">Empresa</p>
                                    <p className="font-thin text-gray-600">{handleKeyToCompany(client.currentCompanie!)}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <IoMdCash className="min-w-8 text-4xl text-gray-500 drop-shadow-md" />
                                <div className="w-full">
                                    <p className="text-sm text-gray-800">Monto Solicitado</p>
                                    {loanApplication.newCantity ? (
                                        <>
                                            <div className="flex items-center space-x-2">
                                                <p className="text-xl text-gray-400 line-through">{stringToPriceCOP(loanApplication.cantity)}</p>
                                                <p className="text-xl text-green-600 font-semibold">{stringToPriceCOP(loanApplication.newCantity)}</p>
                                            </div>
                                            {loanApplication.reasonChangeCantity && (
                                                <p className="text-xs text-gray-500 font-thin mt-1">
                                                    Motivo: {loanApplication.reasonChangeCantity}
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="font-thin text-gray-600 text-xl">{stringToPriceCOP(loanApplication.cantity)}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <RiBankFill className="min-w-8 text-4xl text-gray-500 drop-shadow-md" />
                                <div className="w-full">
                                    <p className="text-sm text-gray-800">Entidad Bancaria</p>
                                    <p className="font-thin text-gray-600">{handleKeyToStringBank(loanApplication.entity as BankTypes)}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <MdOutlineAccountBalanceWallet className="min-w-8 text-4xl text-gray-500 drop-shadow-md" />
                                <div className="w-full">
                                    <p className="text-sm text-gray-800">Numero de cuenta</p>
                                    <p className="font-thin text-gray-600">{loanApplication.bankNumberAccount}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <FaEdit className="min-w-8 text-4xl text-gray-500 drop-shadow-md" />
                                <div className="w-full">
                                    <p className="text-sm text-gray-500">Estado</p>
                                    <div className="flex items-center gap-2">
                                        {loanApplication.status === "Pendiente" && (
                                            <>
                                                <p className="font-medium text-yellow-500">Pendiente</p>
                                            </>
                                        )}
                                        {loanApplication.status === "Aprobado" && (
                                            <>
                                                <p className="font-medium text-green-500">Aceptado</p>
                                            </>
                                        )}
                                        {loanApplication.status === "Aplazado" && (
                                            <div className="flex flex-col">
                                                <p className="font-medium text-red-500">Rechazado</p>
                                                {loanApplication.reasonReject && (
                                                    <p className="text-xs font-bold text-gray-500">
                                                        Motivo: <span className="font-thin">{loanApplication.reasonReject}</span>
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-[400px] flex-grow bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col max-h-[520px]">
                        {/* Encabezado */}
                        <div className="flex items-center gap-2 p-3 border-b border-gray-100">
                            <GoShieldCheck className="text-xl text-green-600" />
                            <h3 className="font-medium text-gray-800">Verificación de Identidad</h3>
                        </div>

                        {/* Contenedor de imagen */}
                        <div className="relative p-4">
                            <div className="flex justify-center bg-gray-100">
                                {client.Document && client.Document.length > 0 && (
                                    <div className="w-[320px] h-[260px] overflow-hidden rounded-md relative">
                                        <Image
                                            src={client.Document[0].imageWithCC!}
                                            alt="Verificación con documento"
                                            width={400}
                                            height={400}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Información de verificación */}
                        <div className="p-3 space-y-2 flex-grow">
                            <div className="flex items-center gap-2">
                                <IoMdCheckmarkCircle className="text-green-600 text-lg" />
                                <span className="text-sm">Identidad confirmada</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <IoMdCalendar className="text-gray-600 text-lg" />
                                <span className="text-sm">
                                    Verificado el {new Date(loanApplication.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <IoMdFingerPrint className="text-gray-600 text-lg" />
                                <span className="text-sm">Método: Reconocimiento facial</span>
                            </div>

                            {client.Document && client.Document.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <IoMdContact className="text-gray-600 text-lg" />
                                    <span className="text-sm">
                                        {client.Document[0].typeDocument}: {client.Document[0].number}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Pie */}
                        <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-lg mt-auto">
                            <div className="flex justify-end">
                                <div className="flex items-center gap-1">
                                    <IoMdInformationCircle className="text-gray-500" />
                                    <span className="text-xs text-gray-500">
                                        {client.Document && client.Document.length > 0 ? `ID: ${client.Document[0].id.substring(0, 8)}` : "ID: No disponible"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documentos */}
                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Documentos Adjuntos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {documents.map((doc, index) => (
                            <div key={index} className="border border-gray-100 hover:border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
                                <IoMdDocument className="text-4xl text-gray-500 drop-shadow-md" />
                                <p className="text-sm font-thin text-gray-700">{doc.name}</p>
                                <div className="flex gap-2">
                                    <button
                                        className="px-3 gap-1 bg-blue-400 text-white rounded hover:bg-blue-600 transition flex flex-row"
                                        onClick={() => setSelectedDocument(doc.url as string)}
                                    >
                                        <p className="grid place-content-center text-sm font-thin">Visualizar</p>
                                    </button>
                                    <a
                                        href={doc.url}
                                        download
                                        className="px-3 py-1 bg-green-400 gap-1 text-white rounded hover:bg-green-600 transition flex flex-row"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <div className="grid place-content-center">
                                            <IoMdDownload className="drop-shadow-md" />
                                        </div>
                                        <p className="drop-shadow-md">Descargar</p>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Botones de acción */}
                {loanApplication.status === "Pendiente" && (
                    <div className="mt-6 flex flex-col md:flex-row gap-4">
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center justify-center cursor-pointer"
                            onClick={handleAccept}
                        >
                            {isAccepting ? (
                                <FaSpinner className="mr-2 animate-spin" />
                            ) : (
                                <FaCheckCircle className="mr-2" />
                            )}
                            {isAccepting ? "Procesando..." : "Aceptar"}

                        </button>
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center justify-center"
                            onClick={() => setRejectModalOpen(true)}
                        >
                            <FaTimesCircle className="mr-2" /> Rechazar
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center justify-center"
                            onClick={() => setAdjustModalOpen(true)}
                        >
                            <FaEdit className="mr-2" /> Ajustar Monto
                        </button>
                    </div>
                )}

                {/* Modal de Rechazo */}
                {isRejectModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        {/* Fondo con blur */}
                        <div
                            className="absolute inset-0 backdrop-blur-sm bg-white/30"
                            onClick={() => setRejectModalOpen(false)}
                        ></div>

                        {/* Contenido del modal */}
                        <div className="relative bg-white p-6 rounded-lg shadow-lg z-50 w-full max-w-md mx-auto">
                            <h2 className="text-lg font-bold mb-4">Rechazar Solicitud</h2>
                            <textarea
                                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                                placeholder="Digite el motivo"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                            />
                            <div className="flex justify-end mt-4">
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                    onClick={handleReject}
                                >
                                    {isRejecting ? "Rechazando..." : "Listo"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Ajuste de Monto */}
                {isAdjustModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        {/* Fondo con blur translúcido */}
                        <div
                            className="absolute inset-0 backdrop-blur-sm bg-white/30"
                            onClick={() => setAdjustModalOpen(false)}
                        ></div>

                        {/* Contenido del modal */}
                        <div className="relative bg-white p-6 rounded-lg shadow-lg z-50 w-full max-w-md mx-auto">
                            <h2 className="text-lg font-bold mb-4">Ajustar Monto</h2>
                            <input
                                type="text"
                                className="w-full border border-gray-300 p-2 rounded mb-4 focus:outline-none focus:border-blue-500"
                                placeholder="Nuevo monto"
                                value={newAmount}
                                onChange={(e) => setNewAmount(e.target.value)}
                            />
                            <textarea
                                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                                placeholder="Motivo del ajuste"
                                value={adjustReason}
                                onChange={(e) => setAdjustReason(e.target.value)}
                            />
                            <div className="flex justify-end mt-4">
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                    onClick={handleAdjust}
                                >
                                    Listo
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Visualización de Documento */}
                {selectedDocument && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        {/* Fondo con blur translúcido */}
                        <div
                            className="absolute inset-0 backdrop-blur-sm bg-white/30"
                            onClick={() => setSelectedDocument(null)}
                        ></div>

                        {/* Contenido del modal */}
                        <div className="relative bg-white p-6 rounded-lg shadow-lg z-50 w-full max-w-2xl mx-auto">
                            <h2 className="text-lg font-bold mb-4">Visualizar Documento</h2>
                            <iframe
                                src={selectedDocument}
                                className="w-full h-[500px] border rounded-lg"
                                title="Documento"
                            ></iframe>
                            <div className="flex justify-end mt-4">
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                    onClick={() => setSelectedDocument(null)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}

export default LoanData;