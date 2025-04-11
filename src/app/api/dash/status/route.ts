import { NextResponse } from 'next/server';
import axios from 'axios';
import { Status } from '@/types/loan';

// Define a comprehensive type for the API response
interface ApiResponse {
    success: boolean;
    data?: any[];
    error?: string;
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
    status?: string;
}

export async function GET(request: Request) {
    // Extract query parameters from URL
    const { searchParams } = new URL(request.url);
    const status: Status = searchParams.get('status') as Status;
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 10;
    const searchQuery = searchParams.get('search') || undefined;

    try {
        let endpoint = '';

        // Map status to appropriate endpoint
        switch (status) {
            case "Aprobado":
                endpoint = 'approved';
                break;
            case "Pendiente":
                endpoint = 'pending';
                break;
            case "Aplazado":
                endpoint = 'deferred';
                break;
            case "Borrador":
                endpoint = 'draft';
                break;
            case "Archivado":
                endpoint = 'archived';
                break;
            case "New-cantity":
                endpoint = 'new-cantity';
                break;
            default:
                return NextResponse.json({
                    success: false,
                    error: `Estado inválido: ${status}`
                }, { status: 400 });
        }

        // Build URL with query parameters
        const queryParams = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString()
        });

        if (searchQuery) {
            queryParams.append('search', searchQuery);
        }

        const url = `${process.env.GATEWAY_API}/loans/${endpoint}?${queryParams.toString()}`;
        console.log(`Making request to: ${url}`);

        // Make request to API
        const response = await axios.get(url);
        const responseData = response.data;

        // Validate response data
        if (!responseData || !responseData.data) {
            throw new Error('Invalid response format from API');
        }

        // Transform data to match expected frontend format
        const transformedData = Array.isArray(responseData.data)
            ? responseData.data.map(transformLoanData)
            : [];

        // Use the total from the backend response
        const total = responseData.total || transformedData.length;
        const totalPages = Math.ceil(total / pageSize);

        // Build successful response
        const apiResponse: ApiResponse = {
            success: true,
            data: transformedData,
            total,
            page,
            pageSize,
            totalPages,
            status
        };

        return NextResponse.json(apiResponse);
    } catch (error) {
        console.error('API route error:', error);

        // Handle error and build error response
        const apiResponse: ApiResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido'
        };

        return NextResponse.json(apiResponse, { status: 500 });
    }
}

// Helper function to transform loan data for frontend
function transformLoanData(item: any) {
    // Safely extract document information
    const documentInfo = item.user?.Document?.[0] || {};

    return {
        user: {
            names: item.user?.names || 'No definido',
            firstLastName: item.user?.firstLastName || 'No definido',
            secondLastName: item.user?.secondLastName || 'No definido',
            currentCompanie: item.user?.currentCompanie || 'no',
            city: item.user?.city || 'No definido'
        },
        document: {
            typeDocument: documentInfo.typeDocument || 'No definido',
            number: documentInfo.number || 'No definido'
        },
        loanApplication: {
            id: item.id,
            cantity: item.cantity,
            newCantity: item.newCantity,
            newCantityOpt: item.newCantityOpt,
            status: item.status,
            created_at: item.created_at,
            reasonChangeCantity: item.reasonChangeCantity,
            reasonReject: item.reasonReject,
            entity: item.entity
        }
    };
}