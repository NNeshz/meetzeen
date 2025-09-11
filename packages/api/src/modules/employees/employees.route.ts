import Elysia, { t } from "elysia";
import { employeesModule } from "@meetzeen/api/src/modules/employees/employees.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export interface EmployeesFilters {
  page?: number;
  search?: string;
  categoryId?: string;
}

export const employeesRoute = new Elysia({
  name: "employeesRoute",
  prefix: "/employees",
})
  .use(betterAuthPlugin)
  .use(employeesModule)
  .post(
    "/create",
    async ({ employeesService, user, body }) => {
      let imageToProcess: File | null = null;

      if (body.image instanceof File) {
        imageToProcess = body.image;
      }

      // Convertir categoryIds de string a array
      const categoryIdsArray = body.categoryIds
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0);

      return employeesService.createEmployee(
        {
          name: body.name,
          phoneNumber: body.phoneNumber,
          email: body.email,
          image: imageToProcess,
          categoryIds: categoryIdsArray,
        },
        user.id
      );
    },
    {
      body: t.Object({
        name: t.String({ minLength: 2, maxLength: 100 }),
        phoneNumber: t.String({ minLength: 10, maxLength: 15 }),
        email: t.String({ format: "email" }),
        image: t.Optional(t.File()),
        categoryIds: t.String({ minLength: 1 }), // Cambiado de Array a String
      }),
      authenticated: true,
    }
  )
  .get(
    "/list",
    async ({ employeesService, user, query }) => {
      const filters: EmployeesFilters = {
        page: query.page ? parseInt(query.page) : 1,
        search: query.search,
        categoryId: query.categoryId,
      };

      return employeesService.listEmployees(filters, user.id);
    },
    {
      query: t.Object({
        page: t.Optional(t.String()),
        search: t.Optional(t.String()),
        categoryId: t.Optional(t.String()),
      }),
      authenticated: true,
    }
  )
  .put(
    "/:id",
    async ({ employeesService, user, params, body }) => {
      const hasImageChanged =
        body.hasImageChanged === "true" || body.hasImageChanged === true;

      let imageToProcess: File | string | null = null;

      if (hasImageChanged) {
        if (body.image instanceof File) {
          imageToProcess = body.image;
        } else {
          imageToProcess = null;
        }
      } else {
        if (typeof body.image === "string") {
          imageToProcess = body.image;
        } else {
          imageToProcess = null;
        }
      }

      // Convertir categoryIds de string a array si se proporciona
      let categoryIdsArray: string[] | undefined;
      if (body.categoryIds) {
        categoryIdsArray = body.categoryIds
          .split(',')
          .map(id => id.trim())
          .filter(id => id.length > 0);
      }

      return employeesService.updateEmployee(
        params.id,
        {
          name: body.name,
          phoneNumber: body.phoneNumber,
          email: body.email,
          image: imageToProcess,
          categoryIds: categoryIdsArray,
          hasImageChanged,
        },
        user.id
      );
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.Optional(t.String({ minLength: 2, maxLength: 100 })),
        phoneNumber: t.Optional(t.String({ minLength: 10, maxLength: 15 })),
        email: t.Optional(t.String({ format: "email" })),
        image: t.Optional(t.Union([t.String(), t.File()])),
        categoryIds: t.Optional(t.String()), // Cambiado de Array a String
        hasImageChanged: t.Optional(t.Union([t.Boolean(), t.String()])),
      }),
      authenticated: true,
    }
  )
  .delete(
    "/:id",
    async ({ employeesService, user, params }) => {
      return employeesService.deleteEmployee(params.id, user.id);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      authenticated: true,
    }
  )
  .put(
    "/:id/schedule",
    async ({ employeesService, user, params, body }) => {
      return employeesService.updateEmployeeSchedule(
        params.id,
        body.schedules,
        user.id
      );
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        schedules: t.Array(
          t.Object({
            dayOfWeek: t.Number({ minimum: 0, maximum: 6 }),
            startTime: t.String(),
            endTime: t.String(),
          })
        ),
      }),
      authenticated: true,
    }
  );
