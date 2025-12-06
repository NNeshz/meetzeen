import Elysia, { t } from "elysia";
import { serviceModule } from "@meetzeen/api/src/modules/service/service.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export const serviceRoutes = new Elysia({
  name: "serviceRoutes",
  prefix: "/services",
})
  .use(betterAuthPlugin)
  .use(serviceModule)
  .get(
    "/",
    ({ serviceService, query }) => {
      return serviceService.getAllServices(
        query.organizationId,
        query.includeCategory === "true"
      );
    },
    {
      auth: true,
      query: t.Object({
        organizationId: t.String(),
        includeCategory: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/:id",
    ({ serviceService, params, query }) => {
      return serviceService.getServiceById(
        params.id,
        query.organizationId,
        query.includeCategory === "true"
      );
    },
    {
      auth: true,
      query: t.Object({
        organizationId: t.String(),
        includeCategory: t.Optional(t.String()),
      }),
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .post(
    "/",
    ({ serviceService, body }) => {
      return serviceService.createService({
        name: body.name,
        serviceCategoryId: body.serviceCategoryId || null,
        description: body.description || null,
        price: body.price,
        duration: body.duration,
        discount: body.discount || null,
        organizationId: body.organizationId,
      });
    },
    {
      auth: true,
      body: t.Object({
        name: t.String(),
        serviceCategoryId: t.Optional(t.String()),
        description: t.Optional(t.String()),
        price: t.Union([t.String(), t.Number()]),
        duration: t.Number(),
        discount: t.Optional(t.Number()),
        organizationId: t.String(),
      }),
    }
  )
  .put(
    "/:id",
    ({ serviceService, params, body }) => {
      return serviceService.updateService(params.id, body.organizationId, {
        name: body.name,
        serviceCategoryId: body.serviceCategoryId,
        description: body.description,
        price: body.price,
        duration: body.duration,
        discount: body.discount,
      });
    },
    {
      auth: true,
      body: t.Object({
        name: t.Optional(t.String()),
        serviceCategoryId: t.Optional(t.Union([t.String(), t.Null()])),
        description: t.Optional(t.Union([t.String(), t.Null()])),
        price: t.Optional(t.Union([t.String(), t.Number()])),
        duration: t.Optional(t.Number()),
        discount: t.Optional(t.Union([t.Number(), t.Null()])),
        organizationId: t.String(),
      }),
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .delete(
    "/:id",
    ({ serviceService, params, body }) => {
      return serviceService.deleteService(params.id, body.organizationId);
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
