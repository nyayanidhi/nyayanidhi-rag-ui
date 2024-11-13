import { NextResponse } from "next/server";
import axios from "axios";
import getServerUser from "@/helpers/getServerUser";

export async function GET(req: Request) {
  const user = await getServerUser();

  if (!user) {
    return NextResponse.redirect("/login");
  }

  try {
    const resp = await axios.get(
      `${process.env.NEXT_NN_WEBSITE_URL}/api/user-plan`,
      {
        params: {
          email: user.email
        }
      }
    );

    return NextResponse.json({
      success: true,
      data: resp.data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      data: "Failed to fetch user plan details",
    });
  }
}