"use client"

//* react/next
import Link from 'next/link'
import React from 'react'

//* packages
import { zodResolver } from "@hookform/resolvers/zod"
import type { ErrorContext } from 'better-auth/react'
import { useForm } from "react-hook-form"
import { z } from "zod"

//* lib
import { signIn, signUp } from '@/lib/auth-client'

//* icons
import { GoogleIcon } from '@/components/icons/google-logo'
import { LoaderCircleIcon } from 'lucide-react'

//* components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Form, FormField } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"

//* local
import { useRouter } from 'next/navigation'
import { AuthFormEmail, AuthFormErrors, AuthFormRememberMe, AuthFormSignInPassword, AuthFormSignUpPassword, AuthFormSubmitButton, AuthFormUsername } from './auth-form-fields'
import { signInDefaultValues, signInFormSchema, signUpDefaultValues, signUpFormSchema } from './form-data'
import { formTextData } from './text-data'
import { toast } from 'sonner'

export type AuthFormProps = {
  type: "sign-in" | "sign-up"
}

export type AuthFormBaseProps = {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const AuthForm = ({ type }: AuthFormProps) => {
  const [loading, setLoading] = React.useState<boolean>(false)

  const FormComp = type === "sign-in" ? AuthFormSignIn : AuthFormSignUp

  return (
    <Card className='w-full max-w-sm'>
      {/* -- login form header */}
      <CardHeader className='text-center'>
        <h1 className='font-bold text-2xl'>{formTextData[type].mainHeader}</h1>
        <p className='text-muted-foreground text-sm'>{formTextData[type].subHeader}</p>
      </CardHeader>

      {/* -- login options */}
      <CardContent className='space-y-6'>
        {/* credential login */}
        <FormComp
          loading={loading}
          setLoading={setLoading}
        />

        {/* login options divider */}
        <div className='relative'>
          <Separator />
          <span className='top-1/2 left-1/2 absolute bg-card px-2 text-muted-foreground text-sm -translate-x-1/2 -translate-y-1/2'>or continue with</span>
        </div>

        {/* alternative/social logins */}
        <AuthFormSocials type={type} loading={loading} setLoading={setLoading} />
      </CardContent>

      {/* -- login form footer */}
      <CardFooter className='w-full text-center text-sm'>
        <span className='w-full'>{formTextData[type].pageSwitchPhrase}{" "}
          <Link className='underline underline-offset-4' href={type === "sign-in" ? "/sign-up" : "/sign-in"}>
            {formTextData[type].pageSwitchLink}
          </Link>
        </span>
      </CardFooter>
    </Card>
  )
}

export type AuthFormSignInProps = AuthFormBaseProps & {}
export const AuthFormSignIn = ({ loading, setLoading }: AuthFormSignInProps) => {
  const [credentialsLoading, setCredentialsLoading] = React.useState<boolean>(false)
  const router = useRouter()

  const type = "sign-in"
  const schema = signInFormSchema
  const defaultValues = signInDefaultValues

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  //* login with credentials
  function onSubmit(values: z.infer<typeof schema>) {
    setLoading(true)
    setCredentialsLoading(true)

    const { username, password, rememberMe } = values

    signIn.username({
      username,
      password,
      rememberMe,
      fetchOptions: {
        onError: (ctx: ErrorContext) => {
          form.setError("root", { message: ctx.error.message })
        },
        // ctx: ResponseContext
        onResponse: () => {
          setLoading(false)
          setCredentialsLoading(false)
        },
        // ctx: SuccessContext
        onSuccess() {
          router.push("/")
        },
      }
    })

  }

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* auth error message */}
        {form.formState.errors.root &&
          <AuthFormErrors
            title={formTextData[type].rootErrorTitle}
            description={form.formState.errors.root.message}
          />
        }

        {/* email field */}
        <FormField control={form.control}
          name="username"
          render={({ field }) => (
            <AuthFormUsername {...field} />
          )}
        />

        {/* password field */}
        <FormField control={form.control}
          name="password"
          render={({ field }) => (
            <AuthFormSignInPassword {...field} />
          )}
        />

        {/* remember login */}
        <FormField control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <AuthFormRememberMe {...field} />
          )}
        />

        {/* Login - Submit */}
        <AuthFormSubmitButton
          loading={loading}
          credentialsLoading={credentialsLoading}
          buttonText={formTextData[type].submitButton}
        />

      </form>
    </Form>
  )
}

export type AuthFormSignUpProps = AuthFormBaseProps & {}
export const AuthFormSignUp = ({ loading, setLoading }: AuthFormSignUpProps) => {
  const [credentialsLoading, setCredentialsLoading] = React.useState<boolean>(false)

  const type = "sign-up"
  const schema = signUpFormSchema
  const defaultValues = signUpDefaultValues

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  //* Sign up with credentials
  function onSubmit(values: z.infer<typeof schema>) {
    setLoading(true)
    setCredentialsLoading(true)

    const { email, password, username } = values

    signUp.email({
      email,
      password,
      username,
      name: username,
      callbackURL: "/",
      fetchOptions: {
        onError: (ctx: ErrorContext) => {
          form.setError("root", {
            message: ctx.error.message
          })
        },
        // ctx: ResponseContext
        onResponse: () => {
          setLoading(false)
          setCredentialsLoading(false)
        },
      }
    })

  }

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* auth error message */}
        {form.formState.errors.root &&
          <AuthFormErrors
            title={formTextData[type].rootErrorTitle}
            description={form.formState.errors.root.message}
          />
        }

        {/* username field */}
        <FormField control={form.control}
          name="username"
          render={({ field }) => (
            <AuthFormUsername {...field} />
          )}
        />

        {/* email field */}
        <FormField control={form.control}
          name="email"
          render={({ field }) => (
            <AuthFormEmail {...field} />
          )}
        />

        {/* new password field */}
        <FormField control={form.control}
          name="password"
          render={({ field }) => (
            <AuthFormSignUpPassword {...field} />
          )}
        />

        {/* submit */}
        <AuthFormSubmitButton
          loading={loading}
          credentialsLoading={credentialsLoading}
          buttonText={formTextData[type].submitButton}
        />

      </form>
    </Form>
  )
}

export type AuthFormSocialsProps = AuthFormProps & AuthFormBaseProps & {}
export const AuthFormSocials = ({ type, loading, setLoading }: AuthFormSocialsProps) => {
  const [socialsLoading, setSocialsLoading] = React.useState<boolean>(false)

  //* sign up/in with socials
  // google
  //? e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  function handleGoogleSignIn() {
    setLoading(true)
    setSocialsLoading(true)

    signIn.social({
      provider: "google",
      callbackURL: "/",
      fetchOptions: {
        onError: (ctx: ErrorContext) => {
          toast.error(type === "sign-in" ? "Sign-in failed" : "Sign-up failed", {
            description: ctx.error.message
          })
        },
        //? ctx: ResponseContext
        onResponse: () => {
          setLoading(false)
          setSocialsLoading(false)
        },
      }
    })
  }

  return (
    <div>
      {/* alternative/social logins */}
      <Button
        className='w-full'
        size='sm'
        variant='outline'
        disabled={loading || socialsLoading}
        onClick={handleGoogleSignIn}
      >
        {socialsLoading
          ? <LoaderCircleIcon className="animate-spin" />
          : <GoogleIcon />
        }
        <span>
          {formTextData[type].googleButton}
        </span>
      </Button>
    </div>
  )
}
