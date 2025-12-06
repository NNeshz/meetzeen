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
  );
