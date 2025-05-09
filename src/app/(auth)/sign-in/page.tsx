import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

import { auth } from "@/lib/auth";

import { AuthForm } from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightFromLineIcon, LogOutIcon } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Sign in | BW Score Tracker",
  description: "Authorize to enter the app",
};


export default async function SignIn() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <main className="flex flex-col justify-center items-center space-y-4 p-4 w-full h-full">
      {session
        ?
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Already signed in</CardTitle>
            <CardDescription>Sign out or enter app to continue</CardDescription>
          </CardHeader>
          {/* <CardContent></CardContent> */}
          <CardFooter className="flex-wrap justify-center gap-2">

            <div className="flex justify-center gap-4 h-11">
              {/* sign out */}
              <SignOutButton session={session} asChild>
                <Button className="gap-1.5" variant="outline">
                  <LogOutIcon className="size-4" /> Sign out
                </Button>
              </SignOutButton>

              <Separator orientation="vertical" className="-mt-1" />

              {/* enter app */}
              <Button asChild>
                <Link href="/"> Enter App <ArrowRightFromLineIcon className="size-4" /> </Link>
              </Button>
            </div>

            {/* create an account - /sign-up page */}
            <Link
              href="/sign-up"
              className="p-1 text-muted-foreground text-sm hover:text-secondary-foreground underline-offset-4 hover:underline transition-colors"
            >
              Create an account
            </Link>

          </CardFooter>
        </Card>
        :
        <AuthForm type="sign-in" />
      }

      {/* [&_a]:hover:text-primary [&_a]:underline [&_a]:underline-offset-4 */}
      {/* <div className="max-w-sm text-balance text-center text-muted-foreground text-xs">
        By clicking continue, you agree to our <Link href="/terms-of-service" className="hover:text-primary underline underline-offset-4">Terms of Service</Link> and <Link href="/privacy-policy" className="hover:text-primary underline underline-offset-4">Privacy Policy</Link>.
      </div> */}
    </main>
  );
}
