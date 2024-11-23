import { NextResponse } from "next/server";
import axios from "axios";
import getServerUser from "@/helpers/getServerUser";

export async function POST(req: Request) {
  const body = await req.json();
  const user = await getServerUser();

  if (!user) {
    return NextResponse.redirect("/login");
  }

  try {
    // Initial request to start processing - just get the job_id
    const resp = await axios.post(
      `${process.env.NEXT_NN_WEBSITE_URL}/api/upscaler`,
      {
        ...body,
        user_email: user.email,
      }
    );

    // Return immediately with the job_id
    return NextResponse.json({
      success: true,
      jobId: resp.data.job_id,
    });

  } catch (error: any) {
    console.error(error);
    
    if (error.response?.status === 403) {
      return NextResponse.json(
        {
          success: false,
          data: "Please check your subscription plan",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        data: "Failed to start upscaler request",
      },
      { status: error.response?.status || 500 }
    );
  }
}
