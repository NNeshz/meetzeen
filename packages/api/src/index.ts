import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import "./utils/envs";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

import { organizationRoute } from "@meetzeen/api/src/modules/organization/organization.route";
import { categoriesRoute } from "@meetzeen/api/src/modules/categories/categories.route";
import { employeesRoute } from "@meetzeen/api/src/modules/employees/employees.route";
import { servicesRoute } from "@meetzeen/api/src/modules/services/services.route";

export const api = new Elysia({
  prefix: "/api",
})
.use(betterAuthPlugin)
.use(cors({
  origin: process.env.NEXT_PUBLIC_FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type"],
}))
.use(organizationRoute)
.use(categoriesRoute)
.use(employeesRoute)
.use(servicesRoute)

export type Api = typeof api;