import { NextResponse } from "next/server";
import axios from "axios";
import Fuse from "fuse.js";

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
        const search = searchParams.get("search")?.trim().toLowerCase();

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

        const apiUrl = clientId
            ? `${baseUrl}/clients/${encodeURIComponent(clientId)}`
            : `${baseUrl}/clients?page=${page}&pageSize=${pageSize}`;

        // Fetch data
        const response = await axios.get(apiUrl, {
            headers: { Authorization: token },
            timeout: 5000 // 5 seconds timeout
        });

        // Process response
        let responseData = response.data;

        // Apply search filter if needed
        if (!clientId && search && Array.isArray(responseData.users)) {
            const filtered = filterClientData(responseData.users, search);
            responseData = {
                ...responseData,
                users: filtered,
                totalCount: filtered.length,
                filteredResults: true
            };
        }

        return NextResponse.json<ApiResponse<typeof responseData>>({
            success: true,
            data: responseData,
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

/**
 * Filters client data based on a search query using fuzzy search
 * @param clients - Array of client objects
 * @param query - Search query string
 * @returns Filtered array of clients
 */
function filterClientData(clients: Client[], query: string): Client[] {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return clients;

    const fuseOptions = {
        keys: [
            { name: "name", weight: 0.7 },      // Higher weight for name
            { name: "email", weight: 0.4 },     // Medium weight for email
            { name: "id", weight: 0.3 },        // Lower weight for ID
            { name: "phone", weight: 0.2 },     // Lower weight for phone
        ],
        threshold: 0.2,            // More strict matching (lower = more precise)
        distance: 100,             // Consider the entire field length
        ignoreLocation: true,      // Match can occur anywhere in the string
        includeScore: true,        // Include match score
        useExtendedSearch: true,   // Enable extended search
        minMatchCharLength: 2      // Minimum character length before considering a match
    };

    const fuse = new Fuse(clients, fuseOptions);
    const results = fuse.search(trimmedQuery);

    // Only return results with reasonable match quality (lower score = better match)
    return results
        .filter(result => result.score !== undefined && result.score < 0.5)
        .map(result => result.item);
}