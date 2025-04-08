"use client"

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { IoReloadOutline } from "react-icons/io5";

interface User {
    names: string;
    firstLastName: string;
    secondLastName: string;
    currentCompanie: string;
    city: string;
}

interface Document {
    typeDocument: string;
    number: string;
}

interface LoanApplication {
    id: string;
    cantity: string;
    newCantity?: string;
    newCantityOpt?: boolean;
    status: string;
    created_at: string;
    reasonChangeCantity?: string;
    reasonReject?: string;
    entity: string;
}

interface LoanData {
    user: User;
    document: Document;
    loanApplication: LoanApplication;
}

interface ApiResponse {
    success: boolean;
    data: LoanData[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

function useActives() {
    const [activeTab, setActiveTab] = useState<'aprobados' | 'aplazados' | 'cambio'>('aprobados');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [loanData, setLoanData] = useState<LoanData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1
    });
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [updateInterval, setUpdateInterval] = useState<NodeJS.Timeout | null>(null);

    // Fetch data with search and pagination
    const fetchData = useCallback(async (page = 1, search = searchQuery) => {
        setIsLoading(true);
        setError(null);

        try {
            let statusParam = "";
            switch (activeTab) {
                case 'aprobados':
                    statusParam = "Aprobado";
                    break;
                case 'aplazados':
                    statusParam = "Aplazado";
                    break;
                case 'cambio':
                    statusParam = "New-cantity";
                    break;
                default:
                    statusParam = "Aprobado";
            }

            // Build query params
            const params = new URLSearchParams({
                status: statusParam,
                page: page.toString(),
                pageSize: pagination.pageSize.toString()
            });

            // Add search param if it exists
            if (search) {
                params.append('search', search);
            }

            console.log(`Fetching data with params: ${params.toString()}`);
            const response = await axios.get<ApiResponse>(`/api/dash/status?${params.toString()}`);

            if (response.data.success && Array.isArray(response.data.data)) {
                setLoanData(response.data.data);

                // Update pagination state
                setPagination({
                    currentPage: response.data.page || page,
                    pageSize: response.data.pageSize || pagination.pageSize,
                    totalItems: response.data.total || 0,
                    totalPages: response.data.totalPages || 1
                });

                // Actualizar el timestamp de última actualización
                setLastUpdated(new Date());
            } else {
                console.warn("No data returned or invalid format:", response.data);
                setLoanData([]);
                setPagination(prev => ({ ...prev, totalItems: 0, totalPages: 1 }));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Error al cargar los datos. Por favor, intente de nuevo más tarde.");
            setLoanData([]);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, pagination.pageSize, searchQuery]);

    // Handle tab change
    useEffect(() => {
        setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to page 1 when changing tabs
        fetchData(1);
    }, [activeTab, fetchData]);

    // Configurar el intervalo para actualizar el tiempo
    useEffect(() => {
        // Limpiar cualquier intervalo anterior
        if (updateInterval) {
            clearInterval(updateInterval);
        }

        // Crear un nuevo intervalo que actualice cada minuto
        const interval = setInterval(() => {
            // Forzar una actualización del componente
            setLastUpdated(prev => new Date(prev.getTime()));
        }, 60000); // Actualizar cada minuto

        setUpdateInterval(interval);

        // Limpiar el intervalo cuando el componente se desmonte
        return () => {
            if (interval) clearInterval(interval);
        };
    }, []);

    // Debounced search handler
    const debouncedSearch = useCallback(
        debounce((query: string) => {
            setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to page 1 when searching
            fetchData(1, query);
        }, 500),
        [fetchData]
    );

    // Handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    // Handle pagination
    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
            fetchData(newPage);
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        if (!dateString) return "Fecha no disponible";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return "Formato de fecha inválido";
        }
    };

    // Format currency
    const formatCurrency = (value: string) => {
        if (!value) return "$0";
        try {
            const amount = parseFloat(value);
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        } catch (e) {
            return "Valor inválido";
        }
    };

    // Función para formatear el tiempo transcurrido desde la última actualización
    const getTimeSinceUpdate = () => {
        const now = new Date();
        const diffMs = now.getTime() - lastUpdated.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return "Actualizado hace unos segundos";
        if (diffMins === 1) return "Actualizado hace 1 minuto";
        return `Actualizado hace ${diffMins} minutos`;
    };

    // Función para manejar la recarga manual
    const handleManualRefresh = () => {
        fetchData(pagination.currentPage);
    };

    // Componente de indicador de actualización
    const UpdateIndicator = () => (
        <div className="grid place-content-center">
            <div className="flex flex-row gap-3">
                <p className="text-xs font-thin">{getTimeSinceUpdate()}</p>
                <div
                    className="grid place-content-center cursor-pointer hover:text-green-500 transition-colors"
                    onClick={handleManualRefresh}
                >
                    <IoReloadOutline className={`${isLoading ? 'animate-spin text-green-500' : 'text-gray-500'}`} />
                </div>
            </div>
        </div>
    );

    return {
        activeTab,
        searchQuery,
        isLoading,
        loanData,
        error,
        pagination,
        fetchData,
        debouncedSearch,
        handleSearchChange,
        handlePageChange,
        formatDate,
        formatCurrency,
        setActiveTab,
        getTimeSinceUpdate,
        handleManualRefresh,
        UpdateIndicator
    };
}

export default useActives;