import { NextResponse } from 'next/server';
import axios from 'axios';
import { Status } from '@/types/loan';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status: Status = searchParams.get('status') as Status;

  try {
    const url = `${process.env.GATEWAY_API}/pdfs/loans-with-documents${status ? `?status=${status}` : ''}`;
    const response = await axios.get(url);

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error al obtener préstamos con documentos:', error);
    return NextResponse.json({ success: false, error: 'Error al obtener los préstamos' }, { status: 500 });
  }
}
