import { ModalWrapper } from "../Modal";

export const RejectModal = ({ 
    rejectReason, 
    setRejectReason, 
    handleReject, 
    setRejectModalOpen,
    isRejecting 
}: { 
    rejectReason: string; 
    setRejectReason: (reason: string) => void; 
    handleReject: () => void; 
    setRejectModalOpen: (open: boolean) => void; 
    isRejecting: boolean; 
}) => {
    return (
        <ModalWrapper onClose={() => setRejectModalOpen(false)}>
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
        </ModalWrapper>
    );
};