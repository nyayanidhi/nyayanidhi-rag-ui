import { NextResponse } from "next/server";
import axios from "axios";
import getServerUser from "@/helpers/getServerUser";

export async function POST(req: Request) {
  let body = await req.json();
  const user = await getServerUser();

  if (!user) {
    return NextResponse.redirect("/login");
  }

  const resp = await axios.post(
    `${process.env.NEXT_NN_WEBSITE_URL}/choose`,
    body
  );

  if (resp.status !== 200) {
    return NextResponse.json({
      success: false,
      data: "Oops! Something didnt work",
    });
  }

  return NextResponse.json({
    success: true,
    data: resp.data,
  });
}
