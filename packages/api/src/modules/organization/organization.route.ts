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
  .post(
    "/socials", 
    async ({ organizationService, user, body }) => {
      return organizationService.updateSocials(body, user.id);
    },
    {
      body: t.Object({
        facebook: t.Optional(t.String()),
        instagram: t.Optional(t.String()),
        twitterX: t.Optional(t.String()),
        tiktok: t.Optional(t.String()),
      }),
      authenticated: true,
    }
  )
  .get(
    "/myOrganization",
    async ({ organizationService, user }) => {
      return organizationService.getOrganizationByUserId(user.id);
    },
    {
      authenticated: true,
    }
  )
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
  .get(
    "/id/:id",
    async ({ params, organizationService }) => {
      return organizationService.getOrganizationById(params.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .delete(
    "/delete",
    async ({ organizationService, user }) => {
      return organizationService.deleteOrganization(user.id);
    },
    {
      authenticated: true,
    }
  );
