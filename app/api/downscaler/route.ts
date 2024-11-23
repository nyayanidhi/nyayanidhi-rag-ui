import { NextResponse } from "next/server";
import axios from "axios";
import getServerUser from "@/helpers/getServerUser";

export async function POST(req: Request) {
  const user = await getServerUser();

  if (!user) {
    return NextResponse.redirect("/login");
  }

  try {
    const formData = await req.formData();
    if (user.email) {
      formData.append("user_email", user.email);
    }

    const resp = await axios.post(
      `${process.env.NEXT_NN_WEBSITE_URL}/api/downscaler`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return NextResponse.json({
      success: true,
      jobId: resp.data.job_id,
    });
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
        data: "Failed to process downscaler request. Please try again",
      },
      { status: error.response?.status || 500 }
    );
  }
}