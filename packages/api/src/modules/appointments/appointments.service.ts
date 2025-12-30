import { db, appointment, customer, member } from "@meetzeen/database";
import { and, or, eq, desc, count, sql, gte, lte, like } from "drizzle-orm";

export class AppointmentsService {
  constructor() {}

  /**
   * Obtiene todas las citas dentro de un rango de fechas, agrupadas por fecha
   * @param organizationId - ID de la organización
   * @param startDate - Fecha de inicio del rango en formato YYYY-MM-DD
   * @param endDate - Fecha de fin del rango en formato YYYY-MM-DD
   * @param memberId - ID opcional del miembro para filtrar
   * @returns Array de objetos agrupados por fecha con formato { date: "Date:YYYY-MM-DD", appointments: [...] }
   */
  async getAppointments(
    organizationId: string,
    startDate: string,
    endDate: string,
    memberId?: string
  ) {
    // Construir condiciones de filtrado
    const whereConditions = [
      eq(appointment.organizationId, organizationId),
      // Obtener citas dentro del rango de fechas (incluyendo ambos extremos)
      gte(appointment.appointmentDate, startDate),
      lte(appointment.appointmentDate, endDate),
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
      {} as Record<string, { date: string; appointments: typeof appointments }>
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
    search?: string,
    limit?: number,
    offset?: number
  ) {
    const finalLimit = limit ?? 50;
    const finalOffset = offset ?? 0;

    // Validar y convertir la fecha del cliente
    const clientNow = new Date(clientCurrentTime);
    if (isNaN(clientNow.getTime())) {
      throw new Error(`Invalid date format: ${clientCurrentTime}. Expected ISO 8601 format.`);
    }

    const todayInClientTz = this.getTodayInTimezone(clientTimezone, clientNow);
    const currentTimeInClientTz = this.getCurrentTimeInTimezone(
      clientTimezone,
      clientNow
    );

    const whereConditions = [
      eq(appointment.organizationId, organizationId),
      sql`(
        ${appointment.appointmentDate} < ${todayInClientTz}
        OR (
          ${appointment.appointmentDate} = ${todayInClientTz}
          AND ${appointment.startTime} <= ${currentTimeInClientTz}
        )
      )`,
    ];

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereConditions.push(
        sql`(
          ${appointment.customerName} ILIKE ${searchTerm}
          OR (
            ${appointment.customerPhone} IS NOT NULL 
            AND ${appointment.customerPhone} ILIKE ${searchTerm}
          )
        )`
      );
    }

    const totalAppointments = await db
      .select({ count: count() })
      .from(appointment)
      .where(and(...whereConditions))
      .then(([res]) => Number(res?.count ?? 0));

    const appointments = await db
      .select({
        id: appointment.id,
        customerName: appointment.customerName,
        appointmentDate: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
      })
      .from(appointment)
      .where(and(...whereConditions))
      .orderBy(desc(appointment.appointmentDate), desc(appointment.startTime))
      .limit(finalLimit)
      .offset(finalOffset);

    return {
      results: {
        appointments: appointments.map((app) => ({
          ...app,
          appointmentDate: `Date:${app.appointmentDate}`,
        })),
      },
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

  async getAppointmentById(id: string) {
    const [found] = await db
      .select({
        id: appointment.id,
        customerId: appointment.customerId,
        customerName: appointment.customerName,
        customerEmail: appointment.customerEmail,
        customerPhone: appointment.customerPhone,
        customerNotes: appointment.customerNotes,
        memberId: appointment.memberId,
        memberName: appointment.memberName,
        memberEmail: appointment.memberEmail,
        memberRole: appointment.memberRole,
        organizationId: appointment.organizationId,
        serviceId: appointment.serviceId,
        appointmentDate: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        notes: appointment.notes,
        cancellationReason: appointment.cancellationReason,
        cancelledAt: appointment.cancelledAt,
        cancelledBy: appointment.cancelledBy,
        paymentStatus: appointment.paymentStatus,
        paymentMethod: appointment.paymentMethod,
        amountPaid: appointment.amountPaid,
        source: appointment.source,
        reminderSent: appointment.reminderSent,
        reminderSentAt: appointment.reminderSentAt,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
        // Relaciones del cliente
        customer: {
          id: customer.id,
          name: customer.name,
          lastName: customer.lastName,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          notes: customer.notes,
        },
        // Relaciones del miembro
        member: {
          id: member.id,
          role: member.role,
        },
        // Servicios reservados
        servicesBooked: sql<unknown>`
          (
            SELECT json_agg(sb)
            FROM "ServicesBooked" sb
            WHERE sb."appointmentId" = ${id}
          )
        `,
      })
      .from(appointment)
      .leftJoin(customer, eq(appointment.customerId, customer.id))
      .leftJoin(member, eq(appointment.memberId, member.id))
      .where(eq(appointment.id, id));

    if (!found) {
      throw new Error("Appointment not found");
    }

    // Obtener serviciosBooked (deserializar si es necesario)
    const servicesBooked = Array.isArray(found.servicesBooked)
      ? found.servicesBooked
      : found.servicesBooked
        ? typeof found.servicesBooked === "string"
          ? JSON.parse(found.servicesBooked)
          : found.servicesBooked
        : [];

    // Prefijo de fecha
    const appointmentDate = found.appointmentDate?.startsWith("Date:")
      ? found.appointmentDate
      : `Date:${found.appointmentDate}`;

    return {
      ...found,
      servicesBooked,
      appointmentDate,
    };
  }

  private getTodayInTimezone(timezone: string, date: Date): string {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    return formatter.format(date);
  }

  private getCurrentTimeInTimezone(timezone: string, date: Date): string {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return formatter.format(date);
  }

  
  async changeAppointmentStatus(id: string, status: string) {
    if (!id || id.trim().length === 0) {
      throw new Error("Appointment ID is required");
    }
    if (!status || status.trim().length === 0) {
      throw new Error("Status is required");
    }

    try {
      
      const [updatedAppointment] = await db
        .update(appointment)
        .set({
          status,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(appointment.id, id))
        .returning();

      if (!updatedAppointment) {
        throw new Error(`Appointment not found with ID: ${id}`);
      }

      return updatedAppointment;
    } catch (error) {
      throw error;
    }
  }

  async changePaymentStatus(id: string, status: string) {
    if (!id || id.trim().length === 0) {
      throw new Error("Appointment ID is required");
    }
    if (!status || status.trim().length === 0) {
      throw new Error("Payment status is required");
    }

    try {
      
      const [updatedAppointment] = await db
        .update(appointment)
        .set({
          paymentStatus: status,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(appointment.id, id))
        .returning();

      if (!updatedAppointment) {
        throw new Error(`Appointment not found with ID: ${id}`);
      }

      return updatedAppointment;
    } catch (error) {
      throw error;
    }
  }

  async changePaymentMethod(id: string, method: string) {
    if (!id || id.trim().length === 0) {
      throw new Error("Appointment ID is required");
    }
    if (!method || method.trim().length === 0) {
      throw new Error("Payment method is required");
    }

    try {
      
      const [updatedAppointment] = await db
        .update(appointment)
        .set({
          paymentMethod: method,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(appointment.id, id))
        .returning();

      if (!updatedAppointment) {
        throw new Error(`Appointment not found with ID: ${id}`);
      }

      return updatedAppointment;
    } catch (error) {
      throw error;
    }
  }
}
