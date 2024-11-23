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
    const resp = await axios.post(
      `${process.env.NEXT_NN_WEBSITE_URL}/api/upscaler`,
      {
        ...body,
        user_email: user.email,
      }
    );

    return NextResponse.json({
      success: true,
      data: resp.data,
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

    // Handle server error (500)
    if (error.response?.status === 500) {
      return NextResponse.json(
        {
          success: false,
          data: "Error processing request. Please try in sometime",
        },
        { status: 500 }
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