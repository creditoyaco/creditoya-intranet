import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('document_id');
    
    // We need to handle the file download differently since we're returning a binary file
    const response = await axios.get(
      `${process.env.GATEWAY_API}/pdfs/document/${documentId}`,
      { responseType: 'arraybuffer' }
    );
    
    // Forward the headers and binary content
    return new NextResponse(response.data, {
      headers: {
        'Content-Type': response.headers['content-type'],
        'Content-Disposition': response.headers['content-disposition'],
        'Content-Length': response.headers['content-length'],
      }
    });
  } catch (error) {
    console.error("Error downloading document:", error);
    
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.message || 'Error downloading document' },
        { status: error.response?.status || 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}