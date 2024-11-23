import { NextResponse } from "next/server";
import axios from "axios";


export async function POST(req: Request) {
    const { job_id } = await req.json(); // Change: Expect an object with job_id

    try {
        const statusResp = await axios.get(
            `${process.env.NEXT_NN_WEBSITE_URL}/api/upscaler/status/${job_id}`
        );
    
        const { status, error, ...results } = statusResp.data;
    
        return NextResponse.json({
            success: true,
            status,
            error,
            data: results
        });
    
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                status: "ERROR",
                error: "Failed to check status"
            },
            { status: error.response?.status || 500 }
        );
    }
}