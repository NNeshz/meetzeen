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
    "/createOrUpdate",
    async ({ organizationService, user, body }) => {
      const hasImageChanged =
        body.hasImageChanged === "true" || body.hasImageChanged === true;

      const organizationData = {
        name: body.name,
        slugName: body.slugName,
        phoneNumber: body.phoneNumber,
        slogan: body.slogan,
        address: body.address,
        workDays: body.workDays,
        startHour: body.startHour,
        startMinute: body.startMinute,
        startAmPm: body.startAmPm,
        endHour: body.endHour,
        endMinute: body.endMinute,
        endAmPm: body.endAmPm,
        hasImageChanged,
      };

      let imageToProcess: File | string | null = null;

      if (hasImageChanged) {
        if (body.image instanceof File) {
          imageToProcess = body.image;
        } else {
          throw new Error(
            "Se esperaba un archivo de imagen pero se recibió texto"
          );
        }
      } else {
        if (typeof body.image === "string") {
          imageToProcess = body.image;
        } else {
          imageToProcess = null;
        }
      }

      return organizationService.createOrUpdateOrganization(
        {
          ...organizationData,
          image: imageToProcess,
        },
        user.id
      );
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3, maxLength: 100 }),
        image: t.Optional(t.Union([t.String(), t.File()])),
        slugName: t.String({ minLength: 3, maxLength: 50 }),
        phoneNumber: t.String({ minLength: 10, maxLength: 10 }),
        slogan: t.Optional(t.String()),
        address: t.Optional(t.String()),
        workDays: t.Array(t.String(), { minItems: 1 }),
        startHour: t.String(),
        startMinute: t.String(),
        startAmPm: t.String(),
        endHour: t.String(),
        endMinute: t.String(),
        endAmPm: t.String(),
        hasImageChanged: t.Union([t.Boolean(), t.String()]),
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
