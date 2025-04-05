// /api/auth/intranet.ts
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
        
        // Extraer los datos de la respuesta
        const { accessToken, user } = response.data;
        
        // Crear la respuesta con la cookie
        const apiResponse: ApiResponse = {
            success: true,
            data: response.data
        };
        
        // Crear la respuesta
        const res = NextResponse.json(apiResponse);
        
        // Establecer la cookie en la respuesta
        res.cookies.set({
            name: '@creditoya:token',
            value: accessToken,
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 día en segundos
        });
        
        return res;
    } catch (error) {
        // Manejar el error y construir la respuesta de error
        const apiResponse: ApiResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido'
        };
        
        return NextResponse.json(apiResponse, { status: 500 });
    }
}