"use client"

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
                const response = await axios.get(
                    `/api/dash/clients?page=${currentPage}&pageSize=${usersPerPage}`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                        timeout: 15000
                    }
                );

                if (response.data.success) {
                    const userData = response.data.data;

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
                if (err.code === 'ECONNABORTED') {
                    setError("La solicitud ha tardado demasiado tiempo. Por favor, inténtalo de nuevo.");
                } else {
                    setError(err.response?.data?.error || err.message || "Error al conectar con el servidor.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentPage, accessToken]);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return {
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
        clientData
    };
}

export default useClient;
