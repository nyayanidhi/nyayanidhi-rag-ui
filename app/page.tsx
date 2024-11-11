import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";
import getServerUser from "./helpers/getServerUser";
import { checkUser } from "./helpers/checkUser";


export default async function Home() {
  
  const user = await getServerUser();

  if (!user) {
    return redirect("/login");
  }

  const emailId = user.email ?? null;

  if (!emailId) {
    return redirect("/server-error");
  }

  const chkUser = await checkUser(emailId);

  if (!chkUser.success) {
    return redirect("/server-error");
  }

  return (
    <main>
      <Navbar />
    </main>
  );
}
