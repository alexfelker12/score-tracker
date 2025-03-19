"use client"

import Link from 'next/link'

import { ControllerRenderProps } from 'react-hook-form'

import { LoaderCircleIcon, ShieldAlertIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"


export const AuthFormEmail = ({ ...field }: ControllerRenderProps) => {
  // const field = useFormField()

  //* email field
  return (
    <FormItem className="space-y-1">
      <FormLabel className="data-[error=true]:text-destructive">Email</FormLabel>
      <FormControl>
        <Input
          className="h-9"
          placeholder="m@example.com"
          type="email"
          autoComplete="email"
          {...field}
        />
      </FormControl>
      <FormMessage className="text-destructive" />
    </FormItem>
  )
}

export const AuthFormUsername = ({ ...field }: ControllerRenderProps) => {
  // const field = useFormField()

  //* username field
  return (
    <FormItem className="space-y-1">
      <FormLabel className="data-[error=true]:text-destructive">Username</FormLabel>
      <FormControl>
        <Input
          className="h-9"
          placeholder="John Doe"
          type="text"
          autoComplete="username"
          {...field}
        />
      </FormControl>
      <FormMessage className="text-destructive" />
    </FormItem>
  )
}

export const AuthFormSignInPassword = ({ ...field }: ControllerRenderProps) => {
  // const field = useFormField()

  //* password field
  return (
    <FormItem className="space-y-1">
      <FormLabel className="flex justify-between items-center data-[error=true]:text-destructive">
        <span>Password</span>
        {/* reset password */}
        <Button className="text-muted-foreground" variant="link" size="inline" asChild>
          <Link href="/reset-password">Forgot password?</Link>
        </Button>
      </FormLabel>
      <FormControl>
        <Input
          className="h-9"
          type="password"
          autoComplete="current-password"
          {...field}
        />
      </FormControl>
      <FormMessage className="text-destructive" />
    </FormItem>

  )
}

export const AuthFormSignUpPassword = ({ ...field }: ControllerRenderProps) => {
  // const field = useFormField()

  //* password field
  return (
    <FormItem className="space-y-1">
      <FormLabel className="flex justify-between items-center data-[error=true]:text-destructive">
        <span>Password</span>
      </FormLabel>
      <FormControl>
        <Input
          className="h-9"
          type="password"
          autoComplete="new-password"
          {...field}
        />
      </FormControl>
      <FormMessage className="text-destructive" />
    </FormItem>
  )
}

export const AuthFormRememberMe = ({ value, onChange, ...field }: ControllerRenderProps) => {
  // const field = useFormField()

  //* remember login
  return (
    <FormItem className="flex items-center gap-1 space-y-0 data-[error=true]:text-destructive">
      <FormControl className="mr-1">
        <Checkbox
          id="remember-me"
          value={`${value}`}
          onCheckedChange={onChange}
          {...field}
        />
      </FormControl>
      <FormLabel htmlFor="remember-me">
        Remember me
      </FormLabel>
      <FormMessage className="text-destructive" />
    </FormItem>
  )
}

export const AuthFormSubmitButton = ({
  loading,
  credentialsLoading,
  buttonText
}: {
  loading: boolean
  credentialsLoading: boolean
  buttonText: string
}) => {

  //* remember login
  return (
    <Button
      className="w-full"
      type="submit"
      size="sm"
      disabled={loading || credentialsLoading}
    >
      {credentialsLoading
        ? <LoaderCircleIcon className="animate-spin" />
        : buttonText
      }
    </Button>
  )
}

export const AuthFormErrors = ({
  title,
  description
}: {
  title: string
  description: string | undefined
}) => {

  //* remember login
  return (
    <Alert variant="destructive">
      <ShieldAlertIcon className="size-5" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}
