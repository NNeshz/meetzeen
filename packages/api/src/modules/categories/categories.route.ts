import Elysia, { t } from "elysia";
import { categoriesModule } from "@meetzeen/api/src/modules/categories/categories.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export interface CategoriesFilters {
  search?: string;
  page?: number;
}

const categoriesFiltersSchema = t.Object({
  search: t.Optional(t.String()),
  page: t.Optional(t.Numeric({ minimum: 1 })),
});

export const categoriesRoute = new Elysia({
  name: "categoriesRoute",
  prefix: "/categories",
})
  .use(betterAuthPlugin)
  .use(categoriesModule)
  .post(
    "/create",
    async ({ categoriesService, body, user }) => {
      return await categoriesService.createCategory(body.name, user.id);
    },
    {
      authenticated: true,
      body: t.Object({
        name: t.String(),
      }),
    }
  )
  .get(
    "/",
    ({ categoriesService, query, user }) =>
      categoriesService.listCategories(query, user.id),
    {
      authenticated: true,
      query: categoriesFiltersSchema,
    }
  )
  .put(
    "/:id",
    async ({ categoriesService, body, user, params }) => {
      return await categoriesService.updateCategory(
        params.id,
        body.name,
        user.id
      );
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.String(),
      }),
      authenticated: true,
    }
  )
  .delete(
    "/:id",
    async ({ categoriesService, body, user, params }) => {
      return await categoriesService.deleteCategory(params.id, user.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      authenticated: true,
    }
  );
