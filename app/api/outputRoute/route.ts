import { NextResponse } from "next/server";
import axios from "axios";
import getServerUser from "@/helpers/getServerUser";

export async function POST(req: Request) {
  let body = await req.json();
  const user = await getServerUser();

  if (!user) {
    return NextResponse.redirect("/login");
  }

  let newBody = {
    ...body,
    email_id: user.email,
  };

  try {
    const resp = await axios.post(
      `${process.env.NEXT_NN_WEBSITE_URL}/output`,
      newBody
    );

    // Assuming success is determined solely by reaching this line without errors
    return NextResponse.json({
      success: true,
      data: resp.data,
    });
  } catch (error) {
    // Log the error or handle it as needed
    console.error(error);

    return NextResponse.json({
      success: false,
      data: "Oops! Something didn't work",
    });
  }
}
