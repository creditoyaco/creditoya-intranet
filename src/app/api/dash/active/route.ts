import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Define una interfaz para la respuesta
interface ApiResponse {
  success: boolean;
  data?: any;
  error?: any;
}

export async function GET(request: NextRequest) {
  // Extraer los parámetros de consulta de la URL
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('pageSize')) || 5;

  const token = request.cookies.get('TOKEN_KEY')?.value;

  try {
    // Realizar la petición a la API de préstamos pendientes
    const response = await axios.get(
      `${process.env.GATEWAY_API}/loans/pending?page=${page}&pageSize=${pageSize}`,
      { headers: { Authorization: `Bearer ${token}` } }
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