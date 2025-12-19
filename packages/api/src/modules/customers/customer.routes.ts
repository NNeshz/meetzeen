import Elysia, { t } from "elysia";
import { customerModule } from "@meetzeen/api/src/modules/customers/customer.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export const customerRoutes = new Elysia({
  name: "customerRoutes",
  prefix: "/customers",
})
  .use(betterAuthPlugin)
  .use(customerModule)
  .get("/", ({ customerService, query }) => {
    return customerService.getAllCustomers(query.organizationId);
  }, {
    auth: true,
    query: t.Object({
      organizationId: t.String(),
      limit: t.Optional(t.Number()),
      offset: t.Optional(t.Number()),
      search: t.Optional(t.String()),
      sortBy: t.Optional(t.String()),
    }),
  })