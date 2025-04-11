"use client"

import { ModalWrapper } from "../Modal";

interface DocumentViewerModalProps {
    selectedDocument: string | null;
    setSelectedDocument: (document: string | null) => void;
}

export const DocumentViewerModal = ({ selectedDocument, setSelectedDocument }: DocumentViewerModalProps) => {
    return (
        <ModalWrapper onClose={() => setSelectedDocument(null)}>
            <div className="relative bg-white p-6 rounded-lg shadow-lg z-50 w-full max-w-2xl mx-auto">
                <h2 className="text-lg font-bold mb-4">Visualizar Documento</h2>
                <iframe
                    src={selectedDocument as string}
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
        </ModalWrapper>
    );
};
