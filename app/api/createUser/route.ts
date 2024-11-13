import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const resp = await axios.post(
      `${process.env.NEXT_NN_WEBSITE_URL}/api/create-user`,
      { email }
    );

    return NextResponse.json({
      success: true,
      data: resp.data,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}