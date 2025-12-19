import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import "./utils/envs";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";
import { companyRoutes } from "@meetzeen/api/src/modules/company/company.routes";
import { serviceCategoryRoutes } from "@meetzeen/api/src/modules/service-category/service-category.routes";
import { serviceRoutes } from "@meetzeen/api/src/modules/service/service.routes";
import { invitationsRoutes } from "@meetzeen/api/src/modules/invitations/invitations.routes";
import { teamRoutes } from "@meetzeen/api/src/modules/team/team.routes";
import { slugRoutes } from "@meetzeen/api/src/modules/slug/slug.routes";
import { bookingRoutes } from "@meetzeen/api/src/modules/booking/booking.routes";
import { customerRoutes } from "@meetzeen/api/src/modules/customers/customer.routes";
import { appointmentsRoutes } from "@meetzeen/api/src/modules/appointments/appointments.routes";

export const api = new Elysia({
  prefix: "/api",
})
  .use(betterAuthPlugin)
  .use(
    cors({
      origin: [
        process.env.NEXT_PUBLIC_FRONTEND_URL,
        process.env.NEXT_PUBLIC_FRONTEND_WWW,
        process.env.NEXT_PUBLIC_BACKEND_URL,
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Authorization", "Content-Type"],
    })
  )
  .use(companyRoutes)
  .use(serviceCategoryRoutes)
  .use(serviceRoutes)
  .use(invitationsRoutes)
  .use(teamRoutes)
  .use(slugRoutes)
  .use(bookingRoutes)
  .use(customerRoutes)
  .use(appointmentsRoutes)

export type Api = typeof api;
