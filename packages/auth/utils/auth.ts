import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI, organization, phoneNumber } from "better-auth/plugins";

import twilio from "twilio"
import { PrismaClient } from "@meetzeen/database";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH;
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const prisma = new PrismaClient();

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  appName: "meetzeen",
  database: prismaAdapter(prisma, {
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
  session: {
    additionalFields: {
      activeOrganizationId: {
        type: "string",
        required: false,
      },
    },
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
  },
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          const membership = await prisma.member.findFirst({
            where: {
              userId: session.userId,
              role: { in: ["owner", "member"] },
            },
            select: { organizationId: true },
          });

          const orgId = membership?.organizationId ?? null;

          const sessionRecord = await prisma.session.findUnique({ where: { id: session.id } });
          
          if (sessionRecord?.activeOrganizationId !== orgId) {
            await prisma.session.update({
              where: { id: session.id },
              data: { activeOrganizationId: orgId },
            });
          }
        },
      },
      update: {
        after: async (session) => {
          const membership = await prisma.member.findFirst({
            where: {
              userId: session.userId,
              role: { in: ["owner", "member"] },
            },
            select: { organizationId: true },
          });

          const orgId = membership?.organizationId ?? null;

          const sessionRecord = await prisma.session.findUnique({ where: { id: session.id } });
          if (sessionRecord?.activeOrganizationId !== orgId) {
            await prisma.session.update({
              where: { id: session.id },
              data: { activeOrganizationId: orgId },
            });
          }
        },
      },
    },
  },
  plugins: [
    openAPI(),
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 1
    }),
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }) => {
        try {
          await twilioClient.verify.v2.services(TWILIO_VERIFY_SERVICE_SID as string)
            .verifications
            .create({ to: phoneNumber, channel: 'whatsapp', customCode: code });
          console.log("OTP sent to", phoneNumber, code);
        } catch (error) {
          console.error("This is the error: ", error);
          throw new Error("Failed to send OTP");
        }
      },
    }),
  ]
})