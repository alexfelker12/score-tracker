import { AuthForm } from "@/components/auth/auth-form";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { LogOutIcon } from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
// import { redirect } from "next/navigation";


export const metadata: Metadata = {
  title: "Sign up | BW Score Tracker",
  description: "Create an account to enter the app",
};


export default async function SignUp() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // if (session) {
  //   redirect("/")
  // }

  return (
    <main className="flex flex-col justify-center items-center space-y-4 p-4 w-full h-full">
      {session
        ?
        <Card className="text-center">
          <CardHeader>
            <CardTitle>You are signed in</CardTitle>
            <CardDescription>Sign out first to create a new account</CardDescription>
          </CardHeader>
          {/* <CardContent></CardContent> */}
          <CardFooter className="flex-wrap justify-center gap-2">

            {/* sign out */}
            <SignOutButton session={session} asChild>
              <Button className="gap-1.5" variant="outline">
                <LogOutIcon className="size-4" /> Sign out
              </Button>
            </SignOutButton>

          </CardFooter>
        </Card>
        :
        <AuthForm type="sign-up" />
      }
      {/* [&_a]:hover:text-primary [&_a]:underline [&_a]:underline-offset-4 */}
      {/* <div className="max-w-sm text-balance text-center text-muted-foreground text-xs">
        By clicking continue, you agree to our <Link href="/terms-of-service" className="hover:text-primary underline underline-offset-4">Terms of Service</Link> and <Link href="/privacy-policy" className="hover:text-primary underline underline-offset-4">Privacy Policy</Link>.
      </div> */}
    </main >
  );
}
