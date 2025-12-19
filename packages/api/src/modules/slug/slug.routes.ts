import Elysia, { t } from "elysia";
import { slugModule } from "@meetzeen/api/src/modules/slug/slug.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export const slugRoutes = new Elysia({
  name: "slugRoutes",
  prefix: "/slug",
})
  .use(betterAuthPlugin)
  .use(slugModule)
  .get("/company", async ({ slugService, query }) => {
    return slugService.getCompanyBySlug(query.slug);
  }, {
    query: t.Object({
      slug: t.String({ minLength: 1 }),
    }),
  })
  .get(
    "/availability",
    async ({ slugService, query }) => {
      return slugService.getAvailability(
        query.companyId,
        query.services,
        query.clientTimeZone,
        query.clientCurrentTime,
        query.startDate,
        query.endDate
      );
    },
    {
      query: t.Object({
        companyId: t.String({ minLength: 1 }),
        services: t.Array(t.String({ minLength: 1 }), { minItems: 1 }),
        clientTimeZone: t.String({ minLength: 1 }),
        clientCurrentTime: t.String({ minLength: 1 }),
        startDate: t.Optional(
          t.String({
            pattern: "^\\d{4}-\\d{2}-\\d{2}$",
            description: "Fecha de inicio en formato YYYY-MM-DD",
          })
        ),
        endDate: t.Optional(
          t.String({
            pattern: "^\\d{4}-\\d{2}-\\d{2}$",
            description: "Fecha de fin en formato YYYY-MM-DD",
          })
        ),
      }),
    }
  );
