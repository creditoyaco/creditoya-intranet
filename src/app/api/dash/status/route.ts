import { NextResponse } from 'next/server';
import axios from 'axios';
import { Status } from '@/types/loan';

// Define una interfaz para la respuesta
interface ApiResponse {
    success: boolean;
    data?: any;
    error?: any;
}

export async function GET(request: Request) {
    // Extraer los parámetros de consulta de la URL
    const { searchParams } = new URL(request.url);
    const status: Status = searchParams.get('status') as Status;
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 5;

    try {
        let endpoint = '';

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
                return NextResponse.json({ success: false, error: 'Estado inválido' }, { status: 400 });
        }

        // Realizar la petición a la API según el estado
        const response = await axios.get(
            `${process.env.GATEWAY_API}/loans/${endpoint}?page=${page}&pageSize=${pageSize}`
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