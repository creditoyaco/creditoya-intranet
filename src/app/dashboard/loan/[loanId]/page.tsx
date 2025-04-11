"use client"

import { use } from "react";
import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import { IoIosArrowRoundBack } from "react-icons/io";
import { LoanDetails } from "@/components/gadgets/loan/Details";
import { IdentityVerification } from "@/components/gadgets/loan/Verification";
import { DocumentsList } from "@/components/gadgets/loan/Documents";
import { ActionButtons } from "@/components/gadgets/loan/ActionButtons";
import { RejectModal } from "@/components/gadgets/loan/Modal/RejectModal";
import { AdjustAmountModal } from "@/components/gadgets/loan/Modal/AdjustAmountModal";
import useLoan from "@/hooks/dashboard/useLoan";
import { DocumentViewerModal } from "@/components/gadgets/loan/Modal/DocumentViewerModal";
import { ZipDocumentCard, ZipDocumentsSection } from "@/components/gadgets/loan/zipDocs";
import { GeneratedDocuments } from "@/types/loan";

interface LoanDataProps {
    params: Promise<{ loanId: string }>;
}

function LoanData({ params }: LoanDataProps) {
    const resolveParams = use(params);
    const { loanId } = resolveParams;
    const {
        loading,
        error,
        loanApplication,
        client,
        router,
        documents,
        isRejectModalOpen,
        isAdjustModalOpen,
        rejectReason,
        newAmount,
        adjustReason,
        selectedDocument,
        isAccepting,
        isRejecting,
        setSelectedDocument,
        handleAccept,
        setRejectModalOpen,
        setAdjustModalOpen,
        handleReject,
        handleAdjust,
        setRejectReason,
        setNewAmount,
        setAdjustReason,
    } = useLoan({ loanId });

    if (loading) {
        return (
            <SidebarLayout>
                <LoadingState />
            </SidebarLayout>
        );
    }

    if (error || !loanApplication || !client) {
        return (
            <SidebarLayout>
                <ErrorState error={error} router={router} />
            </SidebarLayout>
        );
    }

    console.log(documents)

    return (
        <SidebarLayout>
            <div className="p-6 bg-gray-50 min-h-screen overflow-scroll sm:pt-6 pt-20">
                {/* Encabezado */}
                <div
                    className="flex items-center gap-2 text-gray-600 cursor-pointer mb-6 hover:text-gray-800"
                    onClick={() => router.push("/dashboard")}
                >
                    <IoIosArrowRoundBack className="text-xl" />
                    <p className="text-sm font-medium">Volver a todas las solicitudes</p>
                </div>

                {/* Información del préstamo */}
                <div className="flex flex-col md:flex-row flex-wrap gap-6">
                    <LoanDetails loanApplication={loanApplication} client={client} />
                    <IdentityVerification client={client} loanApplication={loanApplication} />
                </div>

                {/* Documentos */}
                <DocumentsList
                    documents={documents}
                    setSelectedDocument={setSelectedDocument}
                />

                <ZipDocumentsSection
                    documents={[loanApplication.GeneratedDocuments] as GeneratedDocuments[]}
                />

                {/* Botones de acción */}
                {loanApplication.status === "Pendiente" && (
                    <ActionButtons
                        isAccepting={isAccepting}
                        handleAccept={handleAccept}
                        setRejectModalOpen={setRejectModalOpen}
                        setAdjustModalOpen={setAdjustModalOpen}
                    />
                )}

                {/* Modales */}
                {isRejectModalOpen && (
                    <RejectModal
                        rejectReason={rejectReason}
                        setRejectReason={setRejectReason}
                        handleReject={handleReject}
                        setRejectModalOpen={setRejectModalOpen}
                        isRejecting={isRejecting}
                    />
                )}

                {isAdjustModalOpen && (
                    <AdjustAmountModal
                        newAmount={newAmount}
                        adjustReason={adjustReason}
                        setNewAmount={setNewAmount}
                        setAdjustReason={setAdjustReason}
                        handleAdjust={handleAdjust}
                        setAdjustModalOpen={setAdjustModalOpen}
                    />
                )}

                {selectedDocument && (
                    <DocumentViewerModal
                        selectedDocument={selectedDocument}
                        setSelectedDocument={setSelectedDocument}
                    />
                )}
            </div>
        </SidebarLayout>
    );
}

// Componentes auxiliares
const LoadingState = () => (
    <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
            <p>Cargando información del préstamo...</p>
        </div>
    </div>
);

const ErrorState = ({ error, router }: { error: string | null, router: any }) => (
    <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
            <p className="text-red-500">{error || "No se pudo cargar la información del préstamo"}</p>
            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={() => router.push("/dashboard")}
            >
                Volver al panel
            </button>
        </div>
    </div>
);

export default LoanData;