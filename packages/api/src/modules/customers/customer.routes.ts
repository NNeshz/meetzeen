import Elysia, { t } from "elysia";
import { customerModule } from "@meetzeen/api/src/modules/customers/customer.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export const customerRoutes = new Elysia({
  name: "customerRoutes",
  prefix: "/customers",
})
  .use(betterAuthPlugin)
  .use(customerModule)