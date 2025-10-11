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

  // PATCH DE IMAGE
  .patch("/image", async ({ organizationService, user, body }) => {
    return organizationService.updateOrganizationImage(user.id, body.image);
  }, {
    body: t.Object({
      image: t.File(),
    }),
    authenticated: true,
  })
  .patch("/slogan", async ({ organizationService, user, body }) => {
    return organizationService.updateOrganizationSlogan(user.id, body.slogan);
  }, {
    body: t.Object({
      slogan: t.String({ minLength: 3, maxLength: 100 }),
    }),
    authenticated: true,
  })
  .patch("/validateSlug", async ({ organizationService, body }) => {
    return organizationService.validateOrganizationSlug(body.slug);
  }, {
    body: t.Object({
      slug: t.String({ minLength: 3, maxLength: 100 }),
    }),
    authenticated: true,
  })
  .patch("/slug", async ({ organizationService, user, body }) => {
    return organizationService.updateOrganizationSlug(user.id, body.slug);
  }, {
    body: t.Object({
      slug: t.String({ minLength: 3, maxLength: 100 }),
    }),
    authenticated: true,
  })

  // PATCH DE CONTACT
  .patch("/address", async ({ organizationService, user, body }) => {
    return organizationService.updateOrganizationAddress(user.id, body.address);
  }, {
    body: t.Object({
      address: t.String({ minLength: 3, maxLength: 100 }),
    }),
    authenticated: true,
  })
  .patch("/phoneNumber", async ({ organizationService, user, body }) => {
    return organizationService.updateOrganizationPhoneNumber(user.id, body.phoneNumber);
  }, {
    body: t.Object({
      phoneNumber: t.String({ minLength: 7, maxLength: 15 }),
    }),
    authenticated: true,
  })
  .patch("/start", async ({ organizationService, user, body }) => {
    return organizationService.updateOrganizationStart(user.id, body);
  }, {
    body: t.Object({
      startHour: t.Number({ min: 0, max: 23 }),
      startMinute: t.Number({ min: 0, max: 59 }),
      startAmPm: t.String({ minLength: 2, maxLength: 2 }),
    }),
    authenticated: true,
  })
  .patch("/end", async ({ organizationService, user, body }) => {
    return organizationService.updateOrganizationEnd(user.id, body);
  }, {
    body: t.Object({
      endHour: t.Number({ min: 0, max: 23 }),
      endMinute: t.Number({ min: 0, max: 59 }),
      endAmPm: t.String({ minLength: 2, maxLength: 2 }),
    }),
    authenticated: true,
  })
  .patch("/workdays", async ({ organizationService, user, body }) => {
    return organizationService.updateOrganizationWorkdays(user.id, body.workdays);
  }, {
    body: t.Object({
      workdays: t.Array(t.Number({ min: 0, max: 6 })),
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
