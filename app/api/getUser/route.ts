import { NextResponse } from "next/server";
import getServerUser from "@/helpers/getServerUser";

export async function GET(req: Request) {
  const user = await getServerUser();

  if (!user) {
    return NextResponse.redirect("/login");
  }

  const retuser = {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  return NextResponse.json({
    success: true,
    User: retuser,
  });
}
