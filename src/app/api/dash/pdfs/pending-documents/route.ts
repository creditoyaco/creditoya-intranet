import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get(`${process.env.GATEWAY_API}/pdfs/pending-documents`);
    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error al obtener documentos pendientes:', error);
    return NextResponse.json({ success: false, error: 'Error al obtener los documentos' }, { status: 500 });
  }
}
