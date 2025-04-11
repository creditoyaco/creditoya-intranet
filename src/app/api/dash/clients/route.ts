import { NextResponse } from "next/server";
import axios from "axios";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

interface Client {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    [key: string]: any; // For any additional properties
}

interface ClientsResponse {
    users: Client[];
    totalCount: number;
    [key: string]: any; // For any additional properties
}

export async function GET(request: Request) {
    try {
        // Parse URL parameters
        const { searchParams } = new URL(request.url);
        const clientId = searchParams.get("client_id");
        const page = Number(searchParams.get("page") || "1");
        const pageSize = Number(searchParams.get("pageSize") || "10");
        const search = searchParams.get("search");

        // Validate pagination parameters
        if (!Number.isInteger(page) || !Number.isInteger(pageSize) || page < 1 || pageSize < 1) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: "Parámetros de paginación inválidos" },
                { status: 400 }
            );
        }

        // Extract authorization token
        const token = request.headers.get("Authorization");
        if (!token) {
            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: "Token de autorización no proporcionado" },
                { status: 401 }
            );
        }

        // Build API URL
        const baseUrl = process.env.GATEWAY_API;
        if (!baseUrl) {
            throw new Error("GATEWAY_API environment variable is not defined");
        }

        // Construir la URL con los parámetros
        let apiUrl = clientId
            ? `${baseUrl}/clients/${encodeURIComponent(clientId)}`
            : `${baseUrl}/clients?page=${page}&pageSize=${pageSize}`;

        // Añadir el parámetro de búsqueda si existe
        if (!clientId && search) {
            apiUrl += `&search=${encodeURIComponent(search.trim())}`;
        }

        // Fetch data
        const response = await axios.get(apiUrl, {
            headers: { Authorization: token },
            timeout: 5000 // 5 seconds timeout
        });

        // Return the response data directly from the backend
        return NextResponse.json<ApiResponse<typeof response.data>>({
            success: true,
            data: response.data,
        });

    } catch (error) {
        console.error("Error fetching clients:", error);

        // Handle specific error types
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const message = error.response?.data?.message || error.message;

            return NextResponse.json<ApiResponse<null>>(
                { success: false, error: `Error de API: ${message}` },
                { status }
            );
        }

        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: error instanceof Error ? error.message : "Error desconocido" },
            { status: 500 }
        );
    }
}