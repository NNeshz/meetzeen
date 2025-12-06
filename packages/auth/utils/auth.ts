import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI, organization } from "better-auth/plugins";
import { _prisma } from "@meetzeen/api/src/modules/prisma";

export const auth = betterAuth({
  appName: "meetzeen",
  database: prismaAdapter(_prisma, {
    provider: "postgresql"
  }),
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  trustedOrigins: [
    process.env.NEXT_PUBLIC_FRONTEND_URL as string,
    process.env.NEXT_PUBLIC_BACKEND_URL as string,
  ],
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      scope: ["email", "profile", "openid"]
    }
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
  },
  plugins: [
    openAPI(),
    organization({
      allowUserToCreateOrganization: true,
    })
  ]
})