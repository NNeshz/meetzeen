import Elysia, { t } from "elysia";
import { companyModule } from "@meetzeen/api/src/modules/company/company.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export const companyRoute = new Elysia({
  name: "companyRoute",
})
  .use(betterAuthPlugin)
  .use(companyModule)
  .post(
    "/company",
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
