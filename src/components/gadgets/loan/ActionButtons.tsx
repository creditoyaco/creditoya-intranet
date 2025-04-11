import { FaCheckCircle, FaTimesCircle, FaEdit, FaSpinner } from "react-icons/fa";

interface ActionButtonsProps {
    isAccepting: boolean;
    handleAccept: () => void;
    setRejectModalOpen: (open: boolean) => void;
    setAdjustModalOpen: (open: boolean) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
    isAccepting,
    handleAccept,
    setRejectModalOpen,
    setAdjustModalOpen
}) => {
    return (
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
    );
};