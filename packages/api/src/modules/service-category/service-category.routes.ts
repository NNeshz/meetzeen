import Elysia, { t } from "elysia";
import { serviceCategoryModule } from "@meetzeen/api/src/modules/service-category/service-category.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export const serviceCategoryRoutes = new Elysia({
  name: "serviceCategoryRoutes",
  prefix: "/serviceCategories",
})
  .use(betterAuthPlugin)
  .use(serviceCategoryModule)
  .get(
    "/",
    ({ serviceCategoryService, query }) => {
      return serviceCategoryService.getAllServiceCategories(query.organizationId);
    },
    {
      auth: true,
      query: t.Object({
        organizationId: t.String(),
      }),
    }
  )
  .get(
    "/:id",
    ({ serviceCategoryService, params, query }) => {
      return serviceCategoryService.getServiceCategoryById(
        params.id,
        query.organizationId
      );
    },
    {
      auth: true,
      query: t.Object({
        organizationId: t.String(),
      }),
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .post(
    "/",
    ({ serviceCategoryService, body }) => {
      return serviceCategoryService.createServiceCategory(
        body.name,
        body.organizationId
      );
    },
    {
      auth: true,
      body: t.Object({
        name: t.String(),
        organizationId: t.String(),
      }),
    }
  )
  .put(
    "/:id",
    ({ serviceCategoryService, params, body }) => {
      return serviceCategoryService.updateServiceCategory(
        params.id,
        body.organizationId,
        { name: body.name }
      );
    },
    {
      auth: true,
      body: t.Object({
        name: t.String(),
        organizationId: t.String(),
      }),
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .delete(
    "/:id",
    ({ serviceCategoryService, params, body }) => {
      return serviceCategoryService.deleteServiceCategory(
        params.id,
        body.organizationId
      );
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
