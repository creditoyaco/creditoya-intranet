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
    const documentNumber = searchParams.get('documentNumber') || undefined;

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

        // Construir la URL con los parámetros de consulta
        let url = `${process.env.GATEWAY_API}/loans/${endpoint}?page=${page}&pageSize=${pageSize}`;

        // Añadir el número de documento si está presente
        if (documentNumber) {
            url += `&documentNumber=${documentNumber}`;
        }

        console.log(`Making request to: ${url}`);

        // Realizar la petición a la API según el estado
        const response = await axios.get(url);

        // Log the response for debugging
        console.log(`Received response with ${response.data?.data?.length || 0} items`);

        // Transform the data to match the expected format in the frontend
        let transformedData = [];

        if (response.data && response.data.data && Array.isArray(response.data.data)) {
            transformedData = response.data.data.map((item: any) => ({
                user: {
                    names: item.user.names,
                    firstLastName: item.user.firstLastName,
                    secondLastName: item.user.secondLastName,
                    currentCompanie: item.user.currentCompanie,
                    city: item.user.city
                },
                document: {
                    typeDocument: item.user.Document && item.user.Document[0] ? item.user.Document[0].typeDocument : 'No definido',
                    number: item.user.Document && item.user.Document[0] ? item.user.Document[0].number : 'No definido'
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
            }));
        }

        // Construir la respuesta exitosa
        const apiResponse: ApiResponse = {
            success: true,
            data: transformedData
        };

        return NextResponse.json(apiResponse);
    } catch (error) {
        console.error('API route error:', error);

        // Manejar el error y construir la respuesta de error
        const apiResponse: ApiResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Error desconocido'
        };

        return NextResponse.json(apiResponse, { status: 500 });
    }
}