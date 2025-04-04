import { NextResponse } from 'next/server';
import axios from 'axios';

// Define una interfaz para la respuesta
interface ApiResponse {
  success: boolean;
  data?: any;
  error?: any;
}

export async function GET(request: Request) {
  // Extraer los parámetros de consulta de la URL
  const { searchParams } = new URL(request.url);
  const loanId = searchParams.get('loan_id');
  
  try {
    // Realizar la petición a la API de préstamos pendientes
    const response = await axios.get(
      `${process.env.GATEWAY_API}/loans/${loanId}`
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