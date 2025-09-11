import Elysia, { t } from "elysia";
import { servicesModule } from "@meetzeen/api/src/modules/services/services.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export interface ServicesFilters {
  search?: string;
  page?: number;
  categoryId?: string;
}

const servicesFiltersSchema = t.Object({
  search: t.Optional(t.String()),
  page: t.Optional(t.Numeric({ minimum: 1 })),
  categoryId: t.Optional(t.String()),
});

const serviceBodySchema = t.Object({
  name: t.String({ minLength: 1 }),
  duration: t.String({ minLength: 1 }),
  price: t.Numeric({ minimum: 0 }),
  categoryId: t.String({ minLength: 1 }),
});

export const servicesRoute = new Elysia({
  name: "servicesRoute",
  prefix: "/services",
})
  .use(betterAuthPlugin)
  .use(servicesModule)
  .post(
    "/create",
    async ({ servicesService, body, user }) => {
      return await servicesService.createService(
        body.name,
        body.duration,
        body.price,
        body.categoryId,
        user.id
      );
    },
    {
      authenticated: true,
      body: serviceBodySchema,
    }
  )
  .get(
    "/",
    ({ servicesService, query, user }) =>
      servicesService.listServices(query, user.id),
    {
      authenticated: true,
      query: servicesFiltersSchema,
    }
  )
  .get(
    "/:id",
    async ({ servicesService, params, user }) => {
      return await servicesService.getServiceById(params.id, user.id);
    },
    {
      authenticated: true,
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .put(
    "/:id",
    async ({ servicesService, body, user, params }) => {
      return await servicesService.updateService(
        params.id,
        body.name,
        body.duration,
        body.price,
        body.categoryId,
        user.id
      );
    },
    {
      authenticated: true,
      params: t.Object({
        id: t.String(),
      }),
      body: serviceBodySchema,
    }
  )
  .delete(
    "/:id",
    async ({ servicesService, params, user }) => {
      return await servicesService.deleteService(params.id, user.id);
    },
    {
      authenticated: true,
      params: t.Object({
        id: t.String(),
      }),
    }
  );