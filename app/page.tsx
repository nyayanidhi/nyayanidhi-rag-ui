import { redirect } from "next/navigation";

import Navbar from "@/components/Navbar";
import { checkUser } from "@/helpers/checkUser";
import getServerUser from "@/helpers/getServerUser";
import Dashboard from "@/components/dashboard/Dashboard";

export default async function Home() {
  const user = await getServerUser();

  if (!user) {
    return redirect("/login");
  }

  const emailId = user.email ?? null;

  
  if (!emailId) {
  return redirect("/server-error");
  }



  return (
    <main>
      <Navbar />
      <Dashboard />
    </main>
  );
}
