"use client"

//* react/next
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

//* packages
import { zodResolver } from "@hookform/resolvers/zod"
import type { ErrorContext } from 'better-auth/react'
import { useForm } from "react-hook-form"
import { toast } from 'sonner'
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
import { AuthFormEmail, AuthFormErrors, AuthFormRememberMe, AuthFormSignInPassword, AuthFormSignUpPassword, AuthFormSubmitButton, AuthFormUsername } from './auth-form-fields'
import { signInDefaultValues, signInFormSchema, signUpDefaultValues, signUpFormSchema } from './form-data'
import { formTextData } from './text-data'
import { LabeledSeparator } from '../ui/labeled-separator'

export type AuthFormProps = {
  type: "sign-in" | "sign-up"
}

export type AuthFormBaseProps = {
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  callbackUrl: string
}

export const AuthForm = ({ type }: AuthFormProps) => {
  const [loading, setLoading] = React.useState<boolean>(false)

  const FormComp = type === "sign-in" ? AuthFormSignIn : AuthFormSignUp

  //* retreive "from" param for redirect to originating protected route if present else home
  const searchParams = useSearchParams()
  const fromProtectedRouteOrHome = searchParams.get("from") || "/"
  const originalParamsOrBlank = searchParams.toString() !== ""
    ? `?${searchParams.toString()}`
    : ""

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
          callbackUrl={fromProtectedRouteOrHome}
        />

        {/* login options divider */}
        <LabeledSeparator>or continue with</LabeledSeparator>

        {/* alternative/social logins */}
        <AuthFormSocials
          type={type}
          loading={loading}
          setLoading={setLoading}
          callbackUrl={fromProtectedRouteOrHome}
        />
      </CardContent>

      {/* -- login form footer */}
      <CardFooter className='w-full text-center text-sm'>
        <span className='w-full'>{formTextData[type].pageSwitchPhrase}{" "}
          <Link
            className='underline underline-offset-4'
            href={
              type === "sign-in"
                ? `/sign-up${originalParamsOrBlank}`
                : `/sign-in${originalParamsOrBlank}`
            }
          >
            {formTextData[type].pageSwitchLink}
          </Link>
        </span>
      </CardFooter>
    </Card>
  )
}

export type AuthFormSignInProps = AuthFormBaseProps & {}
export const AuthFormSignIn = ({ loading, setLoading, callbackUrl }: AuthFormSignInProps) => {
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
          router.push(callbackUrl)
          router.refresh()
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
        {
          //TODO: implement forgot password flow https://www.better-auth.com/docs/authentication/email-password
        }
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
export const AuthFormSignUp = ({ loading, setLoading, callbackUrl }: AuthFormSignUpProps) => {
  const [credentialsLoading, setCredentialsLoading] = React.useState<boolean>(false)
  const router = useRouter()

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
      // callbackURL: callbackUrl,
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
        // ctx: SuccessContext
        onSuccess() {
          //* default redirect to home page
          router.push(callbackUrl)
          router.refresh()
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
            <AuthFormSignUpPassword label="Password" {...field} />
          )}
        />

        {/* confirm password field */}
        <FormField control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <AuthFormSignUpPassword label="Confirm password" {...field} />
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
export const AuthFormSocials = ({ type, loading, setLoading, callbackUrl }: AuthFormSocialsProps) => {
  const [socialsLoading, setSocialsLoading] = React.useState<boolean>(false)
  // const router = useRouter()

  //* sign up/in with socials
  // google
  //? e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  function handleGoogleSignIn() {
    setLoading(true)
    setSocialsLoading(true)

    signIn.social({
      provider: "google",
      callbackURL: callbackUrl,
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
        // ctx: SuccessContext
        // onSuccess: () => {
        //   router.refresh()
        // },
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
