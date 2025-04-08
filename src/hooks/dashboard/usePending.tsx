"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoReloadOutline } from "react-icons/io5";

// Updated interfaces to match the actual API response
interface User {
    id: string;
    names: string;
    firstLastName: string;
    secondLastName?: string;
    avatar: string;
    email: string;
    phone: string;
    // Additional fields not used in the current UI
}

interface Document {
    id: string;
    userId: string;
    typeDocument: string;
    number: string;
    documentSides: string;
    imageWithCC: string;
    // Other fields not shown in the UI
}

interface LoanApplication {
    id: string;
    userId: string;
    cantity: string;
    entity: string;
    bankNumberAccount: string;
    created_at: string;
    status: string;
    // Additional fields not used in the current UI
}

interface LoanItem {
    id: string;
    userId: string;
    employeeId: string;
    cantity: string;
    entity: string;
    bankSavingAccount: boolean;
    bankNumberAccount: string;
    status: string;
    created_at: string;
    // Additional fields from the API
    fisrt_flyer: string | null;
    second_flyer: string | null;
    third_flyer: string | null;
    signature: string;
    // The nested objects
    user: User & {
        Document: Document[];
    };
}

interface ApiResponse {
    data: {
        data: LoanItem[];
        total: number;
    };
}

function usePending() {
    const router = useRouter()
    const [pendingLoans, setPendingLoans] = useState<LoanItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalLoans, setTotalLoans] = useState<number>(0);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [updateInterval, setUpdateInterval] = useState<NodeJS.Timeout | null>(null);

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

    useEffect(() => {
        fetchPendingLoans();
    }, [currentPage, pageSize]);

    const fetchPendingLoans = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get<ApiResponse>(
                `/api/dash/active?page=${currentPage}&pageSize=${pageSize}`
            );

            console.log("loans res: ", response.data);

            if (response.data && response.data.data) {
                setPendingLoans(response.data.data.data);
                setTotalLoans(response.data.data.total);
                // Actualizar el timestamp de última actualización
                setLastUpdated(new Date());
            } else {
                setError("Error al cargar las solicitudes: respuesta inválida");
                setPendingLoans([]);
            }
        } catch (err) {
            setError("Error al conectar con el servidor");
            setPendingLoans([]);
        } finally {
            setLoading(false);
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
        fetchPendingLoans();
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
                    <IoReloadOutline className={`${loading ? 'animate-spin text-green-500' : 'text-gray-500'}`} />
                </div>
            </div>
        </div>
    );

    const formatCurrency = (value: string) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(parseFloat(value));
    };

    const formatBankName = (bankCode: string) => {
        const banks: Record<string, string> = {
            "bancolombia": "Bancolombia",
            "banco-bogota": "Banco de Bogotá",
            "davivienda": "Davivienda",
            "bbva": "BBVA"
            // Add more banks as needed
        };

        return banks[bankCode] || bankCode;
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const totalPages = Math.ceil(totalLoans / pageSize);

    return {
        pendingLoans,
        loading,
        error,
        currentPage,
        pageSize,
        totalLoans,
        fetchPendingLoans,
        formatCurrency,
        formatBankName,
        handlePageChange,
        totalPages,
        router,
        // Exportar nuevas funciones y componentes para la actualización dinámica
        UpdateIndicator,
        getTimeSinceUpdate,
        handleManualRefresh
    }
}

export default usePending;