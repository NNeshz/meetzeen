import Elysia, { t } from "elysia";
import { companyModule } from "@meetzeen/api/src/modules/company/company.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export const companyRoute = new Elysia({
  name: "companyRoute",
  prefix: "/company",
})
  .use(betterAuthPlugin)
  .use(companyModule)
  .post(
    "/create",
    async ({ request, companyService, user }) => {
      if (!user) {
        throw new Error("Usuario no autenticado");
      }
      const form = await request.formData();
      return companyService.createCompany(form, user.id);
    },
    {
      authenticated: true,
    }
  )
  .get(
    "/my-company",
    async ({ companyService, user }) => {
      if (!user) {
        throw new Error("Usuario no autenticado");
      }
      return companyService.getCompanyByUserId(user.id);
    },
    {
      authenticated: true,
    }
  )
  // TODO: Obtener empresa por nombre, no por id
  .get(
    "/:id",
    async ({ params, companyService }) => {
      return companyService.getCompanyById(params.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .put(
    "/update",
    async ({ request, companyService, user }) => {
      if (!user) {
        throw new Error("Usuario no autenticado");
      }
      const form = await request.formData();
      return companyService.updateCompany(form, user.id);
    },
    {
      authenticated: true,
    }
  )
  .delete(
    "/delete",
    async ({ companyService, user }) => {
      if (!user) {
        throw new Error("Usuario no autenticado");
      }
      return companyService.deleteCompany(user.id);
    },
    {
      authenticated: true,
    }
  )