"use client"

import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import useClient from "@/hooks/dashboard/useClients";
import { companiesUser } from "@/types/client";
import Image from "next/image";
import { IoIosCheckmarkCircle, IoMdFingerPrint } from "react-icons/io";
import { IoBanOutline, IoDocumentAttachOutline, IoPersonOutline } from "react-icons/io5";

function InfoClient({ params }: { params: Promise<{ client_id: string }> }) {
    const {
        isValidAvatarUrl,
        editableData,
        handleChange,
        saveError,
        isSaving,
        handleUpdateClient,
        saveSuccess,
    } = useClient({ params });

    console.log(editableData)

    return (
        <SidebarLayout>
            <div className="p-4 md:p-6 overflow-y-auto h-full pt-20 overflow-scroll">
                <header className="mb-8">
                    <h1 className="text-xl sm:text-2xl font-medium text-gray-800">Información General</h1>
                    <p className="text-gray-500 text-sm mt-1">Investiga datos personales, historial de prestamos, edita su informacion y toma control sobre sus cuentas</p>
                </header>

                {/* Main container with improved layout */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Avatar column */}
                    <div className="flex justify-center md:justify-start">
                        {isValidAvatarUrl(editableData?.avatar) ? (
                            <Image
                                src={editableData?.avatar as string}
                                alt="avatar"
                                width={200}
                                height={200}
                                className="shadow-md rounded-lg w-[150px] h-[150px] md:w-[200px] md:h-[200px] object-cover"
                            />
                        ) : (
                            <div className="shadow-md rounded-lg w-[150px] h-[150px] md:w-[200px] md:h-[200px] bg-gray-100 flex items-center justify-center">
                                <IoPersonOutline size={80} className="text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Form and verifications */}
                    <div className="flex flex-col md:flex-row flex-1 gap-4">
                        {/* Form */}
                        <div className="flex-1 space-y-2">
                            <div className="flex flex-col space-y-1">
                                <p className="text-xs text-gray-700">Nombre</p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="text"
                                        value={editableData?.names || ''}
                                        onChange={(e) => handleChange('names', e.target.value)}
                                        className="p-2 rounded-md text-sm outline-gray-200 border border-gray-400 font-thin text-gray-500 flex-1"
                                        placeholder="Nombres"
                                    />
                                    <input
                                        type="text"
                                        value={editableData?.firstLastName || ''}
                                        onChange={(e) => handleChange('firstLastName', e.target.value)}
                                        className="p-2 rounded-md text-sm outline-gray-200 border border-gray-400 font-thin text-gray-500 flex-1"
                                        placeholder="Primer apellido"
                                    />
                                    <input
                                        type="text"
                                        value={editableData?.secondLastName || ''}
                                        onChange={(e) => handleChange('secondLastName', e.target.value)}
                                        className="p-2 rounded-md text-sm outline-gray-200 border border-gray-400 font-thin text-gray-500 flex-1"
                                        placeholder="Segundo apellido"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col space-y-1">
                                <p className="text-xs text-gray-700">Correo electrónico</p>
                                <input
                                    type="email"
                                    value={editableData?.email || ''}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="p-2 rounded-md text-sm outline-gray-200 border border-gray-400 font-thin text-gray-500"
                                />
                            </div>

                            <div className="flex flex-col space-y-1">
                                <p className="text-xs text-gray-700">Número de celular</p>
                                <input
                                    type="tel"
                                    value={editableData?.phone || ''}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className="p-2 rounded-md text-sm outline-gray-200 border border-gray-400 font-thin text-gray-500"
                                />
                            </div>

                            <div className="flex flex-col space-y-1">
                                <p className="text-xs text-gray-700">Ciudad</p>
                                <input
                                    type="text"
                                    value={editableData?.city || ''}
                                    onChange={(e) => handleChange('city', e.target.value)}
                                    className="p-2 rounded-md text-sm outline-gray-200 border border-gray-400 font-thin text-gray-500"
                                />
                            </div>

                            <div className="flex flex-col space-y-1">
                                <p className="text-xs text-gray-700">Empresa</p>
                                <select
                                    value={editableData?.currentCompanie as companiesUser || 'no'}
                                    onChange={(e) => handleChange('currentCompanie', e.target.value)}
                                    className="p-2 rounded-md text-sm outline-gray-200 border border-gray-400 font-thin text-gray-500"
                                >
                                    <option value="incauca_sas">Incauca SAS</option>
                                    <option value="incauca_cosecha">Incauca Cosecha</option>
                                    <option value="providencia_sas">Providencia SAS</option>
                                    <option value="providencia_cosecha">Providencia Cosecha</option>
                                    <option value="con_alta">Con Alta</option>
                                    <option value="pichichi_sas">Pichichi SAS</option>
                                    <option value="pichichi_coorte">Pichichi Coorte</option>
                                    <option value="valor_agregado">Valor Agregado</option>
                                    <option value="no">Ninguna</option>
                                </select>
                            </div>

                            {saveError && (
                                <div className="text-red-500 text-sm">{saveError}</div>
                            )}

                            {saveSuccess && (
                                <div className="text-green-500 text-sm">Información actualizada correctamente.</div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                <button
                                    className={`${isSaving ? 'bg-gray-200' : 'bg-gray-50 hover:bg-gray-100'} cursor-pointer px-4 py-2 rounded-md text-sm text-gray-400`}
                                    onClick={!isSaving ? handleUpdateClient : undefined}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Actualizando...' : 'Actualizar'}
                                </button>

                                <button className="bg-red-300 hover:bg-red-400 px-4 py-2 rounded-md flex items-center justify-center gap-1">
                                    <IoBanOutline className="text-white" />
                                    <span className="text-sm text-white">Deshabilitar cuenta</span>
                                </button>
                            </div>
                        </div>

                        {/* Verifications - More compact and responsive */}
                        <div className="md:w-[260px] lg:w-[300px]">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-xs">Verificaciones</h1>

                                <div className="flex flex-row gap-2 bg-gray-50 px-2 py-2 rounded-md border border-transparent hover:border-gray-100">
                                    <div className="flex items-center">
                                        <IoMdFingerPrint size={20} className="drop-shadow-md" />
                                    </div>
                                    <div className="flex flex-col grow">
                                        <h1 className="text-xs">Verificación de identidad</h1>
                                        <p className="font-thin text-xs">Reconocimiento facial</p>
                                    </div>
                                    <div className="flex items-center">
                                        <IoIosCheckmarkCircle className="text-green-400 drop-shadow-md" />
                                    </div>
                                </div>

                                <div className="flex flex-row gap-2 bg-gray-50 px-2 py-2 rounded-md border border-transparent hover:border-gray-100">
                                    <div className="flex items-center">
                                        <IoDocumentAttachOutline size={20} className="drop-shadow-md" />
                                    </div>
                                    <div className="flex flex-col grow">
                                        <h1 className="text-xs">Verificación de identidad</h1>
                                        <p className="font-thin text-xs">Documento de identidad</p>
                                    </div>
                                    <div className="flex items-center">
                                        <IoIosCheckmarkCircle className="text-green-400 drop-shadow-md" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20">
                    <header className="mb-8">
                        <h1 className="text-xl sm:text-2xl font-medium text-gray-800">Historial de solicitudes</h1>
                    </header>

                    <div className="flex flex-col gap-3">
                        {editableData?.LoanApplication && editableData.LoanApplication.length > 0 ? editableData.LoanApplication.map(loan => (
                            <div key={loan.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow transition-all flex flex-col h-full">
                                {/* Header with ID and status */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-medium text-gray-700">#{loan.id?.substring(0, 6)}</span>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${loan.status === "Aprobado" ? "bg-green-100 text-green-800" :
                                            loan.status === "Pendiente" ? "bg-yellow-100 text-yellow-800" :
                                                loan.status === "Aplazado" ? "bg-orange-100 text-orange-800" :
                                                    loan.status === "Borrador" ? "bg-gray-100 text-gray-800" :
                                                        loan.status === "Archivado" ? "bg-red-100 text-red-800" :
                                                            loan.status === "New-cantity" ? "bg-blue-100 text-blue-800" : ""
                                        }`}>
                                        {loan.status}
                                    </span>
                                </div>

                                {/* Loan details */}
                                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm mb-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Cantidad</p>
                                        <p className="text-sm font-medium">${loan.cantity?.toLocaleString()}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">Entidad</p>
                                        <p className="text-sm">{loan.entity}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">Cuenta</p>
                                        <p className="text-sm">{loan.bankNumberAccount?.substring(0, 4)}****{loan.bankNumberAccount?.slice(-4)}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">Fecha</p>
                                        <p className="text-sm">{new Date(loan.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Documents and action button - at the bottom with mt-auto */}
                                <div className="mt-auto">
                                    <div className="flex items-center gap-1 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-xs text-gray-500">
                                            {Array.isArray(loan.GeneratedDocuments) && loan.GeneratedDocuments.length > 0 && Array.isArray(loan.GeneratedDocuments[0]?.documentTypes) ? `${loan.GeneratedDocuments[0].documentTypes.length} documentos` : 'Sin documentos'}
                                        </span>
                                    </div>

                                    <button
                                        className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm rounded-md border border-gray-300 transition-colors flex items-center justify-center gap-1"
                                        onClick={() => window.location.href = `/dashboard/loan/${loan.id}`}
                                    >
                                        <span>Examinar</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div>
                                <p className="text-sm text-gray-500">Sin solicitudes hazta el momento</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </SidebarLayout>
    );
}

export default InfoClient;