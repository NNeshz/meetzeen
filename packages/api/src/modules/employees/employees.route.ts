import Elysia, { t } from "elysia";
import { employeesModule } from "@meetzeen/api/src/modules/employees/employees.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export interface EmployeesFilters {
  page?: number;
  search?: string;
  categoryId?: string;
}
const TIME_24H_PATTERN = "^(?:[01]\\d|2[0-3]):[0-5]\\d$";

const ScheduleByDaySchema = t.Object({
  lunes: t.Optional(
    t.Array(
      t.Object({
        start: t.String({ pattern: TIME_24H_PATTERN }),
        end: t.String({ pattern: TIME_24H_PATTERN }),
      })
    )
  ),
  martes: t.Optional(
    t.Array(
      t.Object({
        start: t.String({ pattern: TIME_24H_PATTERN }),
        end: t.String({ pattern: TIME_24H_PATTERN }),
      })
    )
  ),
  miercoles: t.Optional(
    t.Array(
      t.Object({
        start: t.String({ pattern: TIME_24H_PATTERN }),
        end: t.String({ pattern: TIME_24H_PATTERN }),
      })
    )
  ),
  jueves: t.Optional(
    t.Array(
      t.Object({
        start: t.String({ pattern: TIME_24H_PATTERN }),
        end: t.String({ pattern: TIME_24H_PATTERN }),
      })
    )
  ),
  viernes: t.Optional(
    t.Array(
      t.Object({
        start: t.String({ pattern: TIME_24H_PATTERN }),
        end: t.String({ pattern: TIME_24H_PATTERN }),
      })
    )
  ),
  sabado: t.Optional(
    t.Array(
      t.Object({
        start: t.String({ pattern: TIME_24H_PATTERN }),
        end: t.String({ pattern: TIME_24H_PATTERN }),
      })
    )
  ),
  domingo: t.Optional(
    t.Array(
      t.Object({
        start: t.String({ pattern: TIME_24H_PATTERN }),
        end: t.String({ pattern: TIME_24H_PATTERN }),
      })
    )
  ),
});

const ScheduleArraySchema = t.Array(
  t.Object({
    dayOfWeek: t.Number({ minimum: 1, maximum: 7 }),
    startTime: t.String({ pattern: TIME_24H_PATTERN }),
    endTime: t.String({ pattern: TIME_24H_PATTERN }),
  })
);

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
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id.length > 0);

      return employeesService.createEmployee(
        {
          name: body.name,
          phoneNumber: body.phoneNumber,
          email: body.email,
          image: imageToProcess,
          categoryIds: categoryIdsArray,
          schedules: body.schedules, // pasa los horarios al servicio
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
        categoryIds: t.String({ minLength: 1 }), // string separado por comas
        schedules: t.Optional(
          t.Union([ScheduleByDaySchema, ScheduleArraySchema])
        ),
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
      params: t.Object({ id: t.String() }),
      body: t.Object({
        schedules: t.Array(
          t.Object({
            dayOfWeek: t.Number({ minimum: 1, maximum: 7 }),
            startTime: t.String({ pattern: TIME_24H_PATTERN }),
            endTime: t.String({ pattern: TIME_24H_PATTERN }),
          })
        ),
      }),
      authenticated: true,
    }
  )
  // LISTAR horarios del empleado
  .get(
    "/:id/schedule",
    async ({ employeesService, user, params }) => {
      return employeesService.listEmployeeSchedules(params.id, user.id);
    },
    {
      params: t.Object({ id: t.String() }),
      authenticated: true,
    }
  )
  // CREAR entrada individual
  .post(
    "/:id/schedule",
    async ({ employeesService, user, params, body }) => {
      return employeesService.createEmployeeScheduleEntry(params.id, user.id, body);
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        dayOfWeek: t.Number({ minimum: 1, maximum: 7 }),
        startTime: t.String({ pattern: TIME_24H_PATTERN }),
        endTime: t.String({ pattern: TIME_24H_PATTERN }),
        order: t.Optional(t.Number()),
        isActive: t.Optional(t.Boolean()),
      }),
      authenticated: true,
    }
  )
  // ACTUALIZAR entrada individual
  .patch(
    "/:id/schedule/:scheduleId",
    async ({ employeesService, user, params, body }) => {
      return employeesService.updateEmployeeScheduleEntry(
        params.id,
        params.scheduleId,
        user.id,
        body
      );
    },
    {
      params: t.Object({ id: t.String(), scheduleId: t.String() }),
      body: t.Object({
        dayOfWeek: t.Optional(t.Number({ minimum: 1, maximum: 7 })),
        startTime: t.Optional(t.String({ pattern: TIME_24H_PATTERN })),
        endTime: t.Optional(t.String({ pattern: TIME_24H_PATTERN })),
        order: t.Optional(t.Number()),
        isActive: t.Optional(t.Boolean()),
      }),
      authenticated: true,
    }
  )
  // ELIMINAR entrada individual
  .delete(
    "/:id/schedule/:scheduleId",
    async ({ employeesService, user, params }) => {
      return employeesService.deleteEmployeeScheduleEntry(
        params.id,
        params.scheduleId,
        user.id
      );
    },
    {
      params: t.Object({ id: t.String(), scheduleId: t.String() }),
      authenticated: true,
    }
  )
  // REEMPLAZAR horarios por día específico
  .put(
    "/:id/schedule/day/:dayOfWeek",
    async ({ employeesService, user, params, body }) => {
      const day = parseInt(params.dayOfWeek, 10);
      return employeesService.replaceEmployeeDaySchedules(
        params.id,
        day,
        body,
        user.id
      );
    },
    {
      params: t.Object({ id: t.String(), dayOfWeek: t.String() }),
      body: t.Array(
        t.Object({
          startTime: t.String({ pattern: TIME_24H_PATTERN }),
          endTime: t.String({ pattern: TIME_24H_PATTERN }),
          order: t.Optional(t.Number()),
          isActive: t.Optional(t.Boolean()),
        })
      ),
      authenticated: true,
    }
  )
  // ACTUALIZACIÓN CONDICIONAL: solo ese día, repetir N semanas, o todos los días
  .put(
    "/:id/schedule/conditional",
    async ({ employeesService, user, params, body }) => {
      return employeesService.conditionalUpdateEmployeeSchedules(
        params.id,
        {
          selectedDate: body.selectedDate,
          schedules: body.schedules,
          onlyThisDay: body.onlyThisDay === true,
          repeatWeeks: body.repeatWeeks,
        },
        user.id
      );
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        selectedDate: t.Optional(t.String()), // "YYYY-MM-DD"
        schedules: t.Array(
          t.Object({
            startTime: t.String({ pattern: TIME_24H_PATTERN }),
            endTime: t.String({ pattern: TIME_24H_PATTERN }),
            order: t.Optional(t.Number()),
            isActive: t.Optional(t.Boolean()),
          })
        ),
        onlyThisDay: t.Optional(t.Boolean()),
        repeatWeeks: t.Optional(t.Number({ minimum: 1, maximum: 52 })),
      }),
      authenticated: true,
    }
  )
  .get(
    "/:id/availability",
    async ({ employeesService, user, params, query }) => {
      const monthsAhead = query.months ? parseInt(query.months, 10) : 6;
      return employeesService.getEmployeeAvailability(
        params.id,
        user.id,
        {
          monthsAhead,
          startDate: query.startDate,
          endDate: query.endDate,
        }
      );
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      query: t.Object({
        months: t.Optional(t.String()),
        startDate: t.Optional(t.String()),
        endDate: t.Optional(t.String()),
      }),
      authenticated: true,
    }
  )