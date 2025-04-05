"use client"

import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import { useAuth } from "@/context/useAuth";
import { companiesUser, ScalarClient } from "@/types/client";
import axios from "axios";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { IoIosCheckmarkCircle, IoMdFingerPrint } from "react-icons/io";
import { IoBanOutline, IoDocumentAttachOutline } from "react-icons/io5";

function InfoClient({ params }: { params: Promise<{ client_id: string }> }) {
    const resolvedParams = use(params);
    const { client_id } = resolvedParams;
    const [clientData, setClientData] = useState<ScalarClient | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { accessToken } = useAuth();

    console.log(accessToken);

    useEffect(() => {
        const getInfoClient = async () => {
            try {
                const response = await axios.get(
                    `/api/dash/clients?client_id=${client_id}`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                        // Add a timeout to prevent hanging requests
                        timeout: 15000
                    }
                );
                console.log(response.data);
                if (response.data.success) {
                    setClientData(response.data.data);
                } else {
                    setError("No se encontró información del cliente.");
                }
            } catch (err) {
                setError("Error al obtener la información del cliente.");
            } finally {
                setLoading(false);
            }
        };

        getInfoClient();
    }, [client_id]);

    console.log(clientData);

    return (
        <SidebarLayout>
            <div className="p-6 overflow-scroll h-full">
                {loading ? (
                    <p>Cargando información del cliente...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : clientData ? (
                    <>
                        <p className="mt-10 sm:mt-0 mb-5 text-2xl">Informacion General</p>
                        <div className="flex flex-wrap gap-5">
                            <div className="grid place-content-center">
                                <Image
                                    src={clientData.avatar!}
                                    alt="avatar" width={300}
                                    height={300}
                                    className="shadow-md rounded-lg"
                                />
                            </div>

                            <div className="grow space-y-3">
                                <div className="flex flex-col grow space-y-1">
                                    <p className="text-xs text-gray-700">Nombre</p>
                                    <input
                                        type="text"
                                        value={`${clientData.names} ${clientData.firstLastName} ${clientData.secondLastName}`}
                                        className="p-2 rounded-md text-base outline-gray-200 border border-gray-400 font-thin text-gray-500"
                                    />
                                </div>
                                <div className="flex flex-col grow space-y-1">
                                    <p className="text-xs text-gray-700">Correo electronico</p>
                                    <input
                                        type="text"
                                        value={clientData.email}
                                        className="p-2 rounded-md text-base outline-gray-200 border border-gray-400 font-thin text-gray-500"
                                    />
                                </div>
                                <div className="flex flex-col grow space-y-1">
                                    <p className="text-xs text-gray-700">Numero de celular</p>
                                    <input
                                        type="text"
                                        value={clientData.phone}
                                        className="p-2 rounded-md text-base outline-gray-200 border border-gray-400 font-thin text-gray-500"
                                    />
                                </div>
                                <div className="flex flex-col grow space-y-1">
                                    <p className="text-xs text-gray-700">Ciudad</p>
                                    <input
                                        type="text"
                                        value={clientData.city}
                                        className="p-2 rounded-md text-base outline-gray-200 border border-gray-400 font-thin text-gray-500"
                                    />
                                </div>
                                <div className="flex flex-col grow space-y-1">
                                    <p className="text-xs text-gray-700">Empresa</p>
                                    <select
                                        value={clientData.currentCompanie as companiesUser}
                                        className="p-2 rounded-md text-base outline-gray-200 border border-gray-400 font-thin text-gray-500"
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

                                <div className="flex flex-row gap-3">
                                    <div className="grid place-content-center bg-gray-50 hover:bg-gray-100 cursor-pointer px-4 py-2 rounded-md">
                                        <p className="text-sm text-gray-400">Actualizar</p>
                                    </div>

                                    <div className="grid place-content-center bg-red-300 hover:bg-red-400 px-4 py-2 rounded-md">
                                        <div className="flex flex-row gap-1">
                                            <div className="grid place-content-center">
                                                <IoBanOutline className="drop-shadow-md text-white" />
                                            </div>
                                            <p className="grid place-content-center text-sm text-white cursor-pointer">Deshabilitar cuenta</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="basis-[400px]">
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-xs">Verificaciones</h1>
                                    <div className="flex flex-row gap-2 bg-gray-50 px-3 py-1 rounded-md border border-transparent hover:border-gray-100">
                                        <div className="grid place-content-center">
                                            <IoMdFingerPrint size={30} className="drop-shadow-md" />
                                        </div>
                                        <div className="flex flex-col grow">
                                            <h1 className="text-xs">Verificacion de identidad</h1>
                                            <p className="font-thin text-sm">Reconocimiento facial</p>
                                        </div>
                                        <div className="grid place-content-center">
                                            <IoIosCheckmarkCircle className="text-green-400 drop-shadow-md" />
                                        </div>
                                    </div>

                                    <div className="flex flex-row gap-2 bg-gray-50 px-3 py-1 rounded-md border border-transparent hover:border-gray-100">
                                        <div className="grid place-content-center">
                                            <IoDocumentAttachOutline size={30} className="drop-shadow-md" />
                                        </div>
                                        <div className="flex flex-col grow">
                                            <h1 className="text-xs">Verificacion de identidad</h1>
                                            <p className="font-thin text-sm">Documento de identidad por ambos lados</p>
                                        </div>
                                        <div className="grid place-content-center">
                                            <IoIosCheckmarkCircle className="text-green-400 drop-shadow-md" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <p>No se encontró información.</p>
                )}
            </div>
        </SidebarLayout>
    );
}

export default InfoClient;