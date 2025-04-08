"use client"

import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import useClient from "@/hooks/dashboard/useClients";
import { companiesUser, ScalarClient } from "@/types/client";
import Image from "next/image";
import { IoIosCheckmarkCircle, IoMdFingerPrint } from "react-icons/io";
import { IoBanOutline, IoDocumentAttachOutline, IoPersonOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/useAuth";

function InfoClient({ params }: { params: Promise<{ client_id: string }> }) {
    const { loading, error, clientData } = useClient({ params });
    const { accessToken } = useAuth();
    const [editableData, setEditableData] = useState<ScalarClient | null>(null);
    const [isSaving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (clientData) {
            setEditableData({ ...clientData });
        }
    }, [clientData]);

    // Helper to check if avatar URL is valid
    const isValidAvatarUrl = (url: string | undefined | null): boolean => {
        if (!url || url === "No definido") return false;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleChange = (field: keyof ScalarClient, value: any) => {
        if (editableData) {
            setEditableData({ ...editableData, [field]: value });
        }
    };

    const handleUpdateClient = async () => {
        if (!editableData || !accessToken) return;

        setSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            const response = await axios.put(
                `/api/dash/clients`,
                { client: editableData },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    timeout: 15000
                }
            );

            if (response.data.success) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                setSaveError(response.data.error || "Error al actualizar la información.");
            }
        } catch (err: any) {
            if (err.code === 'ECONNABORTED') {
                setSaveError("La solicitud ha tardado demasiado tiempo. Por favor, inténtalo de nuevo.");
            } else {
                setSaveError(err.response?.data?.error || err.message || "Error al conectar con el servidor.");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <SidebarLayout>
            <div className="p-4 md:p-6">
                <p>Cargando información del cliente...</p>
            </div>
        </SidebarLayout>
    );

    if (error) return (
        <SidebarLayout>
            <div className="p-4 md:p-6">
                <p className="text-red-500">{error}</p>
            </div>
        </SidebarLayout>
    );

    if (!editableData) return (
        <SidebarLayout>
            <div className="p-4 md:p-6">
                <p>No se encontró información.</p>
            </div>
        </SidebarLayout>
    );

    return (
        <SidebarLayout>
            <div className="p-4 md:p-6 overflow-y-auto h-full">
                <p className="mt-6 sm:mt-0 mb-4 text-xl md:text-2xl">Información General</p>

                {/* Main container with improved layout */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Avatar column */}
                    <div className="flex justify-center md:justify-start">
                        {isValidAvatarUrl(editableData.avatar) ? (
                            <Image
                                src={editableData.avatar as string}
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
                                        value={editableData.names || ''}
                                        onChange={(e) => handleChange('names', e.target.value)}
                                        className="p-2 rounded-md text-sm outline-gray-200 border border-gray-400 font-thin text-gray-500 flex-1"
                                        placeholder="Nombres"
                                    />
                                    <input
                                        type="text"
                                        value={editableData.firstLastName || ''}
                                        onChange={(e) => handleChange('firstLastName', e.target.value)}
                                        className="p-2 rounded-md text-sm outline-gray-200 border border-gray-400 font-thin text-gray-500 flex-1"
                                        placeholder="Primer apellido"
                                    />
                                    <input
                                        type="text"
                                        value={editableData.secondLastName || ''}
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
                                    value={editableData.email || ''}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="p-2 rounded-md text-sm outline-gray-200 border border-gray-400 font-thin text-gray-500"
                                />
                            </div>

                            <div className="flex flex-col space-y-1">
                                <p className="text-xs text-gray-700">Número de celular</p>
                                <input
                                    type="tel"
                                    value={editableData.phone || ''}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className="p-2 rounded-md text-sm outline-gray-200 border border-gray-400 font-thin text-gray-500"
                                />
                            </div>

                            <div className="flex flex-col space-y-1">
                                <p className="text-xs text-gray-700">Ciudad</p>
                                <input
                                    type="text"
                                    value={editableData.city || ''}
                                    onChange={(e) => handleChange('city', e.target.value)}
                                    className="p-2 rounded-md text-sm outline-gray-200 border border-gray-400 font-thin text-gray-500"
                                />
                            </div>

                            <div className="flex flex-col space-y-1">
                                <p className="text-xs text-gray-700">Empresa</p>
                                <select
                                    value={editableData.currentCompanie as companiesUser || 'no'}
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
            </div>
        </SidebarLayout>
    );
}

export default InfoClient;