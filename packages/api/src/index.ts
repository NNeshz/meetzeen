import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import "./utils/envs";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";
import { companyRoutes } from "@meetzeen/api/src/modules/company/company.routes";
import { serviceCategoryRoutes } from "@meetzeen/api/src/modules/service-category/service-category.routes";
import { serviceRoutes } from "@meetzeen/api/src/modules/service/service.routes";

export const api = new Elysia({
  prefix: "/api",
})
  .use(betterAuthPlugin)
  .use(
    cors({
      origin: process.env.NEXT_PUBLIC_FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Authorization", "Content-Type"],
    })
  )
  .use(companyRoutes)
  .use(serviceCategoryRoutes)
  .use(serviceRoutes)

export type Api = typeof api;
