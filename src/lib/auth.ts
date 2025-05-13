import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/server/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  trustedOrigins: [
    // process.env.VERCEL_URL!, // only on production
    process.env.VERCEL_URL!,
    "http://192.168.178.71:3000",
    "https://bw-score-tracker.vercel.app/"
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
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
