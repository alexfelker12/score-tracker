import { AuthForm } from "@/components/auth/auth-form";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";

export default async function Home() {
  // const session = await auth.api.getSession({
  //   headers: await headers()
  // })

  return (
    <main className="flex flex-col justify-center items-center space-y-4 p-4 h-full">
      <Suspense fallback={
        <div className="flex justify-center items-center w-full h-full">
          <Loader2Icon />
        </div>
      }>
        <AuthForm type="sign-up" />
      </Suspense>

      {/* [&_a]:hover:text-primary [&_a]:underline [&_a]:underline-offset-4 */}
      {/* <div className="max-w-sm text-balance text-center text-muted-foreground text-xs">
        By clicking continue, you agree to our <Link href="/terms-of-service" className="hover:text-primary underline underline-offset-4">Terms of Service</Link> and <Link href="/privacy-policy" className="hover:text-primary underline underline-offset-4">Privacy Policy</Link>.
      </div> */}

    </main>
  );
}
