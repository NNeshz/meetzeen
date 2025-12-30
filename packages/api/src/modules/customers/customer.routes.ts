import Elysia, { t } from "elysia";
import { customerModule } from "@meetzeen/api/src/modules/customers/customer.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export const customerRoutes = new Elysia({
  name: "customerRoutes",
  prefix: "/customers",
})
  .use(betterAuthPlugin)
  .use(customerModule)
  .get(
    "/",
    ({ customerService, query }) => {
      return customerService.getAllCustomers(
        query.organizationId,
        query.limit,
        query.offset,
        query.search,
        query.sortBy
      );
    },
    {
      auth: true,
      query: t.Object({
        organizationId: t.String(),
        limit: t.Optional(t.Number()),
        offset: t.Optional(t.Number()),
        search: t.Optional(t.String()),
        sortBy: t.Optional(t.String()),
      }),
    }
  )
  .put(
    "/:id",
    ({ customerService, params, body }) => {
      return customerService.updateCustomer(body.organizationId, {
        id: params.id,
        name: body.name,
        lastName: body.lastName,
        email: body.email,
        phoneNumber: body.phoneNumber,
      });
    },
    {
      auth: true,
      body: t.Object({
        name: t.String(),
        lastName: t.String(),
        email: t.String(),
        phoneNumber: t.Optional(t.String()),
        organizationId: t.String(),
      }),
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .delete(
    "/:id",
    ({ customerService, params, body }) => {
      return customerService.deleteCustomer(params.id, body.organizationId);
    },
    {
      auth: true,
      body: t.Object({
        organizationId: t.String(),
      }),
      params: t.Object({
        id: t.String(),
      }),
    }
  );
