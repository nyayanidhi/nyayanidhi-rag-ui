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
    // Initial request to start processing
    const resp = await axios.post(
      `${process.env.NEXT_NN_WEBSITE_URL}/api/upscaler`,
      {
        ...body,
        user_email: user.email,
      }
    );

    // Get job_id from response
    const { job_id } = resp.data;

    // Poll for results
    
    
    while (true) {
      const statusResp = await axios.get(
        `${process.env.NEXT_NN_WEBSITE_URL}/api/upscaler/status/${job_id}`
      );

      const { status, error, ...results } = statusResp.data;

      if (status === "COMPLETED") {
        return NextResponse.json({
          success: true,
          data: results,
        });
      }

      if (status === "ERROR") {
        return NextResponse.json(
          {
            success: false,
            data: error || "Failed to process upscaler request",
          },
          { status: 500 }
        );
      }

      await new Promise(resolve => setTimeout(resolve, 5000));
    }

  } catch (error: any) {
    console.error(error);
    
    // Handle subscription error (403)
    if (error.response?.status === 403) {
      return NextResponse.json(
        {
          success: false,
          data: "Please check your subscription plan",
        },
        { status: 403 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        data: "Failed to process upscaler request",
      },
      { status: error.response?.status || 500 }
    );
  }
}