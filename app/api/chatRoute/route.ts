import { NextResponse } from "next/server";
import axios from "axios";
import getServerUser from "@/helpers/getServerUser";

export async function POST(req: Request) {
  let body = await req.json();
  const user = await getServerUser();

  if (!user) {
    return NextResponse.redirect("/login");
  }

  try {
    const resp = await axios.post(
      `${process.env.NEXT_NN_WEBSITE_URL}/moreinfo`,
      body
    );
    return NextResponse.json({
      success: true,
      data: resp.data,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      data: "Oops! Something didnt work",
    });
  }
}
