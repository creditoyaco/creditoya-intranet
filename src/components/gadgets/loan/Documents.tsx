import { IoMdDocument, IoMdDownload, IoMdEye } from "react-icons/io";
import { MdBlock } from "react-icons/md";

type Document = {
    name: string;
    url?: string;
};

type DocumentsListProps = {
    documents: Document[];
    setSelectedDocument: (url: string) => void;
};

type DocumentCardProps = {
    document: Document;
    setSelectedDocument: (url: string) => void;
};

export const DocumentsList: React.FC<DocumentsListProps> = ({ documents, setSelectedDocument }) => {
    return (
        <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Documentos Adjuntos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {documents.map((doc, index) => (
                    <DocumentCard
                        key={index}
                        document={doc}
                        setSelectedDocument={setSelectedDocument}
                    />
                ))}
            </div>
        </div>
    );
};

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, setSelectedDocument }) => {
    return (
        <div className="border border-gray-100 bg-white hover:bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-between h-44 transition-all shadow-sm hover:shadow">
            {/* Icono y nombre */}
            <div className="flex flex-col items-center space-y-2 w-full">
                <div className="bg-gray-50 rounded-full p-3">
                    <IoMdDocument className="text-2xl text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 font-medium text-center truncate w-full">
                    {document.name}
                </p>
            </div>

            {/* Acciones */}
            {document.url && (
                <div className="flex w-full gap-2 mt-4">
                    <button
                        className="flex-1 py-2 px-3 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition flex items-center justify-center gap-1 text-sm"
                        onClick={() => setSelectedDocument(document.url!)}
                    >
                        <IoMdEye className="text-gray-500" />
                        <span>Ver</span>
                    </button>
                    <a
                        href={document.url}
                        download
                        className="flex-1 py-2 px-3 bg-green-50 text-green-700 rounded hover:bg-green-100 transition flex items-center justify-center gap-1 text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <IoMdDownload className="text-green-600" />
                        <span>Descargar</span>
                    </a>
                    <button
                        className="flex-1 py-2 px-3 bg-red-50 text-red-700 rounded hover:bg-red-100 transition flex items-center justify-center gap-1 text-sm"
                        onClick={() => alert("Funcionalidad en mantenimiento...")}
                    >
                        <MdBlock className="text-red-600" />
                        <span>Rechazar</span>
                    </button>
                </div>
            )}
        </div>
    );
};
