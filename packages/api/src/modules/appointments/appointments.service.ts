import { db, appointment } from "@meetzeen/database";
import { and, eq, desc, count, sql, gte } from "drizzle-orm";

export class AppointmentsService {
  constructor() {}

  /**
   * Obtiene todas las citas desde la fecha del cliente en adelante, agrupadas por fecha
   * @param organizationId - ID de la organización
   * @param clientDate - Fecha del cliente en formato YYYY-MM-DD (hoy)
   * @param memberId - ID opcional del miembro para filtrar
   * @returns Array de objetos agrupados por fecha con formato { date: "Date:YYYY-MM-DD", appointments: [...] }
   */
  async getAppointments(
    organizationId: string,
    clientDate: string,
    memberId?: string
  ) {
    // Construir condiciones de filtrado
    const whereConditions = [
      eq(appointment.organizationId, organizationId),
      // Obtener citas desde hoy en adelante (incluyendo todo el día de hoy)
      gte(appointment.appointmentDate, clientDate),
    ];

    // Filtrar por memberId si se proporciona
    if (memberId) {
      whereConditions.push(eq(appointment.memberId, memberId));
    }

    // Obtener todas las citas que cumplan las condiciones
    const appointments = await db
      .select({
        id: appointment.id,
        customerName: appointment.customerName,
        customerEmail: appointment.customerEmail,
        customerPhone: appointment.customerPhone,
        memberName: appointment.memberName,
        memberEmail: appointment.memberEmail,
        memberId: appointment.memberId,
        appointmentDate: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        paymentStatus: appointment.paymentStatus,
        amountPaid: appointment.amountPaid,
        notes: appointment.notes,
        createdAt: appointment.createdAt,
      })
      .from(appointment)
      .where(and(...whereConditions))
      .orderBy(appointment.appointmentDate, appointment.startTime);

    // Agrupar citas por fecha
    const groupedByDate = appointments.reduce(
      (acc, appointment) => {
        const date = appointment.appointmentDate;
        const dateKey = `Date:${date}`;

        if (!acc[dateKey]) {
          acc[dateKey] = {
            date: dateKey,
            appointments: [],
          };
        }

        // Agregar el prefijo "Date:" al appointmentDate
        acc[dateKey].appointments.push({
          ...appointment,
          appointmentDate: dateKey,
        });
        return acc;
      },
      {} as Record<
        string,
        { date: string; appointments: typeof appointments }
      >
    );

    // Convertir el objeto agrupado a un array y ordenar por fecha
    const result = Object.values(groupedByDate).sort((a, b) => {
      // Extraer la fecha de "Date:YYYY-MM-DD" para comparar
      const dateA = a.date.replace("Date:", "");
      const dateB = b.date.replace("Date:", "");
      return dateA.localeCompare(dateB);
    });

    return result;
  }

  /**
   * Obtiene el historial de citas pasadas basado en el timezone del cliente
   * @param organizationId - ID de la organización
   * @param clientTimezone - Timezone del cliente (ej: "America/Mexico_City", "America/Bogota")
   * @param clientCurrentTime - Hora actual del cliente en formato ISO string
   * @param limit - Límite de resultados por página
   * @param offset - Offset para paginación
   */
  async getAppointmentsHistory(
    organizationId: string,
    clientTimezone: string,
    clientCurrentTime: string,
    limit?: number,
    offset?: number
  ) {
    const finalLimit = limit ?? 50;
    const finalOffset = offset ?? 0;

    const clientNow = new Date(clientCurrentTime);

    const todayInClientTz = this.getTodayInTimezone(clientTimezone, clientNow);
    const currentTimeInClientTz = this.getCurrentTimeInTimezone(
      clientTimezone,
      clientNow
    );

    const whereConditions = [
      eq(appointment.organizationId, organizationId),
      // La cita es pasada si:
      // 1. La fecha es anterior a hoy, O
      // 2. La fecha es hoy pero la hora de inicio ya pasó
      sql`(
        ${appointment.appointmentDate} < ${todayInClientTz}
        OR (
          ${appointment.appointmentDate} = ${todayInClientTz}
          AND ${appointment.startTime} <= ${currentTimeInClientTz}
        )
      )`,
    ];

    const totalAppointments = await db
      .select({ count: count() })
      .from(appointment)
      .where(and(...whereConditions))
      .then(([res]) => Number(res?.count ?? 0));

    const appointments = await db
      .select({
        id: appointment.id,
        customerName: appointment.customerName,
        customerEmail: appointment.customerEmail,
        customerPhone: appointment.customerPhone,
        memberName: appointment.memberName,
        memberEmail: appointment.memberEmail,
        appointmentDate: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        paymentStatus: appointment.paymentStatus,
        amountPaid: appointment.amountPaid,
        createdAt: appointment.createdAt,
      })
      .from(appointment)
      .where(and(...whereConditions))
      .orderBy(desc(appointment.appointmentDate), desc(appointment.startTime))
      .limit(finalLimit)
      .offset(finalOffset);

    return {
      results: appointments,
      meta: {
        totalAppointments,
        filteredAppointments: totalAppointments,
        limit: finalLimit,
        offset: finalOffset,
        hasNextPage: finalOffset + finalLimit < totalAppointments,
        hasPrevPage: finalOffset > 0,
      },
    };
  }

  /**
   * Obtiene la fecha en el timezone especificado basado en la fecha proporcionada
   */
  private getTodayInTimezone(timezone: string, date: Date): string {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    return formatter.format(date);
  }

  /**
   * Obtiene la hora en el timezone especificado basado en la fecha proporcionada (formato HH:MM)
   */
  private getCurrentTimeInTimezone(timezone: string, date: Date): string {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return formatter.format(date);
  }
}
