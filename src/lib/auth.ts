import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/server/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // 5 minutes
    }
  },
  plugins: [
    username({
      minUsernameLength: 1
    })
  ]
})