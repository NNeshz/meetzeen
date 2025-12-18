import Elysia, { t } from "elysia";
import { bookingModule } from "@meetzeen/api/src/modules/booking/booking.module";
import { betterAuthPlugin } from "@meetzeen/api/src/utils/better-auth-plugin";

export const bookingRoutes = new Elysia({
  name: "bookingRoutes",
  prefix: "/booking",
})
  .use(betterAuthPlugin)
  .use(bookingModule)
  .post(
    "/",
    ({ bookingService, body }) => {
      return bookingService.createBooking(
        body.organizationId,
        body.memberId,
        body.services,
        body.date,
        body.startTime,
        body.customer
      );
    },
    {
      body: t.Object({
        organizationId: t.String({ minLength: 1 }),
        memberId: t.String({ minLength: 1 }),
        services: t.Array(t.String({ minLength: 1 }), { minItems: 1 }),
        date: t.String({
          pattern: "^\\d{4}-\\d{2}-\\d{2}$",
          description: "Fecha en formato YYYY-MM-DD",
        }),
        startTime: t.String({
          pattern: "^\\d{2}:\\d{2}$",
          description: "Horario en formato HH:MM",
        }),
        customer: t.Object({
          name: t.String({ minLength: 1 }),
          lastName: t.String({ minLength: 1 }),
          email: t.String({ format: "email" }),
          phoneNumber: t.Optional(t.String()),
        }),
      }),
    }
  );
