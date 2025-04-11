import React from 'react';
import { IoMdArchive, IoMdDownload, IoMdInformationCircleOutline } from "react-icons/io";
import { GeneratedDocuments } from '@/types/loan';

// Componente para representar un documento ZIP
export const ZipDocumentCard = ({ document }: { document: Partial<GeneratedDocuments> & { fileInfo?: { name: string; size?: string; fileCount?: number; modifiedDate?: string } } }) => {
    const fileName = document.fileInfo?.name || document.publicUrl?.split('/').pop() || "Documento ZIP";
    const fileSize = document.fileInfo?.size || "Desconocido";
    const fileCount = document.fileInfo?.fileCount ?? document.documentTypes?.length ?? "?";
    const modifiedDate = document.fileInfo?.modifiedDate || (document.updated_at ? new Date(document.updated_at).toLocaleDateString() : "Desconocido");
    const downloadUrl = document.publicUrl || `/loan-documents/download/${document.id}`;

    return (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            {/* Encabezado */}
            <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <IoMdArchive className="text-blue-500 text-xl" />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-800">{fileName}</h3>
                        <p className="text-xs text-gray-500">
                            {fileSize} • {fileCount} archivos
                        </p>
                    </div>
                </div>
            </div>

            {/* Información */}
            <div className="px-4 py-2 bg-gray-50 flex items-center text-xs text-gray-500">
                <IoMdInformationCircleOutline className="mr-1" />
                Última modificación: {modifiedDate}
            </div>

            {/* Botón de descarga */}
            {downloadUrl && (
                <div className="px-4 py-3 border-t">
                    <a
                        href={downloadUrl}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        download={fileName}
                    >
                        <IoMdDownload />
                        Descargar archivo ZIP
                    </a>
                </div>
            )}
        </div>
    );
};

// Sección que muestra los documentos ZIP
export const ZipDocumentsSection = ({ documents }: { documents: GeneratedDocuments[] }) => {
    // Add null checks when filtering
    const zipDocuments = documents.filter(doc =>
        doc && doc.fileType && (doc.fileType === 'application/zip' || doc.fileType.includes('zip'))
    );

    if (!zipDocuments.length) return null;

    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Archivos Comprimidos</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {zipDocuments.map((doc, index) => (
                    <ZipDocumentCard
                        key={doc.id || index}
                        document={{
                            ...doc,
                            fileInfo: {
                                name: doc.publicUrl?.split('/').pop() || `Documento ${index + 1}`,
                                size: "Aprox. 1MB", // Esto puede mejorarse si tienes los datos reales
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

