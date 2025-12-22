import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, organization, magicLink } from "better-auth/plugins";
import {
  db,
  user,
  session,
  account,
  verification,
  organization as org,
  member,
  invitation,
} from "@meetzeen/database";
import { sendVerificationEmail } from "@meetzeen/auth/email";

const isProduction = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  appName: "meetzeen",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
      organization: org,
      member,
      invitation,
    },
  }),
  secret: process.env.AUTH_SECRET,
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
  trustedOrigins: [
    process.env.NEXT_PUBLIC_FRONTEND_URL as string,
    process.env.NEXT_PUBLIC_FRONTEND_WWW as string,
    process.env.NEXT_PUBLIC_BACKEND_URL as string,
  ],
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // Scopes adicionales para Google Calendar
      scope: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/calendar.events",
      ],
      // Necesario para obtener refresh_token y mantener acceso
      accessType: "offline",
      prompt: "consent",
    },
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      // IMPORTANTE: Esto se usa en producción para que las cookies se compartan entre los subdominios
      // En desarrollo, se puede omitir este campo
      domain: isProduction ? process.env.NEXT_PUBLIC_MEETZEEN : undefined,
    },
  },
  plugins: [
    openAPI(),
    organization({
      allowUserToCreateOrganization: true,
    }),
    magicLink({
      sendMagicLink: async ({ email, token }) => {
        await sendVerificationEmail(email, token);
      },
    }),
  ],
});
