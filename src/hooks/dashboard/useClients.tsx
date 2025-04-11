"use client";

import SidebarLayout from "@/components/gadgets/sidebar/LayoutSidebar";
import { useAuth } from "@/context/useAuth";
import { ScalarClient } from "@/types/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function useClient({ params }: { params: Promise<{ client_id: string }> | null }) {
    const [users, setUsers] = useState<ScalarClient[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { accessToken } = useAuth();
    const [clientData, setClientData] = useState<ScalarClient | null>(null);
    const [clientId, setClientId] = useState<string | null>(null);
    
    // For edit functionality
    const [editableData, setEditableData] = useState<ScalarClient | null>(null);
    const [isSaving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Resolver el parámetro de cliente (client_id)
    useEffect(() => {
        const resolveParams = async () => {
            if (params) {
                try {
                    const resolved = await params;
                    setClientId(resolved.client_id);
                } catch (err) {
                    console.error("Error resolving params:", err);
                    setError("No se pudo obtener el ID del cliente.");
                }
            }
        };
        resolveParams();
    }, [params]);

    // Obtener la información del cliente (detalles)
    useEffect(() => {
        const getInfoClient = async () => {
            if (!clientId || !accessToken) return;
            try {
                const response = await axios.get(
                    `/api/dash/clients?client_id=${clientId}`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                        timeout: 15000
                    }
                );
                if (response.data.success) {
                    setClientData(response.data.data);
                    setEditableData(response.data.data); // Initialize editable data
                } else {
                    setError("No se encontró información del cliente.");
                }
            } catch (err) {
                setError("Error al obtener la información del cliente.");
            } finally {
                setLoading(false);
            }
        };
        getInfoClient();
    }, [clientId, accessToken]);

    // Obtener la lista de usuarios (clientes), enviando searchQuery para filtrar en el endpoint
    useEffect(() => {
        const fetchUsers = async () => {
            if (!accessToken) {
                setError("No hay token de acceso disponible");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // Se agrega el parámetro "search" si está definido
                const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : "";
                const response = await axios.get(
                    `/api/dash/clients?page=${currentPage}&pageSize=${usersPerPage}${searchParam}`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                        timeout: 15000
                    }
                );

                if (response.data.success) {
                    const userData = response.data.data;
                    // Suponiendo que el endpoint devuelva un objeto con "users" y "totalCount"
                    if (userData.users && userData.totalCount !== undefined) {
                        setUsers(userData.users);
                        setTotalPages(Math.ceil(userData.totalCount / usersPerPage));
                    } else {
                        setError("Formato de respuesta inesperado");
                    }
                } else {
                    setError(response.data.error || "Error al cargar los usuarios.");
                }
            } catch (err: any) {
                if (err.code === "ECONNABORTED") {
                    setError("La solicitud ha tardado demasiado tiempo. Por favor, inténtalo de nuevo.");
                } else {
                    setError(err.response?.data?.error || err.message || "Error al conectar con el servidor.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentPage, accessToken, searchQuery]);

    // Helper to check if avatar URL is valid
    const isValidAvatarUrl = (url: string | undefined | null): boolean => {
        if (!url || url === "No definido") return false;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleChange = (field: keyof ScalarClient, value: any) => {
        if (editableData) {
            setEditableData({ ...editableData, [field]: value });
        }
    };

    const handleUpdateClient = async () => {
        if (!editableData || !accessToken) return;

        setSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            const response = await axios.put(
                `/api/dash/clients`,
                { client: editableData },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    timeout: 15000
                }
            );

            if (response.data.success) {
                setSaveSuccess(true);
                setClientData(editableData); // Update the main client data
                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                setSaveError(response.data.error || "Error al actualizar la información.");
            }
        } catch (err: any) {
            if (err.code === 'ECONNABORTED') {
                setSaveError("La solicitud ha tardado demasiado tiempo. Por favor, inténtalo de nuevo.");
            } else {
                setSaveError(err.response?.data?.error || err.message || "Error al conectar con el servidor.");
            }
        } finally {
            setSaving(false);
        }
    };

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // Render loading state for client details
    const renderLoadingState = () => (
        <SidebarLayout>
            <div className="p-4 md:p-6">
                <p>Cargando información del cliente...</p>
            </div>
        </SidebarLayout>
    );

    // Render error state for client details
    const renderErrorState = () => (
        <SidebarLayout>
            <div className="p-4 md:p-6">
                <p className="text-red-500">{error}</p>
            </div>
        </SidebarLayout>
    );

    // Render no data state for client details
    const renderNoDataState = () => (
        <SidebarLayout>
            <div className="p-4 md:p-6">
                <p>No se encontró información.</p>
            </div>
        </SidebarLayout>
    );

    return {
        // Original useClient return values
        searchQuery,
        setSearchQuery,
        loading,
        error,
        users,
        router,
        currentPage,
        totalPages,
        prevPage,
        nextPage,
        clientData,
        
        // New useOnlyClient return values
        isValidAvatarUrl,
        editableData,
        handleChange,
        saveError,
        saveSuccess,
        isSaving,
        handleUpdateClient,
        
        // UI helpers
        renderLoadingState,
        renderErrorState,
        renderNoDataState
    };
}

export default useClient;