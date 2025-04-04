import { NextResponse } from 'next/server';
import axios from 'axios';
import { Status } from '@/types/loan';

// Define una interfaz para la respuesta
interface ApiResponse {
  success: boolean;
  data?: any;
  error?: any;
}

interface statusLoan {
  status: Status
  reason?: string;
}

export async function PATCH(request: Request) {
  try {
    // Extraer los parámetros de consulta de la URL
    const { searchParams } = new URL(request.url);
    const loanId = searchParams.get('loan_id');

    if (!loanId) {
      return NextResponse.json({ success: false, error: 'loan_id es requerido' }, { status: 400 });
    }

    // Extraer el cuerpo de la solicitud
    const requestBody: { status: Status } = await request.json();

    // Hacer la petición al backend de NestJS
    const response = await axios.patch(`${process.env.GATEWAY_API}/loans/${loanId}/status`, requestBody);

    if (response.data.success === false) throw new Error(response.data.error);

    // Construir la respuesta exitosa
    const apiResponse: ApiResponse = {
      success: true,
      data: response.data,
    };

    return NextResponse.json(apiResponse);
  } catch (error) {
    console.error('Error al cambiar el estado del préstamo:', error);

    // Manejar el error y construir la respuesta de error
    const apiResponse: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };

    return NextResponse.json(apiResponse, { status: 500 });
  }
}
