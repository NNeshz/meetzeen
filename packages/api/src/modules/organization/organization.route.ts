import Elysia, { t } from "elysia";
import { organizationModule } from "@meetzeen/api/src/modules/organization/organization.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export const organizationRoute = new Elysia({
  name: "organizationRoute",
  prefix: "/organization",
})
  .use(betterAuthPlugin)
  .use(organizationModule)
    .post(
    "/create", 
    async ({ organizationService, user, body }) => {
      return organizationService.createOrganization(body, user.id);
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3, maxLength: 100 }),
        timezone: t.String({ minLength: 1 }),
        currency: t.String({ minLength: 3, maxLength: 3 }),
      }),
      authenticated: true,
    }
  )
  // PANTALLAS INDIVIDUALES
  .get("/settings", async ({ organizationService, user }) => {
    return organizationService.getOrganizationSettings(user.id)
  }, {
    authenticated: true,
  })
  .get("/image", async ({ organizationService, user }) => {
    return organizationService.getOrganizationImage(user.id);
  }, {
    authenticated: true,
  })
  .get("/contact", async ({ organizationService, user }) => {
    return organizationService.getOrganizationContact(user.id);
  }, {
    authenticated: true,
  })

  // PATCH DE SETTINGS
  .patch("/name", async ({ organizationService, user, body }) => {
    return organizationService.updateOrganizationName(user.id, body.name);
  }, {
    body: t.Object({
      name: t.String({ minLength: 3, maxLength: 100 }),
    }),
    authenticated: true,
  })
  .patch("/timezone", async ({ organizationService, user, body }) => {
    return organizationService.updateOrganizationTimezone(user.id, body.timezone);
  }, {
    body: t.Object({
      timezone: t.String({ minLength: 1 }),
    }),
    authenticated: true,
  })
  .patch("/currency", async ({ organizationService, user, body }) => {
    return organizationService.updateOrganizationCurrency(user.id, body.currency);
  }, {
    body: t.Object({
      currency: t.String({ minLength: 3, maxLength: 3 }),
    }),
    authenticated: true,
  })

  .get(
    "/org/:slugName",
    async ({ params, organizationService }) => {
      return organizationService.getOrganizationBySlugName(params.slugName);
    },
    {
      params: t.Object({
        slugName: t.String(),
      }),
    }
  )
  .get("/services/:slugName", async ({ params, organizationService }) => {
    return organizationService.getServicesBySlugName(params.slugName);
  })
