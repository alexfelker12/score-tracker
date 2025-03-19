export type FormTextProperties = {
  mainHeader: string
  subHeader: string
  submitButton: string
  googleButton: string
  pageSwitchPhrase: string
  pageSwitchLink: string
  pageSwitchHref: string
  rootErrorTitle: string
}

export type FormTextData = {
  "sign-in": FormTextProperties
  "sign-up": FormTextProperties
}

export const formTextData: FormTextData = {
  "sign-in": {
    mainHeader: "Login to your Account",
    subHeader: "Enter your credentials to login to your Account",
    submitButton: "Login",
    googleButton: "Sign in with Google",
    pageSwitchPhrase: "Don't have an Account?",
    pageSwitchLink: "Sign up",
    pageSwitchHref: "/sign-up",
    rootErrorTitle: "Login failed",
  },
  "sign-up": {
    mainHeader: "Create your Account",
    subHeader: "Enter your information below to sign up",
    submitButton: "Sign up",
    googleButton: "Sign up with Google",
    pageSwitchPhrase: "Already have an Account?",
    pageSwitchLink: "Sign in",
    pageSwitchHref: "/sign-in",
    rootErrorTitle: "Sign up failed",
  }
}