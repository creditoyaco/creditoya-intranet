import {
    IoMdContact,
    IoMdMail,
    IoMdCall,
    IoMdPin,
    IoMdBusiness,
    IoMdCash
} from "react-icons/io";
import { RiBankFill } from "react-icons/ri";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { stringToPriceCOP } from "@/handlers/StringToCOP";
import { handleKeyToCompany } from "@/handlers/keyToCompany";
import { BankTypes, handleKeyToStringBank } from "@/handlers/typeBank";
import { LoanHeader } from "./Header";
import { ScalarLoanApplication } from "@/types/loan";
import { ScalarClient } from "@/types/client";

interface DetailItemProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}

export const LoanDetails = ({ loanApplication, client }: { loanApplication: ScalarLoanApplication; client: ScalarClient }) => {
    return (
        <div className="w-full md:w-[400px] flex-grow mb-10">
            <LoanHeader loanId={loanApplication.id as string} />

            <div className="grid grid-cols-1 gap-4">
                <DetailItem
                    icon={<IoMdContact className="min-w-8 text-4xl text-gray-500 drop-shadow-md" />}
                    label="Nombre Completo"
                    value={`${client.names} ${client.firstLastName} ${client.secondLastName}`}
                />

                <DetailItem
                    icon={<IoMdMail className="min-w-8 text-4xl text-gray-500 drop-shadow-md" />}
                    label="Email"
                    value={client.email}
                />

                <DetailItem
                    icon={<IoMdCall className="min-w-8 text-4xl text-gray-500 drop-shadow-md" />}
                    label="Teléfono"
                    value={client.phone as string}
                />

                <DetailItem
                    icon={<IoMdPin className="min-w-8 text-4xl text-gray-500 drop-shadow-md" />}
                    label="Ciudad"
                    value={client.city as string}
                />

                <DetailItem
                    icon={<IoMdBusiness className="min-w-8 text-4xl text-gray-500 drop-shadow-md" />}
                    label="Empresa"
                    value={handleKeyToCompany(client.currentCompanie!)}
                />

                <LoanAmountDetail
                    loanApplication={loanApplication}
                />

                <DetailItem
                    icon={<RiBankFill className="min-w-8 text-4xl text-gray-500 drop-shadow-md" />}
                    label="Entidad Bancaria"
                    value={handleKeyToStringBank(loanApplication.entity as BankTypes)}
                />

                <DetailItem
                    icon={<MdOutlineAccountBalanceWallet className="min-w-8 text-4xl text-gray-500 drop-shadow-md" />}
                    label="Numero de cuenta"
                    value={loanApplication.bankNumberAccount}
                />

                <LoanStatusDetail loanApplication={loanApplication} />
            </div>
        </div>
    );
};

export const DetailItem = ({ icon, label, value }: DetailItemProps) => {
    return (
        <div className="flex items-center space-x-2">
            {icon}
            <div className="w-full">
                <p className="text-sm text-gray-800">{label}</p>
                <p className="font-thin text-gray-600">{value}</p>
            </div>
        </div>
    );
};

// Componente específico para mostrar el monto del préstamo
export const LoanAmountDetail = ({ loanApplication }: { loanApplication: ScalarLoanApplication }) => {
    return (
        <div className="flex items-center space-x-2">
            <IoMdCash className="min-w-8 text-4xl text-gray-500 drop-shadow-md" />
            <div className="w-full">
                <p className="text-sm text-gray-800">Monto Solicitado</p>
                {loanApplication.newCantity ? (
                    <>
                        <div className="flex items-center space-x-2">
                            <p className="text-xl text-gray-400 line-through">
                                {stringToPriceCOP(loanApplication.cantity)}
                            </p>
                            <p className="text-xl text-green-600 font-semibold">
                                {stringToPriceCOP(loanApplication.newCantity)}
                            </p>
                        </div>
                        {loanApplication.reasonChangeCantity && (
                            <p className="text-xs text-gray-500 font-thin mt-1">
                                Motivo: {loanApplication.reasonChangeCantity}
                            </p>
                        )}
                    </>
                ) : (
                    <p className="font-thin text-gray-600 text-xl">
                        {stringToPriceCOP(loanApplication.cantity)}
                    </p>
                )}
            </div>
        </div>
    );
};

// Componente para mostrar el estado del préstamo
export const LoanStatusDetail = ({ loanApplication }: { loanApplication: ScalarLoanApplication }) => {
    return (
        <div className="flex items-center space-x-2">
            <FaEdit className="min-w-8 text-4xl text-gray-500 drop-shadow-md" />
            <div className="w-full">
                <p className="text-sm text-gray-500">Estado</p>
                <div className="flex items-center gap-2">
                    {loanApplication.status === "Pendiente" && (
                        <p className="font-medium text-yellow-500">Pendiente</p>
                    )}
                    {loanApplication.status === "Aprobado" && (
                        <p className="font-medium text-green-500">Aceptado</p>
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
    );
};