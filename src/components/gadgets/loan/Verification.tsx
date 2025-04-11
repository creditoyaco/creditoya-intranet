import { ScalarClient } from "@/types/client";
import { ScalarLoanApplication } from "@/types/loan";
import Image from "next/image";
import {
    GoShieldCheck
} from "react-icons/go";
import {
    IoMdCheckmarkCircle,
    IoMdCalendar,
    IoMdFingerPrint,
    IoMdContact,
    IoMdInformationCircle
} from "react-icons/io";

export const IdentityVerification = ({ client, loanApplication }: { client: ScalarClient, loanApplication: ScalarLoanApplication }) => {
    return (
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
                <VerificationItem
                    icon={<IoMdCheckmarkCircle className="text-green-600 text-lg" />}
                    text="Identidad confirmada"
                />
                <VerificationItem
                    icon={<IoMdCalendar className="text-gray-600 text-lg" />}
                    text={`Verificado el ${new Date(loanApplication.created_at).toLocaleDateString()}`}
                />
                <VerificationItem
                    icon={<IoMdFingerPrint className="text-gray-600 text-lg" />}
                    text="Método: Reconocimiento facial"
                />

                {client.Document && client.Document.length > 0 && (
                    <VerificationItem
                        icon={<IoMdContact className="text-gray-600 text-lg" />}
                        text={`${client.Document[0].typeDocument}: ${client.Document[0].number}`}
                    />
                )}
            </div>

            {/* Pie */}
            <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-lg mt-auto">
                <div className="flex justify-end">
                    <div className="flex items-center gap-1">
                        <IoMdInformationCircle className="text-gray-500" />
                        <span className="text-xs text-gray-500">
                            {client.Document && client.Document.length > 0
                                ? `ID: ${client.Document[0].id.substring(0, 8)}`
                                : "ID: No disponible"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VerificationItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => {
    return (
        <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm">{text}</span>
        </div>
    );
};