import { NextResponse } from "next/server";
import axios from "axios";
import getServerUser from "@/helpers/getServerUser";

export async function POST(req: Request) {
  let formData = await req.formData();
  const user = await getServerUser();

  if (!user) {
    return NextResponse.redirect("/login");
  }

  const session_id = user.email + "_" + new Date().getTime();
  formData.append("email_id", user.email ?? "");
  formData.append("user_id", user.id ?? "");
  formData.append("session_id", session_id);

  const resp = await axios.post(
    `${process.env.NEXT_NN_WEBSITE_URL}/upload`,
    formData
  );

  if (resp.status !== 200) {
    return NextResponse.json({
      success: false,
      data: "Oops! Something didnt work",
    });
  }

  return NextResponse.json({
    success: true,
    data: {
      session_id,
      resp_data: resp.data,
    },
  });
}
