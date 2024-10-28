import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";


export default async function Home() {

    return redirect("/login");
 



  return (
    <main>
     <Navbar />
    </main>
  );
}
