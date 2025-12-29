import Elysia, { t } from "elysia";
import { appointmentsModule } from "@meetzeen/api/src/modules/appointments/appointments.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export const appointmentsRoutes = new Elysia({
  name: "appointmentsRoutes",
  prefix: "/appointments",
})
  .use(betterAuthPlugin)
  .use(appointmentsModule)
  .get("/", ({ appointmentsService, query }) => {
    return appointmentsService.getAppointments(
      query.organizationId,
      query.startDate,
      query.endDate,
      query.memberId,
    );
  }, {
    auth: true,
    query: t.Object({
      organizationId: t.String(),
      startDate: t.String(), // YYYY-MM-DD (inicio del rango)
      endDate: t.String(),   // YYYY-MM-DD (fin del rango)
      memberId: t.Optional(t.String()),
    }),
  })
  .get("/:id", ({ appointmentsService, params }) => {
    return appointmentsService.getAppointmentById(params.id);
  }, {
    auth: true,
    params: t.Object({
      id: t.String(),
    }),
  })
  .get(
    "/history",
    ({ appointmentsService, query }) => {
      return appointmentsService.getAppointmentsHistory(
        query.organizationId,
        query.clientTimezone,
        query.clientCurrentTime,
        query.search,
        query.limit,
        query.offset
      );
    },
    {
      auth: true,
      query: t.Object({
        organizationId: t.String(),
        search: t.Optional(t.String()),
        clientTimezone: t.String(), // Timezone del cliente (ej: "America/Mexico_City")
        clientCurrentTime: t.String(), // Hora actual del cliente en formato ISO string (HH:mm:ss)
        limit: t.Optional(t.Number()),
        offset: t.Optional(t.Number()),
      }),
    }
  );
