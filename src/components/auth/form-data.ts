import { z } from "zod";

export const MINUSERNAMELENGTH = 1;
export const MINSIGNINPASSWORDLENGTH = 1;
export const MINSIGNUPPASSWORDLENGTH = 8;
export const MAXPASSWORDLENGTH = 32;

// const baseSchema = z.object({
//   email: z.string().email({ message: "Enter a valid email" }),
// });

export const signInFormSchema = z.object({
  username: z
  .string()
  .min(MINUSERNAMELENGTH, { message: `Username cannot be empty` }),
  password: z
    .string()
    .min(MINSIGNINPASSWORDLENGTH, { message: "Password cannot be empty" }),
  rememberMe: z
    .boolean()
});

export const signUpFormSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  username: z
    .string()
    .min(MINUSERNAMELENGTH, { message: `Your username should be at least ${MINUSERNAMELENGTH} characters long` }),
  password: z
    .string()
    .min(MINSIGNUPPASSWORDLENGTH, { message: `Your password must be at least ${MINSIGNUPPASSWORDLENGTH} characters long` })
    .max(MAXPASSWORDLENGTH, { message: `Your password should not exceed ${MAXPASSWORDLENGTH} characters` }),
});

export const signInDefaultValues: z.infer<typeof signInFormSchema> = {
  username: "",
  password: "",
  rememberMe: false
};

export const signUpDefaultValues: z.infer<typeof signUpFormSchema> = {
  email: "",
  password: "",
  username: "",
};
