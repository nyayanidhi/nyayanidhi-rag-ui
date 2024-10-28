import SignUpForm from "@/components/auth/SignUp";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignUp() {
  

  return <SignUpForm />;
}
