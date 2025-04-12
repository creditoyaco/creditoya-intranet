import axios from "axios";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST() {
  try {
    const response = await fetch(
      `${process.env.GATEWAY_API}/pdfs/generate-pending`,
      { method: 'POST' }
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generando documentos pendientes:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.message || 'Error en proceso batch' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}