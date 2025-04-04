import { NextResponse } from 'next/server';
import axios from 'axios';

// Define una interfaz para la respuesta
interface ApiResponse {
    success: boolean;
    data?: any;
    error?: any;
}

export async function POST(request: Request) {
    const { email, password } = await request.json();

    try {
        // Realizar la petición a la API de préstamos pendientes
        const response = await axios.post(
            `${process.env.GATEWAY_API}/auth/login/intranet`,
            { email, password }
        );

        // Construir la respuesta exitosa
        const apiResponse: ApiResponse = {
            success: true,
            data: response.data
        };

        return NextResponse.json(apiResponse);
    } catch (error) {
        // Manejar el error y construir la respuesta de error
        const apiResponse: ApiResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido'
        };

        return NextResponse.json(apiResponse, { status: 500 });
    }
}