import React from 'react';
import { IoMdArchive, IoMdDownload } from "react-icons/io";
import { GeneratedDocuments } from '@/types/loan';
import useProof from '@/hooks/dashboard/useProof';

// Componente para representar un documento ZIP
export const ZipDocumentCard = ({ document }: { document: Partial<GeneratedDocuments> & { fileInfo?: { name: string; size?: string; fileCount?: number; modifiedDate?: string } } }) => {
    const { downloadDocumentById } = useProof(); // Utilizamos la función del hook
    const fileName = document.fileInfo?.name || document.publicUrl?.split('/').pop() || "Documento ZIP";
    const fileCount = document.fileInfo?.fileCount ?? document.documentTypes?.length ?? 0;
    const modifiedDate = document.fileInfo?.modifiedDate || (document.updated_at ? new Date(document.updated_at).toLocaleDateString() : "Desconocido");
    
    // Función para manejar la descarga
    const handleDownload = (e: React.MouseEvent) => {
        e.preventDefault();
        if (document.id) {
            downloadDocumentById(document.id);
        } else if (document.publicUrl) {
            // Si no hay ID pero sí URL, abrimos directamente
            window.open(document.publicUrl, '_blank');
        }
    };

    return (
        <div className="bg-white border rounded-lg overflow-hidden transition hover:shadow-md">
            <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                        <IoMdArchive className="text-gray-600 text-lg" />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-800">{fileName}</h3>
                        <p className="text-xs text-gray-500">
                            {fileCount} {fileCount === 1 ? 'archivo' : 'archivos'} • {modifiedDate}
                        </p>
                    </div>
                </div>
                
                <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-1 py-2 mt-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm"
                >
                    <IoMdDownload />
                    <span>Descargar</span>
                </button>
            </div>
        </div>
    );
};

// Sección que muestra los documentos ZIP
export const ZipDocumentsSection = ({ documents }: { documents: GeneratedDocuments[] }) => {
    const zipDocuments = documents.filter(doc =>
        doc && doc.fileType && (doc.fileType === 'application/zip' || doc.fileType.includes('zip'))
    );

    if (!zipDocuments.length) return null;

    return (
        <div className="mt-6">
            <h2 className="text-base font-medium mb-3 text-gray-700">Archivos comprimidos</h2>
            <div className="grid md:grid-cols-3 gap-4">
                {zipDocuments.map((doc, index) => (
                    <ZipDocumentCard
                        key={doc.id || index}
                        document={{
                            ...doc,
                            fileInfo: {
                                name: doc.publicUrl?.split('/').pop() || `Documento ${index + 1}`,
                                fileCount: doc.documentTypes?.length || 0,
                                modifiedDate: doc.updated_at ? new Date(doc.updated_at).toLocaleDateString() : "Desconocido",
                            },
                        }}
                    />
                ))}
            </div>
        </div>
    );
};