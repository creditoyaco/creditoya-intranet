import { IoMdInformationCircleOutline } from "react-icons/io";

export const LoanHeader = ({ loanId }: { loanId: string }) => {
    return (
        <div className="flex flex-col-reverse gap-1 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Detalles del Préstamo</h2>
            <div className="flex items-center gap-1 text-sm text-gray-500">
                <IoMdInformationCircleOutline className="text-sm drop-shadow-md" />
                <span className="text-xs">ID: {loanId}</span>
            </div>
        </div>
    );
};