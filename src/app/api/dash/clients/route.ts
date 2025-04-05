import { NextResponse } from 'next/server';
import axios from 'axios';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const clientId = searchParams.get('client_id');
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '8', 10);
        
        // Extract the authorization header from the incoming request
        const authHeader = request.headers.get('authorization');
        
        if (isNaN(page) || isNaN(pageSize) || page < 1 || pageSize < 1) {
            return NextResponse.json(
                { success: false, error: 'Parámetros de paginación inválidos' },
                { status: 400 }
            );
        }
        
        let apiUrl = `${process.env.GATEWAY_API}/clients?page=${page}&pageSize=${pageSize}`;
        if (clientId) {
            apiUrl = `${process.env.GATEWAY_API}/clients/${clientId}`;
        }
        
        console.log(`Fetching data from: ${apiUrl}`);
        
        // Forward the authorization header to the gateway API
        const response = await axios.get(apiUrl, {
            headers: authHeader ? { Authorization: authHeader } : {}
        });
        
        return NextResponse.json<ApiResponse<any>>({
            success: true,
            data: response.data
        });
        
    } catch (error) {
        console.error('Error fetching clients:', error);
        
        return NextResponse.json<ApiResponse<null>>(
            { success: false, error: error instanceof Error ? error.message : 'Error desconocido' },
            { status: 500 }
        );
    }
}