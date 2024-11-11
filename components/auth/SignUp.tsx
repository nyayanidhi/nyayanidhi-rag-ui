"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const supabase = createClientComponentClient();

  const handleSignUp = async () => {

    const res = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    console.log("result of sign up is", res);
    router.refresh();
    setEmail("");
    setPassword("");
  };


  return (
    <>
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8 md:text-white"
          )}
        >
          Login
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 lg:flex dark:border-r">
          <div className="absolute inset-0 " />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Nyayanidhi
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Transform two weeks of legal effort into under 10
                minutes. Scale your practice 5x with cost-effective automation
                handling 80% of knowledge work.&rdquo;
              </p>
              <footer className="text-sm">Nyaya Nidhi</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8 flex items-center justify-center h-screen bg-white md:bg-zinc-900 md:text-white">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create your account
              </h1>
              <p className="text-sm hidden md:text-zinc-200">
                Enter your email below
              </p>
            </div>
            <div className={cn("grid gap-6")}>
              <form onSubmit={handleSignUp} className="">
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="email">
                      Email
                    </Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="email">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="password"
                      onChange={(e) => setPassword(e.target.value)}
                      autoCapitalize="none"
                      autoCorrect="off"
                      disabled={loading}
                      className="text-black dark:text-white"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-zinc-700 hover:bg-zinc-600"
                  >
                    {loading ? "Signing up..." : "Sign Up"}
                  </Button>
                </div>
              </form>

            </div>
            <p className="px-8 text-center text-sm text-muted-foreground hidden">
              By clicking continue, you agree to our{" "}
              <Link
                href="/"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
