import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const loanId = searchParams.get('loanId');

        // Build query string if parameters exist
        let queryString = '';
        if (userId || loanId) {
            queryString = '?';
            if (userId) queryString += `userId=${userId}`;
            if (userId && loanId) queryString += '&';
            if (loanId) queryString += `loanId=${loanId}`;
        }

        const response = await axios.get(
            `${process.env.GATEWAY_API}/pdfs/never-downloaded${queryString}`
        );

        return NextResponse.json({
            data: response.data
        });
    } catch (error) {
        console.error("Error fetching never downloaded documents:", error);

        if (axios.isAxiosError(error)) {
            return NextResponse.json(
                { error: error.response?.data?.message || 'Error fetching documents' },
                { status: error.response?.status || 500 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}