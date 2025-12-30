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
        clientTimezone: t.String(), 
        clientCurrentTime: t.String(),
        limit: t.Optional(t.Number()),
        offset: t.Optional(t.Number()),
      }),
    }
  )
  .put("/changeAppointmentStatus", async ({ appointmentsService, body, set }) => {
    try {
      return await appointmentsService.changeAppointmentStatus(body.id, body.status);
    } catch (error) {
      console.error("[Route changeAppointmentStatus] Error:", error);
      set.status = 500;
      return { 
        error: true, 
        message: error instanceof Error ? error.message : "Error updating appointment status" 
      };
    }
  }, {
    auth: true,
    body: t.Object({
      id: t.String(),
      status: t.String(),
    }),
  })
  .put("/changePaymentStatus", async ({ appointmentsService, body, set }) => {
    try {
      return await appointmentsService.changePaymentStatus(body.id, body.status);
    } catch (error) {
      console.error("[Route changePaymentStatus] Error:", error);
      set.status = 500;
      return { 
        error: true, 
        message: error instanceof Error ? error.message : "Error updating payment status" 
      };
    }
  }, {
    auth: true,
    body: t.Object({
      id: t.String(),
      status: t.String(),
    }),
  })
  .put("/changePaymentMethod", async ({ appointmentsService, body, set }) => {
    try {
      return await appointmentsService.changePaymentMethod(body.id, body.method);
    } catch (error) {
      console.error("[Route changePaymentMethod] Error:", error);
      set.status = 500;
      return { 
        error: true, 
        message: error instanceof Error ? error.message : "Error updating payment method" 
      };
    }
  }, {
    auth: true,
    body: t.Object({
      id: t.String(),
      method: t.String(),
    }),
  })
