import { NextResponse } from "next/server";
import axios from "axios";
import getServerUser from "@/helpers/getServerUser";

export async function POST(req: Request) {
  const user = await getServerUser();

  if (!user) {
    return NextResponse.redirect("/login");
  }

  try {
    const { job_id } = await req.json();
    const response = await axios.get(
      `${process.env.NEXT_NN_WEBSITE_URL}/api/downscaler/status/${job_id}`,
    );
    const { status, error, ...results } = response.data;

    return NextResponse.json({
        success: true,
        status,
        error,
        data: results
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        status: "ERROR",
        error: "Unable to process downscale request. Please try again after sometime",
      },
      { status: error.response?.status || 500 }
    );
  }
}