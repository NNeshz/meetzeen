import Elysia, { t } from "elysia";
import { companyModule } from "@meetzeen/api/src/modules/company/company.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export const companyRoutes = new Elysia({
  name: "companyRoute",
  prefix: "/company",
})
  .use(betterAuthPlugin)
  .use(companyModule)
  .get(
    "/allCompanies",
    ({ companyService, user, request }) => {
      return companyService.getAllCompanies(user.id);
    },
    {
      auth: true,
    }
  )
  .post(
    "/",
    ({ companyService, body, user, request }) => {
      return companyService.createCompany(
        body.companyName,
        body.timezone,
        body.currency,
        user.id,
        request.headers
      );
    },
    {
      auth: true,
      body: t.Object({
        companyName: t.String(),
        timezone: t.String(),
        currency: t.String(),
      }),
    }
  )
  .get(
    "/getCompany",
    ({ companyService, query }) => {
      return companyService.getCompany(query.organizationId);
    },
    {
      auth: true,
      query: t.Object({
        organizationId: t.String(),
      }),
    },
  )
  .put(
    "/changeSlug",
    ({ companyService, body }) => {
      return companyService.updateCompanySlug(body.slug, body.organizationId);
    },
    {
      auth: true,
      body: t.Object({
        slug: t.String(),
        organizationId: t.String(),
      }),
    }
  )
  .put(
    "/changeName",
    ({ companyService, body }) => {
      return companyService.updateCompanyName(body.companyName, body.organizationId);
    },
    {
      auth: true,
      body: t.Object({
        companyName: t.String(),
        organizationId: t.String(),
      }),
    }
  )
  .put(
    "/changeTimezone",
    ({ companyService, body }) => {
      return companyService.updateCompanyTimezone(body.timezone, body.organizationId);
    },
    {
      auth: true,
      body: t.Object({
        timezone: t.String(),
        organizationId: t.String(),
      }),
    }
  )
  .put(
    "/changeCurrency",
    ({ companyService, body }) => {
      return companyService.updateCompanyCurrency(body.currency, body.organizationId);
    },
    {
      auth: true,
      body: t.Object({
        currency: t.String(),
        organizationId: t.String(),
      }),
    }
  )
  .put(
    "/changeWorkdays",
    ({ companyService, body }) => {
      return companyService.updateCompanyWorkdays(body.workdays, body.organizationId);
    },
    {
      auth: true,
      body: t.Object({
        workdays: t.Array(t.Number()),
        organizationId: t.String(),
      }),
    }
  )
  .put(
    "/changeStartHour",
    ({ companyService, body }) => {
      return companyService.updateStartHour(body.startHour, body.startMinute, body.organizationId);
    },
    {
      auth: true,
      body: t.Object({
        startHour: t.Number(),
        startMinute: t.Number(),
        organizationId: t.String(),
      }),
    }
  )
  .put(
    "/changeEndHour",
    ({ companyService, body }) => {
      return companyService.updateEndHour(body.endHour, body.endMinute, body.organizationId);
    },
    {
      auth: true,
      body: t.Object({
        endHour: t.Number(),
        endMinute: t.Number(),
        organizationId: t.String(),
      }),
    }
  )
  .put(
    "/changeLocation",
    ({ companyService, body }) => {
      return companyService.updateLocation(body.location, body.organizationId);
    },
    {
      auth: true,
      body: t.Object({
        location: t.String(),
        organizationId: t.String(),
      }),
    }
  )
  .put(
    "/changeSocialLinks",
    ({ companyService, body }) => {
      return companyService.updateSocialLinks(body.socialLinks, body.organizationId);
    },
    {
      auth: true,
      body: t.Object({
        socialLinks: t.Object({
          facebookLink: t.Optional(t.String()),
          instagramLink: t.Optional(t.String()),
          whatsappLink: t.Optional(t.String()),
          tiktokLink: t.Optional(t.String()),
        }),
        organizationId: t.String(),
      }),
    }
  )