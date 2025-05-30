import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const response = await axios.post(`${process.env.GATEWAY_API}/pdfs/generate/promissory-note`, body);
        return NextResponse.json({ success: true, data: response.data });
    } catch (error) {
        console.error('Error al generar pagaré:', error);
        return NextResponse.json({ success: false, error: 'Error al generar pagaré' }, { status: 500 });
    }
}
